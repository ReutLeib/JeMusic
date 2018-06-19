var mongoose  = require('mongoose');
var schema = mongoose.Schema;   

var video = new mongoose.Schema({

      vid: String,
      likes: Number
    
    });

var vidSchema = mongoose.model('Videos',video);
module.exports = vidSchema;