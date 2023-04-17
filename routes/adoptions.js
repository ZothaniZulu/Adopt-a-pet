const express = require('express');
const { check, validationResult } = require('express-validator');
const path = require('path');
const passport = require('passport');
const nodemailer = require('nodemailer');
const router = express.Router();


//Adoption model
let Adoption = require('../models/adoption');

//Pet model
let Pet = require('../models/pet');

//User model
let User = require('../models/user')

// Access Control
function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    req.flash('danger', 'Please login');
    res.redirect('/login');
  }
}

//Apply to adopt the pet.
router.get('/:id',ensureAuthenticated, function(req, res){
  let errors = '';
  Pet.findById(req.params.id, function(err, pet){
    User.findById(req.user._id, function(err, user){
      res.render('adoption_form',{
        title: 'Adopt Pet',
        pet:pet,
        user: user,
        errors: errors
      });
    });
  }); 
  
});

//Submit adoption application
router.post('/application',[
  //Form validation
  check('userName', 'Please enter a valid username').isLength({min:2}),
  check('userEmail', 'Please enter a valid email address').isEmail(),
  check('motivation', 'The motivation sent is too short').isLength({min:5})
], ensureAuthenticated, function(req, res){
    /*This variable(applicationId) gets the petID from a hidden input field on the application form.
      It's purpose is to re-send the pet ID back to the form incase there are errors with the form validation submission
    */
    let applicationId = req.body.applicationId;

    //If there are any errors, re-load the page and re-fetch the pet id using the 'applicationId' variable
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      Pet.findById(applicationId, function(err, pet){
        res.render('adoption_form',{
          title: 'Adopt Pet',
          pet:pet,
          errors: errors.mapped()
        });
      });
       
      console.log('There was an error');
    }else{
      //Prepare the adoption application for the database
      let adoption = new Adoption();
      adoption.userName = req.body.userName;
      adoption.userEmail = req.body.userEmail;
      adoption.cellphoneNumber = req.body.cellphoneNumber;
      adoption.petId = req.body.petId;
      adoption.userId = req.body.userId;
      adoption.motivation = req.body.motivation;



      //Save the adoption to the database
      adoption.save(function(err){
          if(err){
            console.log(err);
            return;
          }else{
            let transporter = nodemailer.createTransport({
              host: 'smtp.office365.com',
              auth: {
                  user: 'adoptapet2019@outlook.com',
                  pass: '2580456@Owen'
              }
          });

          let mailOptions = {
              from: 'adoptapet2019@outlook.com',
              to: req.body.userEmail,
              subject: 'Adoption application received', 
              text: 'Hello, your application to adopt a pet has been received, we will be in touch with you soon.'
          }

          transporter.sendMail(mailOptions, function(error, info){
              if(error){
                  return console.log(error)
              }else{
                  console.log('Message sent:' +info.response)
              }
          });
            console.log('Adoption submitted successfully');
            req.flash('info', 'Adoption application submitted successfully, we will contact you once it is processed.');
            res.redirect('/');
          }
      });
      }
    
});


module.exports = router;