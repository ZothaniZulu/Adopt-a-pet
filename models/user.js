const mongoose = require('mongoose');
//User Schema
const userSchema = mongoose.Schema({
   name:{
       type: String,
       required: true
   },
   username:{
       type: String,
       required: true
   },
   cellphoneNumber:{
       type: String,
       required: true
   },
   gender:{
       type: String,
       required: true
   },
   homeAddress:{
       type: String,
       required: true
   },
   password:{
       type: String,
       required: true
   },
    
});

const User = module.exports = mongoose.model('User', userSchema);