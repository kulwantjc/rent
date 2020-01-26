/**
 * BrandController
 *
 * @description :: Server-side logic for managing brands
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var _request = require('request');
var ObjectId = require('mongodb').ObjectID;

module.exports = {
    save: function(req, res) {
        API(BrandService.saveBrand, req, res);
    },

    update: function(req, res) {
        API(BrandService.updateBrand, req, res);
    },
    getBrand:function(req,res){
        API(BrandService.getBrand,req,res);
    },

    getListBrand :function(req,res){
        API(BrandService.getListBrand,req,res);
    },
    getTypeBrand :function(req,res){
        API(BrandService.getTypeBrand,req,res);
    },

    getAllBrand: function(req, res) {

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

        Brand.count(query).exec(function(err, total) {
            console.log("total is ",total)
            if (err) {
                return res.status(400).jsonx({
                    success: false,
                    error: err
                });
            } else {
                Brand.find(query).populate('vtype').sort(sortBy).skip(skipNo).limit(count).exec(function(err, brand) {
                    if (err) {
                        return res.status(400).jsonx({
                            success: false,
                            error: err
                        });
                    } else {
                        return res.jsonx({
                            success: true,
                            data: {
                                brand: brand,
                                total: total
                            },
                        });
                    }
                })
            }
        })
    },

 
};