
// PUG

const express = require("express");
const usedCarsController = require("../controllers/usedCarsController");
const authController = require('../controllers/authController');

const router = express.Router();

router.get("/", authController.protect, usedCarsController.getAllCars); 
router.get("/:carName", authController.protect, usedCarsController.getACar);

module.exports = router;
















