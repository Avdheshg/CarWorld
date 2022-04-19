
const express = require('express');
const authController = require('./../controllers/authController');

const newCarsController = require('./../controllers/newCarsController');

const router = express.Router();

// Under 5 lacks
router
    .route('/under-5-lacks')
    .get(newCarsController.aliasUnder5Lacks, newCarsController.getAllCars);
    // pass this query in the url to make this work     
    // 127.0.0.1:3000/newCars/getAll/under-5-lacks?price[lte]=5

// 5-10 L
router
    .route('/under-5-lacks')
    .get(newCarsController.aliasUnder5Lacks, newCarsController.getAllCars);

// Router:    localhost:/newCars/getAll

router
    .route('/')
    .get(authController.protect, newCarsController.getAllCars);

router
    .route('/:id')
    .get(newCarsController.getACar)
    .delete(
        authController.protect, 
        authController.restrictTo('admin', 'uploader'),
        newCarsController.deleteCar
    );  
// implementing this route into the user Model
  
module.exports = router;

 

/*
    tourRoute == newCarRute
*/












































































