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

    saveBrand: function(data,context){
        console.log("uptop in function",data)

        if((!data.name) || typeof data.name == undefined){ 
            return {"success": false, "error": {"code": 404,"message": constantObj.brand.NAME_REQUIRED} };
        }
      
        let query = {}
        query.isDeleted = false,
        query.name = data.name,
        query.status =  "active";

        return Brand.findOne(query).then(function(cat) {
            
            if(cat != undefined) {
                return {
                    success: false,
                    error: {
                        code: 400,
                        message: constantObj.brand.BRAND_ALREADY_EXIST
                    },
                };

            } else {
                console.log("type of", typeof data.vtype)
                return Brand.create(data).then(function(catg) {
                    return {
                        success: true,
                        code:200,
                        data: {
                            brand:catg,
                            message: constantObj.brand.BRAND_SAVED
                        },
                    };
                })
                .fail(function(err){
                    return {
                        success: false,
                        error: {
                            code: 400,
                            message: constantObj.brand.BRAND_ALREADY_EXIST
                        },
                    };   
                });
            }
        }).fail(function(err){ 
                return {
                    success: false,
                    error: {
                        code: 400,
                        message: err
                    },
                };   
        });
    },

    updateBrand: function(data,context){

        let query = {};

        query.name = data.name;
        query._id = { $nin: [ ObjectID(data.id) ] }
        query._id = String(query._id)
        query.isDeleted = false;
        
        return Brand.findOne(query).then(function(cat) {
            if( cat == undefined ){

              return Brand.update(data.id,data).then(function(cats) {
                    return {
                        success: true,
                        code:200,
                        data: {
                            brand:cats,
                            message: constantObj.brand.UPDATED_BRAND
                        },
                    };
                })
                .fail(function(err){
                    
                    return {
                        success: false,
                        error: {
                            code: 400,
                            message: constantObj.brand.ISSUE_IN_UPDATE
                        },
                    };   
                });

                
            } else {

                return {
                    success: false,
                    error: {
                        code: 400,
                        message: constantObj.brand.BRAND_ALREADY_EXIST
                    },
                };
                
            }
        }).fail(function(err){ 
                return {
                    success: false,
                    error: {
                        code: 400,
                        message: err
                    },
                };   
        });
    },
    getBrand:function(data,context){
        return Brand.findOne({id:data.id,isDeleted:false,status:"active"}).then(function(brand) {
            if(!brand){
                return {
                    success: false,
                    error: {
                        code: 400,
                        message: constantObj.brand.BRAND_NOT_FOUND
                    },
                };
            }else{
                return {
                    success: true,
                    data: {
                        code: 200,
                        brand:brand
                    },
                };
            }
        })
    },

    getListBrand:function(data,context){
        return Brand.find({isDeleted:false,status:"active"}).sort({name:1}).then(function(brand) {
            if(brand.length==0){
                return {
                    success: false,
                    error: {
                        code: 400,
                        message: constantObj.brand.BRAND_NOT_FOUND
                    },
                };
            }else{
                return {
                    success: true,
                    data: {
                        code: 200,
                        data:brand
                    },
                };
            }
        })
    },
    // getTypeBrand:function(data,context){
    //     var query = {};
    //     query.isDeleted = false;
    //     query.status = 'active';
    //     query.vtype = data.type
    //     return Brand.find(query).sort({name:1}).then(function(brand) {
    //         if(brand.length==0){
    //             return {
    //                 success: false,
    //                 error: {
    //                     code: 400,
    //                     message: constantObj.brand.BRAND_NOT_FOUND
    //                 },
    //             };
    //         }else{
    //             return {
    //                 success: true,
    //                 data: {
    //                     code: 200,
    //                     data:brand
    //                 },
    //             };
    //         }
    //     })
    // },

    getTypeBrand:function(data,context){
        var query = {};
        query.isDeleted = false;
        query.status = 'active';
        query.vtype = data.getTypeBrand
        return Model.find(query).populate('brand_id').sort({name:1}).then(function(brand) {

            if(brand.length==0){
                return {
                    success: false,
                    error: {
                        code: 400,
                        message: constantObj.brand.BRAND_NOT_FOUND
                    },
                };
            }else{
                console.log("brand is ",brand)
                return {
                    success: true,
                    data: {
                        code: 200,
                        data:brand
                    },
                };
            }
        })
    },
}; // End Delete service class