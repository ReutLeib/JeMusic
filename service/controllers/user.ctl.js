const mongoose          = require('mongoose');
var   Subject           = require('../models/define_schema_subject');
      User              = require('../models/define_schema_users');
      projectStrings    = require('../config').projectStrings,
      Video             = require('../models/define_schema_video');

/////////////////// FOR ROUTE: insertUser ////////////////////////////
exports.insertUser = (req,res)=>{
  var profilePict;
  console.log("Enter route(POST): /insertUsers");

// if there is no profile picture to user:
  if(req.body.profilePic == null) profilePict = projectStrings.DEFAULT_PROFILE_PIC;
  else profilePict = req.body.profilePic;

 IsUniqueUserName_UserSchema(req.body.userName).then((result,error) => {
    if(result){
      // if result TRUE:
          // Subject.create({date : req.body.date, message: req.body.message, fromUser:req.body.fromUser},(err, msg) => {
        creatUser_UserSchema(req.body.userName,req.body.password, req.body.name, req.body.age,
         req.body.city, profilePict).then((result,error) => {
            if (error) return res.status(500).send(projectStrings.ERROR_REGISTRATION);
               res.status(200).send(result);
        });
      
      console.log(`RESULT: ${result}`);
    }
    else{
      res.status(200).send(projectStrings.ERROR_USER_EXIST);
      console.log(`RESULT: ${result}`);

    }
  }, error =>{
    console.log(error);
 });
};

var IsUniqueUserName_UserSchema = (value) => {
  
    return new Promise((resolve, reject) =>{
      var flag;
      console.log(value);
      User.find({userName:value}, (err,user) => {
        if(err){
          reject(err);
        }
        if(user == ""){
          // not found
          console.log("user is NOT exist");
          flag = true;
        }
        else {
          // found
          console.log(`user exist named: ${value}`);
          flag = false;
          }
          console.log("///////////////////////");
          console.log(`USER: ${user}`);
          console.log("///////////////////////");
          resolve(flag);
      });
  
    }); 
  
  };

  var creatUser_UserSchema = (_userName, _password, _name, _age,_city, _profilePic) => {
  
    return new Promise((resolve, reject) =>{
      console.log(`_userName, _password, 
      _name, _age,_city, _profilePic: ${_userName, _password, 
        _name, _age,_city, _profilePic}`);
  
        User.create({userName : _userName, password: _password, 
          name:_name, age:_age,
          city:_city, profilePic:_profilePic},(err, msg) => {
          if (err) {
            console.log(projectStrings.ERROR_USER_NOT_EXIST);
            resolve({});
          }
          else{
            resolve(msg);
          }
      });
  
    }); 
  
  };   

////////////////////////////////////////////////////////////////////////////////////

/////////////////// FOR ROUTE: getAllVideosByUserName ////////////////////////////
 exports.getAllVideosByUserName = (req,res) =>{

  console.log("Enter route(POST): /getAllVideosByUserName");
  
   getAllVideosByUserName_UserSchema(req.params.userName).then((result,error) => {
      if(result){
        // if result TRUE:  
        console.log(`RESULT: ${result}`);
        res.status(200).send(result);      
      }
      else{
        res.status(500).send(projectStrings.ERROR_PICTURE_NOT_EXIST);
      }
    }, error =>{
        res.status(500).send(error);
      console.log(error);
   });
 }


var getAllVideosByUserName_UserSchema = (_userName) => {
  
  return new Promise((resolve, reject) =>{

    console.log(`_userName: ${_userName}`);

    User.findOne({userName:_userName}, (err, user) => {
        if (err) {
          console.log(projectStrings.ERROR_PICTURE_NOT_EXIST);
          resolve({});
        }
        Video.find({"_id":{$in:user.videos}}, (err,msg) => {
           resolve(msg);
        });
    });

  }); 

};  


////////////////////////////////////////////////////////////////////////////////////

/////////////////// FOR ROUTE: getUserByUserName ////////////////////////////
 
 exports.getUserByUserName = (req,res) =>{

      console.log("Enter route(POST): /getUserByUserName");
    
    getUserByUserName_UserSchema(req.params.userName).then((result,error) => {
        if(result != null){
          // if result TRUE:  
          console.log(`RESULT: ${result}`);
          res.status(200).send(result);      
        }
        else{
          res.status(500).send(projectStrings.ERROR_USER_NOT_EXIST);
        }
      }, error =>{
          res.status(500).send(error);
        console.log(error);
     });
  }

var getUserByUserName_UserSchema = (_userName) => {

  return new Promise((resolve, reject)=> {
    console.log(`_userName: ${_userName}`);

    User.findOne({userName:_userName}, (err, user) => {
        if (err) {
          console.log(projectStrings.ERROR_USER_NOT_EXIST);
          resolve({});
        }
        else{
          resolve(user);
        }
    });

  }); 

};  
////////////////////////////////////////////////////////////////////////////////////

/////////////////// FOR ROUTE: deleteUserByUserName ////////////////////////////

exports.deleteUserByUserName = (req,res) => {

    console.log("Enter route(POST): /deleteUserByUserName");
    
    deleteUserByUserName_UserSchema(req.body.userName).then((result,error) => {
        if(result){
          // if result TRUE:  
          console.log(`RESULT: ${result}`);
          console.log(`The user ${req.body.userName} have been deleted.`)
          res.status(200).send(result);      
        }
        else{
          // if result FALSE: 
          console.log(`RESULT: ${result}`);
          res.status(500).send(projectStrings.ERROR_USER_NOT_EXIST);
        }
      }, error =>{
          res.status(500).send(error);
        console.log(error);
     });
}
 
   var deleteUserByUserName_UserSchema = (_userName) => {
  
    return new Promise((resolve, reject)=> {

      console.log(`_userName: ${_userName}`);
  
      User.findOne({userName:_userName}, (err, usr) => {
          if (err) {
            console.log(projectStrings.ERROR_USER_NOT_EXIST);
            resolve(false);
          }
          else if(usr){
  
            //foreach loop that go on all the user subject's and remove him.
            usr.subjects.forEach((element) =>{
              deleteUserFromSubjectByUserName_UserSchema(_userName, element).then((result,error) => {
                if(result){}
                else{}
            });
          });
              console.log(`${usr}`);
              //deleteing the user
              var myquery = { userName: _userName };
              User.deleteOne(myquery, (err, obj)=> {
                if (err) {         
                  console.log(err);
                  resolve(false);
                }
                else{
                  console.log(obj);
                  resolve(true);
                }
              });
            }
            else{
              resolve(false);
            }

          });
      });
  }; 

  var deleteUserFromSubjectByUserName_UserSchema = (_userName,id_) => {

    return new Promise((resolve, reject)=> {
      console.log(`_userName,id_: ${_userName,id_}`);
  
      Subject.findByIdAndUpdate(id_,
        {$pull: {participents: _userName}},
        {safe: true, upsert: true},
        (err, doc) =>{
            if(err){
            console.log(err);
            resolve({});
            }else{
              console.log(`The user ${_userName} is deleted from ${doc.name} Subject.`);
              resolve(doc);
            }
        }
      );
  
    });
  };


////////////////////////////////////////////////////////////////////////////////////

/////////////////// FOR ROUTE: UpdateNameByUserName ////////////////////////////

exports.UpdateNameByUserName = (req,res) => {
  console.log("Enter route(POST): /UpdateNameByUserName");
  
  UpdateNameByUserName_UserSchema(req.body.userName, req.body.name).then((result,error) => {
      if(result){
        // if result TRUE:  
        console.log(`RESULT: ${result}`);
        res.status(200).send(result);      
      }
      else{
        // if result FALSE: 
        console.log(`RESULT: ${result}`);
        res.status(500).send(projectStrings.ERROR_USER_NOT_EXIST);
      }
    }, error =>{
        res.status(500).send(error);
      console.log(error);
   });

}


var UpdateNameByUserName_UserSchema = (_userName,_name) => {

    return new Promise((resolve, reject) =>{
      console.log(`_userName,_name: ${_userName,_name}`);
      var cond = {userName:_userName},
          update = {$set:{name:_name}},
          opts = {multi: true};
  
       User.update(cond,update,opts, (err) => {
        if(err){
          console.log(projectStrings.ERROR_USER_NOT_EXIST);
          resolve(false);
        }
        else{
        // console.log(`Update doc: ${User}`);
          resolve(true);
        }
      });
  
    }); 
  
  };
////////////////////////////////////////////////////////////////////////////////////

/////////////////// FOR ROUTE: UpdateAgeByUserName ////////////////////////////

exports.UpdateAgeByUserName = (req,res) => {

    console.log("Enter route(POST): /UpdateAgeByUserName");
    
    UpdateAgeByUserName_UserSchema(req.body.userName, req.body.age).then((result,error) => {
        if(result){
          // if result TRUE:  
          console.log(`RESULT: ${result}`);
          res.status(200).send(result);      
        }
        else{
        // if result FALSE: 
        console.log(`RESULT: ${result}`);
        res.status(500).send(projectStrings.ERROR_USER_NOT_EXIST);
        }
      }, error =>{
          res.status(500).send(error);
        console.log(error);
     });
  
}

var UpdateAgeByUserName_UserSchema = (_userName,_age) => {

  return new Promise((resolve, reject) =>{
    console.log(`_userName,_age: ${_userName,_age}`);
    var cond = {userName:_userName},
        update = {$set:{age:_age}},
        opts = {multi: true};

     User.update(cond,update,opts, (err) => {
      if(err){
        console.log(projectStrings.ERROR_USER_NOT_EXIST);
        resolve(false);
      }
      else{
        resolve(true);
      }
    });

  }); 

};
////////////////////////////////////////////////////////////////////////////////////

/////////////////// FOR ROUTE: UpdateCityByUserName ////////////////////////////

exports.UpdateCityByUserName = (req,res) => {
  // value : userName, city
            

  console.log("Enter route(POST): /UpdateCityByUserName");
  
  UpdateCityByUserName_UserSchema(req.body.userName, req.body.city).then((result,error) => {
      if(!result){
            
        // if result FALSE: 
        console.log(`RESULT: ${result}`);
        res.status(500).send(projectStrings.ERROR_USER_NOT_EXIST);  
      }
       else{
        // if result TRUE:  
        console.log(`RESULT: ${result}`);
        res.status(200).send(result);
        }
    }, error =>{
        res.status(500).send(error);
      console.log(error);
   });
}

 var UpdateCityByUserName_UserSchema = (_userName,_city) => {

  return new Promise((resolve, reject)=> {
    console.log(`_userName,_age: ${_userName,_city}`);
    var cond = {userName:_userName},
        update = {$set:{city:_city}},
        opts = {multi: true};

     User.update(cond,update,opts, (err) => {
      if(err){
        console.log(projectStrings.ERROR_USER_NOT_EXIST);
        resolve(false);
      }
      else{
        resolve(true);
      }
    });
  }); 
};


//////////////////////////////////////////////////////////////////////////////////
