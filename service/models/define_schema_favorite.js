
var mongoose  = require('mongoose');
var schema = mongoose.Schema;   

var favorite = new mongoose.Schema({
      // Rock/Pop etc.
      type: String,
      userName: String,
      statistic: Number
    
    });

var faveSchema = mongoose.model('Favorite',favorite);
module.exports = faveSchema;