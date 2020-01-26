/**
 * Development environment settings
 *
 * This file can include shared settings for a development team,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

module.exports = {

  /***************************************************************************
   * Set the default database connection for models in the development       *
   * environment (see config/connections.js and config/models.js )           *
   ***************************************************************************/

  // models: {
  //   connection: 'someMongodbServer'
  // }

  hookTimeout: 4000000,
  
  // connections : {
  //   mongoDev: {
  //     adapter: 'sails-mongo',
  //     host: '52.14.65.48',
  //     port: 27017,
  //     user: 'user', //optional
  //     password: 'user123', //optional
  //     database: 'db_rentscooter'
  //   }
  // },

  connections : {
    mongoDev: {
      adapter: 'sails-mongo',
      host: 'localhost',
      port: 27017,
      // user: 'user', //optional
      // password: 'user123', //optional
      database: 'db_rentscooter'
    }
  },
  models: {
    connection: 'mongoDev'
  },

  // RENTING_FRONT_WEB_URL: "http://52.14.65.48:4300",
  RENTING_FRONT_WEB_URL: "http://192.168.0.92:1337",
  RENTING_BACK_WEB_URL: "http://52.14.65.48:1337",
};