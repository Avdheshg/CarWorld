
const express = require('express');

const bookingController = require('./../controllers/bookingController');
const authController = require('./../controllers/authController'); 

const router = express.Router();


console.log("*** bookingRoutes.js ::  ***");
  
router.get("/checkout-session/:carID",  authController.protect, bookingController.getCheckoutSession);

module.exports = router;





    






 









