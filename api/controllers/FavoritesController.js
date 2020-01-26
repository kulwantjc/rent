/**
 * Favorites Controller
 *
 * @description :: Server-side logic for managing clients
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    addFavorite: function(req,res){
        API(FavoritesService.addFavorite,req,res);
    },
    Favorites: function(req,res){
        API(FavoritesService.Favorites,req,res);
    },
    Search: function(req,res){
        API(FavoritesService.Search,req,res);
    }
};