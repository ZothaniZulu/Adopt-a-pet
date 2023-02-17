const mongoose = require('mongoose');
const moment = require('moment-timezone');

let time = moment().tz("Africa/Maseru");
let current_date = time.format('YYYY-MM-DD');


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
    },
    created_at: {
        type: String,
        default: current_date,
        required: true
    }
});

const Adoption = module.exports = mongoose.model('Adoption', AdoptionSchema);