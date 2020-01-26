
var Promise = require('bluebird'),
    promisify = Promise.promisify;
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var bcrypt = require('bcrypt-nodejs');
var commonServiceObj = require('./commonService');
var constantObj = sails.config.constants;



module.exports = {

    bookRide: function (data, context) {
        data.bookedBy = context.identity.id;
        return Rentals.create(data).then(function (user) {
            return {
                success: true,
                code: 200,
                message: 'Request posted successfully'
            };

        }).fail(function (err) {
            console.log("token", token)
            return {
                success: false,
                code: 400,
                message: 'err'
            };
        });

    },


    rideStatus: function (data, context) {
        console.log('id', data)
        var id = data.id;
        var status = data.status;
        var query = {};

        if (status == 1) {
            query.isApproved = true;
        } else {
            query.isRejected = true;
        }
        return Rentals.update({ id: id }, query)
            .then(function (result) {
                return {
                    success: true,
                    code: 200,
                    message: 'Updated'
                };
            }).fail(function (err) {
                return {
                    success: false,
                    code: 400,
                    message: 'err'
                };
            })
    },

    getRentals: function (data, context, req, res) {

        var query = {};
        query.isApproved = 'true';
        query.isRejected = 'false';
        query.isCancelled = 'false';

        return Rentals.find(query).populate("vehicle_id").then(function (user) {
            var counter = 0;
            async.eachSeries(user, function (item, callback) {
                console.log("item", item.vehicle_id.id)
                Vehicle.findOne({ id: item.vehicle_id.id }).populate('type', { select: ['name'] }).populate('brand_id', { select: ['name'] }).populate('model_id', { select: ['name'] }).populate('country', { select: ['name'] }).populate('cylinder_id', { select: ['name'] }).populate('energy_id', { select: ['name'] }).populate('mileage_id', { select: ['startrange', 'endrange'] }).populate('consumption_id', { select: ['name'] }).populate('category_id', { select: ['name'] }).then(function (vehicles) {

                    user[counter].vehicle_id = vehicles
                    counter++;
                    // console.log("veh in async each", vehicles)
                    return callback()
                })
            }, function (error) {
                if (error) {
                    console.log("error is here", error);
                } else {
                    // console.log("in else", vehicles)
                    return res.jsonx({
                        success: true,
                        code: 200,
                        data: user
                    });
                }
            })
        }).fail(function (err) {
            return {
                success: false,
                code: 400,
                message: 'err'
            };
        })
    },

    bookings: function (data, context, req, res) {
        var sortBy = data.sortBy;
        var page = data.page;
        var count = data.count
        var skipNo = (page - 1) * count;
        var query = {};

        // console.log("count", count)
        if (sortBy) {
            sortBy = sortBy.toString();
        } else {
            sortBy = 'createdAt desc';
        }
        var query = {};

        query.isApproved = 'true';
        query.isRejected = 'false';
        query.isCancelled = 'false';

        return Rentals.find().populate("vehicle_id").populate('bookedBy', { select: ['fullName'] }).sort(sortBy).skip(skipNo).limit(count).then(function (user) {
            var counter = 0;
            async.eachSeries(user, function (item, callback) {
                console.log("item", item.vehicle_id.id)
                Vehicle.findOne({ id: item.vehicle_id.id }).populate('type', { select: ['name'] }).populate('brand_id', { select: ['name'] }).populate('model_id', { select: ['name'] }).populate('country', { select: ['name'] }).populate('cylinder_id', { select: ['name'] }).populate('energy_id', { select: ['name'] }).populate('mileage_id', { select: ['startrange', 'endrange'] }).populate('consumption_id', { select: ['name'] }).populate('category_id', { select: ['name'] }).then(function (vehicles) {

                    user[counter].vehicle_id = vehicles
                    counter++;
                    // console.log("veh in async each", vehicles)
                    return callback()
                })
            }, function (error) {
                if (error) {
                    console.log("error is here", error);
                } else {
                    // console.log("in else", vehicles)
                    return res.jsonx({
                        success: true,
                        code: 200,
                        data: user
                    });
                }
            })
        }).fail(function (err) {
            return {
                success: false,
                code: 400,
                message: 'err'
            };
        })
    },
    // viewRental: function (data, context) {
    //     console.log('in view rental')
    //     console.log('id', data.id)
    //     var id = data.id;
    //     // var status = data.status;
    //     var query = {};

    //     // query.isApproved = true;
    //     // query.isRejected = false;
    //     // query._id = id;

    //     console.log('query',query)

    //     return Rentals.find({id: id}).populate("vehicle_id").then(function (rental) {
    //         console.log('rental', rental)
    //         return {
    //             success: true,
    //             code: 200,
    //             data: rental
    //         };
    //     }).fail(function (err) {
    //         return {
    //             success: false,
    //             code: 400,
    //             message: 'err'
    //         };
    //     })
    // },

    viewRental: function (data, context) {
        console.log("data os", data.id)
        return Vehicle.findOne({ id: data.id, isDeleted: false, status: "active" }).populate('type').populate('brand_id', { select: ['name'] }).populate('model_id').populate('country').populate('cylinder_id').populate('energy_id').populate('mileage_id').populate('consumption_id').populate('category_id').populate('addedBy', { select: ['fullName', 'image', 'averageRating', 'totalRating'] }).then(function (vehicles) {
            if (!vehicles) {
                return {
                    success: false,
                    error: {
                        code: 400,
                        message: constantObj.vehicle.VEHICLE_NOT_FOUND
                    },
                };
            } else {
                if (vehicles.addedBy) {
                    vehicles.addedBy.fullName = vehicles.addedBy.fullName || "";
                    vehicles.addedBy.image = vehicles.addedBy.image || "";
                    vehicles.addedBy.averageRating = vehicles.addedBy.averageRating || "";
                    vehicles.addedBy.totalRating = vehicles.addedBy.totalRating || "";
                } else {
                    vehicles.addedBy = {}
                }
                return Ratings.find({ vehicle_id: data.id }).populate('addedBy', { select: ['fullName', 'image'] }).then(function (review) {
                    return Ratings.find({ ownerId: vehicles.addedBy.id }).populate('addedBy', { select: ['fullName', 'image'] }).then(function (orev) {

                        return {
                            success: true,
                            data: {
                                code: 200,
                                vehicles: vehicles,
                                reviews: review,
                                ownerReviews: orev
                            }
                        };
                    }).fail(function (err) {
                        return {
                            success: false,
                            code: 400,
                            message: 'err'
                        };
                    })

                }).fail(function (err) {
                    return {
                        success: false,
                        code: 400,
                        message: 'err'
                    };
                })
            }
        })
    },

    myRentals: function (data, context, req, res) {
        let user_id = context.identity.id;
        var sortBy = data.sortBy;
        var page = data.page;
        var count = data.count
        var skipNo = (page - 1) * count;

        var query = {};
        if (sortBy) {
            sortBy = sortBy.toString();
        } else {
            sortBy = 'createdAt desc';
        }
        return Rentals.find({ bookedBy: user_id }).populate('bookedBy').populate('vehicle_id').sort(sortBy).skip(skipNo).limit(count).then(function (rentals) {
            var counter = 0;

            async.eachSeries(rentals, function (item, callback) {
                // console.log("item", item.vehicle_id.id)
                Vehicle.findOne({ id: item.vehicle_id.id }).populate('type', { select: ['name'] }).populate('brand_id', { select: ['name'] }).populate('model_id', { select: ['name'] }).populate('country', { select: ['name'] }).populate('cylinder_id', { select: ['name'] }).populate('energy_id', { select: ['name'] }).populate('mileage_id', { select: ['startrange', 'endrange'] }).populate('consumption_id', { select: ['name'] }).populate('category_id', { select: ['name'] }).then(function (vehicles) {

                    rentals[counter].vehicle_id = vehicles
                    counter++;
                    // console.log("veh in async each", vehicles)
                    return callback()
                })
            }, function (error) {
                if (error) {
                    console.log("error is here", error);
                } else {
                    // console.log("in else", vehicles)
                    return res.jsonx({
                        success: true,
                        code: 200,
                        data: rentals
                    });
                }
            })
        }).fail(function (err) {
            return {
                success: false,
                code: 400,
                message: 'err', err
            };
        })
    },

    myRental: function (data, context) {
        let user_id = context.identity.id;
        let id = data.id;
        let owner = {};
        // console.log('user_id', user_id, id)

        return Rentals.findOne({ id: id }).populate('vehicle_id', { select: ['country', 'detail', 'price', 'lat', 'lng', 'registration_no', 'averageRating', 'totalRating', 'images', 'createdAt','addedBy'] }).populate("bookedBy", { select: ['fullName'] }).then(function (rentals) {
            //  console.log('rentals', rentals.vehicle_id.id)
            if (rentals) {
                // console.log('rentals', rentals.vehicle_id.id)
                return Vehicle.findOne({ id: rentals.vehicle_id.id }).populate('addedBy').populate('type').populate('brand_id').populate('model_id').populate('country').populate('cylinder_id').populate('energy_id').populate('mileage_id').populate('consumption_id').populate('category_id').then(function (result) {
                    // console.log("result", result)
                    if (result.brand_id)
                        rentals.brand = (result.brand_id.name)
                    else rentals.brand = "";

                    if (result.model_id)
                        rentals.model = (result.model_id.name)
                    else rentals.model = "";

                    if (result.category_id)
                        rentals.category = (result.category_id.name)
                    else rentals.category = "";

                    if (result.cylinder_id)
                        rentals.cylinder = (result.cylinder_id.name)
                    else rentals.cylinder = "";

                    if (result.country)
                        rentals.country = (result.country.name)
                    else rentals.country = "";

                    if (result.energy_id)
                        rentals.energy = (result.energy_id.name)
                    else rentals.energy = "";

                    if (result.mileage_id)
                        rentals.mileage = (result.mileage_id.startrange + "-" + result.mileage_id.endrange)
                    else rentals.mileage = "";

                    if (result.consumption_id)
                        rentals.consumption = (result.consumption_id.name)
                    else rentals.consumption = "";

                    if (result.type)
                        rentals.type = result.type.name
                    else rentals.type = "";

                    if (result.addedBy) {
                        owner.fullName = result.addedBy.fullName || "";
                        owner.averageRating = result.addedBy.averageRating || "";
                        owner.totalRating = result.addedBy.totalRating || "";
                        owner.image = result.addedBy.image || "";
                    }

                    return Ratings.find({ vehicle_id: rentals.vehicle_id.id }).populate('addedBy', { select: ['fullName', 'image'] }).then(function (review) {
                        return {
                            success: true,
                            data: {
                                code: 200,
                                data: rentals,
                                reviews: review,
                                owner: owner
                            }
                        };
                    }).fail(function (err) {
                        console.log("err", err)
                        return {
                            success: false,
                            code: 400,
                            message: 'err'
                        };
                    })
                }).fail(function (err) {
                    return {
                        success: false,
                        code: 400,
                        message: 'err1'
                    };
                })
            } else {
                return {
                    success: false,
                    code: 400,
                    message: 'No Rentals Found'
                };
            }
        }).fail(function (err) {
            console.log("err1", err)
            return {
                success: false,
                code: 400,
                message: 'err2'
            };
        })
    },


    // myRequests: function (data, context) {
    //     console.log('in favs')
    //     let user_id = context.identity.id;
    //     console.log('user_id', user_id)

    //     return Rentals.find({ bookedBy: user_id, isCompleted: 'false' }).populate('bookedBy').populate('vehicle_id').then(function (requests) {
    //         return {
    //             success: true,
    //             code: 200,
    //             data: requests
    //         };
    //     }).fail(function (err) {
    //         return {
    //             success: false,
    //             code: 400,
    //             message: 'err'
    //         };
    //     })
    // },

    // myRequest: function (data, context) {
    //     let user_id = context.identity.id;
    //     let id = data.id;
    //     console.log('user_id', id)

    //     return Rentals.findOne({ bookedBy: user_id, id: id, isCompleted: 'false' }).populate('bookedBy').populate("vehicle_id").then(function (rentals) {
    //         return {
    //             success: true,
    //             code: 200,
    //             data: rentals
    //         };
    //     }).fail(function (err) {
    //         return {
    //             success: false,
    //             code: 400,
    //             message: 'err'
    //         };
    //     })
    // },

    cancelRide: function (data, context) {
        let user_id = context.identity.id;
        var id = data.id;

        return Rentals.update({ id: id, bookedBy: user_id }, { isCancelled: true })
            .then(function (result) {
                if (result != "") {
                    return {
                        success: true,
                        code: 200,
                        message: 'Booking Cancelled'
                    };
                } else {
                    return {
                        success: false,
                        code: 400,
                        message: 'No booking found'
                    };
                }
            }).fail(function (err) {
                return {
                    success: false,
                    code: 400,
                    message: 'err'
                };
            })
    },


    updateBooking: function (data, context) {

        let user_id = context.identity.id;
        var id = data.id;

        console.log('data', id, user_id)

        return Rentals.findOne({ id: id }).then(function (cat) {
            console.log("cat", cat)
            if (cat) {

                return Rentals.update(id, data).then(function (cats) {
                    return {
                        success: true,
                        code: 200,
                        data: {
                            result: cats,
                            message: 'Updated successfully'
                        },
                    };
                }).fail(function (err) {
                    console.log("err", err)
                    return {
                        success: false,
                        error: {
                            code: 400,
                            message: 'err'
                        },
                    };
                });
            } else {
                return {
                    success: false,
                    error: {
                        code: 400,
                        message: 'No booking found'
                    },
                };

            }
        }).fail(function (err) {
            return {
                success: false,
                error: {
                    code: 400,
                    message: err
                },
            };
        });
    },


    getOwnerRating: function (data, context) {

        let ownerId = data.id;
        // console.log("owner id", data.id)

        return Users.findOne({ id: ownerId }).then(function (owner) {
            // console.log('rentals', rentals.vehicle_id.id)
            if (owner) {

                return Ratings.find({ ownerId: ownerId }).populate('addedBy', { select: ['fullName', 'image'] }).then(function (review) {
                    return {
                        success: true,
                        data: {
                            code: 200,
                            data: owner,
                            reviews: review
                        }
                    };
                }).fail(function (err) {
                    return {
                        success: false,
                        code: 400,
                        message: 'err'
                    };
                })
            } else {
                return {
                    success: false,
                    code: 400,
                    message: 'No Owner Found'
                };
            }
        }).fail(function (err) {
            console.log("err1", err)
            return {
                success: false,
                code: 400,
                message: 'err1'
            };
        })
    },

    getCancelBookings: function (data, context, req, res) {
        let user_id = context.identity.id;
        var sortBy = data.sortBy;
        var page = data.page;
        var count = data.count
        var skipNo = (page - 1) * count;

        var query = {};
        query.$or = [{
            isCancelled: 'true'
        }, {
            isCancelled: true
        }
        ]
        if (sortBy) {
            sortBy = sortBy.toString();
        } else {
            sortBy = 'createdAt desc';
        }
        return Rentals.find(query).populate('bookedBy',{select: ['fullName']}).populate('vehicle_id').sort(sortBy).skip(skipNo).limit(count).then(function (rentals) {
            var counter = 0;

            async.eachSeries(rentals, function (item, callback) {
                // console.log("item", item.vehicle_id.id)
                Vehicle.findOne({ id: item.vehicle_id.id }).populate('type', { select: ['name'] }).populate('brand_id', { select: ['name'] }).populate('model_id', { select: ['name'] }).populate('country', { select: ['name'] }).populate('cylinder_id', { select: ['name'] }).populate('energy_id', { select: ['name'] }).populate('mileage_id', { select: ['startrange', 'endrange'] }).populate('consumption_id', { select: ['name'] }).populate('category_id', { select: ['name'] }).then(function (vehicles) {

                    rentals[counter].vehicle_id = vehicles
                    counter++;
                    // console.log("veh in async each", vehicles)
                    return callback()
                })
            }, function (error) {
                if (error) {
                    console.log("error is here", error);
                } else {
                    // console.log("in else", vehicles)
                    return res.jsonx({
                        success: true,
                        code: 200,
                        data: rentals
                    });
                }
            })
        }).fail(function (err) {
            return {
                success: false,
                code: 400,
                message: 'err', err
            };
        })
    },


};


