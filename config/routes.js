/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  //Authorisation Routes
  'post /register': 'UsersController.register',
  'get /user/verification/:code' :'UsersController.verification/:code',

  'get /verify/:code': 'UsersController.verify/:code',

  'post /signin': 'UsersController.signin',
  'post /signinUser': 'UsersController.signinUser',
  'post /forgotpassword': 'UsersController.forgotPassword',
  'post /oauth/token': 'OAuthController.token',
  'put /changepassword': 'UsersController.changePassword',
  'get /getuserdetail': 'UsersController.getUserDetail',
  'put /updateprofile': 'UsersController.updateProfile',

  'post /socialsignin': 'UsersController.socialSignin',

  //User Routes
  'get /user': 'UsersController.getAllUsers',
  'get /user/:id': 'UsersController.userProfileData',
  'put /user/:id': { model: 'users', blueprint: 'update' },
  'delete /user/:id': { model: 'users', blueprint: 'destroy' },
  'post /user': 'UsersController.index',

  'post /contactus': 'UsersController.contactus',

  // Setting
  'get /setting/:type': 'SettingController.setting',
  'post /setting/add': 'SettingController.saveSetting',
  'get /getlatlng/:address': 'SettingController.getLatLng',
  'get /setting': 'SettingController.setting',

  // Common
  'put /changestatus': 'CommonController.changeStatus',
  'post /upload': 'CommonController.uploadImages',
  'delete /delete': 'CommonController.delete',
  'get /countries': 'CommonController.getAllCountries',

  //Vehicle Types Routes
  'post /vehicletype': 'VehicleController.saveTypes',
  'put /vehicletype/:id': 'VehicleController.update',
  'get /allvehicletype': 'VehicleController.getAllVehicleType',
  'get /vehicletype/:id': 'VehicleController.getVehicleType',
  'get /listvehicletype': 'VehicleController.getListVehicleType',

  'post /vehicle': 'VehicleController.saveVehicle',
  'put /vehicle/:id': 'VehicleController.updateVehicle',
  'get /allvehicle': 'VehicleController.getAllVehicle',
  'get /vehicle/:id': 'VehicleController.getVehicle',
  'get /listvehicle': 'VehicleController.getListVehicle',

  'get /myvehicles': 'VehicleController.myVehicles',

  //Category Routes
  'post /category': 'CategoryController.save',
  'put /category': 'CategoryController.update',
  'get /allcategory': 'CategoryController.getAllCategory',
  'get /typecat': 'CategoryController.categories',
  'get /typecategory': 'CategoryController.getTypeCatgory',

  //Roles & Permission Routes
  'post /permission': { model: 'roles', blueprint: 'create' },
  'get /permission': 'RolesController.getAllRoles',
  'get /listroles': 'RolesController.getListRoles',
  'get /permission/:id': { model: 'roles', blueprint: 'find' },
  'put /permission/:id': { model: 'roles', blueprint: 'update' },
  'delete /permission/:id': 'RolesController.deleteSeletectedRole',

  //Power Routes
  'post /energy': 'CommonController.saveEnergy',
  'put /energy/:id': 'CommonController.updateEnergy',
  'get /allenergy': 'CommonController.getAllEnergy',
  'get /energy/:id': 'CommonController.getEnergy',
  'get /listenergy': 'CommonController.getListEnergy',

  //Cylinder Routes
  'post /cylinder': 'CommonController.saveCylinder',
  'put /cylinder/:id': 'CommonController.updateCylinder',
  'get /allcylinder': 'CommonController.getAllCylinder',
  'get /cylinder/:id': 'CommonController.getCylinder',
  'get /listcylinder': 'CommonController.getListCylinder',

  //Model Routes
  'post /model': 'CommonController.saveModel',
  'put /model/:id': 'CommonController.updateModel',
  'get /allmodel': 'CommonController.getAllModel',
  'get /model/:id': 'CommonController.getModel',
  'get /listmodel': 'CommonController.getListModel',
  'get /brandmodel': 'CommonController.getBrandModel',

  //Options Routes
  'post /options': 'CommonController.saveOptions',
  'put /options/:id': 'CommonController.updateOptions',
  'get /getalloptions': 'CommonController.getAllOptions',
  'get /options/:id': 'CommonController.getOptions',
  'get /listoptions': 'CommonController.getListOptions',

  //Mileage Routes
  'post /mileage': 'CommonController.saveMileage',
  'put /mileage/:id': 'CommonController.updateMileage',
  'get /getallmileage': 'CommonController.getAllMileage',
  'get /mileage/:id': 'CommonController.getMileage',
  'get /listmileage': 'CommonController.getListMileage',

  //Consumption Routes
  'post /consumption': 'CommonController.saveConsumption',
  'put /consumption/:id': 'CommonController.updateConsumption',
  'get /getallconsumption': 'CommonController.getAllConsumption',
  'get /consumption/:id': 'CommonController.getConsumption',
  'get /listconsumption': 'CommonController.getListConsumption',

  //Brand Routes
  'post /brand': 'BrandController.save',
  'put /brand/:id': 'BrandController.update',
  'get /getallbrand': 'BrandController.getAllBrand',
  'get /brand/:id': 'BrandController.getBrand',
  'get /listbrand': 'BrandController.getListBrand',
  'get /typebrand': 'BrandController.getTypeBrand',

  //Blogs Routes
  'post /blogs': 'BlogsController.save',
  'get /blogs': 'BlogsController.getAllBlog',
  'put /blogs/:id': 'BlogsController.edit',
  'post /addcomment': 'BlogsController.addComment',
  'get /blog/:id': 'BlogsController.getSingleBlog',

  'get /comment/:id': 'BlogsController.getComment',

  /*API for static pages start*/
  'get  /Pages/fixTitle/:slug_name': 'PagesController.getfixTitle',
  'post /Pages/savePages': 'PagesController.savePages',
  'get  /allstatic_pages': 'PagesController.getstatic_pages',
  'get  /Pages/:id': 'PagesController.getpages/:id',
  'put  /Pages/:slug': 'PagesController.updatepage/:slug',
  'get  /getStaticPageNamelist': 'PagesController.getStaticPageNamelist',
  'get  /getpage': 'PagesController.getPage',
  /*API for static pages end*/

  /*API for FAQ start*/
  'get  /faq/fixTitle/:slug_name': 'FaqController.getfixTitle',
  'post /savefaq': 'FaqController.saveFaq',
  'get  /allfaq': 'FaqController.getfaq',
  'get  /faq/:id': 'FaqController.getfaq/:id',
  'put  /faq/:slug': 'FaqController.updatefaq/:slug',
  'get  /getFaqNamelist': 'FaqController.getFaqNamelist',
  /*API for FAQ end*/

  //Languages Routes
  'get /alllang': 'LanguagesController.getAllLang',
  'post /lang': { model: 'languages', blueprint: 'create' },
  'get /lang': 'LanguagesController.getLanguage',

  // Stripe Routes
  'post /sendtoken': 'StripeController.createcustomer',
  'post /chargepayment': 'StripeController.chargePayment',
  'post /stripe': 'StripeController.createcustomer',
  //'post /v1/tokens': 'StripeController.createToken',
  'get /getallpayments': 'StripeController.getAllPayments',
  'get /viewpayment/:id': 'StripeController.viewPayment',
  'get /getfailedpayments': 'StripeController.getFailedPayments',
  'post /refund': 'StripeController.Refund',
  'get /getrefundpayments': 'StripeController.getRefundPayments',
  'get /mypayments': 'StripeController.myPayments',
  'get /viewitempayment/:id': 'StripeController.viewItemPayment',


  // Rental Routes
  'post /bookride': 'RidesController.bookRide',
  'put /ridestatus/:id': 'RidesController.rideStatus', // 'accept/ cancel ride'

  'get /getrentals': 'RidesController.getRentals', // get latest rentals
  'get /viewrental': 'RidesController.viewRental', // view detail of rental

  'get /myrentals': 'RidesController.myRentals', // get rides/rentals of user which has been completed
  'get /myrental/:id': 'RidesController.myRental', //get detail of my ride

  'get /ownerrating/:id': 'RidesController.getOwnerRating',
 
  // 'get /myrequests': 'RidesController.myRequests', //get all ride requests except completed
  // 'get /myrequest/:id': 'RidesController.myRequest',

  'put /cancelride': 'RidesController.cancelRide', 
  'put /updatebooking': 'RidesController.updateBooking', 
  'get /bookings': 'RidesController.bookings',
  'get /getcancelbookings': 'RidesController.getCancelBookings',  


  // Add to favourite

  'post /addfavorite': 'FavoritesController.addFavorite',
  'get /favorites': 'FavoritesController.Favorites',

  'post /search': 'FavoritesController.Search',

  // Rating Routes
  'post /ratevehicle': 'RatingsController.rateVehicle',
  'post /rateowner': 'RatingsController.rateOwner',
};
