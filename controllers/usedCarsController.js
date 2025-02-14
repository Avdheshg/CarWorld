
// For PUG
const UsedCars = require("../models/usedCarModel") 
const overviewQueryCars = require("../utils/overviewQueryCars");
     

exports.getAllCars = async (req, res, next) => { 

    console.log("*** usedCarsController.js :: getAllCars ***");    

    const tempOptions = await overviewQueryCars.queryCars(req, res, UsedCars);  

    res.status(200).render("overview", {
        title: "Used Cars",
        length: tempOptions.length,
        paginateURL: tempOptions.paginateURL,
        paginationBtnCount: tempOptions.paginationBtnCount,
        paginationActiveBtn: tempOptions.paginationActiveBtn,
        isOverviewPage: tempOptions.isOverviewPage,
        imageURL: `/img/cars/used-`,
        cars: tempOptions.cars
    });
    
};
    
exports.getACar= async (req, res, next) => {   
    console.log("*** usedCarsController.js :: getACar ***");

    const tempOptions = await overviewQueryCars.getCarDetails(req, res, UsedCars);
    console.log("usedCarsController tempOptions", tempOptions)                       

    res.status(200).render("car", { 
        title: tempOptions.title,
        car: tempOptions.car,
        imageURL: `/img/cars/used-`,
        isCarDetailsPage: tempOptions.isCarDetailsPage
    })
}




























