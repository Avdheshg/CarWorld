
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
const authController = require("./controllers/authController");
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
//   res.status(200).render("paymentSuccess", {
//     carName: req.params.car
//   });
});
// ===========

// at home route, sending the Index file
app.use("/", authController.isLoggedIn, (req, res) => {
    // console.log("app.js, / req.cookies", req.cookies);
    let isLoggedIn = false;
    if (res.locals.user !== undefined) {
        isLoggedIn = true;
    }
    res.status(200).render("index", {
        isLoggedIn
    })
}); 

module.exports = app;  



 


















/* 

Brand Names
    common
        BMW     
        Mercedes         
        Maruti Suzuki

    Used Cars
        Renault     
        Toyota             
        MG      
        Skoda           
        Jaguar      
        Lexus

    New Cars
        Audi        
        Hyundai            
        Tata        
        Mahindra        
        Kia

Car Fields
    Common:
        price
        bodyType
        mileage
        fuelType

    NewCars
        rating
        engine
        transmission
        seatingCapacity

    UsedCars
        travel
        city
        emi


*/














