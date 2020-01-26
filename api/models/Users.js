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

        code: {
            type: 'integer',
            unique: true
        },
       
        firstName: {
            type: 'string',
            required: true
        },
        
        lastName: {
            type: 'string',
            required: true
        },

        fullName: {
            type: 'string',
            required: true
        },     

        username: {
            type: 'email',
            unique: true,
            required: 'Please enter valid email id.'
        },

        mobile: {
            type: 'string',
            maxLength: 10,
            required: false
        },
        date_of_birth: {
            type: 'date',
            required: false
        },

        place_of_birth: {
            type: 'string',
            required: false
        },
        
        zipcode: {
            type: 'string'
        },
        postal_address: {
            type: 'string'
        },
        image:{
            type:'string',
        },
        city:{
            type:'string',
        },
        town:{
            type:'string',
        },
        country:{
            model:'Country',
        },
        license_no: {
            type: 'string'
        },
        license_expiry: {
            type: 'date'
        },
        license_country: {
            model: 'Country'
        },
        
        about:{
            type:'string'
        },

        lat: {
            type: 'string',
            defaultsTo: "0",
        },

        lng: {
            type: 'string',
            defaultsTo: "0",
        },

        password: {
            type: 'string',
            required: true,
            columnName: 'encryptedPassword',
            minLength: 8
        },

        date_verified: {
            type : 'date'
        },
        isVerified: {
            type: 'string',
            enum: ['Y','N'],
            defaultsTo: 'N'
        },
        roles: {
            type: 'string',
            enum: ['SA', 'A','U'],
            defaultsTo: 'U'
            // required: true
        },
        domain: {
            type: 'string',
            enum: ['web', 'mobile']
        },

        roleId: {
            model: 'roles',
        },
        addedBy : {
            model:'users'
        },
        status: {
            type: 'string',
            enum: ['active', 'deactive', 'inactive'],
            defaultsTo:'deactive'
        },
        isDeleted : {
            type: 'Boolean',
            defaultsTo: false
        },
        lastLogin: {
            type: 'date'
        },
        date_registered: {
            type: 'date'
        },
        totalRating : {
            type:'integer'
        },
        averageRating : {
            type:'float'
        },
        paymentMethod:{
            type: 'array',
        },

        fbId: {
            type: 'string',
            maxLength: 100
        },
        gId: {
            type: 'string',
            maxLength: 100
        },
        clientId: {
            type: 'string',
            maxLength: 100
        },
        comparePassword: function(password) {
            return bcrypt.compareSync(password, this.password);
        },

        toJSON: function() {
            var obj = this.toObject();
            delete obj.password;
            return obj;
        }

    },

    beforeCreate: function(user, next) {
        if(user.firstName && user.lastName) {
            user.fullName = user.firstName + ' ' + user.lastName;
        }

        if (user.hasOwnProperty('password')) {
            user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
            next(false, user);

        } else {
            next(null, user);
        }
    },


    beforeUpdate: function(user, next) {
        if(user.firstName && user.lastName) {
            user.fullName = user.firstName + ' ' + user.lastName;
        }

        if (user.hasOwnProperty('password')) {
            user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
            next(false, user);
        } else {
            next(null, user);
        }
    },

    authenticate: function (username, password) {
        console.log("in auth    ")
        var query = {};
        query.username = username;
        query.$or = [{roles:["SA","A"]}];

        return Users.findOne(query).populate('roleId').then(function(user){ 
        //return API.Model(Users).findOne(query).then(function(user){
            return (user && user.date_verified && user.comparePassword(password))? user : null;
        });
    },

};