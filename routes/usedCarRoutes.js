
// PUG

const express = require("express");
const usedCarsController = require("../controllers/usedCarsController");
const authController = require('../controllers/authController');

const router = express.Router();

/*
    tour = car
*/

router.get("/usedCars", usedCarsController.getOverview); 
router.get("/api/v1/users/login", usedCarsController.getLoginForm);     
router.get("/car", usedCarsController.getCar);
router.get("/usedCarDeatils/:name", usedCarsController.getCarDetails);
router.get("/search/usedCars/:bar", usedCarsController.getQueryUsedCars);

// router.get()

module.exports = router;












































































