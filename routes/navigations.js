const express = require('express');
const router = express.Router();
const passport = require('passport');

//Users Model
let User = require('../models/user');

// Access Control
function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
      return next();
    } else {
      req.flash('danger', 'Please login');
      res.redirect('/users/login');
    }
}

//Get users profile by user id
router.get('/profile',ensureAuthenticated, function(req, res){
    User.findById(req.user._id, function(err, user){
        res.render('profile', {
            title: 'My Profile',
            user: user
        });
    });
 });

//Get contact page
router.get('/contact', ensureAuthenticated, function(req, res){
    res.render('contact',{
        title: 'Contact Us'
    });
});

//Get about page
router.get('/about', ensureAuthenticated, function(req, res){
    res.render('about', {
        title: 'About'
    });
});

module.exports = router;