
const express = require('express');
const authController = require('./../controllers/authController');

const newCarsController = require('./../controllers/newCarsController');

const router = express.Router();     
// console.log("inside car router");
/* 
If a compelte request is 
    "/newCars/top-rated" or "/newCars?price[gte]=0&price[lte]=10" and when that will come into this router then it will become
    "/top-rated"    or      "/?price[gte]=0&price[lte]=10"

    for us this problem is coming only in query btns and not on alias routes bcoz if the query is made using query btns then after that V also need to append pagination on it

*/
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












































































