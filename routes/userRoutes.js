 
const express = require("express");
const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");

const router = express.Router(); 

console.log("*** userRoutes.js  ***");
    
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

// ===========         Forgot Password     =============
router.get("/forgotPassword", (req, res) => {     
  res.status(200).render("forgotPassword", {title: "Forgot Password"});
})

router.post("/forgotPassword", authController.forgotPassword);


router.patch("/resetPassword/:token", authController.resetPassword);

router
  .route("/")
  .get(userController.getAllUsers)

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;

  