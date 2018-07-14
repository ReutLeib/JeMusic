const mongoose          = require('mongoose');
var   Subject           = require('../models/define_schema_subject');
      User              = require('../models/define_schema_users');
      projectStrings    = require('../config').projectStrings,
      smartSearchCtl    = require('./smartSearch.ctl.js'),
      sleep             = require('system-sleep'),
      Favorite          = require('../models/define_schema_favorite');
 
/////////////////////////// SHARING FUNCTIONS ////////////////////////////////////

var followSubjectBySubjectID_UserSchema = (_userName,idSubject) => {

  return new Promise(function(resolve, reject) {
    console.log("Function: /followSubjectBySubjectID_UserSchema"); 


    var flag = false;
    var id_ = idSubject.toString();
    User.findOne({userName:_userName}, (err, usr) => {
      if (err) {
        console.log(projectStrings.ERROR_USER_NOT_EXIST);
        resolve(false);
      }
      else if(usr){
        //foreach loop that go on all the user subject's and remove him.
        usr.subjects.forEach(function(element) {
          if(element==id_) {
            console.log("flag=true");
            flag=true;
          }
        });
        if(flag==false){
     // if subject not exist push it:
          var cond = {userName:_userName},
          update = {$push:{subjects:id_}},
          opts = {multi: true};

           User.update(cond,update,opts, (err) => {
            if(err){
              console.log(projectStrings.ERROR_USER_NOT_EXIST);
              resolve({});
            }
            else{
              resolve(true);
            }
          });
            resolve(true);

          }
          resolve(true);

        }
        else{
          resolve(false);
        }
      });

  }); 

};

var IsUniqueName_SubjectSchema = (value) => {
  
  return new Promise((resolve, reject)=> {
    console.log("Function: /IsUniqueName_SubjectSchema"); 

    var flag;
    console.log(value);
    Subject.find({name:value}, (err,subject) => {
      if(err){
        reject(err);
      }
      if(subject == ""){
        // not found
        console.log("subject is NOT exist");
        flag = true;
      }
      else {
        // found
        console.log(`subject exist named: ${value}`);
        flag = false;
        }
        resolve(flag);
    });

  }); 

}; 

var getSubjectByNameReturnID_SubjectSchema = (_name) => {
  
  return new Promise((resolve, reject)=> {
    console.log("Function: /getSubjectByNameReturnID_SubjectSchema"); 

    console.log(`_name: ${_name}`);

    Subject.findOne({name:_name}, (err, subject) => {
        if (err) {
          console.log(projectStrings.ERROR_SUBJECT_NOT_EXIST);
          resolve(false);          

        }
        else if (subject){
        resolve(subject._id);          
        }
        else{
          resolve(false);          
        }
    });

  }); 

}; 

var getSubjectByNameReturnSubject_SubjectSchema = (_name) => {
  
  return new Promise((resolve, reject)=> {
    console.log("Function: /getSubjectByNameReturnSubject_SubjectSchema"); 

    console.log(`_name: ${_name}`);

    Subject.findOne({name:_name}, (err, subject) => {
        if (err) {
          console.log(projectStrings.ERROR_SUBJECT_NOT_EXIST);
          resolve(false);
        }
        else if(subject){
          console.log("-------------------------------------------------------");
          console.log(subject);
          console.log("-------------------------------------------------------");
        resolve(subject);          
        }
        else{
          resolve(false);
        }
    });

  }); 

}; 


////////////////////////////////////////////////////////////////////////////////////

/////////////////// FOR ROUTE: getAllSubjectsByUserName ////////////////////////////
exports.getAllSubjectsByUserName = (req,res)=>{
    console.log("Enter route(GET): /getAllSubjectsByUserName"); 

    getAllSubjectsByUserName_UserSchema(req.params.userName).then((result,error) => {
        if(result){
            // if result TRUE:  
            console.log(`RESULT: ${result}`);
            res.status(200).send(result);      
        }
        else{
            res.status(500).send(projectStrings.ERROR_NO_SUBJECTS);
        }
        }, error =>{
            res.status(500).send(error);
        console.log(error);
    });
}

var getAllSubjectsByUserName_UserSchema = (_userName) => {
  
    return new Promise((resolve, reject) =>{
    console.log("Function: /getAllSubjectsByUserName_UserSchema"); 

      console.log(`_userName: ${_userName}`);
  
      User.findOne({userName:_userName}, (err, user) => {
          if (err) {
            console.log(projectStrings.ERROR_SUBJECT_NOT_EXIST);
            resolve({});
          }
          Subject.find({"_id":{$in:user.subjects}}, (err,msg) => {
             resolve(msg);
          });
      });
  
    }); 
  
  }; 

////////////////////////////////////////////////////////////////////////////////////

/////////////////// FOR ROUTE: getAllSubjects ////////////////////////////

exports.getAllSubjects = (req,res) => {

    console.log("Enter route(GET): /getAllSubjects");
    
    getAllSubjects_SubjectSchema().then((result,error) => {
        if(result){
          // if result TRUE:  
          console.log(`RESULT: ${result}`);
          res.status(200).send(result);      
        }
        else{
          res.status(500).send(projectStrings.ERROR_NO_SUBJECTS);
        }
      }, error =>{
          res.status(500).send(error);
        console.log(error);
     });
}   

exports.getAllSubjectsIfNoFavorite = () => {

    console.log("Enter route(POST): /getAllSubjectsIfNoFavorite");
    
  return new Promise((resolve, reject)=> {
  
    Subject.find({}, (err, subjects) => {
        if (err) {
          console.log(projectStrings.ERROR_NO_SUBJECTS);
          resolve({});
        }
        else{
           resolve(subjects);
        }
    });

  }); 
}  


var getAllSubjects_SubjectSchema = () => {
    console.log("Function: /getAllSubjects_SubjectSchema"); 

  return new Promise((resolve, reject)=> {
          console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA fu heroku");
  
    Subject.find({}, (err, subjects) => {
        if (err) {
          console.log(projectStrings.ERROR_NO_SUBJECTS);
          resolve({});
        }
        else{
          console.log("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB fu heroku");
           resolve(subjects);
        }
    });

  }); 

}; 

////////////////////////////////////////////////////////////////////////////////////

/////////////////// FOR ROUTE: getSubjectByName ////////////////////////////

exports.getSubjectByName = (req,res) => {

  console.log("Enter route(GET): /getSubjectByName");
  
  getSubjectByName_SubjectSchema(req.params.name).then((result,error) => {
      if(result){
        // if result TRUE:  
        console.log(`RESULT: ${result}`);
        res.status(200).send(result);      
      }
      else{
        res.status(500).send(projectStrings.ERROR_SUBJECT_NOT_EXIST);

      }
    }, error =>{
        res.status(500).send(error);
      console.log(error);
   });
}

var getSubjectByName_SubjectSchema = (_name) => {
  
  return new Promise((resolve, reject)=> {
    console.log(`_name: ${_name}`);

    Subject.findOne({name:_name}, (err, subject) => {
        if (err) {
          console.log(projectStrings.ERROR_SUBJECT_NOT_EXIST);
          resolve({});
        }
        else{
          resolve(subject);
        }
    });

  }); 

}; 

////////////////////////////////////////////////////////////////////////////////////

/////////////////// FOR ROUTE: getSubjectByType_SubjectSchema ////////////////////////////
exports.getSubjectByType_SubjectSchema = (_type) => {
  console.log("Enter route(POST): /getSubjectByType_SubjectSchema");

  return new Promise((resolve, reject)=> {
    console.log(`_type: ${_type}`);

    Subject.find({type:_type}, (err, subject) => {
        if (err) {
          console.log(projectStrings.ERROR_SUBJECT_NOT_EXIST);
          resolve({});
        }
        else{
          resolve(subject);
        }
    });

  }); 

}; 
////////////////////////////////////////////////////////////////////////////////////

/////////////////// FOR ROUTE: getSubjectByDate ////////////////////////////

exports.getSubjectByDate = (req,res) => {
    console.log("Enter route(POST): /getSubjectByDate");
  
  getSubjectByDate_SubjectSchema(req.body.date).then((result,error) => {
      if(result){
        // if result TRUE:  
        console.log(`RESULT: ${result}`);
        res.status(200).send(result);      
      }
       else{
        // if result FALSE: 
        console.log(`RESULT: ${result}`);
        res.status(500).send(projectStrings.ERROR_NO_SUBJECTS);
        }
    }, error =>{
        res.status(500).send(error);
      console.log(error);
   });
}

var getSubjectByDate_SubjectSchema = (_date) => {
  
  return new Promise((resolve, reject) =>{
    console.log(`_date: ${_date}`);

    Subject.find({date:_date}, (err, subject) => {
        if (subject == "") {
          resolve(false);
        }
        else{
          resolve(subject);

        }
    });

  }); 

};    

////////////////////////////////////////////////////////////////////////////////////

/////////////////// FOR ROUTE: insertSubject //////////////////////////// 

exports.insertSubject = (req, res) => {
// values: name, date, hours, type, location + userName

// check if there is no multi names
  var backgroundPic;
  console.log("Enter route(POST): /insertSubject");

  // if there is no profile picture to user:
  if(req.body.background == null) backgroundPic = projectStrings.DEFAULT_BACKGROUND_PIC;
  else backgroundPic = req.body.background;



 IsUniqueName_SubjectSchema(req.body.name).then((result,error) => {
    if(result){
      // if result TRUE:
      creatSubject_SubjectSchema(req.body.userName,req.body.name, backgroundPic, req.body.date, req.body.hours, req.body.type,
        req.body.location, req.body.requiredSkills).then((sub,error) => {

          if (error) return res.status(500).send(projectStrings.ERROR_ADDING);
 
          getSubjectByNameReturnID_SubjectSchema(req.body.name).then((result,error) => {
            if(result){

              // follow subject 
              followSubjectBySubjectID_UserSchema(req.body.userName, result).then((result,error) => {
                 
                  if(result){
                    // if result TRUE:  
                    // add the type of subject to favorites array
                    getSubjectByNameReturnSubject_SubjectSchema(req.body.name).then((subject,error) => { 
                      if(result){
                            smartSearchCtl.addFavorite_UserSchema(req.body.userName, subject.type,"create", true).then((result,error) => {
                          if(result)
                            res.status(200).send(sub);      
                          else{
                            res.status(500).send(error);   
                          }
                        }, error =>{
                            res.status(500).send(error);
                          console.log(error);
                        });
                      }
                      else{
                         // if result FALSE: 
                      console.log(`RESULT ELSE: ${result}`);
                      res.status(500).send(result);
                      }
                    },error =>{
                      res.status(500).send(error);
                      console.log(error);
                  })// endOf getSubjectByNameReturnSubject
                    
                  }
                   else{
                    // if result FALSE: 
                    console.log(`RESULT: ${result}`);
                    res.status(500).send(result);
                    }

                }, error =>{
                    res.status(500).send(error);
                  console.log(error);
                });
            }
            else res.status(500).send(error);
            }, error =>{
                res.status(500).send(error);
              console.log(error);
            });
      });
    }
    else
        res.status(500).send(projectStrings.ERROR_SUBJECT_EXIST);
  }, error =>{
    console.log(error);
 });
}

  var creatSubject_SubjectSchema = (_userName,_name, _backgroundPic, _date, _hours, _type, _location, _requiredSkills) => {
  
    return new Promise((resolve, reject) =>{
        console.log(`_name, _backgroundPic, _date, _hours, _type, _location, _requiredSkills: 
                    ${_name}, ${_backgroundPic}, ${_date}, ${_hours}, ${_type}, ${_location}, ${_requiredSkills}`);
    
        Subject.create({userName:_userName,name: _name, background:_backgroundPic,date:_date, hours:_hours,
                        type:_type, location:_location, requiredSkills:_requiredSkills},(err, msg) => {
          if (err) {
            console.log(err);
            resolve({});
          }
          else{
            console.log(msg);
            resolve(msg);
          }
      });
    }); 
  
  }; 
////////////////////////////////////////////////////////////////////////////////////

/////////////////// FOR ROUTE: UpdateParticipentsByUserName //////////////////////////// 

// adding the user as a participant to a specific subject(include checking if the user is already follows the subject)
 exports.UpdateParticipentsByUserName =(req,res) => {              
  
    console.log("Enter route(POST): /UpdateParticipentsByUserName");
    getSubjectByNameReturnID_SubjectSchema(req.body.name).then((idSub,error) => {
      if(idSub){
        // if result TRUE: 
        console.log(`idSub: |${idSub}|`);
        UpdateParticipentsByUserName_SubjectSchema(req.body.userName,req.body.name, idSub).then((result,error) => {
            if(result){
              // if result TRUE:  
              console.log(`RESULT: ${result}`);  
              res.status(200).send(result);
            }
            else{
              // if result FALSE: 
              console.log(`RESULT ELSE: ${result}`);
              res.status(500).send(projectStrings.ERROR_UPDATE);
              }
          }, error =>{
              res.status(500).send(error);
            console.log(error);
        });
      }
      else{
      // if result FALSE: 
      console.log(projectStrings.ERROR_SUBJECT_NOT_EXIST);
      res.status(500).send(projectStrings.ERROR_SUBJECT_NOT_EXIST);
      }
  });
}

var UpdateParticipentsByUserName_SubjectSchema = (_userName,_name,idSubject) => {
    
    return new Promise(function(resolve, reject) {
    console.log("Function: /UpdateParticipentsByUserName_SubjectSchema");
   
    var id_ = idSubject.toString();
    var flag=false;
    User.findOne({userName:_userName}, (err, usr) => {
      if (err) {
        console.log(projectStrings.ERROR_USER_NOT_EXIST);
        resolve(false);
      }
      else{
        //foreach loop that go on all the user subject's and remove him.
        usr.subjects.forEach(function(element) {
          if(element==id_) {
            flag=true;
          }
        });
        if(flag==false){
          followSubjectBySubjectID_UserSchema(_userName,id_).then((result,error) => {
            if(result){}
            else{}
          });
        }
        ifUserNameexistInParticipents_SubjectSchema(_userName,id_).then((result,error) => {
          if(result){
            resolve(false);
          }
          else{            
            // if user isnot exist - UPDATE
            var cond = {_id:id_},
            update = {$push:{participents:_userName}},
            opts = {multi: true};
  
            Subject.update(cond,update,opts, (err) => {
              if(err){
                console.log(projectStrings.ERROR_SUBJECT_NOT_EXIST);
                resolve(false);
              }
              else{
                  getSubjectByName_SubjectSchema(_name).then((subject,error) => {

                  if(subject){
                       // add the type of subject to favorites array
                    smartSearchCtl.addFavorite_UserSchema(_userName, subject.type, "participent", false).then((result,error) => {
                      if(result)
                        resolve(subject);     
                      else
                        resolve(false);  
                    }, error =>{
                        resolve(false);
                    }); 
                  }   
                  else{
                    resolve(false);
                  }
                }, error =>{
                    resolve(false);
               }); 
              }
            });
          }
        });  
      }
    });
  });
};

 var ifUserNameexistInParticipents_SubjectSchema = (userName,id_) => {
    return new Promise((resolve, reject) => {
      var flag=false;
      Subject.findOne({_id:id_}, (err, sub) => {
        if (err) {
          console.log(projectStrings.ERROR_USER_NOT_EXIST);
          resolve(false);
        }
        else{
          //foreach loop that go on all the user subject's and remove him.
          sub.participents.forEach((element)=> {
            if(element==userName) {
              console.log("flag=true");
              resolve(true);
            }
          });
          resolve(false);
        }
      });
    });
  };

////////////////////////////////////////////////////////////////////////////////////

/////////////////// FOR ROUTE: followSubject //////////////////////////// 

exports.followSubject = (req,res) => {

  console.log("Enter route(POST): /followSubject");
  
  getSubjectByNameReturnID_SubjectSchema(req.body.name).then((sub,error) => {
      if(sub){
        // if result TRUE:  
        console.log(`RESULT: ${sub}`);
        followSubjectBySubjectID_UserSchema(req.body.userName, sub).then((result,error) => {
            if(result){
                // if result TRUE:  
                console.log(`RESULT: ${result}`);
                getSubjectByName_SubjectSchema(req.body.name).then((subject,error) => {

                    // add the type of subject to favorites array
                    smartSearchCtl.addFavorite_UserSchema(req.body.userName, subject.type,"follow", false).then((result,error) => {
                      if(result)
                        res.status(200).send(result);      
                      else
                        res.status(500).send(error);   
                    }, error =>{
                        res.status(500).send(error);
                      console.log(error);
                    });    
                }, error =>{
                    res.status(500).send(projectStrings.ERROR_SUBJECT_EXIST);
                  console.log(error);
               });
              
            }
             else{
                // if result FALSE: 
                console.log(`RESULT: ${result}`);
                res.status(500).send(projectStrings.ERROR_USER_NOT_EXIST);
              }
          }, error =>{
              res.status(500).send(projectStrings.ERROR_SUBJECT_NOT_EXIST);
            console.log(error);
         });
      }
      else{
        console.log(projectStrings.ERROR_SUBJECT_NOT_EXIST);
        res.status(500).send(projectStrings.ERROR_SUBJECT_NOT_EXIST);
      }
    }, error =>{
        res.status(500).send(error);
      console.log(error);
   });

}
////////////////////////////////////////////////////////////////////////////////////


/////////////////// FOR ROUTE: deleteSubjectByName ////////////////////////////

exports.deleteSubjectByName = (req,res) => {

  console.log("Enter route(POST): /deleteSubjectByName");
  
  deleteSubjectByName_SubjectSchema(req.body.name).then((result,error) => {
      if(result){
        // if result TRUE:  
        console.log(`RESULT: ${result}`);
        console.log(`The subject ${req.body.name} have been deleted.`)
        res.status(200).send(result);      
      }
      else{
        // if result FALSE: 
        console.log(`RESULT: ${result}`);
        res.status(500).send(projectStrings.ERROR_SUBJECT_NOT_EXIST);
      }
    }, error =>{
        res.status(500).send(error);
      console.log(error);
   });
}

 var deleteSubjectByName_SubjectSchema = (_name) => {

  return new Promise((resolve, reject)=> {

    console.log(`_name: ${_name}`);

    Subject.findOne({name:_name}, (err, sub) => {
        if (err) {
          console.log(projectStrings.ERROR_SUBJECT_NOT_EXIST);
          resolve(false);
        }
        else if(sub){

          sub.participents.forEach((element) =>{
              var cond = {userName:element},
              update = {$pull:{subjects:sub._id}},
              opts = {multi: true};
    
               User.update(cond,update,opts, (err) => {
                if(err){
                  console.log(err);
                }else{
                  console.log(`The subject ${sub.name} is deleted as a participent from ${element} user.`);
                }
              }
            );
          });
          getAllUsers_UserSchema().then((users,error) => {
            if(error){}
            else if(users){
              users.forEach((element) =>{
                var cond = {userName:element.userName},
                update = {$pull:{subjects:sub._id}},
                opts = {multi: true};
      
                User.update(cond,update,opts, (err) => {
                  if(err){
                    console.log(err);
                  }
                  // else if(update){
                  //   console.log(`The subject ${sub.name} is deleted as a follower from ${element.userName} user.`);
                  // }
                });
              });
            }
          });
          console.log(`${sub.name}`);
          //deleteing the subject
          var myquery = { name: _name };
          Subject.deleteOne(myquery, (err, obj)=> {
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

////////////////////////////////////////////////////////////////////////////////////


/////////////////// FUNCTION: getAllUsers_UserSchema ////////////////////////////
var getAllUsers_UserSchema = () => {
  
  return new Promise((resolve, reject) =>{
    console.log(`FUNCTION:getAllUsers_UserSchema`);

    User.find({}, (err, users) => {
        if (err) {
          console.log(projectStrings.ERROR_SUBJECT_NOT_EXIST);
          resolve({});
        }
        else if(users){
           resolve(users);
        }
    });

  }); 

}; 


////////////////////////////////////////////////////////////////////////////////////
