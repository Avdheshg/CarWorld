const newCars = require("../models/newCarsModel");

// Overview
exports.getOverview = async (req, res) => {

    const cars = await newCars.find();

    res.status(200).render("overview", {
        cars: cars
    });
}

// Tour
exports.getTour = (req, res) => {
    res.status(200).render('tour', {
        title: 'The Forest Hiker Tour'
    })
}

// Login
exports.getLoginForm = (req, res) => {
    res.status(200).render("login", {
        title: "Log In"
    });
}



