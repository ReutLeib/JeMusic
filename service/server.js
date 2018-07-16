var   express         = require('express'),
      event           = require('events'),
      bodyParser      = require('body-parser'),
      fs              = require('fs'),
      userCtl         = require('./controllers/user.ctl.js'),
      subjectCtl      = require('./controllers/subject.ctl.js'),
      smartSearchCtl  = require('./controllers/smartSearch.ctl.js'),
      app             = express();
      port            = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set('port',port);
app.use('/', express.static('./public/html'));//for API 

app.use((req,res,next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type,Accept");
    next();
});

/*** All routes ***/
// UserCtl:
app.post('/insertUser/', userCtl.insertUser); // values: userName , password , name, age, city
app.get('/getAllVideosByUserName/:userName',  userCtl.getAllVideosByUserName);  // value : userName
app.get('/getUserByUserName/:userName', userCtl.getUserByUserName); // value : userName
app.delete('/deleteUserByUserName/:userName', userCtl.deleteUserByUserName);  // value : userName
app.put('/UpdateCityByUserName/:userName/:city', userCtl.UpdateCityByUserName)  // value : userName, city
app.put('/UpdateAgeByUserName/:userName/:age', userCtl.UpdateAgeByUserName)   // value : userName, age
app.put('/UpdateNameByUserName/:userName/:name', userCtl.UpdateNameByUserName)   // value : userName, name
app.get('/getSubjectsByFavorites/:userName', smartSearchCtl.getSubjectsByFavorites)   // value : userName

// subjectCtl:
app.get('/getAllSubjectsByUserName/:userName',subjectCtl.getAllSubjectsByUserName); // value : userName
app.get('/getAllSubjects/', subjectCtl.getAllSubjects);    // no values
app.get('/getSubjectByName/:name', subjectCtl.getSubjectByName);    // value : name
app.post('/getSubjectByDate/', subjectCtl.getSubjectByDate);  // value : date
app.post('/insertSubject/', subjectCtl.insertSubject);  // values: name, date, hours, type, location, requiredSkills + userName
app.post('/UpdateParticipentsByUserName/', subjectCtl.UpdateParticipentsByUserName);   // value : userName, name
app.post('/followSubject/',subjectCtl.followSubject ) // value : name, userName 
app.post('/deleteSubjectByName/', subjectCtl.deleteSubjectByName);  // value : name  
           
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});


