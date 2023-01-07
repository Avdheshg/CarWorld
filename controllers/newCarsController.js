
// getting the model
const NewCars = require('./../models/newCarsModel');
const url = require("url");

// TOP RATED
exports.topRatedCars = (req, res, next) => {
    console.log("*** newCarsCOntroller.js :: topRatedCars ***");
    
    req.query.limit = "5";
    req.query.sort = "-ratings";
    next();
}

// TOP EFFICIENT
exports.topEfficientCars = (req, res, next) => {
    console.log("*** newCarsCOntroller.js :: topEfficientCars ***");
    
    req.query.limit = "5";
    req.query.sort = "-mileage";
    next();
}

// TOP POWERFUL
exports.topPowerfulCars = (req, res, next) => {
    console.log("*** newCarsCOntroller.js :: topPowerfulCars ***");
    
    req.query.limit = "5";
    req.query.sort = "-engine";
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
          console.log("queryString", JSON.parse(queryString));  
    
        let query = NewCars.find(JSON.parse(queryString));
        // console.log(req.query.sort);
  
        // Sorting
        // price, cc, mileage, capacity, rating              
        if (req.query.sort) {  
            console.log("sort present");     
            query = query.sort(req.query.sort);
        }       
          
        // Pagination
        const page = req.query.page * 1 || 1;    
        const limit = req.query.limit * 1 || 100;    
        const skip = (page - 1) * limit;
     
        

        query = query.skip(skip).limit(limit);
    
       // ==== Execute the query   ====
       const cars = await query;
        // console.log("cars ", cars);

         // ==== Send Response   ====                              
        // res.status(200).json({  
        //     length: cars.length,  
        //     // range: rangeCars,      
        //     cars: cars
        // });
        
        // For pagination
        // let replacedStr = req.url.replace("/", "/newCars");
        // console.log("Before replace replacedStr", replacedStr);                             
        // console.log("req.query.page", req.query.page);   
        // if (req.query.page) {
        //     pageIdx = replacedStr.indexOf("page");
        //     console.log("pageIdx", pageIdx);

        //     replacedStr = replacedStr.substring(0, pageIdx);

        // } else {
        //     replacedStr = replacedStr + "?";
        // }   
        // // replacedStr = replacedStr.replace("page")                                           
        // console.log("After replace replacedStr", replacedStr);
           
        // const hasQueryString = !(Object.keys(req.query).length === 0);
        
        res.status(200).render("overview", {  
            title: "New Cars",     
            isOverviewPage: true,      // for header pug template ie to show filter btns only for overview page
            length: cars.length, 
            cars: cars
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
    
    // console.log(req.params.id); 
    // const car = await NewCars.findById(req.params.id);
    
    try {
        const car = await NewCars.findOne({name: req.params.carName});
        // console.log(car);

        // If id is valid by syntax but not present in DB
        if (!car) {
            return res.status(404).json({  
                status: 'fail',
                message: 'Cannot find the car with given Name '
            })
        }
    
        res.status(200).render("car", {
            title: car.title,
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



   




































































