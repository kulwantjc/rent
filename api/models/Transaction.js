/**
 * Transaction.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
    autoCreatedAt: true,
    autoUpdatedAt: true,
    attributes: {
        addedBy: {
            model: 'users'
        },
        order_details: {
            type: 'array'
        },
        updatedBy: {
            model: 'users'
        },
        deletedBy: {
            model: 'users'
        },
        isDeleted: {
            type: 'Boolean',
            defaultsTo: false
        },
        detail: {
            type: 'Object'
        },
        transaction_id: {
            type: 'string'
        },
        price: {
            type: 'string'
        },
        rentalId: {
            model: 'Rentals'
        },
        payment_status: {
            type: 'string',
            defaultsTo: false
        },
        refund_detail: {
            type: 'Object'
        },
    }

};