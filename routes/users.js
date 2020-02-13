const express = require('express');
const router = express.Router();
const { body, check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const passport = require('passport');

//Users Model
let User = require('../models/user');

// Access Control
function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
      return next();
    } else {
      req.flash('danger', 'Please login');
      res.redirect('/login');
    }
  }

//Register page
router.get('/register', function(req, res){
    let errors = '';
    res.render('users/register',{
        title: 'Register',
        errors:errors
    });
});

//Submit user info for registration
router.post('/register',[
    //Check the input fields
   check('name', 'The name entered is too short').isLength({min:2}),
   check('username', 'Please enter a valid email address').isEmail(),
   check('homeAddress', 'The home address entered is too short').isLength({min:5}),
   check('cellphoneNumber', 'The cellphone number entered is too short').isLength({min:10}),
   check('gender', 'Please specify your gender').isLength({min:2}),
   check('password', 'The password entered is too short').isLength({min:6})
   
], async (req, res, next) => {
    //check if the passwords match
    if(req.body.password){
        await body('password2').equals(req.body.password).withMessage('Passwords do not match').run(req);
    }

    //Handle the errors
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.render('users/register',{
            title: 'Register',
            errors:errors.mapped()
        });
    }else{
         

        //Prepare to put the user in a database
        let user = new User();
        user.name = req.body.name;
        user.username = req.body.username;
        user.homeAddress = req.body.homeAddress;
        user.cellphoneNumber = req.body.cellphoneNumber;
        user.gender = req.body.gender;
        user.password = req.body.password;

        //hash the password
        const saltRounds = 10;
        bcrypt.genSalt(saltRounds, function(err, salt) {
            bcrypt.hash(user.password, salt, function(err, hash) {
                if(err){
                    console.log(err);
                    return;
                }else{
                user.password = hash; 
    
                user.save(function(err){
                    if(err){
                        console.log(err);
                        return;
                    }else{
                        console.log('User registered successfully');
        
                        //Send message to user
                        req.flash('info', 'Registration Completed Successfully, please login');
                        res.redirect('/login');
                    }
                });
                } 
            });
        });
    }
});

router.get('/edit_profile/:id', ensureAuthenticated, function(req, res){
    User.findById(req.params.id, function(err, user){
        let errors = '';
        res.render('edit_profile', {
            title: 'Edit Profile',
            user: user,
            errors: errors
        });
    });
});

router.post('/update_profile', [
    check('name', 'Please enter your name').isLength({min:3}),
    check('cellphoneNumber', 'Your cellphone number has to be be 10 digits long').isLength({min:10}),
    check('homeAddress', 'Please enter a valid home address').isLength({min:10})
], ensureAuthenticated, function(req, res){
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        User.findById(req.user._id, function(err, user){
            let errors = '';
            res.render('edit_profile', {
                title: 'Edit Profile',
                user: user,
                errors: errors
            });
        });
      }else{
        let user = {};
        user.name = req.body.name;
        user.username = req.body.username;
        user.homeAddress = req.body.homeAddress;
        user.cellphoneNumber = req.body.cellphoneNumber;
        user.gender = req.body.gender;
        user.password = req.body.password;
        
        let query = {_id:req.user._id}

        User.updateOne(query, user, function(err){
            if(err){
                console.log(err);
                return;
            }else{
                //The update is a success
                console.log("Profile Updated Successfully");
                req.flash('success', 'Profile updated successfully');
                res.redirect('/');
            }
        });
      }
});







module.exports = router;