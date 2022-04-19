
// For PUG
const Car = require("../models/usedCarModel") 

exports.getOverview = async (req, res, next) => {

    // 1. Get the tour data from the collection. For this V need the carModel 
    const cars = await Car.find(); 
    console.log("USED CARS*******************", cars)

    // const queryCars =   

    // 2. Build template

    // 3. Render that template using car data from step 1
    // res.status(200).render("overview", {
    res.status(200).render("overviewUsedCars", {   
        title: "All Cars", 
        cars: cars
    });
    // res.status(200).json({
    //     message: "Hello"
    // })  
    
};
 
exports.getCar = (req, res) => {
    
    res.status(200).render("base", { 
        car: "BMW",
        user: "Jonas"
    });
}
    
exports.getCarDetails= async (req, res, next) => {    
    console.log("******************")
    const car = await Car.findOne({name: req.params.name});
    res.status(200).render("usedCar", {
        title: `${car.name}`,
        car 
    })
}

exports.getLoginForm = (req, res) => {
    res.status(200).render("login", {
        title: "Log into your account"
    });
}

exports.getQueryUsedCars = async (req, res) => {
    const searchBar = req.params.bar;
    console.log(searchBar);

    let cars = "";

    if (searchBar === "under-10") {
        cars = await Car.find({price: {$lt: 10}});
    } else if (searchBar === "under-20") {
        // cars = await Car.find({price: {$lt: 20} });  
        cars = await Car.where("price").lt("20").where("price").gt("10");
    } else if (searchBar === "under-30") {
        cars = await Car.where("price").lt("30").where("price").gt("20");
    } else if (searchBar === "under-40") {
        cars = await Car.where("price").lt("40").where("price").gt("30");
    } else if (searchBar === "under-50") {
        cars = await Car.where("price").lt("50").where("price").gt("40"); 
    }  else if (searchBar === "under-50-plus") {
        cars = await Car.where("price").gt("50");
    }
    
    // res.status(200).render("./")
    res.status(200).render("queryUsedCar", {
        title: "All Cars", 
        cars: cars
    });

    console.log(cars);
}































