/**
 * Rentals.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
    autoCreatedAt: true,
    autoUpdatedAt: true,
    attributes: {

        bookedBy: {
            model: 'Users'
        },
        vehicle_id: {
            model: 'Vehicle'
        },
        message: {
            type: 'string',
        },
        isApproved: {
            type: 'string',
            defaultsTo: 'false'
        },
        isRejected: {
            type: 'string',
            defaultsTo: 'false'
        },
        date_booking: {
            type: 'datetime'
        },
        date_return: {
            type: 'datetime'
        },
        isCancelled: {
            type: 'string',
            defaultsTo: 'false'
        },
        isCompleted: {
            type: 'string',
            defaultsTo: 'false'
        },
        payment_status: {
            type: 'string',
            defaultsTo: 'false'
        },
        transaction_id: {
            type: 'string',
        },
        price: {
            type: 'string'
        },
        detail: {
            type: 'Object'
        },
        refund_detail: {
            type: 'Object'
        },
    }
};

