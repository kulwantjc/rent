/**
 * Vehicle.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
    autoCreatedAt: true,
    autoUpdatedAt: true,
    attributes: {
        type: {
            model: 'vehicletype'
        },
        brand_id:{
            model: 'brand'
        },
        model_id:{
            model: 'model'
        },
        category_id:{
            model: 'category'
            //type: 'string'
        },
        detail: {
            type: 'string'
        },
        country: {
            model: 'country'
        },
        registration_no: {
            type: 'string'
        },
        cylinder_id: {
            model: 'cylinder'
        },
        energy_id: {
            model: 'energy'
        },
        mileage_id: {
            model: 'mileage'
        },
        consumption_id: {
            model: 'consumption'
        },
        description: {
            type: 'string'
        },
        price: {
            type: 'string'
        },
        isdcode: {
            type: 'string'
        },
        mobile: {
            type: 'integer'
        },
        images: {
            type: 'array',
        },
        options: {
            type: 'array',
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
        },
        addedBy : {
            model:'users'
        },
        address: {
            type: 'string'
        },
        lat: {
            type: 'string'
        },

        lng: {
            type: 'string'
        },
        startDate: {
            type: 'date'
        },
        endDate: {
            type: 'date'
        },
        totalRating : {
            type:'integer'
        },
        averageRating : {
            type:'float'
        }
       
    }
};