
const NewCars = require('../models/newCarsModel');
const UsedCars = require('../models/usedCarModel');
// const Car = require("../models/usedCarModel") 

exports.queryCars = async (req, res, modelName) => {
    console.log("*** overviewQueryCars.js :: queryCars ***");
    try {
        // console.log("*** complete query: *** ", req.query);
            
        const queryObj = { ...req.query };             
    
        // 1A. Filtering   
        const excludedFields = ["sort", "limit", "page", "fields"];
        excludedFields.forEach(curr => delete queryObj[curr]);
    
        // 1B. Advanced filtering: gte    
        let queryString = JSON.stringify(queryObj);
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);  
    
        let query = modelName.find(JSON.parse(queryString));
    
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
        // console.log("inside overviewQueryCars cars", cars);
    
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

        const tempOptions = {
            length: cars.length, 
            paginateURL,
            paginationBtnCount,
            paginationActiveBtn,
            isOverviewPage: true,
            cars
        }

        // console.log("inside overviewQueryCars cars, tempOptions", tempOptions);

        return tempOptions;
        
    } catch (err) {  
        console.log(err);     
        res.status(404).json({
            status: 'fail',
            message: err
        });  
    }
}

exports.getCarDetails = async (req, res, modelName) => {
    console.log("*** overviewQueryCars.js :: getCarDetails ***");
    
    try {
        const car = await modelName.findOne({name: req.params.carName});
        // console.log("car", car);

        // If id is valid by syntax but not present in DB
        if (!car) {
            return res.status(404).json({  
                status: 'fail',
                message: 'Cannot find the car with given Name '
            })
        }

        // making first letter capital
        let title = car.name;
        title = title.charAt(0).toUpperCase() + title.slice(1);
        
        const tempOptions = {
            title,
            car,
            isCarDetailsPage: true
        }

        return tempOptions;
        
    } catch (err) {
        console.log("catch of getACar", err);
        res.status(404).json({
            status: 'fail',
            message: 'Cannot find the car with given Name '
        })
    }
}

exports.generateSession = async (req, res, modelName) => {
    console.log("*** overviewQueryCars.js :: generateSession ***");
    
    try {
        // 1) Get the currently booked Car
        const car = await modelName.findById(req.params.carID);
        console.log("car", car);
      
        // 2) Create checkout session
        if (car.price > 10) {  
            car.price = 99999999;
        } else {
          car.price = car.price * 10000000;
        }
        const sendCar = `${car.brand} ${car.name}`;
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          success_url: `${req.protocol}://${req.get('host')}/order/success/car=${car.name}`,   
          cancel_url: `${req.protocol}://${req.get('host')}/`,
          customer_email: `${req.user.email}`,
          client_reference_id: req.params.carID,    
          line_items: [
            {   
              name: `${car.brand}: ${car.name}`,
              description: `${car.summary}`,
              images: [
                "https://github.com/Avdheshg/CarWorld/blob/master/public/img/cars/altroz-2.jpg"
              ],
              amount: car.price ,
              currency: 'inr',              
              quantity: 1
            }  
          ]
        });       

        const tempOptions = {
            session
        }
          
        // 3) Create session as response
        // res.status(200).json({
        //   status: 'success',          
        // });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            status: "fail",
            err
        })
    }
};

// module.exports = queryCars;











