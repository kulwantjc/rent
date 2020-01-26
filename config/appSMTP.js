/*var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var transport = nodemailer.createTransport(smtpTransport({
host: sails.config.appSMTP.host,
port: sails.config.appSMTP.port,
debug: sails.config.appSMTP.debug,
auth: {
        user: sails.config.appSMTP.auth.user,
        pass: sails.config.appSMTP.auth.pass
      }

    }));*/
module.exports.appSMTP = { //appSmtp use in EndUserService.js
    service: "Gmail",
    host: 'smtp.gmail.com',
    port: 587,
    debug: true,
    sendmail: true,
    requiresAuth: true,
    domains: ["gmail.com", "googlemail.com"],

    auth: {
      // user: 'contactinstaleaf@gmail.com',
      // pass: 'carl@123'
      user: 'contactshieft@gmail.com',
      pass: 'jcsoftware!234'
    }
}