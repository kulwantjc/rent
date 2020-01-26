/**
 * Pages.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  autoCreatedAt: true,
  autoUpdatedAt: true,
  attributes: {
    question: {
      type: 'string',
      required: true,
      unique: true
    },
    slug_name: {
      type: 'string',
      required: true
    },
    description: {
      type: 'string',
    },
    isDeleted: {
      type: 'Boolean',
      defaultsTo: false
    },
    deletedBy: {
      model: 'users'
    },
    status: {
      type: 'string',
      enum: ['active', 'deactive'],
      defaultsTo: 'active'
    },
  }
};

