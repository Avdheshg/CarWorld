
const express = require('express');
const authController = require('./../controllers/authController');

const newCarsController = require('./../controllers/newCarsController');

const router = express.Router();

// **** ALIASE ROUTES  **** 
// TOP RATED
router
    .route("/top-rated")
    .get(newCarsController.topRatedCars, newCarsController.getAllCars);

// TOP EFFICIENT
router
    .route("/top-efficient")
    .get(newCarsController.topEfficientCars, newCarsController.getAllCars);

// TOP POWERFUL
router
    .route("/top-powerful")
    .get(newCarsController.topPowerfulCars, newCarsController.getAllCars)

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












































































