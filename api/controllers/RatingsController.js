/**
 * Favorites Controller
 *
 * @description :: Server-side logic for managing clients
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    rateVehicle: function(req,res){
        API(RatingsService.rateVehicle,req,res);
    },
    rateOwner: function(req,res){
        API(RatingsService.rateOwner,req,res);
    }
};