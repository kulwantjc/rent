var Promise = require('q');
var constantObj = sails.config.constants;
var gm = require('gm');
var smtpTransport = require('nodemailer-smtp-transport');
var nodemailer = require('nodemailer');
var distance = require('google-distance-matrix');

var crypt = require('crypt');
var util = require('util');
var crypto = require('crypto');
var iplocation = require("iplocation").default;
var geoip = require('geoip-lite');
var geodist = require('geodist');
var NodeGeocoder = require('node-geocoder');

var transport = nodemailer.createTransport(smtpTransport({
    host: sails.config.appSMTP.host,
    port: sails.config.appSMTP.port,
    debug: sails.config.appSMTP.debug,
    auth: {
        user: sails.config.appSMTP.auth.user, //access using /congig/appSMTP.js
        pass: sails.config.appSMTP.auth.pass
    }
}));

/**
 * CommonController
 *
 * @description :: Server-side logic for managing equipment
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    
    uploadImages: function(req, res) {
        console.log('abc')
        var fs = require('fs');
        var uuid = require('uuid');
        var randomStr = uuid.v4();
        var date = new Date();
        var currentDate = date.valueOf();

        var modelName = req.body.type;

        var Model = sails.models[modelName];
        var name = randomStr + "-" + currentDate;

        var imagedata = req.body.data;
        imageBuffer = this.decodeBase64Image(imagedata);

        var imageType = imageBuffer.type;

        var typeArr = new Array();
        typeArr = imageType.split("/");
        var fileExt = typeArr[1];

        var size = Buffer.byteLength(imagedata, "base64");
        var i = parseInt(Math.floor(Math.log(size) / Math.log(1024)));
        var test = Math.round(size / Math.pow(1024, i), 2);

        if (size <= 10737418) {

            if ((fileExt === 'jpeg') || (fileExt === 'JPEG') || (fileExt === 'JPG') || (fileExt === 'jpg') || (fileExt === 'PNG') || (fileExt === 'png')) {
                if (imageBuffer.error) return imageBuffer.error;

                var fullPath = name + '.' + fileExt;
                var imagePath = '/images/' + modelName + '/' + name + '.' + fileExt;
                var uploadLocation = 'assets/images/' + modelName + '/' + name + '.' + fileExt;

                var thumbnails = [];

                fs.writeFile('assets/images/' + modelName + '/' + name + '.' + fileExt, imageBuffer.data, function(imgerr, img) {
                    if (imgerr) {

                        return res.jsonx({
                            success: false,
                            error: {
                                code: 404,
                                message: imgerr

                            },
                        });
                    } else {
                        fs.readFile(uploadLocation, function(err, data) {
                            if (err) {
                                return res.jsonx({
                                    success: false,
                                    error: {
                                        code: 403,
                                        message: err
                                    },
                                });
                            }
                            if (data) {
                                var thumbpath = 'assets/images/' + modelName + '/thumbnail/200/' + name + '.' + fileExt;
                                //var thumbtempLocation = '.tmp/public/images/'+ modelName + '/thumbnail/' +'200_' +name + '.' + fileExt ;
                                gm(data)
                                    .resize('200', '200', '^')
                                    .write(thumbpath, function(err) {
                                        if (!err) {
                                            var thumbpath1 = 'assets/images/' + modelName + '/thumbnail/300/' + name + '.' + fileExt;
                                            thumbnails.push(thumbpath)
                                            gm(data)
                                                .resize('300', '300', '^')
                                                .write(thumbpath1, function(error) {

                                                    if (!error) {
                                                        thumbnails.push(thumbpath1)
                                                        var thumbpath2 = 'assets/images/' + modelName + '/thumbnail/500/' + name + '.' + fileExt;
                                                        
                                                        gm(data)
                                                            .resize('500', '500', '^')
                                                            .write(thumbpath2, function(er) {
                                                                if (!er) {

                                                                    return res.jsonx({
                                                                        success: true,
                                                                        data: {
                                                                            fullPath: fullPath,
                                                                            imagePath: imagePath,
                                                                            //thumbpath : thumbnails
                                                                        },
                                                                    });

                                                                }

                                                            })
                                                    } else {
                                                        return res.jsonx({
                                                            success: false,
                                                            error: {
                                                                code: 402,
                                                                message: constantObj.messages.NOT_UPLOADED1

                                                            },
                                                        });
                                                    }

                                                })
                                        } else {
                                            return res.jsonx({
                                                success: false,
                                                error: {
                                                    code: 401,
                                                    message: constantObj.messages.NOT_UPLOADED

                                                },
                                            });
                                        }
                                    });
                            }
                        });
                    }

                });

            } else {

                return res.jsonx({
                    success: false,
                    error: {
                        code: 400,
                        message: constantObj.messages.INVALID_IMAGE

                    },
                });

            }
        } else {
            return res.jsonx({
                success: false,
                error: {
                    code: 400,
                    message: constantObj.messages.SIZE_EXCEEDED

                },
            });
        }
    },

    /*function to decode base64 image*/
    decodeBase64Image: function(dataString) {
        var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
            response = {};
        if (matches) {

            if (matches.length !== 3) {
                return new Error('Invalid input string');
            }

            response.type = matches[1];
            response.data = new Buffer(matches[2], 'base64');
        } else {
            response.error = constantObj.messages.INVALID_IMAGE;
        }

        return response;
    },

    delete: function(req, res) {

        var modelName = req.param('model');
        var Model = sails.models[modelName];
        var itemId = req.param('id');

        let query = {};
        query.id = itemId;

        Model.find(query).exec(function(err, data) {
            if (err) {
                return res.jsonx({
                    success: false,
                    error: {
                        code: 400,
                        message: constantObj.messages.DATABASE_ISSUE
                    }
                });
            } else {

                Model.update({
                    id: itemId
                }, {
                    isDeleted: true,
                    deletedBy: req.identity.id
                }, function(err, data) {
                    if (data) {
                        return res.jsonx({
                            success: true,
                            data: {
                                message: constantObj.messages.DELETE_RECORD
                            }
                        });
                    } else {
                        return res.jsonx({
                            success: false,
                            error: {
                                code: 400,
                                message: constantObj.messages.DATABASE_ISSUE
                            }
                        });
                    }

                });
            }
        })
    },

    changeStatus: function(req, res) {

        var modelName = req.param('model');
        var Model = sails.models[modelName];
        var itemId = req.param('id');
        var updated_status = req.param('status');

        let query = {};
        query.id = itemId;

        Model.findOne(query).exec(function(err, data) {

            if (err) {
                return res.jsonx({
                    success: false,
                    error: {
                        code: 400,
                        message: constantObj.messages.DATABASE_ISSUE
                    }
                });
            } else {

                Model.update({
                    id: itemId
                }, {
                    status: updated_status
                }, function(err, response) {
                    if (err) {
                        return res.jsonx({
                            success: false,
                            error: {
                                code: 400,
                                message: constantObj.messages.DATABASE_ISSUE
                            }
                        });

                    } else {

                        return res.jsonx({
                            success: true,
                            data: {
                                message: constantObj.messages.STATUS_CHANGED
                            }
                        });
                    }
                });
            }
        })
    },

    getAllCountries :function(req,res){
        API(commonService.getAllCountries,req,res);
    },

    // Start of Energy Management
    saveEnergy: function(req, res) {
        API(commonService.saveEnergy, req, res);
    },

    updateEnergy: function(req, res) {
        API(commonService.updateEnergy, req, res);
    },

    getEnergy :function(req,res){
        API(commonService.getEnergy,req,res);
    },

    getListEnergy :function(req,res){
        API(commonService.getListEnergy,req,res);
    },

    getAllEnergy: function(req, res) {

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

        Energy.count(query).exec(function(err, total) {
            console.log("total is ",total)
            if (err) {
                return res.status(400).jsonx({
                    success: false,
                    error: err
                });
            } else {
                Energy.find(query).sort(sortBy).skip(skipNo).limit(count).exec(function(err, energy) {
                    if (err) {
                        return res.status(400).jsonx({
                            success: false,
                            error: err
                        });
                    } else {
                        return res.jsonx({
                            success: true,
                            data: {
                                energy: energy,
                                total: total
                            },
                        });
                    }
                })
            }
        })
    },
    // End of Energy Management

    // Start of Cylinder Capacity Management

    saveCylinder: function(req, res) {
        API(commonService.saveCylinder, req, res);
    },

    updateCylinder: function(req, res) {
        API(commonService.updateCylinder, req, res);
    },

    getCylinder :function(req,res){
        API(commonService.getCylinder,req,res);
    },

    getListCylinder :function(req,res){
        API(commonService.getListCylinder,req,res);
    },

    getAllCylinder: function(req, res) {

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
            query.$or = [
                { name:parseInt(search)}
            ]
        } 
        
        console.log("query is ",query)

        Cylinder.count(query).exec(function(err, total) {
            console.log("total is ",total)
            if (err) {
                return res.status(400).jsonx({
                    success: false,
                    error: err
                });
            } else {
                Cylinder.find(query).sort(sortBy).skip(skipNo).limit(count).exec(function(err, cylinder) {
                    if (err) {
                        return res.status(400).jsonx({
                            success: false,
                            error: err
                        });
                    } else {
                        return res.jsonx({
                            success: true,
                            data: {
                                cylinder: cylinder,
                                total: total
                            },
                        });
                    }
                })
            }
        })
    },

    // End of Cylinder Capacity Management

    // Start of Vehicle Models Management

    saveModel: function(req, res) {
        API(commonService.saveModel, req, res);
    },

    updateModel: function(req, res) {
        API(commonService.updateModel, req, res);
    },

    getModel :function(req,res){
        API(commonService.getModel,req,res);
    },

    getListModel :function(req,res){
        API(commonService.getListModel,req,res);
    },

    getBrandModel :function(req,res){
        API(commonService.getBrandModel,req,res);
    },

    getAllModel: function(req, res) {

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

        Model.count(query).exec(function(err, total) {
            console.log("total is ",total)
            if (err) {
                return res.status(400).jsonx({
                    success: false,
                    error: err
                });
            } else {
                Model.find(query).populate('brand_id').populate('vtype').sort(sortBy).skip(skipNo).limit(count).exec(function(err, model) {
                    if (err) {
                        return res.status(400).jsonx({
                            success: false,
                            error: err
                        });
                    } else {
                        return res.jsonx({
                            success: true,
                            data: {
                                model: model,
                                total: total
                            },
                        });
                    }
                })
            }
        })
    },

    // End of Vehicle Models Management


    // Start of Options Management

    saveOptions: function(req, res) {
        API(commonService.saveOptions, req, res);
    },

    updateOptions: function(req, res) {
        API(commonService.updateOptions, req, res);
    },

    getOptions:function(req,res){
        API(commonService.getOptions,req,res);
    },

    getListOptions :function(req,res){
        API(commonService.getListOptions,req,res);
    },

    getAllOptions: function(req, res) {

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

        Options.count(query).exec(function(err, total) {
            console.log("total is ",total)
            if (err) {
                return res.status(400).jsonx({
                    success: false,
                    error: err
                });
            } else {
                Options.find(query).sort(sortBy).skip(skipNo).limit(count).exec(function(err, options) {
                    if (err) {
                        return res.status(400).jsonx({
                            success: false,
                            error: err
                        });
                    } else {
                        return res.jsonx({
                            success: true,
                            data: {
                                options: options,
                                total: total
                            },
                        });
                    }
                })
            }
        })
    },

    // End of Options Management

    // Start of Mileage Management

    saveMileage: function(req, res) {
        API(commonService.saveMileage, req, res);
    },

    updateMileage: function(req, res) {
        API(commonService.updateMileage, req, res);
    },

    getMileage:function(req,res){
        API(commonService.getMileage,req,res);
    },

    getListMileage :function(req,res){
        API(commonService.getListMileage,req,res);
    },

    getAllMileage: function(req, res) {

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
            query.$or = [
                { startrange:parseInt(search)},
                { endrange: parseInt(search)},
            ]
        } 
        
        console.log("query is ",query)

        Mileage.count(query).exec(function(err, total) {
            console.log("total is ",total)
            if (err) {
                return res.status(400).jsonx({
                    success: false,
                    error: err
                });
            } else {
                Mileage.find(query).sort(sortBy).skip(skipNo).limit(count).exec(function(err, mileage) {
                    if (err) {
                        return res.status(400).jsonx({
                            success: false,
                            error: err
                        });
                    } else {
                        return res.jsonx({
                            success: true,
                            data: {
                                mileage: mileage,
                                total: total
                            },
                        });
                    }
                })
            }
        })
    },

    // End of Mileage Management

    // Start of Consumption Management

    saveConsumption: function(req, res) {
        API(commonService.saveConsumption, req, res);
    },

    updateConsumption: function(req, res) {
        API(commonService.updateConsumption, req, res);
    },

    getConsumption:function(req,res){
        API(commonService.getConsumption,req,res);
    },

    getListConsumption :function(req,res){
        API(commonService.getListConsumption,req,res);
    },

    getAllConsumption: function(req, res) {

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

        Consumption.count(query).exec(function(err, total) {
            console.log("total is ",total)
            if (err) {
                return res.status(400).jsonx({
                    success: false,
                    error: err
                });
            } else {
                Consumption.find(query).sort(sortBy).skip(skipNo).limit(count).exec(function(err, consumption) {
                    if (err) {
                        return res.status(400).jsonx({
                            success: false,
                            error: err
                        });
                    } else {
                        return res.jsonx({
                            success: true,
                            data: {
                                consumption: consumption,
                                total: total
                            },
                        });
                    }
                })
            }
        })
    },

    // End of Consumption Management


}; // End of module export
