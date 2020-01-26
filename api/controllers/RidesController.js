/**
 * RidesController
 *
 * @description :: Server-side logic for managing clients
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    bookRide: function(req,res){
        API(RidesService.bookRide,req,res);
    },
    rideStatus: function(req,res){
        API(RidesService.rideStatus,req,res);
    },



    getRentals: function(req,res){
        API(RidesService.getRentals,req,res);
    },
    viewRental: function(req,res){
        API(RidesService.viewRental,req,res);
    },



    myRentals: function(req,res){
        API(RidesService.myRentals,req,res);
    },

    myRental: function(req,res){
        API(RidesService.myRental,req,res);
    },
    // myRequests: function(req,res){
    //     API(RidesService.myRequests,req,res);
    // },
    // myRequest: function(req,res){
    //     API(RidesService.myRequest,req,res);
    // },
    cancelRide: function(req,res){
        API(RidesService.cancelRide,req,res);
    },
    updateBooking: function(req,res){
        API(RidesService.updateBooking,req,res);
    },

    getOwnerRating: function(req,res){
        API(RidesService.getOwnerRating,req,res);
    },

    bookings: function(req,res){
        API(RidesService.bookings,req,res);
    },
    getCancelBookings: function(req,res){
        API(RidesService.getCancelBookings,req,res);
    },
};