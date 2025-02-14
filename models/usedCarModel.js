
const mongoose = require('mongoose');

const oldCarsSchema = new mongoose.Schema({
    brand: {
        type: String, 
        required: [true, 'A car must have a brand'],
        trim: true
    },
    name: {
        type: String,
        required: [true, 'A car must have a name'],
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'A car  must have a price']
    },
    bodyType: {
        type: String,
        // required: [true, 'A car  must have a body type'],
        trim: true
    },
    mileage: {
        type: Number,
        // required: [true, 'A car  must have a mileage']
    },
    fuelType: {
        type: String,
        default: "diesel", 
        trim: true
    },
    travel: {
        type: String,
        trim: true,
        required: [true, 'A car  must have a travelled range']
    }, 
    city: {
        type: String,
        trim: true,
        // required: [true, 'A car  must have a travelled range']
    }, 
    emi: {
        type: String,
        trim: true,
        // required: [true, 'A car  must have a travelled range']
    }, 
    summary: {
        type: String
    },
    coverLink: String
});

const UsedCar = mongoose.model('UsedCar', oldCarsSchema);

module.exports = UsedCar;




