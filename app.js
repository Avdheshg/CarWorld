
const path = require("path");
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const morgan = require('morgan')
// For getting the cookie available in the "res"
const NewCars = require('./models/newCarsModel');
const cookieParser = require("cookie-parser");

// Importing the Routers
const newCarsRouter = require('./routes/newCarsRoutes');
const usedCarsRouter = require('./routes/usedCarRoutes');
const userRouter = require("./routes/userRoutes");
const viewRouter = require("./routes/viewRoutes");
const bookingRouter = require('./routes/bookingRoutes');
// const asd = require('./dev-data/data/import-dev-data');

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

console.log("*** app.js  ***");

app.use((req, res, next) => {
    res.locals.homeRoute = "newCars"; 
    next();
})
// Mounting the Routers
app.use("/newCars", newCarsRouter); 
app.use((req, res, next) => {
    res.locals.homeRoute = "usedCars"; 
    next();
})
app.use("/usedCars", usedCarsRouter);   

app.use("/bookings", bookingRouter);           
   
// router for users   
app.use("/api/v1/users", userRouter);       

// ===========    
const stripe = require('stripe')('sk_test_tR3PYbcVNZZ796tH88S4VQ2u');

app.get('/order/success/:car', async (req, res) => {  
  res.status(200).sendFile(`${__dirname}/paymentSuccess.html`);
});
// ===========

// at home route, sending the Index file
app.use("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/index.html"));
}); 

module.exports = app;  

// const str = "/q7";
// console.log(str.includes("brand"));


// app -> Routes -> Controllers
// 4242 4242 4242 4242

 





































































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