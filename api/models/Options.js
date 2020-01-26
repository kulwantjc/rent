/**
 * Users.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var promisify = require('bluebird').promisify;
var bcrypt    = require('bcrypt-nodejs');

module.exports = {
    autoCreatedAt: true,
    autoUpdatedAt: true,
    attributes: {

  		name: {
            type: 'string'
        },
        image:{
            type:'string',
        },
        status: {
            type: 'string',
            enum: ['active', 'deactive'],
            defaultsTo:'active'
        },
        isDeleted: {
            type: 'Boolean',
            defaultsTo: false
        },
        deletedBy : {
            model:'users'
        }
    },

};