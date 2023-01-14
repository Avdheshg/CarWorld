
// getting the model
const NewCars = require('./../models/newCarsModel');
const url = require("url");

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
    
    try {
        // console.log("*** complete query: *** ", req.query);
            
        const queryObj = { ...req.query };             

        // 1A. Filtering
        const excludedFields = ["sort", "limit", "page", "fields"];
        excludedFields.forEach(curr => delete queryObj[curr]);

        // 1B. Advanced filtering: gte
        let queryString = JSON.stringify(queryObj);
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);  
    
        let query = NewCars.find(JSON.parse(queryString));
  
        // Sorting
        if (req.query.sort) {  
            query = query.sort(req.query.sort);
        }       

        // ==== Execute the query   ====  
        let cars = await query;
        let totalCars = cars.length;
                
        // Pagination
        const page = req.query.page * 1 || 1;    
        const limit = req.query.limit * 1 || 9;    
        const skip = (page - 1) * limit;

        let paginationActiveBtn = page;

        query = query.skip(skip).limit(limit);
    
        // ==== Execute the query with pagination   ====  
        cars = await query;   
        console.log("cars", cars);

        // ==== Constructing pagination URL   ====
        let paginateURL = req.protocol + '://' + req.get('host') + req.originalUrl;
        // if queryString is not present      
        if (Object.keys(req.query).length === 0) {       
            paginateURL = paginateURL + "?"; 
        } else if (!req.query.page) {   
            paginateURL = paginateURL + "&";   
        } else {   
            paginateURL = paginateURL.split("page")[0];
        }
   
        let paginationBtnCount = totalCars / 9;
        if (totalCars % 9 !== 0) {
            paginationBtnCount = Math.floor(paginationBtnCount) + 1;
        } 
        // console.log("length", totalCars, "paginationBtnCount",paginationBtnCount);
        
        res.status(200).render("overview", {  
            title: "New Cars",          
            length: cars.length, 
            paginateURL,
            paginationBtnCount,
            paginationActiveBtn,
            isOverviewPage: true,
            // aliasRoutes,
            cars
        });      
    } catch (err) {  
        console.log(err);     
        res.status(404).json({
            status: 'fail',
            message: err
        });  
    }     
    
};
   
exports.getACar = async (req, res) => {
    console.log("*** newCarsCOntroller.js :: getACar ***");
    
    try {
        const car = await NewCars.findOne({name: req.params.carName});

        // If id is valid by syntax but not present in DB
        if (!car) {
            return res.status(404).json({  
                status: 'fail',
                message: 'Cannot find the car with given Name '
            })
        }
    
        res.status(200).render("car", {
            title: car.name,
            car: car,
            isCarDetailsPage: true
        })
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: 'Cannot find the car with given Name '
        })
    }
}



   

















/* 



  { _id: 63c01574c229381dd478e59f, brand: 'Tata' },
  { _id: 63c01574c229381dd478e5a4, brand: 'Mahindra' },
  { _id: 63c01574c229381dd478e5a7, brand: 'Kia' },




















*/


















































