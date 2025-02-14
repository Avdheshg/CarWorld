const express = require('express');
const viewsController = require("../controllers/viewsController");
const authController = require("../controllers/authController");

const router = express.Router();

console.log("*** viewRoutes.js  ***");

// router.use(authController.isLoggedIn);  

// router.get('/', viewsController.getOverview);
// router.get('/:tour', authController.protect, viewsController.getTour);
 
// login
router.get("/login", viewsController.getLoginForm);
router.get("/signup", viewsController.getSignupForm);


module.exports = router;  

