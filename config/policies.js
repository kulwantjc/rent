/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your controllers.
 * You can apply one or more policies to a given controller, or protect
 * its actions individually.
 *
 * Any policy file (e.g. `api/policies/authenticated.js`) can be accessed
 * below by its filename, minus the extension, (e.g. "authenticated")
 *
 * For more information on how policies work, see:
 * http://sailsjs.org/#!/documentation/concepts/Policies
 *
 * For more information on configuring policies, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.policies.html
 */


module.exports.policies = {

  /***************************************************************************
  *                                                                          *
  * Default policy for all controllers and actions (`true` allows public     *
  * access)                                                                  *
  *                                                                          *
  ***************************************************************************/

  '*': 'OAuthValidateAccessToken',

  OAuthController: {
    '*': 'OAuthValidateAccessToken',
    token: 'OAuthPublicClient'
  },
  SettingController: {
    '*': true
  },
  UsersController: {
    '*': 'OAuthValidateAccessToken',
    'forgotPassword': true,
    'webForgotPassword': true,
    'signup': true,
    'signin': true,
    'socialSignin': true,

    'register': true,
     'verification/:code' : true,
    'verify/:code': true,
    'userForgotPassword': true,
    'changePassword/:id': true,
    'userProfile': true,
    'setpassword': true,
    'resetPassword': true,
    'signinUser': true,
    'contactus': true
  },
  ClientsController: {
    '*': 'OAuthValidateAccessToken',
    'register': true,
    'verify/:email': true
  },
  CommonController: {
    '*': 'OAuthValidateAccessToken',
    'countries': true,
    'Search': true,
    'uploadImages':true,
  },
  VehicleController: {
    '*': 'OAuthValidateAccessToken',
    'getAllVehicle': true,
    'getVehicle': true
  },
  CategoryController: {
    '*': 'OAuthValidateAccessToken',
    'categoryList': true
  },
  BlogsController: {
    '*': 'OAuthValidateAccessToken',
    'getAllBlog': true,
    'getSingleBlog': true

  },
  FaqController: {
    '*': 'OAuthValidateAccessToken',
    'getfaq': true,
    'getfaq/:id': true

  },
  RidesController: {
    '*': 'OAuthValidateAccessToken',
    'getRentals': true,
    'viewRental': true,

  },
  PagesController: {
    '*': true,
    'getRentals': true,

  },
  LanguagesController: {
    '*': true
  }
};