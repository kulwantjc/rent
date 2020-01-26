var Promise = require('bluebird'),
    promisify = Promise.promisify;
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var bcrypt = require('bcrypt-nodejs');
var commonServiceObj = require('./commonService');
var constantObj = sails.config.constants;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";


var transport = nodemailer.createTransport(smtpTransport({
    host: sails.config.appSMTP.host,
    port: sails.config.appSMTP.port,
    debug: sails.config.appSMTP.debug,
    auth: {
        user: sails.config.appSMTP.auth.user, //access using /congig/appSMTP.js
        pass: sails.config.appSMTP.auth.pass
    }
}));


var emailGeneratedCode = function (options) { //email generated code 
    //url = options.verifyURL,
    var email = options.username,
        password = options.password;

    message = 'Hello ';
    message += options.firstName;
    message += ",";
    message += '<br/><br/>';
    message += 'Your account has been created. Please login with the following credentials.';
    message += '<br/><br/>';
    message += 'Email Id : ' + email;
    message += '<br/>';
    message += 'Password : ' + password;
    message += '<br/><br/>';
    message += 'Regards';
    message += '<br/>';
    message += 'Support Team';

    transport.sendMail({
        //from: sails.config.appSMTP.auth.user,
        from: 'Renting System Registration <' + sails.config.appSMTP.auth.user + '>',
        to: email,
        subject: 'Registration Verification',
        html: message
    }, function (err, info) {
        console.log("errro is ", err, info);
    });

    return { success: true, code: 200, data: { message: constantObj.messages.ADDED_SUCCESSFULL, /* data: url */ } };
};

emailVerifyLink = function (options) { //email generated code 
    var url = options.verifyURL,
        email = options.username;
    console.log("email", email)

    message = 'Hello ';
    message += options.firstName;
    message += ",";
    message += '<br/><br/>';
    message += 'User Name: ' + email;
    message += '<br/>';
    message += 'Password: ' + options.password;
    message += '<br/><br/>';
    message += 'You are one step away from verifying your account and joining the community.';
    message += '<br/><br/>';
    message += 'Please verify your account by clicking the link below.';
    message += '<br/><br/>';
    message += '<a href="' + options.verifyURL + '" target="_blank" >Click and Verify</a>';
    message += '<br/><br/><br/>';
    message += 'Welcome to the community!';
    message += '<br/><br/><br/>';
    message += 'Thanks,';
    message += '<br/>';
    message += 'Support Team';


    transport.sendMail({
        from: 'Renting System Registration <' + sails.config.appSMTP.auth.user + '>',
        to: email,
        subject: 'Activate Account',
        html: message
    }, function (err, info) {
        console.log("errro is ", err, info);
    });

    return { success: true, code: 200, data: { message: constantObj.messages.ADDED_SUCCESSFULL, /* data: url */ } };
};
generatePassword = function () { // action are perform to generate random password for user 
    var length = 8,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-=+;:,.?",
        retVal = "";

    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
};

socialUserAccess = function (data, user) {

    let query = {};
    // console.log("checking", data);
    query.clientId = data.clientId;

    query.$or = [{ 'roles': 'U' }, { 'roles': 'D' }, { 'roles': 'B' }, { 'roles': 'DR' }]

    return Users.findOne(query).then(function (user) {

        console.log("abhishek", user)

        let inputData = {};
        if (data.gcm_id) { inputData.gcm_id = data.gcm_id; }
        if (data.device_token) { inputData.device_token = data.device_token; }
        inputData.device_type = data.device_type;
        inputData.user = user.id;
        if (data.device_type == '') { inputData.device_type = "Web"; }

        return Tokens.generateToken({
            client_id: user.id,
            user_id: user.id
        }).then(function (token) {
            user.access_token = token.access_token;
            user.refresh_token = token.refresh_token;

            inputData.access_token = token.access_token;

            return Userslogin.create(inputData).then(function () {
                var lastLoginUpdate = {}
                lastLoginUpdate.lastLogin = new Date();
                lastLoginUpdate.status = 'active';
                // console.log("eeeeeeeee", lastLoginUpdate);
                if (data.domain == 'mobile') {
                    lastLoginUpdate.deviceToken = data.device_token;
                    lastLoginUpdate.domain = data.domain;
                    lastLoginUpdate.device_type = data.device_type;
                }

                return Users.update({ id: user.id }, lastLoginUpdate).then(function () {
                    console.log('123abcd', user)
                    return { "success": true, "message": "Successfully logged in", "data": user };

                }).fail(function (errr) {
                    return { "success": false, "error": { "code": 400, "message": "err", errr } };
                });
            });
        });

    });
}

module.exports = {
    emailGeneratedCode: emailGeneratedCode,
    currentUser: function (data, context) {
        return context.identity;
    },
    // registerUser: function (data, context) {
    //     var date = new Date();

    //     if((!data.username) || typeof data.username == undefined){ 
    //         return {"success": false, "error": {"code": 404,"message": constantObj.messages.USERNAME_REQUIRED, key: 'USERNAME_REQUIRED'} };
    //     }
    //     if((!data.Type) || typeof data.Type == undefined){ 
    //         return {"success": false, "error": {"code": 404,"message": constantObj.messages.TYPE, key: 'TYPE'} };
    //     }
    //     if((!data.password) || typeof data.password == undefined){ 
    //         return {"success": false, "error": {"code": 404,"message": constantObj.messages.PASSWORD_REQUIRED, key: 'PASSWORD_REQUIRED'} };
    //     }
    //     var query = {}
    //     code = commonServiceObj.getUniqueCode();
    //     data.code = code;

    //     console.log("data",data);
    //     if(data.roles == 'U'){
    //         query.$or = [{ username1: data.username1}, {username: data.username}]
    //     } else {
    //         query.username1 = data.username1
    //     }

    //     return Users.findOne(query).then(function (user) {
    //         if (user !== undefined) {
    //             if(user.username1 == data.username1 && user.username != data.username){
    //                 return {"success": false, "error": {"code": 301,"message": constantObj.messages.USER_EXIST, key: 'USER_EXIST'} };
    //             } else if(user.username == data.username && user.username1 != data.username1){
    //                 return {"success": false, "error": {"code": 301,"message": constantObj.messages.EMAIL_EXIST, key: 'EMAIL_EXIST'} };
    //             } else {
    //                 return {"success": false, "error": {"code": 301,"message": constantObj.messages.USERNAME_EMAIL_EXIST, key: 'USERNAME_EMAIL_EXIST'} };                   
    //             }
    //         }else{
    //             data['date_registered'] = date;
    //             data['date_verified'] = date;
    //             data["status"] = "active";


    //             return API.Model(Users).create(data).then(function (user) { 
    //                 context.id = user.username;
    //                 context.type = 'Email';
    //                 console.log("user",user)
    //                 return Tokens.generateToken({
    //                     user_id: user.id,
    //                     client_id: Tokens.generateTokenString()
    //                 });

    //             }).then(function (token) {
    //                 /*return emailGeneratedCode({
    //                     id: context.id,
    //                     type: context.type,
    //                     username: data.username,
    //                     password: data.password,
    //                     firstName: data.firstName,
    //                     verifyURL: sails.getBaseUrl() + "/user/verify/" + data.username + "?code=" + token.code
    //                 });*/
    //                 console.log("token",token)
    //                 return emailVerifyLink({
    //                     id: context.id,
    //                     type: context.type,
    //                     username: data.email,
    //                     username1: data.username1,
    //                     //verifyURL: sails.getBaseUrl() + "/verify/" + data.email
    //                     verifyURL: constantObj.serverUrl.HOST + "/verify/" + data.email 
    //                 });
    //             });                
    //         }
    //     })
    // },

    registerUser: function (data, context) {
        var date = new Date();
        var firstName = data.firstName;
        firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1)
        console.log("data.query",data.query)

        if ((!data.username) || typeof data.username == undefined) {
            return { "success": false, "error": { "code": 404, "message": constantObj.messages.USERNAME_REQUIRED, key: 'USERNAME_REQUIRED' } };
        }

        if ((!data.password) || typeof data.password == undefined) {
            return { "success": false, "error": { "code": 404, "message": constantObj.messages.PASSWORD_REQUIRED, key: 'PASSWORD_REQUIRED' } };
        }

        code = commonServiceObj.getUniqueCode();
        data.code = code;
        data.Type = "U";
        data.roles = "U";
        data.fullName = data.firstName + " " + data.lastName;
        console.log("data", data);

        var query = {}
        query.username = data.username
        return Users.findOne(query).then(function (user) {
            if (user !== undefined) {
                if (user.username == data.username) {
                    return { "success": false, "error": { "code": 301, "message": constantObj.messages.EMAIL_EXIST, key: 'EMAIL_EXIST' } };
                }
            } else {
                data['date_registered'] = date;
                data['date_verified'] = date;
                data["status"] = "active";


                return API.Model(Users).create(data).then(function (user) {
                    context.id = user.username;
                    context.type = 'Email';
                    console.log("user", user)
                    return Tokens.generateToken({
                        user_id: user.id,
                        client_id: Tokens.generateTokenString()
                    });

                }).then(function (token) {
                    /*return emailGeneratedCode({
                        id: context.id,
                        type: context.type,
                        username: data.username,
                        password: data.password,
                        firstName: data.firstName,
                        verifyURL: sails.getBaseUrl() + "/user/verify/" + data.username + "?code=" + token.code
                    });*/
                    console.log("token", token)
                    return emailVerifyLink({
                        id: context.id,
                        type: context.type,
                        username: data.username,
                        password: data.password,
                        firstName: firstName,
                        verifyURL: sails.config.RENTING_BACK_WEB_URL + "/verify/" + data.code
                        // verifyURL: sails.getBaseUrl() + "/verify/" + data.username
                        // verifyURL: constantObj.serverUrl.HOST + "/verify/" + data.email 
                    });
                });
            }
        })
    },

    signin: function (data, context) {
        console.log("Data in service", data)
        let query = {};
        query.username1 = data.username;
        query.$or = [{ 'roles': data.roles }]
        return Users.findOne(query).then(function (user) {


            if (user == undefined) {
                return { "success": false, "error": { "code": 404, "message": constantObj.messages.WRONG_USERNAME, key: 'WRONG_USERNAME' } };
            }

            if (user != undefined && user.roles == 'U' && user.isVerified != 'Y' && user.status == 'deactive') {
                return { "success": false, "error": { "code": 404, "message": constantObj.messages.USERNAME_NOT_VERIFIED, key: 'USERNAME_NOT_VERIFIED' } };
            }

            if (user != undefined && user.status == 'deactive') {
                return { "success": false, "error": { "code": 404, "message": constantObj.messages.USERNAME_INACTIVE, key: 'USERNAME_INACTIVE' } };
            }

            if (user != undefined && user.status != "active" && user.isVerified != "Y") {
                return { "success": false, "error": { "code": 404, "message": constantObj.messages.USERNAME_INACTIVE, key: 'USERNAME_INACTIVE' } };
            }

            if (!bcrypt.compareSync(data.password, user.password)) {
                return { "success": false, "error": { "code": 404, "message": constantObj.messages.WRONG_PASSWORD, key: 'WRONG_PASSWORD' } };
            } else {
                let inputData = {};
                if (data.gcm_id) { inputData.gcm_id = data.gcm_id; }
                if (data.device_token) { inputData.device_token = data.device_token; }
                inputData.device_type = data.device_type;
                inputData.user = user.id;
                if (data.device_type == '') { inputData.device_type = "Web"; }

                return Tokens.generateToken({
                    client_id: user.id,
                    user_id: user.id
                }).then(function (token) {
                    user.access_token = token.access_token;
                    user.refresh_token = token.refresh_token;

                    inputData.access_token = token.access_token;

                    return Userslogin.create(inputData).then(function () {
                        var lastLoginUpdate = {}
                        lastLoginUpdate.lastLogin = new Date();
                        lastLoginUpdate.status = 'active';
                        // console.log("eeeeeeeee", lastLoginUpdate);
                        if (data.domain == 'mobile') {
                            lastLoginUpdate.deviceToken = data.device_token;
                            lastLoginUpdate.domain = data.domain;
                            lastLoginUpdate.device_type = data.device_type;
                        }

                        // console.log("sdsdsdsds",lastLoginUpdate);

                        return Users.update({ id: user.id }, lastLoginUpdate).then(function () {
                            return { success: true, code: 200, message: constantObj.messages.SUCCESSFULLY_LOGGEDIN, data: user };
                        }).fail(function (errr) {
                            return { "success": false, "error": { "code": 400, "message": errr } };
                        });
                    });
                });
            }
        });
    },
    signinUser: function (data, context) {

        let query = {};
        console.log("checking", data);
        query.username = data.username;
        // query.status = {$ne:"deactive"};
        //query.isVerified = "Y";
        query.$or = [{ 'roles': 'U' }, { 'roles': 'D' }, { 'roles': 'B' }, { 'roles': 'DR' }]


        //return Users.findOne({username:username, roles:'U'}).then(function (user) {
        return Users.findOne(query).then(function (user) {


            if (user == undefined) {
                return { "success": false, "error": { "code": 404, "message": constantObj.messages.WRONG_USERNAME, key: 'WRONG_USERNAME' } };
            }

            if (user != undefined && user.roles == 'U' && user.isVerified != 'Y' /*&& user.status == 'deactive'*/) {
                return { "success": false, "error": { "code": 404, "message": constantObj.messages.USERNAME_NOT_VERIFIED, key: 'USERNAME_NOT_VERIFIED' } };
            }

            if (user != undefined && user.status == 'deactive') {
                return { "success": false, "error": { "code": 404, "message": constantObj.messages.USERNAME_INACTIVE, key: 'USERNAME_INACTIVE' } };
            }

            if (user != undefined && user.status != "active" && user.isVerified != "Y") {
                return { "success": false, "error": { "code": 404, "message": constantObj.messages.USERNAME_INACTIVE, key: 'USERNAME_INACTIVE' } };
            }

            if (!bcrypt.compareSync(data.password, user.password)) {
                return { "success": false, "error": { "code": 404, "message": constantObj.messages.WRONG_PASSWORD, key: 'WRONG_PASSWORD' } };
            } else {
                let inputData = {};
                if (data.gcm_id) { inputData.gcm_id = data.gcm_id; }
                if (data.device_token) { inputData.device_token = data.device_token; }
                inputData.device_type = data.device_type;
                inputData.user = user.id;
                if (data.device_type == '') { inputData.device_type = "Web"; }

                return Tokens.generateToken({
                    client_id: user.id,
                    user_id: user.id
                }).then(function (token) {
                    user.access_token = token.access_token;
                    user.refresh_token = token.refresh_token;

                    inputData.access_token = token.access_token;

                    return Userslogin.create(inputData).then(function () {
                        var lastLoginUpdate = {}
                        lastLoginUpdate.lastLogin = new Date();
                        lastLoginUpdate.status = 'active';
                        // console.log("eeeeeeeee", lastLoginUpdate);
                        if (data.domain == 'mobile') {
                            lastLoginUpdate.deviceToken = data.device_token;
                            lastLoginUpdate.domain = data.domain;
                            lastLoginUpdate.device_type = data.device_type;
                        }

                        // console.log("sdsdsdsds",lastLoginUpdate);

                        return Users.update({ id: user.id }, lastLoginUpdate).then(function () {
                            return { success: true, code: 200, message: constantObj.messages.SUCCESSFULLY_LOGGEDIN, data: user };
                        }).fail(function (errr) {
                            return { "success": false, "error": { "code": 400, "message": errr } };
                        });
                    });
                });
            }
        });
    },

    adminSideRegistration: function (data, context) {

        var date = new Date();

        if ((!data.firstName) || typeof data.firstName == undefined) {
            return { "success": false, "error": { "code": 404, "message": constantObj.messages.FIRSTNAME_REQUIRED, key: 'FIRSTNAME_REQUIRED' } };
        }
        if ((!data.lastName) || typeof data.lastName == undefined) {
            return { "success": false, "error": { "code": 404, "message": constantObj.messages.LASTNAME_REQUIRED, key: 'LASTNAME_REQUIRED' } };
        }
        if ((!data.username) || typeof data.username == undefined) {
            return { "success": false, "error": { "code": 404, "message": constantObj.messages.USERNAME_REQUIRED, key: 'USERNAME_REQUIRED' } };
        }
        if ((!data.mobile) || typeof data.mobile == undefined) {
            return { "success": false, "error": { "code": 404, "message": constantObj.messages.MOBILE_REQUIRED, key: 'MOBILE_REQUIRED' } };
        }

        return Users.findOne({ username: data.username }).then(function (user) {

            if (user !== undefined) {
                return { "success": false, "error": { "code": 301, "message": constantObj.messages.USER_EXIST, key: 'USER_EXIST' } };
            } else {
                if (data.roles == 'SA' || data.roles == 'A') {
                    data['roles'] = data.roles;

                } else {
                    data['roles'] = 'U';
                }

                if (!data['password']) {
                    data['password'] = generatePassword();
                    //data['password'] = 123456789;
                }

                data['date_registered'] = date;
                data['date_verified'] = date;
                data['isVerified'] = "N";
                data['addedBy'] = context.identity.id;
                if (data.mobile) {
                    if (typeof data.mobile == 'string') {
                        var phExpression = /^\d+$/;
                        if (data.mobile.match(phExpression)) {
                            if (data.mobile.length > 10 || data.mobile.length < 10) {
                                return { "success": false, "error": { "code": 412, "message": constantObj.messages.PHONE_NUMBER, key: 'PHONE_NUMBER' } };
                            }

                            data['mobile'] = data.mobile;

                        } else {
                            return { "success": false, "error": { "code": 412, "message": constantObj.messages.PHONE_INVALID, key: 'PHONE_INVALID' } };
                        }
                    } else {
                        var mobile = data.mobile.toString();
                        if (mobile.length > 10 || mobile.length < 10) {
                            return { "success": false, "error": { "code": 412, "message": constantObj.messages.PHONE_NUMBER, key: 'PHONE_NUMBER' } };
                        } else {
                            data['mobile'] = data.mobile;
                        }
                    }
                }
                data["fullName"] = data.firstName + ' ' + data.lastName;
                data["status"] = "deactive";

                code = commonServiceObj.getUniqueCode();
                data.code = code;

                return API.Model(Users).create(data).then(function (user) {

                    context.id = user.username;
                    context.type = 'Email';
                    return Tokens.generateToken({
                        user_id: user.id,
                        client_id: Tokens.generateTokenString()
                    });

                }).then(function (token) {
                    return emailVerifyLink({
                        id: context.id,
                        type: context.type,
                        username: data.username,
                        password: data.password,
                        firstName: data.firstName,
                        verifyURL: sails.config.RENTING_FRONT_WEB_URL + "/verify/" + data.code

                        //  verifyURL: sails.config.RENTING_FRONT_WEB_URL + "/user/verification/" + data.code
                        // verifyURL: sails.config.SERVER_URL + "/user/verification/" + data.code
                    });
                    // return emailGeneratedCode({
                    //     id: context.id,
                    //     type: context.type,
                    //     username: data.username,
                    //     password: data.password,
                    //     firstName: data.firstName,
                    //     verifyURL: sails.getBaseUrl() + "/user/verify/" + data.username + "?code=" + token.code
                    // });
                });
            }
        })
    },
    socialSignin: function (data, context) {

        if (data.fbId && (data.providers == "facebook" || data.provider == "facebook")) {
            var query = {}
            //var query = {"fbId":data.fbId};
            query.fbId = data.fbId;

            return API.Model(Users).findOne(query).then(function (user) {
                if (user != undefined) {
                    //console.log("Already");
                    //return {success: true,code:200,message: "Third party login User Already Exist"} ;
                    return socialUserAccess(data, user);
                } else {
                    var query = {}
                    query.username = data.username;

                    return API.Model(Users).findOne(query).then(function (user) {
                        if (user != undefined) {
                            //return {success: true,code:200,message: "Third party login User Already Exist"} ;
                            return socialUserAccess(data, user);
                        } else {
                            var date = new Date();
                            code = commonServiceObj.getUniqueCode();
                            data.code = code;
                            data.Type = "U";
                            data.roles = "U";
                            data.fullName = data.name;
                            data.password = "1234567890";
                            data.isVerified = "Y"
                            data['date_registered'] = date;
                            data['date_verified'] = date;
                            data["status"] = "active";
                            // console.log("data", data);
                            return API.Model(Users).create(data).then(function (user) {
                                context.id = user.username;
                                context.type = 'Email';
                                console.log("user", user)
                                return Tokens.generateToken({
                                    user_id: user.id,
                                    client_id: Tokens.generateTokenString()
                                });
                            }).then(function (token) {
                                console.log("data xyzzz", token)
                                return socialUserAccess(data, user)
                            });
                        }
                    });
                }
            });
        } else if (data.gId && (data.providers == "google" || data.provider == "google")) {

            var query = {}
            //var query = {"fbId":data.fbId};
            query.gId = data.gId;

            return API.Model(Users).findOne(query).then(function (user) {
                if (user != undefined) {
                    //console.log("Already");
                    //return {success: true,code:200,message: "Third party login User Already Exist"} ;
                    return socialUserAccess(data, user);
                } else {
                    var query = {}
                    query.username = data.username;

                    return API.Model(Users).findOne(query).then(function (user) {
                        if (user != undefined) {
                            //return {success: true,code:200,message: "Third party login User Already Exist"} ;
                            return socialUserAccess(data, user);
                        } else {
                            var date = new Date();
                            code = commonServiceObj.getUniqueCode();
                            data.code = code;
                            data.Type = "U";
                            data.roles = "U";
                            data.fullName = data.name;
                            data.password = "1234567890";
                            data.isVerified = "Y"
                            data['date_registered'] = date;
                            data['date_verified'] = date;
                            data["status"] = "active";
                            // console.log("data", data);
                            return API.Model(Users).create(data).then(function (user) {
                                context.id = user.username;
                                context.type = 'Email';
                                console.log("user", user)
                                return Tokens.generateToken({
                                    user_id: user.id,
                                    client_id: Tokens.generateTokenString()
                                });
                            }).then(function (token) {
                                console.log("data xyzzz", token)
                                return socialUserAccess(data, user)
                            });
                        }
                    });
                }
            });
        }
    }




};

