const express = require('express');
const { check, validationResult } = require('express-validator');
const path = require('path');
const passport = require('passport');
const router = express.Router();


//Pet model
let Pet = require('../models/pet');

//Adoption model
let Adoption = require('../models/adoption');

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

//Get add pet page
router.get('/add', ensureAuthenticated, function(req, res){
    //Initially there will be no errors before a user attempts to give up a pet for adoption
    User.findById(req.user._id, function(err, user){
      let errors = '';
      res.render('add_pet', {
          title: 'Add Pet',
          errors:errors,
          user:user
      });
    });
    
});

//Form validation
router.post('/submit_pet',[
  check('petName', 'Please enter a valid pet name').isLength({min:3}),
  check('petType', 'Please select a category for the pet').isLength({min:1}),
  check('petGender', 'Please select a gender of the pet').isLength({min:1}),
  check('petDescription', 'The pet description entered is too short').isLength({min:1}),
  // check('petPicture', 'Please upload a picture of the pet').isLength({min:1}),
  check('uploadedBy', 'Please specify who is uploading the pet').isLength({min:5})

], ensureAuthenticated, function(req, res){
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    res.render('add_pet',{
      title: 'Add Pet',
      errors:errors.mapped()
    });
  }else{
    //Pet picture variables for (Express file-upload)
    let petPicture = req.files.petPicture;
    let uploadPath = path.join(__dirname, '../public/pet_pictures/'+ petPicture.name);

    //Upload the pets picture
    petPicture.mv(uploadPath, function(err){
      if(err){
        console.log('Picture not uploaded, there was an error!');
      }else{
        console.log('Process complete. Picture uploaded successfully');
      }
    });

    //Pet picture variable for database
    let petPictureName = req.files.petPicture.name
    
    //Prepare to save pet to database
    let pet = new Pet();
    pet.petName = req.body.petName;
    pet.petType = req.body.petType;
    pet.petGender = req.body.petGender;
    pet.petDescription = req.body.petDescription;
    pet.fileLocation = petPictureName;
    pet.userId = req.body.userId;
    pet.uploadedBy = req.body.uploadedBy;

    //Save pet to database
    pet.save(function(err){
      if(err){
        console.log(err);
        return;
      } else {

        console.log('Pet added successfully');

        req.flash('info', 'Pet added successfully');
        
        res.redirect('/');
      }
    });
  
  }    
});


//View a pet
router.get('/:id', ensureAuthenticated, function(req, res){
    Pet.findById(req.params.id, function(err, pet){
    res.render('view_pet', {
      title: 'Pet Details',
      pet:pet 
    });
  });
});





module.exports = router;