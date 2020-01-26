/**
 * CategoryController
 *
 * @description :: Server-side logic for managing categories
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var _request = require('request');
var ObjectId = require('mongodb').ObjectID;

module.exports = {
    saveTypes: function(req, res) {
        API(VehicleService.saveTypes, req, res);
    },

    update: function(req, res) {
        API(VehicleService.updateTypes, req, res);
    },

    delete: function(req, res) {
        API(CategoryService.delete, req, res);
    },
    
    getAllVehicleType: function(req, res) {

        var search = req.param('search');
        var sortBy = req.param('sortBy');
        var page = req.param('page');
        var count = req.param('count');
        var skipNo = (page - 1) * count;
        var query = {};

        if (sortBy) {
            sortBy = sortBy.toString();
        } else {
            sortBy = 'createdAt desc';
        }

        query.isDeleted = 'false';

        if (search) {
            query.$or = [{
                    name: {
                        'like': '%' + search + '%'
                    }
                }

            ]
        } 
        
        console.log("query is ",query)

        Vehicletype.count(query).exec(function(err, total) {
            console.log("total is ",total)
            if (err) {
                return res.status(400).jsonx({
                    success: false,
                    error: err
                });
            } else {
                Vehicletype.find(query).sort(sortBy).skip(skipNo).limit(count).exec(function(err, vtypes) {
                    if (err) {
                        return res.status(400).jsonx({
                            success: false,
                            error: err
                        });
                    } else {
                        return res.jsonx({
                            success: true,
                            data: {
                                vtypes: vtypes,
                                total: total
                            },
                        });
                    }
                })
            }
        })
    },
    
    getVehicleType :function(req,res){
        API(VehicleService.getvehicletype,req,res);
    },

    getListVehicleType :function(req,res){
        API(VehicleService.getListVehicleType,req,res);
    },

    /* Start Vehicle Management here */
    saveVehicle: function(req, res) {
        API(VehicleService.saveVehicle, req, res);
    },

    updateVehicle: function(req, res) {
        API(VehicleService.updateVehicle, req, res);
    },
    
    getAllVehicle: function(req, res) {

        var search = req.param('search');
        var sortBy = req.param('sortBy');
        var page = req.param('page');
        var count = req.param('count');
        var skipNo = (page - 1) * count;
        var query = {};

        if (sortBy) {
            sortBy = sortBy.toString();
        } else {
            sortBy = 'createdAt desc';
        }

        query.isDeleted = 'false';

        if (search) {
            query.$or = [{
                    name: {
                        'like': '%' + search + '%'
                    }
                }

            ]
        } 
        
        console.log("query is ",query)

        Vehicle.count(query).exec(function(err, total) {
            console.log("total is ",total)
            if (err) {
                return res.status(400).jsonx({
                    success: false,
                    error: err
                });
            } else {
                Vehicle.find(query).populate('type').populate('brand_id').populate('model_id').populate('mileage_id').sort(sortBy).skip(skipNo).limit(count).exec(function(err, vehicles) {
                    if (err) {
                        return res.status(400).jsonx({
                            success: false,
                            error: err
                        });
                    } else {
                        return res.jsonx({
                            success: true,
                            data: {
                                vehicles: vehicles,
                                total: total
                            },
                        });
                    }
                })
            }
        })
    },
    
    getVehicle :function(req,res){
        API(VehicleService.getvehicle,req,res);
    },

    getListVehicle :function(req,res){
        API(VehicleService.getListVehicle,req,res);
    },

    myVehicles :function(req,res){
        API(VehicleService.myVehicles,req,res);
    },


    /* Stop Vehicle Management here */

};