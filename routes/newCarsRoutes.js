
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

// **** NORMAL ROUTES  ****
router
    .route('/')
    .get(newCarsController.getAllCars);
    // .get(authController.protect ,newCarsController.getAllCars); 

// router
//     .route("/search")
//     .get(newCarsController.getQueryCars);

router
    // .route('/:id')
    .route('/:carName')
    .get(newCarsController.getACar);  


// implementing this route into the user Model
  
module.exports = router;

  

/*
    tourRoute == newCarRute
*/












































































