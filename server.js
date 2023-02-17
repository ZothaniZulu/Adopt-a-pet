const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator');
const flash = require('connect-flash');
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');



//connect to database
require('./config/db')

// Init App
const app = express();



//Bring in the models
let Pet = require('./models/pet');
let Adoption = require('./models/adoption');
let User = require('./models/user');

//Load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

  // Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

//Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));

  
// parse application/json
app.use(bodyParser.json());

//Express files middleware
app.use(fileUpload());



//Session middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
  
}));

//Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Passport Config
require('./config/passport')(passport);
// Passport Middleware
app.use(passport.initialize(console.log("Passport initialized")));
app.use(passport.session(console.log("Passport session on standby")));



/* User Access routes */

//Load login page
app.get('/login', function(req, res){
  res.render('users/login',{
      title: 'Login'
  });
});

//login request
app.post('/login', 
      passport.authenticate('local', { failureRedirect: '/login'}),
      function(req, res) {
        res.redirect('/');
        console.log("User Logged in");
});

//Logout
app.get('/logout', function(req, res){
  req.logout();
  req.flash('success', 'You are logged out');
  res.redirect('/login');
});


//Access Control
function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    res.redirect('/login');
  }
}

/* End of User Access Routes */



//Home page
app.get('/',ensureAuthenticated, function(req, res){
  Pet.find({}, function(err, pets){
    if(err){
      console.log(err);
    } else {
      res.render('index', {
        title:'Explore Pets',
        pets: pets
      });
    }
  });
}); 
 

//Route files
let pets = require('./routes/pets');
let adoptions = require('./routes/adoptions');
let navigations = require('./routes/navigations');
let users = require('./routes/users');
app.use('/pets', pets);
app.use('/adoptions', adoptions);
app.use('/navigations', navigations);
app.use('/users', users);



// Start Server
app.listen(3000, function(){
    console.log('Server started on port 3000...');
});


