
const express = require('express');
const authController = require('./../controllers/authController');

const newCarsController = require('./../controllers/newCarsController');

const router = express.Router();

router
    .route('/')
    .get(newCarsController.getAllCars);

// router
//     .route("/search")
//     .get(newCarsController.getQueryCars);

router
    .route('/:id')
    .get(newCarsController.getACar);  


// implementing this route into the user Model
  
module.exports = router;

  

/*
    tourRoute == newCarRute
*/












































































