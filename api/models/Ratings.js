/**
 * Ratings.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
    autoCreatedAt: true,
    autoUpdatedAt: true,
    attributes: {

        addedBy: {
            model: 'Users'
        },
        ownerId: {
            model: 'Users'
        },
        vehicle_id: {
            model: 'Vehicle'
        },
        rating: {
            type: 'integer'
        },
        review: {},
        isDeleted: {
            type: 'Boolean',
            defaultsTo: false
        },
        deletedBy: {
            model: 'users'
        }
    }
};

