var Promise = require('bluebird'),
    promisify = Promise.promisify;
var ObjectID = require('mongodb').ObjectID;
var constantObj = sails.config.constants;



module.exports = {

    rateVehicle: function (data, context) {
        var totalRating = 0;
        var averageRating = 0;
        var sum = 0;
        let vehicle_id = data.vehicle_id;
        data.addedBy = context.identity.id;

        return Ratings.create(data).then(function (rating) {

            return Ratings.find({ vehicle_id: vehicle_id }).then(function (get) {
                totalRating = get.length;
                for (var i = 0; i < totalRating; i++) {
                    sum += get[i].rating;
                }
                averageRating = sum / totalRating;
                console.log('abc', totalRating, averageRating)
                return Vehicle.update({ id: vehicle_id }, { totalRating: totalRating, averageRating: averageRating }).then(function (update) {
                    console.log('abc', totalRating, averageRating)
                    //console.log("update",update)
                    return {
                        success: true,
                        code: 200,
                        message: 'Posted Successfully'
                    };
                }).fail(function (err) {
                    console.log("err", err)
                    return {
                        success: false,
                        code: 400,
                        message: 'err1'
                    };
                })
            }).fail(function (err) {
                return {
                    success: false,
                    code: 400,
                    message: 'err2'
                };
            })
        }).fail(function (err) {
            return {
                success: false,
                code: 400,
                message: 'err3'
            };
        })
    },


    rateOwner: function (data, context) {
        var totalRating = 0;
        var averageRating = 0;
        var sum = 0;

        let ownerId = data.ownerId;
        data.addedBy = context.identity.id;

        return Ratings.create(data).then(function (rating) {
            return Ratings.find({ ownerId: ownerId }).then(function (get) {
                totalRating = get.length;
                console.log('get', get)
                for (i = 0; i < totalRating; i++) {
                    sum += get[i].rating;
                    console.log('sum123', sum);
                    console.log('get', get[i].rating)
                }
                averageRating = sum / totalRating;
                return Users.update({ id: ownerId }, { totalRating: totalRating, averageRating: parseFloat(averageRating) }).then(function (update) {
                    // console.log('abc', totalRating, averageRating)
                    return {
                        success: true,
                        code: 200,
                        message: update
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
    },

};