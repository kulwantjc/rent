var Promise = require('bluebird'),
    promisify = Promise.promisify;
var ObjectID = require('mongodb').ObjectID;
var constantObj = sails.config.constants;
var async = require('async')

module.exports = {

    addFavorite: (data, context) => {
        console.log('data', data)

        let status = data.status;

        let query = {}
        query.addedBy = context.identity.id,
            query.favorites = data.bike_id;

        if (status == true || status == 'true') {
            console.log('status', status)
            return Favorites.create(query).then((favs) => {
                console.log('Favorites create', favs);
                return {
                    success: true,
                    code: 200,
                    message: 'FAVORITES_SAVED'
                };
            }).fail((err) => {
                return {
                    success: false,
                    error: {
                        code: 400,
                        message: 'err'
                    },
                };
            });
        } else {
            return Favorites.destroy({ addedBy: context.identity.id, favorites: data.bike_id }).then(function (err) {
                //console.log("err",err);
                return {
                    success: true,
                    code: 200,
                    message: 'FAVORITES_REMOVE'
                };
            }).fail(function (err1) {
                console.log('err1', err1)
                return {
                    success: false,
                    error: {
                        code: 400,
                        message: 'err1'
                    },
                };
            });
        }
    },


    Favorites: function (data, context) {
        console.log('in favs')
        let user_id = context.identity.id;
        console.log('user_id', user_id)

        return Favorites.find({ addedBy: user_id }).populate("favorites").then(function (favorites) {

            return {
                success: true,
                code: 200,
                data: favorites
            };
        }).fail(function (err) {
            return {
                success: false,
                code: 400,
                message: 'err'
            };
        })
    },

    Search: function (data, context, req, res) {

        let lat = data.lat
        let lng = data.lng
        let start_date = data.start_date
        let end_date = data.end_date

        if ((!data.lat) || (!data.lng) || (!data.start_date) || (!data.end_date)) {
            return { "success": false, "error": { "code": 404, "message": "ALL FIELDS REQUIRED" } };
        }
        let query = {};
        query.isDeleted = 'false';

        query.$and = [{
            startDate:
            {
                '<=': start_date,
            },
            endDate:
            {
                '>=': end_date,
            }
        }]
        query.$or = [{
            lat: {
                'like': '%' + lat + '%'
            }
        }, {
            lng: {
                'like': '%' + lng + '%'
            }
        }
        ]
        return Vehicle.find(query).populate('addedBy', { select: ['fullName'] }).populate('type', { select: ['name'] }).populate('brand_id', { select: ['name'] }).populate('model_id', { select: ['name'] }).populate('country', { select: ['name'] }).populate('cylinder_id', { select: ['name'] }).populate('energy_id', { select: ['name'] }).populate('mileage_id', { select: ['startrange', 'endrange'] }).populate('consumption_id', { select: ['name'] }).populate('category_id', { select: ['name'] }).then(function (vehicles) {
            // console.log("vehicles", vehicles)
            var counter = 0;
            async.eachSeries(vehicles, function (user, callback) {

                if (user) {

                    let reviewQuery = {};
                    reviewQuery.vehicle_id = user.id;
                    reviewQuery.isCancelled = 'false';
                    reviewQuery.isRejected = 'false';

                    reviewQuery.$and = [{
                        date_booking:
                        {
                            '<=': start_date,
                        },
                        date_return:
                        {
                            '>=': start_date,
                        },
                        $or: {
                            date_booking:
                            {
                                '<=': end_date,
                            },
                            date_return:
                            {
                                '>=': end_date,
                            }
                        }
                    }]
                    Rentals.find(reviewQuery).then(function (result2) {
                        // console.log("result2", result2[0], counter)
                        if (result2[0]) vehicles.splice(counter, 1);
                    })
                } counter++
                // console.log("veh", vehicles)
                return callback();
            }, function (error) {
                if (error) {
                    console.log("error is here", error);
                } else {
                    // console.log("in else", vehicles)
                    return res.jsonx({
                        success: true,
                        code: 200,
                        data: vehicles
                    });
                }
            }
            );
        }).fail(function (err) {
            return {
                success: false,
                code: 400,
                message: 'err1', err
            };
        })
    },

};




