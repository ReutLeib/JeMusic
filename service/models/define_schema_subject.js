var mongoose  = require('mongoose'),
    schema    = mongoose.Schema;   

var subjectsSchema = new mongoose.Schema({

      name: {
        type: String,
        required:true  
      },
      date: { 
        type: String,
        required:true  
      },
      hours: {
        type: String,
        required:true  
      },
      type: {
        type: String,
        required:true 
      }, 
      location: {
        type: String,
        required:true
      },
      about: String, 
      price: Number, 
      background:     String,
      //Missing Players
      requiredSkills: String,
      //Players
      participents:   [String]

    });

var SubSchema = mongoose.model('Subject',subjectsSchema);
module.exports = SubSchema;