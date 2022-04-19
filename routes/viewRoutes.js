// PUG

const express = require("express");
const viewsController = require("../controllers/viewsController");
const authController = require('../controllers/authController');

const router = express.Router();

/*
    tour = car
*/

router.get("/newCars", viewsController.getOverview); 
router.get("/api/v1/users/login", viewsController.getLoginForm);     
router.get("/car", viewsController.getCar);
router.get("/car/:name", viewsController.getCarDetails);
router.get("/search/:bar", viewsController.getQueryCars);
// router.get()

module.exports = router;



























