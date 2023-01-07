const newCars = require("../models/newCarsModel");


// Overview
exports.getOverview = async (req, res) => {
    console.log("*** ViewsController.js :: getOverview ***");

    const cars = await newCars.find();

    res.status(200).render("overview", {
        cars: cars
    });
}

// Tour
exports.getTour = (req, res) => {
    console.log("*** ViewsController.js :: get a Tour ***");
    res.status(200).render('tour', {
        title: 'The Forest Hiker Tour'
    })
}

// Login
exports.getLoginForm = (req, res) => {
    console.log("*** ViewsController.js :: getLoginFrom ***");
    // deliver the login page
    res.status(200).render("login", {
        title: "Log In"
    });
}



