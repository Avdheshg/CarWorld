const path = require("path");
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const morgan = require('morgan')
// For getting the cookie available in the "res"
const cookieParser = require("cookie-parser");
const NewCars = require('./models/newCarsModel');

const app = express();

app.use(morgan("dev"));

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

// ===== Setting the PUG    ==============================

// Mounting the Routers
app.use("/newCars", newCarsRouter); 
app.use("/usedCars", usedCarsRouter); 
app.use("/", (req, res) => {
    // res.status(200).render("index", {
    //     message: "Hello"
    // }) 
    res.sendFile(path.join(__dirname, "/views/index.html"))
}); 

module.exports = app;


 // app -> Routes -> Controllers



/* 
    Tasks:
        what if at btn of "20 Lacks", I want the cars under 10-20Lacks, basically how to implement the "and" query in query string and extract that in app.js

        Range query ie cars between 10-15
            NewCars.find({ price: {$gte: 10, $lt: 15} });   
            How to write this in the query string 

        * Active color for the curr page in pagination

    Question    
        If we click on the button “ under 10 lacs” and if V have used the route “/newCars/search?price[lte]=10” then the image are being searched for the location “/newCars/img/cars/altroz-cover.jpg”
            app.js
                app.use("/newCars", newCarsRouter);
            newCarRoutes.js
                router
                .route("/search")
                .get(newCarsController.getQueryCars);
            

        and if we click the same button and the route is “/newCars?price[lte]=10” then we are able to fetch the images because then we are searching for the images at “/img/cars/altroz-cover.jpg ”. Why this is happening?
            app.js
                app.use("/newCars", newCarsRouter);
            newCarRoutes.js
                router
                .route("/")
                .get(newCarsController.getQueryCars);

*/
      















































































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