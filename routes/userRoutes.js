 
const express = require("express");
const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");

const router = express.Router(); 

console.log("*** userRoutes.js  ***");
    
// ===========         SIGNUP    =============
router.get("/signup", (req, res) => {
  console.log("*** ViewsController.js :: getSignupFrom ***");
  // deliver the login page
  res.status(200).render("signup", {
      title: "Signup"
  });
});
router.post('/signup', authController.signup);

// ===========         LOGIN    =============
router.get("/login", (req, res) => {     
  res.status(200).render("login", {title: "Login"});
})
router.post('/login', authController.login);

// ===========         LOGOUT    =============
router.get('/logout', authController.logout);

// ===========         Forgot Password     =============
router.get("/forgotPassword", (req, res) => {     
  res.status(200).render("forgotPassword", {title: "Forgot Password"});
})

router.post("/forgotPassword", authController.forgotPassword);

// ===========         Password Reset      =======================
router.get("/resetPassword/:token", (req, res) => {     
  res.status(200).render("resetPassword", {title: "Reset Password", resetToken: req.params.token});
});

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

  

