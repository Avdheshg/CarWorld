const path = require("path");
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
// For getting the cookie available in the "res"
const cookieParser = require("cookie-parser");
const NewCars = require('./models/newCarsModel');

const app = express();

app.set('view engine', 'pug');
// using "path" for relative path
app.set("views", path.join(__dirname, "views"));
 
// for CSS files
// app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
    console.log(req.cookies);
    next();
})

// requiring the Error class 
// const AppError = require('./utils/appError'); 
const globalErrorHandler = require('./controllers/errorController');

const newCarsRouter = require('./routes/newCarsRoutes');
const usedCarsRouter = require('./routes/usedCarRoutes');
const userRouter = require('./routes/userRoutes');
const viewRouter = require('./routes/viewRoutes');
const bookingRouter = require('./routes/bookingRoutes');

// ===== Setting the PUG    ==============================

// Mounting the Routers
app.use("/", viewRouter); 
app.use("/", usedCarsRouter); 
app.use("/", (req, res) => {
    // res.status(200).render("index", {
    //     message: "Hello"
    // }) 
    res.sendFile(path.join(__dirname, "/views/index.html"))
}); 

// Stripe
// app.use("/api/v1/bookings", bookingRouter)
app.use("/", bookingRouter)


module.exports = app;


 // app -> Routes -> Controllers




      















































































/*
    
    {
        "brand": "",
        "name": "",
        "rating": 4.2,
        "bodyType": "hatchback",
        "price": 4,
        "mileage": 15, 
        "engine": 1200,
        "transmission": "",
        "fuelType": "",
        "seatingCapacity": 5,
        "summary": "",
        "good": [
            ""
        ],
        "bad": [
            ""
        ],
        "images": [

        ]
    },


*/