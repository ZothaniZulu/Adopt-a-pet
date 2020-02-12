const mongoose = require('mongoose');

//Pet Schema 

const petSchema = mongoose.Schema({
    petName:{
        type: String,
        required: true
    },
    petType:{
        type: String,
        required: true
    },
    petGender: {
        type: String,
        required: true
    },
    petDescription: {
        type: String,
        required: true
    },
    fileLocation: {
        type: String,
        required: true
    },
    uploadedBy: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    }
    
});

const Pet = module.exports = mongoose.model('Pet', petSchema);