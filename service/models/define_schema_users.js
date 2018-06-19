var mongoose    = require('mongoose');

vaforiteSchema  = require('./define_schema_favorite');
videoSchema  = require('./define_schema_video');


var usersSchema = new mongoose.Schema({

        userName:{
            type: String,
            index:1,
            required:true
        },
        password: {
            type: String,
            index:1,
            required:true      
        },
        name:{
            type: String,
            required:true  
        }, 
        age: {
            type: Number,
            required:true      
        },
        city:{
            type: String,
            required:true  
        }, 
        profilePic: String,
        subjects:   [{type:mongoose.Schema.Types.ObjectId,ref:"Subject"}],
        videos:   [{type:mongoose.Schema.Types.ObjectId,ref:"Video"}],
        // plaing on:
        skills:     [String],
        // genre: 
        favorites: [{type:mongoose.Schema.Types.ObjectId,ref:"Favorite"}]
    
    });

mongoose.model('User', usersSchema);

module.exports = mongoose.model('User');