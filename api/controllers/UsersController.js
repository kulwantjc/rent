/**
 * UsersController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var constantObj = sails.config.constants;
var ObjectId = require('mongodb').ObjectID;
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var commonServiceObj = require('../services/commonService.js');
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
    index: function (req, res) {
        API(Registration.adminSideRegistration, req, res);
    },
    register: function (req, res) {
        API(Registration.registerUser, req, res);
    },
    current: function (req, res) {
        API(Registration.currentUser, req, res);
    },
    signin: function (req, res) {
        API(Registration.signin, req, res);
    },

    signinUser: function (req, res) {
        API(Registration.signinUser, req, res);
    },

    socialSignin: function (req, res) {
        API(Registration.socialSignin, req, res);
    },

    forgotPassword: function (req, res) {
        API(UserService.forgotPassword, req, res);
    },

    changePassword: function (req, res) {
        API(UserService.changePassword, req, res);
    },
    getUserDetail: function (req, res) {
        API(UserService.userInfo, req, res)
    },
    updateProfile: function (req, res) {
        API(UserService.updateUserProfile, req, res)
    },

    'verification/:code': function (req, res) {
        let verifyCode = parseInt(req.param('code'))
        console.log("in verification code", req.param)
        Users.findOne({ code: verifyCode }).then(function (user) {

            if (user == undefined) {
                return { "success": false, "error": { "code": 404, "message": constantObj.messages.INVALID_USER } };
            } else {
                if (user.isVerified == 'N') {
                    Users.update({ id: user.id }, { isVerified: 'Y', date_verified: new Date(), status: "active" }).exec(function (usererr, userInfo) {
                        if (userInfo) {
                            return res.redirect(sails.config.PAYTM_FRONT_WEB_URL + "/#/login;verify=true");
                            //return {"success": true, "data": {"code": 200,"message": constantObj.messages.SUCCESSFULLY_LOGGEDIN, "key":"SUCCESSFULLY_LOGGEDIN"} };       
                        } else {
                            return { "success": false, "error": { "code": 404, "message": constantObj.messages.INVALID_USER, "key": "INVALID_USER" } };
                        }
                    })
                } else {
                    //return res.redirect(sails.config.RENTING_FRONT_WEB_URL + "/#/login;verify=alreadyverified");
                    return { "success": false, "error": { "code": 404, "message": constantObj.messages.ALREADY_VERIFIED, "key": "ALREADY_VERIFIED" } };
                }
            }
        });
    },



    'verify/:code': function (req, res) {
        let verifyCode = req.params.code
        console.log("aaaaa", verifyCode)

        Users.findOne({ code: verifyCode }).then(function (user) {
            console.log("user+++++++++", user)

            if (user === "undefined" || user === undefined) {
                console.log("abc")
                // return {"success": false, "error": {"code": 404,"message": 'INVALID_USER'} };
                return res.jsonx({
                    success: false,
                    error: {
                        code: 404,
                        message: 'invalid_user'
                    },
                });
            } else {
                var code = user.code
                if (user.isVerified == 'N') {

                    //data.code = code;
                    Users.update({ id: user.id }, { isVerified: 'Y', date_verified: new Date(), status: "active" }).exec(function (usererr, userInfo) {
                        if (userInfo) {
                            //return res.redirect(sails.config.INSTALEAF_FRONT_WEB_URL + "/auth/login-signup?email="+code+"&verify=true");
                            //return res.redirect(sails.config.INSTALEAF_FRONT_WEB_URL + "/auth/login-signup?email="+code+"&verify=true");
                            // return res.redirect('http://localhost:3000/login' + "?email=" + user.username + "&verify=true");
                            return res.redirect('http://18.191.240.168:3000/login' + "?email=" + user.username + "&verify=true");

                        } else {
                            return { "success": false, "error": { "code": 404, "message": constantObj.messages.INVALID_USER, "key": "INVALID_USER" } };
                        }
                    })
                } else {
                    console.log("false url", sails.config.INSTALEAF_FRONT_WEB_URL + "?email=" + code + "&verify=false")
                    //return res.redirect(sails.config.INSTALEAF_FRONT_WEB_URL + "/auth/login-signup?email="+code+"&verify=false");
                    return res.redirect('http://localhost:3000/login' + "?email=" + user.username + "&verify=false");
                    //return res.redirect(sails.config.INSTALEAF_FRONT_WEB_URL + "/auth/login-signup?email="+code+"&verify=false");
                    //return {"success": false, "error": {"code": 404,"message": constantObj.messages.ALREADY_VERIFIED, "key":"ALREADY_VERIFIED"} };
                }
            }
        });
    },



    getAllUsers: function (req, res, next) {

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

        if (search) {
            query.$or = [
                {
                    firstName: {
                        'like': '%' + search + '%'
                    }
                },
                {
                    lastName: {
                        'like': '%' + search + '%'
                    }
                },
                {
                    fullName: {
                        'like': '%' + search + '%'
                    }
                },
                {
                    email: {
                        'like': '%' + search + '%'
                    }
                },
                {
                    username: {
                        'like': '%' + search + '%'
                    }
                },
                {
                    mobile: parseInt(search)
                }

            ]
        }
        console.log("query", query);

        Users.count(query).exec(function (err, total) {
            if (err) {
                return res.status(400).jsonx({
                    success: false,
                    error: err
                });
            } else {
                Users.find(query).populate('roleId').sort(sortBy).skip(skipNo).limit(count).exec(function (err, users) {
                    if (err) {
                        return res.status(400).jsonx({
                            success: false,
                            error: err
                        });
                    } else {
                        return res.jsonx({
                            success: true,
                            data: {
                                users: users,
                                total: total
                            },
                        });
                    }
                })
            }
        })
    },

    userProfileData: function (req, res, next) {

        let query = {};
        query.id = req.param('id');

        Users.findOne(query).exec(function (err, users) {
            if (err) {
                return res.status(400).jsonx({
                    success: false,
                    error: err
                });
            } else {
                return res.status(200).jsonx({
                    success: true,
                    data: users
                });
            }
        });
    },
    forgotPassword: function (req, res) {
        API(UserService.forgotPassword, req, res);
    },

    contactus: function (req, res) {
        API(UserService.contactUs, req, res);
    },











};