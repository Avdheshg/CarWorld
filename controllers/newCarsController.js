
// getting the model
const NewCars = require('./../models/newCarsModel');
const url = require("url");
const overviewQueryCars = require("../utils/overviewQueryCars");

// TOP RATED
// send totalCars along with the request to next MW
exports.topRatedCars = (req, res, next) => {
    console.log("*** newCarsCOntroller.js :: topRatedCars ***");
    
    req.query.limit = "5";
    req.query.sort = "-ratings";
    res.locals.aliasRoues = true;
    next();
}

// TOP EFFICIENT
exports.topEfficientCars = (req, res, next) => {
    console.log("*** newCarsCOntroller.js :: topEfficientCars ***");
    
    req.query.limit = "5";
    req.query.sort = "-mileage";
    res.locals.aliasRoues = true;
    next();
}

// TOP POWERFUL
exports.topPowerfulCars = (req, res, next) => {
    console.log("*** newCarsCOntroller.js :: topPowerfulCars ***");
    
    req.query.limit = "5";
    req.query.sort = "-engine";
    res.locals.aliasRoues = true;
    next();
}


exports.getAllCars = async (req, res) => {  
    console.log("*** newCarsCOntroller.js :: getAllCars ***");

    const tempOptions = await overviewQueryCars.queryCars(req, res, NewCars);

    res.status(200).render("overview", {
        title: "New Cars",
        length: tempOptions.length,
        paginateURL: tempOptions.paginateURL,
        paginationBtnCount: tempOptions.paginationBtnCount,
        paginationActiveBtn: tempOptions.paginationActiveBtn,
        isOverviewPage: tempOptions.isOverviewPage,
        imageURL: `/img/cars/`,
        newCarDetails: true,
        cars: tempOptions.cars
    });
    
};
   
exports.getACar = async (req, res) => {
    console.log("*** newCarsCOntroller.js :: getACar ***");

    const tempOptions = await overviewQueryCars.getCarDetails(req, res, NewCars);

    res.status(200).render("car", { 
        title: tempOptions.title,
        car: tempOptions.car,
        imageURL: `/img/cars/`,
        newCarDetails: true,
        isCarDetailsPage: tempOptions.isCarDetailsPage
    })

}



   



































































