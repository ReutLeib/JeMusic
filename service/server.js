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
app.post('/getAllVideosByUserName/',  userCtl.getAllVideosByUserName);  // value : userName
app.post('/getUserByUserName/', userCtl.getUserByUserName); // value : userName
app.post('/deleteUserByUserName/', userCtl.deleteUserByUserName);  // value : userName
app.post('/UpdateCityByUserName/', userCtl.UpdateCityByUserName)  // value : userName, city
app.post('/UpdateAgeByUserName/', userCtl.UpdateAgeByUserName)   // value : userName, age
app.post('/UpdateNameByUserName/', userCtl.UpdateNameByUserName)   // value : userName, name
app.get('/getSubjectsByFavorites/', smartSearchCtl.getSubjectsByFavorites)   // value : userName

// subjectCtl:
app.post('/getAllSubjectsByUserName/',subjectCtl.getAllSubjectsByUserName); // value : userName
app.get('/getAllSubjects/', subjectCtl.getAllSubjects);    // no values
app.post('/getSubjectByName/', subjectCtl.getSubjectByName);    // value : name
app.post('/getSubjectByDate/', subjectCtl.getSubjectByDate);  // value : date
app.post('/insertSubject/', subjectCtl.insertSubject);  // values: name, date, hours, type, location, requiredSkills + userName
app.post('/UpdateParticipentsByUserName/', subjectCtl.UpdateParticipentsByUserName);   // value : userName, name
app.post('/followSubject/',subjectCtl.followSubject ) // value : name, userName 
app.post('/deleteSubjectByName/', subjectCtl.deleteSubjectByName);  // value : name  
           
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});


