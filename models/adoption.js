const mongoose = require('mongoose');

//Adoption Schema

const AdoptionSchema = mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        required: true
    },
    cellphoneNumber: {
        type: String,
        required: true
    },
    petId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    motivation:{
        type: String,
        required: true
    }
});

const Adoption = module.exports = mongoose.model('Adoption', AdoptionSchema);