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

      addedBy : {
          model:'Users'
      },
      favorites: {
        model: 'Vehicle',
      },
    }
  };
  
  