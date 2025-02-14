const newCars = require("../models/newCarsModel");

// Overview
exports.getOverview = async (req, res) => {
    console.log("*** ViewsController.js :: getOverview ***");

    const cars = await newCars.find();

    res.status(200).render("overview", {
        cars: cars
    });
}

// Login
exports.getLoginForm = (req, res) => {
    console.log("*** ViewsController.js :: getLoginFrom ***");
    // deliver the login page
    res.status(200).render("login", {
        title: "Log In"
    });
}

// Login
exports.getSignupForm = (req, res) => {
    console.log("*** ViewsController.js :: getSignupFrom ***");
    // deliver the login page
    res.status(200).render("signup", {
        title: "Signup"
    });
}

