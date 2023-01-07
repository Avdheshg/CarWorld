
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

const app = express();    
     
// app.use(morgan("dev")); 
  
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
    // console.log("------- Inside cookie Parser");
    // console.log("in app.js req.url", req.url);     
    next();
})

// Mounting the Routers
app.use("/login", viewRouter);    
app.use("/newCars", newCarsRouter); 
app.use("/usedCars", usedCarsRouter);               
   
// router for users
app.use("/api/v1/users", userRouter);  


// at home route, sending the Index file
app.use("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/views/index.html"))
}); 

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