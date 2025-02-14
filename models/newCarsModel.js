
const mongoose = require('mongoose');

const newCarsSchema = new mongoose.Schema({
    brand: {
        type: String, 
        // required: [true, 'A car must have a brand'],
        trim: true
    },
    name: {
        type: String,
        // required: [true, 'A car must have a name'],
        trim: true
    },
    price: {
        type: Number,
        // required: [true, 'A car  must have a price']
    },
    rating: {
        type: Number, 
        default: 4.2
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
    engine: {
        type: Number,
        // required: [true, 'A car  must have a engine power']
    },
    transmission: {
        type: String,
        default: "Manual",
        trim: true
    },
    fuelType: {
        type: String,
        default: "diesel", 
        trim: true
    },
    seatingCapacity: {
        type: Number,
        default: 5
    },
    summary: {
        type: String
    },
    coverLink: String,
    good: [String],
    bad: [String],
    images: [String]
});

const NewCar = mongoose.model('NewCar', newCarsSchema);

module.exports = NewCar;


 

