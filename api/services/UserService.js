/**
  * #DESC:  In this class/files EndUser related functions
  * #Author: JC software
  */
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var bcrypt = require('bcrypt-nodejs');
var validator = require("email-validator");
var constantObj = sails.config.constants;
var commonServiceObj = require('./commonService');
var transport = nodemailer.createTransport(smtpTransport({
    host: sails.config.appSMTP.host,
    port: sails.config.appSMTP.port,
    debug: sails.config.appSMTP.debug,
    auth: {
        user: sails.config.appSMTP.auth.user, //access using /congig/appSMTP.js
        pass: sails.config.appSMTP.auth.pass
    }
}));
emailGeneratedPassword = function (options) { //email generated code 
    // var url = options.verifyURL,
    email = options.email,
        password = options.password;
    // console.log('pwwd', password)
    message = 'Hello ';
    message += options.firstName;
    message += ',';
    message += '<br/>';
    message += 'Your new password has been created successfully';
    message += '<br/><br/>';
    message += 'Email Id : ' + email;
    message += '<br/>';
    message += 'Password : ' + password;
    message += '<br/><br/>';
    message += 'Regards';
    message += '<br/><br/>';
    message += 'Support Team';

    transport.sendMail({
        // from: sails.config.appSMTP.auth.user,
        from: 'Renting System <' + sails.config.appSMTP.auth.user + '>',
        to: email,
        subject: 'Password Reset',
        html: message
    }, function (err, info) {
        console.log('err', err, info)
    });
    return {
        success: true,
        code: 200,
        data: {
            "message": "Password has been sent to Email"
        }
    }
};



emailContactUs = function (options) {
    // var url = options.verifyURL,
    Name = options.firstName + " " + options.lastName,
        email = options.email,
        user_message = options.message;
    hello = 'Hello Admin,'
    message = hello;
    message += '<br/>';
    message += 'You have a new query from :' + Name;
    message += '<br/><br/>';
    message += 'Email Id : ' + email;
    message += '<br/>';
    message += 'Message : ' + user_message;
    message += '<br/><br/>';
    message += 'Regards';
    message += '<br/><br/>';
    message += 'Support Team';

    transport.sendMail({
        // from: sails.config.appSMTP.auth.user,
        from: 'Renting System <' + sails.config.appSMTP.auth.user + '>',
        to: 'bikerent81@gmail.com',
        subject: 'New Query',
        html: message
    }, function (err, info) {
        console.log('err', err, info)
    });
    return {
        success: true,
        code: 200,
        data: {
            "message": "Mail has been sent to admin"
        }
    }
};




var emailVerifyLink = function (options, cb) {

    var url = options.verifyURL,
        email = options.email,

        message = 'Hello! ';
    message += options.username;
    message += '<br/><br/>';
    message += 'We heard that you lost your password. Please click on link to reset your password.';
    message += '<br/><br/>';
    message += '<a href="' + options.verifyURL + '" target="_blankh" >Click here to set new password</a>';
    message += '<br/><br/>';
    message += 'Regards';
    message += '<br/><br/>';
    message += 'Support Team';

    let msg = '';
    transport.sendMail({
        from: sails.config.appSMTP.auth.user,
        to: email,
        subject: 'Password Reset',
        html: message

    }, function (err, info) {
        if (err) {
            //msg = "There is some error to send mail to your email id.";
            return cb(err);
        } else {

            return cb(null, info)
            //msg = "Link for reset passwork has been sent to your email id.";
        }
    });
    return cb();
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
generatePassword1 = function () { // action are perform to generate random password for user 
    var length = 8,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
};

module.exports = {
    emailGeneratedPassword: emailGeneratedPassword, //emailgeneratecode()
    generatePassword: generatePassword,   //generatepassword()

    forgotPassword: function (data, context) {
        // console.log('email', data.email)
        var em = data.username;
        return Users.findOne({ username: data.username })
            .then(function (data) {
                if (data === undefined) {
                    return {
                        success: false,
                        error: {
                            "code": 404,
                            "message": "No such user exist"
                        }
                    }
                }
                else {
                    var password = generatePassword()
                    var encryptedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
                    return Users.update({ username: em }, { encryptedPassword: encryptedPassword })
                        .then(function (result) {
                            // console.log('result',result[0].username);
                            return emailGeneratedPassword({
                                email: result[0].username,
                                password: password,
                                firstName: result[0].firstName,
                                // verifyURL: sails.config.security.server.url + "/users/verify/" + data[0].email + "?code=" + data[0].password,
                            })
                        })
                }

            })
    },

    changePassword: function (data, context) {

        let newPassword = data.newPassword;
        let confirmPassword = data.confirmPassword;
        let currentPassword = data.currentPassword;

        let query = {};
        query.id = context.identity.id;


        return Users.findOne(query).then(function (user) {

            if (!bcrypt.compareSync(currentPassword, user.password)) {
                return { "success": false, "error": { "code": 404, "message": constantObj.messages.CURRENT_PASSWORD, key: 'CURRENT_PASSWORD' } };
            } else {
                if (newPassword != confirmPassword) {
                    return { "success": false, "error": { "code": 404, "message": "new password and confirmPassword does not match", key: 'WRONG_PASSWORD' } };
                } else {
                    var encryptedPassword = bcrypt.hashSync(newPassword, bcrypt.genSaltSync(10));
                    return Users.update({ id: context.identity.id }, { encryptedPassword: encryptedPassword }).then(function (user) {
                        return { "success": true, "code": 200, message: constantObj.messages.PASSWORD_CHANGED, Key: "PASSWORD_CHANGED" };
                    });
                }
            }
        });
    },

    userInfo: function (data, context) {

        let query = {};
        query.id = context.identity.id;

        return Users.findOne(query).then(function (user) {
            if (user) {
                return {
                    success: true,
                    code: 200,
                    data: {
                        user: user
                    },
                };
            }
        });
    },
    
    updateUserProfile: function (data, context) {
        console.log("data", data);

        var query = {}
        query.id = context.identity.id;
        return Users.update(query, data).then(function (updatedUser) {
            if (updatedUser) {
                return {
                    success: true,
                    code: 200,
                    data: {
                        user: updatedUser,
                        message: constantObj.user.USER_UPDATED,
                    },
                };
            } else {
                return res.status(400).jsonx({
                    success: false,
                    error: constantObj.user.USER_UPDATION_ISSUE
                });
            }
        })
    },


    contactUs: function (data, context) {
        let firstName = data.firstName;
        let lastName = data.lastName;
        let email = data.email;
        let message = data.message;
        // let context = context;
        if (firstName == '' || lastName == '' || email == '' || message == '') {
            return res.jsonx({
                success: false,
                error: {
                    code: 404,
                    message: 'ALL_FIELDS_REQUIRED'
                },
            });
        }
        return emailContactUs({
            firstName: firstName,
            lastName: lastName,
            email: email,
            message: message
        })
    }
}; 