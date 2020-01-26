var Promise = require('bluebird'),
    promisify = Promise.promisify;
var bcrypt    = require('bcrypt-nodejs');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var ObjectId = require('mongodb').ObjectID;
var constantObj = sails.config.constants;

var transport = nodemailer.createTransport(smtpTransport({
    host: sails.config.appSMTP.host,
    port: sails.config.appSMTP.port,
    debug: sails.config.appSMTP.debug,
    auth: {
        user: sails.config.appSMTP.auth.user, //access using /congig/appSMTP.js
        pass: sails.config.appSMTP.auth.pass
    }
}));

module.exports = {

    getUniqueCode: function () {
        let code = Math.floor(Math.random()*900001258) + 100009852;
        return code;
    },

    getAllCountries:function(data,context){
        return Country.find({}).sort({name:1}).then(function(country) {
            if(country.length==0){
                return {
                    success: false,
                    error: {
                        code: 400,
                        message: constantObj.messages.COUNTRY_NOT_FOUND
                    },
                };
            }else{
                return {
                    success: true,
                    data: {
                        code: 200,
                        data:country
                    },
                };
            }
        })
    },

    // Start of Energy Management

    saveEnergy: function(data,context){

        if((!data.name) || typeof data.name == undefined){ 
            return {"success": false, "error": {"code": 404,"message": constantObj.Energy.NAME_REQUIRED} };
        }
      
        let query = {}
        query.isDeleted = false,
        query.name = data.name,
        query.status =  "active";

        return Energy.findOne(query).then(function(cat) {        
            if(cat) {
                return {
                    success: false,
                    error: {
                        code: 400,
                        message: constantObj.energy.ENERGY_VALUE_ALREADY_EXIST
                    },
                };

            } else {
                return Energy.create(data).then(function(energy) {
                    return {
                        success: true,
                        code:200,
                        data: {
                            energy:energy,
                            message: constantObj.energy.VALUE_SAVED
                        },
                    };
                })
                .fail(function(err){
                    return {
                        success: false,
                        error: {
                            code: 400,
                            message: constantObj.energy.ENERGY_VALUE_ALREADY_EXIST
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

    updateEnergy: function(data,context){

        let query = {};

        query.name = data.name;
        query._id = data.id;
        query.isDeleted = false;
        
        return Energy.findOne(query).then(function(cat) {
            if( cat == undefined ){

              return Energy.update(data.id,data).then(function(energy) {
                    return {
                        success: true,
                        code:200,
                        data: {
                            energy:energy,
                            message: constantObj.energy.ENERGY_VALUE_UPDATED
                        },
                    };
                })
                .fail(function(err){
                    
                    return {
                        success: false,
                        error: {
                            code: 400,
                            message: constantObj.energy.ISSUE_IN_ENERGY_VALUE_UPDATE
                        },
                    };   
                });

                
            } else {

                return {
                    success: false,
                    error: {
                        code: 400,
                        message: constantObj.energy.ENERGY_VALUE_ALREADY_EXIST
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

    getEnergy:function(data,context){
        return Energy.findOne({id:data.id,isDeleted:false,status:"active"}).then(function(energy) {
            if(!energy){
                return {
                    success: false,
                    error: {
                        code: 400,
                        message: constantObj.energy.ENERGY_TYPE_NOT_FOUND
                    },
                };
            }else{
                return {
                    success: true,
                    data: {
                        code: 200,
                        energy:energy
                    },
                };
            }
        })
    },

    getListEnergy:function(data,context){
        return Energy.find({isDeleted:false,status:"active"}).sort({name:1}).then(function(energy) {
            if(energy.length==0){
                return {
                    success: false,
                    error: {
                        code: 400,
                        message: constantObj.energy.ENERGY_TYPE_NOT_FOUND
                    },
                };
            }else{
                return {
                    success: true,
                    data: {
                        code: 200,
                        data:energy
                    },
                };
            }
        })
    },

    // End of Energy Management

    // Start of Cylinder Capacity Management

    saveCylinder: function(data,context){

        if((!data.name) || typeof data.name == undefined){ 
            return {"success": false, "error": {"code": 404,"message": constantEnergy.NAME_REQUIRED} };
        }
      
        let query = {}
        query.isDeleted = false,
        query.name = data.name,
        query.status =  "active";

        return Cylinder.findOne(query).then(function(cat) {        
            if(cat) {
                return {
                    success: false,
                    error: {
                        code: 400,
                        message: constantObj.cylinder.CYLINDER_VALUE_ALREADY_EXIST
                    },
                };

            } else {
                return Cylinder.create(data).then(function(cylinder) {
                    return {
                        success: true,
                        code:200,
                        data: {
                            cylinder:cylinder,
                            message: constantObj.cylinder.VALUE_SAVED
                        },
                    };
                })
                .fail(function(err){
                    return {
                        success: false,
                        error: {
                            code: 400,
                            message: constantObj.cylinder.CYLINDER_VALUE_ALREADY_EXIST
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

    updateCylinder: function(data,context){

        let query = {};

        query.name = data.name;
        query._id = data.id;
        query.isDeleted = false;
        
        return Cylinder.findOne(query).then(function(cat) {
            if( cat == undefined ){

              return Cylinder.update(data.id,data).then(function(cylinder) {
                    return {
                        success: true,
                        code:200,
                        data: {
                            cylinder:cylinder,
                            message: constantObj.cylinder.CYLINDER_VALUE_UPDATED
                        },
                    };
                })
                .fail(function(err){
                    
                    return {
                        success: false,
                        error: {
                            code: 400,
                            message: constantObj.cylinder.ISSUE_IN_CYLINDER_VALUE_UPDATE
                        },
                    };   
                });

                
            } else {

                return {
                    success: false,
                    error: {
                        code: 400,
                        message: constantObj.cylinder.CYLINDER_VALUE_ALREADY_EXIST
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

    getCylinder:function(data,context){
        return Cylinder.findOne({id:data.id,isDeleted:false,status:"active"}).then(function(cylinder) {
            if(!cylinder){
                return {
                    success: false,
                    error: {
                        code: 400,
                        message: constantObj.cylinder.CYLINDER_NOT_FOUND
                    },
                };
            }else{
                return {
                    success: true,
                    data: {
                        code: 200,
                        cylinder:cylinder
                    },
                };
            }
        })
    },

    getListCylinder:function(data,context){
        return Cylinder.find({isDeleted:false,status:"active"}).sort({name:1}).then(function(cylinder) {
            if(cylinder.length==0){
                return {
                    success: false,
                    error: {
                        code: 400,
                        message: constantObj.cylinder.CYLINDER_NOT_FOUND
                    },
                };
            }else{
                return {
                    success: true,
                    data: {
                        code: 200,
                        data:cylinder
                    },
                };
            }
        })
    },

    // End of Cylinder Capacity Management

    // Start of Vehicle Models Management

    saveModel: function(data,context){

        if((!data.name) || typeof data.name == undefined){ 
            return {"success": false, "error": {"code": 404,"message": constantObj.model.NAME_REQUIRED} };
        }
      
        let query = {}
        query.isDeleted = false,
        query.name = data.name,
        query.status =  "active";

        return Model.findOne(query).then(function(cat) {      
            if(cat) {
                return {
                    success: false,
                    error: {
                        code: 401,
                        message: constantObj.model.MODEL_VALUE_ALREADY_EXIST
                    },
                };

            } else { 
                console.log("2")
                return Model.create(data).then(function(model) { 
                    return {
                        success: true,
                        code:200,
                        data: {
                            model:model,
                            message: constantObj.model.VALUE_SAVED
                        },
                    };
                })
                .fail(function(err){
                    return {
                        success: false,
                        error: {
                            code: 400,
                            message: constantObj.model.MODEL_VALUE_ALREADY_EXIST
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

    updateModel: function(data,context){

        let query = {};

        query.name = data.name;
        query._id = data.id;
        query.isDeleted = false;
        
        return Model.findOne(query).then(function(cat) {
            if( cat == undefined ){

              return Model.update(data.id,data).then(function(model) {
                    return {
                        success: true,
                        code:200,
                        data: {
                            model:model,
                            message: constantObj.model.MODEL_VALUE_UPDATED
                        },
                    };
                })
                .fail(function(err){
                    
                    return {
                        success: false,
                        error: {
                            code: 400,
                            message: constantObj.model.ISSUE_IN_MODEL_VALUE_UPDATE
                        },
                    };   
                });

                
            } else {

                return {
                    success: false,
                    error: {
                        code: 400,
                        message: constantObj.model.MODEL_VALUE_ALREADY_EXIST
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

    getModel:function(data,context){
        return Model.findOne({id:data.id,isDeleted:false,status:"active"}).then(function(model) {
            if(!model){
                return {
                    success: false,
                    error: {
                        code: 400,
                        message: constantObj.model.MODEL_NOT_FOUND
                    },
                };
            }else{
                return {
                    success: true,
                    data: {
                        code: 200,
                        model:model
                    },
                };
            }
        })
    },

    getListModel:function(data,context){
        return Model.find({isDeleted:false,status:"active"}).sort({name:1}).then(function(model) {
            if(model.length==0){
                return {
                    success: false,
                    error: {
                        code: 400,
                        message: constantObj.model.MODEL_NOT_FOUND
                    },
                };
            }else{
                return {
                    success: true,
                    data: {
                        code: 200,
                        data:model
                    },
                };
            }
        })
    },

    getBrandModel:function(data,context){
        var query={};
        query.isDeleted = false;
        query.status = "active";
        query.brand_id = data.brand_id;
        return Model.find(query).sort({name:1}).then(function(model) {
            if(model.length==0){
                return {
                    success: false,
                    error: {
                        code: 400,
                        message: constantObj.model.MODEL_NOT_FOUND
                    },
                };
            }else{
                return {
                    success: true,
                    data: {
                        code: 200,
                        data:model
                    },
                };
            }
        })
    },

    // End of Vehicle Models Management

    // Start of Option Management

    saveOptions: function(data,context){

        if((!data.name) || typeof data.name == undefined){ 
            return {"success": false, "error": {"code": 404,"message": constantObj.options.NAME_REQUIRED} };
        }
      
        let query = {}
        query.isDeleted = false,
        query.name = data.name,
        query.status =  "active";

        console.log("teting",query)

        return Options.findOne(query).then(function(cat) {   
            console.log("cat",cat)   
            if(cat) {
                return {
                    success: false,
                    error: {
                        code: 401,
                        message: constantObj.options.OPTIONS_VALUE_ALREADY_EXIST
                    },
                };

            } else { 
                console.log("2")
                return Options.create(data).then(function(options) { 
                    console.log("in first else condition",options)
                    return {
                        success: true,
                        code:200,
                        data: {
                            options:options,
                            message: constantObj.options.VALUE_SAVED
                        },
                    };
                })
                .fail(function(err){
                    console.log("in first fail condition",err)
                    return {
                        success: false,
                        error: {
                            code: 400,
                            message: constantObj.options.OPTIONS_VALUE_ALREADY_EXIST
                        },
                    };   
                });
            }
        }).fail(function(errr){ 
            console.log("in second fail condition",errr)
                return {
                    success: false,
                    error: {
                        code: 402,
                        message: errr
                    },
                };   
        });
    },

    updateOptions: function(data,context){

        let query = {};

        query.name = data.name;
        query._id = data.id;
        query.isDeleted = false;
        
        return Options.findOne(query).then(function(cat) {
            if( cat == undefined ){

              return Options.update(data.id,data).then(function(options) {
                    return {
                        success: true,
                        code:200,
                        data: {
                            options:options,
                            message: constantObj.options.OPTIONS_VALUE_UPDATED
                        },
                    };
                })
                .fail(function(err){
                    
                    return {
                        success: false,
                        error: {
                            code: 400,
                            message: constantObj.options.ISSUE_IN_OPTIONS_VALUE_UPDATE
                        },
                    };   
                });

                
            } else {

                return {
                    success: false,
                    error: {
                        code: 400,
                        message: constantObj.options.OPTIONS_VALUE_ALREADY_EXIST
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

    getOptions:function(data,context){
        return Options.findOne({id:data.id,isDeleted:false,status:"active"}).then(function(options) {
            if(!options){
                return {
                    success: false,
                    error: {
                        code: 400,
                        message: constantObj.options.OPTIONS_NOT_FOUND
                    },
                };
            }else{
                return {
                    success: true,
                    data: {
                        code: 200,
                        options:options
                    },
                };
            }
        })
    },

    getListOptions:function(data,context){
        return Options.find({isDeleted:false,status:"active"}).sort({name:1}).then(function(options) {
            if(options.length==0){
                return {
                    success: false,
                    error: {
                        code: 400,
                        message: constantObj.options.OPTIONS_NOT_FOUND
                    },
                };
            }else{
                return {
                    success: true,
                    data: {
                        code: 200,
                        data:options
                    },
                };
            }
        })
    },

    // End of Options Management

    // Start of Mileage Management

    saveMileage: function(data,context){

        if((!data.startrange) || typeof data.startrange == undefined){ 
            return {"success": false, "error": {"code": 404,"message": constantObj.mileage.START_POINT_REQUIRED} };
        }
        if((!data.endrange) || typeof data.endrange == undefined){ 
            return {"success": false, "error": {"code": 404,"message": constantObj.mileage.END_POINT_REQUIRED} };
        }
        let query = {}
        query.isDeleted = false,
        query.startrange = data.startrange,
        query.endrange = data.endrange,
        query.status =  "active";

        console.log("teting",query)

        return Mileage.findOne(query).then(function(cat) {   
            console.log("cat",cat)   
            if(cat) {
                return {
                    success: false,
                    error: {
                        code: 401,
                        message: constantObj.mileage.START_END_ALREADY_EXIST
                    },
                };

            } else { 
                console.log("2")
                return Mileage.create(data).then(function(mileage) { 
                    console.log("in first else condition",mileage)
                    return {
                        success: true,
                        code:200,
                        data: {
                            mileage:mileage,
                            message: constantObj.mileage.VALUE_SAVED
                        },
                    };
                })
                .fail(function(err){
                    console.log("in first fail condition",err)
                    return {
                        success: false,
                        error: {
                            code: 400,
                            message: constantObj.mileage.MILEAGE_VALUE_ALREADY_EXIST
                        },
                    };   
                });
            }
        }).fail(function(errr){ 
            console.log("in second fail condition",errr)
                return {
                    success: false,
                    error: {
                        code: 402,
                        message: errr
                    },
                };   
        });
    },

    updateMileage: function(data,context){
        console.log("test of update function",data)
        if((data.startrange != '') || typeof data.startrange == undefined){ 
            return {"success": false, "error": {"code": 404,"message": constantObj.mileage.START_POINT_REQUIRED} };
        }
        if((!data.endrange) || typeof data.endrange == undefined){ 
            return {"success": false, "error": {"code": 404,"message": constantObj.mileage.END_POINT_REQUIRED} };
        }

        let query = {};

        query.isDeleted = false,
        query.startrange = data.startrange,
        query.endrange = data.endrange,
        query.status =  "active";
        
        console.log("query of update",query)
        return Mileage.findOne(query).then(function(cat) {
            if( cat == undefined ){

              return Mileage.update(data.id,data).then(function(mileage) {
                    return {
                        success: true,
                        code:200,
                        data: {
                            mileage:mileage,
                            message: constantObj.mileage.MILEAGE_VALUE_UPDATED
                        },
                    };
                })
                .fail(function(err){
                    
                    return {
                        success: false,
                        error: {
                            code: 400,
                            message: constantObj.mileage.ISSUE_IN_MILEAGE_VALUE_UPDATE
                        },
                    };   
                });

                
            } else {

                return {
                    success: false,
                    error: {
                        code: 400,
                        message: constantObj.mileage.START_END_ALREADY_EXIST
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

    getMileage:function(data,context){
        return Mileage.findOne({id:data.id,isDeleted:false,status:"active"}).then(function(mileage) {
            if(!mileage){
                return {
                    success: false,
                    error: {
                        code: 400,
                        message: constantObj.mileage.MILEAGE_NOT_FOUND
                    },
                };
            }else{
                return {
                    success: true,
                    data: {
                        code: 200,
                        mileage:mileage
                    },
                };
            }
        })
    },

    getListMileage:function(data,context){
        return Mileage.find({isDeleted:false,status:"active"}).sort({name:1}).then(function(mileage) {
            if(mileage.length==0){
                return {
                    success: false,
                    error: {
                        code: 400,
                        message: constantObj.mileage.MILEAGE_NOT_FOUND
                    },
                };
            }else{
                return {
                    success: true,
                    data: {
                        code: 200,
                        data:mileage
                    },
                };
            }
        })
    },

    // End of Mileage Management

    
    // Start of Consumption Management

    saveConsumption: function(data,context){

        if((!data.name) || typeof data.name == undefined){ 
            return {"success": false, "error": {"code": 404,"message": constantObj.consumption.NAME_REQUIRED} };
        }
      
        let query = {}
        query.isDeleted = false,
        query.name = data.name,
        query.status =  "active";

        console.log("teting",query)

        return Consumption.findOne(query).then(function(cat) {   
            console.log("cat",cat)   
            if(cat) {
                return {
                    success: false,
                    error: {
                        code: 401,
                        message: constantObj.consumption.CONSUMPTION_VALUE_ALREADY_EXIST
                    },
                };

            } else { 
                console.log("2")
                return Consumption.create(data).then(function(consumption) { 
                    console.log("in first else condition",consumption)
                    return {
                        success: true,
                        code:200,
                        data: {
                            consumption:consumption,
                            message: constantObj.consumption.VALUE_SAVED
                        },
                    };
                })
                .fail(function(err){
                    console.log("in first fail condition",err)
                    return {
                        success: false,
                        error: {
                            code: 400,
                            message: constantObj.consumption.CONSUMPTION_VALUE_ALREADY_EXIST
                        },
                    };   
                });
            }
        }).fail(function(errr){ 
            console.log("in second fail condition",errr)
                return {
                    success: false,
                    error: {
                        code: 402,
                        message: errr
                    },
                };   
        });
    },

    updateConsumption: function(data,context){

        let query = {};

        query.name = data.name;
        query._id = data.id;
        query.isDeleted = false;
        
        return Consumption.findOne(query).then(function(cat) {
            if( cat == undefined ){

              return Consumption.update(data.id,data).then(function(consumption) {
                    return {
                        success: true,
                        code:200,
                        data: {
                            consumption:consumption,
                            message: constantObj.consumption.CONSUMPTION_VALUE_UPDATED
                        },
                    };
                })
                .fail(function(err){
                    
                    return {
                        success: false,
                        error: {
                            code: 400,
                            message: constantObj.consumption.ISSUE_IN_CONSUMPTION_VALUE_UPDATE
                        },
                    };   
                });

                
            } else {

                return {
                    success: false,
                    error: {
                        code: 400,
                        message: constantObj.consumption.CONSUMPTION_VALUE_ALREADY_EXIST
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

    getConsumption:function(data,context){
        return Consumption.findOne({id:data.id,isDeleted:false}).then(function(consumption) {
            if(!consumption){
                return {
                    success: false,
                    error: {
                        code: 400,
                        message: constantObj.consumption.CONSUMPTION_NOT_FOUND
                    },
                };
            }else{
                return {
                    success: true,
                    data: {
                        code: 200,
                        consumption:consumption
                    },
                };
            }
        })
    },

    getListConsumption:function(data,context){
        return Consumption.find({isDeleted:false,status:"active"}).sort({name:1}).then(function(consumption) {
            if(consumption.length==0){
                return {
                    success: false,
                    error: {
                        code: 400,
                        message: constantObj.consumption.CONSUMPTION_NOT_FOUND
                    },
                };
            }else{
                return {
                    success: true,
                    data: {
                        code: 200,
                        data:consumption
                    },
                };
            }
        })
    },

    // End of Consumption Management
};

	