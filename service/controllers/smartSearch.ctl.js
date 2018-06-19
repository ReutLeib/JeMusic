const mongoose          = require('mongoose');
var   Subject           = require('../models/define_schema_subject');
      User              = require('../models/define_schema_users');
      projectStrings    = require('../config').projectStrings,
      globVar           = require('../config').globVars,
      subjectCtl        = require('./subject.ctl.js'),
      sleep             = require('system-sleep'),
      Favorite          = require('../models/define_schema_favorite');
      Promise           = require('bluebird');
    

// _typeFunction = create(0.4)/follow(0.2)/participent(0.4)
exports.addFavorite_UserSchema = (_userName, _type, _typeFunction,_isToString) =>{

  var type = _type;
  var flag = false;

  if(_isToString)
    type = _type.toString();

  console.log("ADD FAVORITE - TYPE:" + _type); 
  console.log("Function: /addFavorite_UserSchema"); 
  return new Promise((resolve, reject) => {

    User.findOne({userName:_userName}, (err, usr) => {
      if (usr) {
        getFavoriteByTypeAndUsername_ReturnStatistic_FavoriteSchema(_type,_userName).then((statistic,error) =>{
        // type exist so we need to update the statistic
        if(statistic){
            updateStatistics(_type ,statistic,_typeFunction).then((result,error) => {
              if(error) resolve(false); 
              resolve(result); 
            }, error => {
                console.log(error);
            });
          } // endOf if(typeID)

          else{
            // insert this type by typeFunction couse all function is different scoring
            insertFavorite(_type,_userName,_typeFunction).then((result,error) => {
              if (error) resolve(false); 
              resolve(result); 
            }, error => {
                console.log(error);
                resolve(false);
              });
            // resolve(false);
          }
        }, error => {
          console.log(error);
          resolve(false);
        });
      };
  
    });// ondOf findOne

  });// end of prommise
}

var getFavoriteByTypeAndUsername_ReturnStatistic_FavoriteSchema = (_type,_userName) => {
    console.log("Function: /getFavoriteByTypeAndUsername_ReturnStatistic_FavoriteSchema"); 

    return new Promise((resolve, reject)=> {
    console.log(`_type: ${_type}, _userName: ${_userName}`);

    Favorite.findOne({type:_type,userName:_userName}, (err, favorite) => {
        if (err) {
          resolve(false);  
        }
        else if(favorite == null){
          console.log("favorite____________ ___________:" + favorite);
          resolve(false);
        }
        else{
          console.log("favorite.statistic____________ ___________:" + favorite.statistic);
          resolve(favorite.statistic);          
        }
    });

  }); 
}

var updateStatistics = (_type,_statistic,_typeFunction) => {
      console.log("Enter route(POST): /updateStatistics"); 

      return new Promise((resolve, reject) =>{
        var typeFunc;
         switch(_typeFunction) {
        case "create":
            typeFunc = _statistic + (globVar.CREATE_FUNC*_statistic);
            break;
        case "follow":
            typeFunc = _statistic + (globVar.FOLLOW_FUNC*_statistic);        
            break;
        case "participent":
            typeFunc = _statistic + (globVar.PARTICIPENT_FUNC*_statistic);
            break;
        default:
      }

        var cond = {type:_type},
            update = {$set:{statistic:typeFunc}},
            opts = {multi: true};
    
         Favorite.update(cond,update,opts, (err) => {
          if(err){
            console.log(projectStrings.ERROR_ADDING);
            resolve(false);
          }
          else{
            resolve(true);
          }
        });
  
    }); 
}

var insertFavorite = (_type,_userName,_typeFunction) => {
      console.log("Function: /insertFavorite"); 

    return new Promise((resolve, reject)=> {
      switch(_typeFunction) {
        case "create":
                Favorite.create({type: _type,userName:_userName, statistic:globVar.CREATE_FUNC},(err, msg) => {
                if (err) {
                  resolve({});
                }
                else{
                  resolve(msg);
                }
              });
            break;
        case "follow":
                Favorite.create({type: _type,userName:_userName,statistic:globVar.FOLLOW_FUNC},(err, msg) => {
                if (err) {
                  resolve({});
                }
                else{
                  resolve(msg);
                }
              });
            break;
        case "participent":                
                Favorite.create({type: _type,userName:_userName, statistic:globVar.PARTICIPENT_FUNC},(err, msg) => {
                if (err) {
                  resolve({});
                }
                else{
                  resolve(msg);
                }
              });
            
            break;
        default:
            
      }

      

  }); // endOf promise
}



exports.getSubjectsByFavorites = (req,res) => {
  
  // var flag = false;
  console.log("Enter route(POST): /getSubjectsByFavorites");
  var arrayOfSubjects = [];
  var promiseArray = [];

  GetFavoritesByUserName_FavoriteSchema(req.body.userName).then((favorites,error) => {
    //check if return "{}"
    if(favorites != ""){
        for (let j=0; j<favorites.length; j++) {
            promiseArray.push(subjectCtl.getSubjectByType_SubjectSchema(favorites[j].type));
        }

        Promise.all(promiseArray).then((responseArray) => {
          console.log(responseArray);
              res.status(200).send(responseArray);
        })
    }
    else{
      subjectCtl.getAllSubjects().then((subjects,error) =>{
        if(subjects){
          res.status(200).send(subjects);
        }
        else{
          res.status(500).send(error);  
        }
      })
    }
  }, error => {
      console.log(error);
      res.status(500).send(error);  
  })

}



var GetFavoritesByUserName_FavoriteSchema = (_userName) => {
  return new Promise((resolve, reject) =>{

    console.log(`_userName: ${_userName}`);

    Favorite.find({userName:_userName}, (err, favor) => {
        if (err) {
          console.log(projectStrings.ERROR_USER_NOT_EXIST);
          resolve({});
        }
        else{
          resolve(favor);
        }
    });

  }); 

}