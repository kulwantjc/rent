/**
  * #DESC:  In this class/files crops related functions
  * #Request param: Crops add form data values
  * #Return : Boolen and sucess message
  * #Author: JCsoftware Solution
*/

var Promise = require('bluebird'),
    promisify = Promise.promisify;
var constantObj = sails.config.constants;
var ObjectID = require('mongodb').ObjectID;


module.exports = {

    saveTypes: function (data, context) {

        if ((!data.name) || typeof data.name == undefined) {
            return { "success": false, "error": { "code": 404, "message": constantObj.vehicle.NAME_REQUIRED } };
        }

        let query = {}
        query.isDeleted = false,
            query.name = data.name,
            query.status = "active";

        return Vehicletype.findOne(query).then(function (cat) {
            if (cat) {
                return {
                    success: false,
                    error: {
                        code: 400,
                        message: constantObj.vehicle.VEHICLE_TYPE_ALREADY_EXIST
                    },
                };

            } else {
                return Vehicletype.create(data).then(function (catg) {
                    return {
                        success: true,
                        code: 200,
                        data: {
                            vtype: catg,
                            message: constantObj.vehicle.VECHICLE_TYPE_SAVED
                        },
                    };
                })
                    .fail(function (err) {
                        return {
                            success: false,
                            error: {
                                code: 400,
                                message: constantObj.vehicle.VEHICLE_TYPE_ALREADY_EXIST
                            },
                        };
                    });
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

    updateTypes: function (data, context) {

        let query = {};

        query.name = data.name;
        query._id = data.id;
        query.isDeleted = false;

        return Vehicletype.findOne(query).then(function (cat) {
            if (cat == undefined) {

                return Vehicletype.update(data.id, data).then(function (cats) {
                    return {
                        success: true,
                        code: 200,
                        data: {
                            vtypes: cats,
                            message: constantObj.vehicle.VECHICLE_TYPE_UPDATED_CATEGORY
                        },
                    };
                })
                    .fail(function (err) {

                        return {
                            success: false,
                            error: {
                                code: 400,
                                message: constantObj.vehicle.ISSUE_IN_VEHICLE_TYPE_UPDATE
                            },
                        };
                    });


            } else {

                return {
                    success: false,
                    error: {
                        code: 400,
                        message: constantObj.vehicle.VEHICLE_TYPE_ALREADY_EXIST
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

    delete: function (data, context) {
        return API.Model(Category).update(data.id, data)
            .then(function (categories) {
                var result;
                if (categories) {
                    result = {
                        "sucess": {
                            "Code": 200,
                            "Message": "Vehicle type deleted successfully."
                        }
                    }
                } else {

                    result = {
                        "error": {
                            "Code": 301,
                            "Message": "There is some issue with the vehicle type deletion."
                        }
                    }
                }
                return {
                    "Status": true,
                    result
                };
            });
    },

    getvehicletype: function (data, context) {
        console.log("data os", data)
        return Vehicletype.findOne({ id: data.id, isDeleted: false, status: "active" }).then(function (vtypes) {
            console.log("vtypes os", vtypes)
            if (!vtypes) {
                return {
                    success: false,
                    error: {
                        code: 400,
                        message: constantObj.vehicle.VEHICLE_TYPE_NOT_FOUND
                    },
                };
            } else {
                return {
                    success: true,
                    data: {
                        code: 200,
                        vtypes: vtypes
                    },
                };
            }
        })
    },

    getListVehicleType: function (data, context) {
        return Vehicletype.find({ isDeleted: false, status: "active" }).sort({ name: 1 }).then(function (vtypes) {
            console.log("vtypes of list", vtypes)
            if (vtypes.length == 0) {
                return {
                    success: false,
                    error: {
                        code: 400,
                        message: constantObj.vehicle.VEHICLE_TYPE_NOT_FOUND
                    },
                };
            } else {
                return {
                    success: true,
                    data: {
                        code: 200,
                        data: vtypes
                    },
                };
            }
        })
    },

    /* Vehicle Management Starts here */

    saveVehicle: function (data, context) {

        data.addedBy = context.identity.id;

        return Vehicle.create(data).then(function (catg) {
            return {
                success: true,
                code: 200,
                data: {
                    vehicles: catg,
                    message: constantObj.vehicle.VECHICLE_SAVED
                },
            };
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

    updateVehicle: function (data, context) {

        return Vehicle.findOne({ id: data.id, isDeleted: false }).then(function (cat) {
            console.log("cat", cat)
            if (cat) {

                return Vehicle.update(data.id, data).then(function (cats) {
                    return {
                        success: true,
                        code: 200,
                        data: {
                            vehicles: cats,
                            message: constantObj.vehicle.VECHICLE_UPDATED
                        },
                    };
                })
                    .fail(function (err) {

                        return {
                            success: false,
                            error: {
                                code: 400,
                                message: constantObj.vehicle.ISSUE_IN_VEHICLE
                            },
                        };
                    });
            } else {
                return {
                    success: false,
                    error: {
                        code: 400,
                        message: constantObj.vehicle.VEHICLE_NOT_FOUND
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

    getvehicle: function (data, context) {
        console.log("data os", data)
        return Vehicle.findOne({ id: data.id, isDeleted: false, status: "active" }).populate('type').populate('brand_id').populate('model_id').populate('country').populate('cylinder_id').populate('energy_id').populate('mileage_id').populate('consumption_id').populate('category_id').then(function (vehicles) {
            if (!vehicles) {

                return {
                    success: false,
                    error: {
                        code: 400,
                        message: constantObj.vehicle.VEHICLE_NOT_FOUND
                    },
                };
            } else {
                return {
                    success: true,
                    data: {
                        code: 200,
                        vehicles: vehicles
                    }
                };
            }
        })
    },

    getListVehicle: function (data, context) {
        return Vehicle.find({ isDeleted: false, status: "active" }).sort({ name: 1 }).then(function (vehicles) {
            if (vehicles.length == 0) {
                return {
                    success: false,
                    error: {
                        code: 400,
                        message: constantObj.vehicle.VEHICLE_NOT_FOUND
                    },
                };
            } else {
                return {
                    success: true,
                    data: {
                        code: 200,
                        data: vehicles
                    },
                };
            }
        })
    },

    myVehicles: function (data, context) {
        let id = context.identity.id;

        var sortBy = data.sortBy;
        var page = data.page;
        var count = data.count
        var skipNo = (page - 1) * count;

        if (sortBy) {
            sortBy = sortBy.toString();
        } else {
            sortBy = 'createdAt desc';
        }

        console.log("data os", data)
        return Vehicle.find({ addedBy: id, isDeleted: false, status: "active" }).populate('type').populate('brand_id').populate('model_id').populate('country').populate('cylinder_id').populate('energy_id').populate('mileage_id').populate('consumption_id').populate('category_id').sort(sortBy).skip(skipNo).limit('count').then(function (vehicles) {
            console.log("vehicles", vehicles)
            if (!vehicles) {
                return {
                    success: false,
                    error: {
                        code: 400,
                        message: constantObj.vehicle.VEHICLE_NOT_FOUND
                    },
                };
            } else {
                return {
                    success: true,
                    data: {
                        code: 200,
                        vehicles: vehicles
                    },
                };
            }
        })
    }
    /* Vehicle Management Ends here */

}; // End Delete service class