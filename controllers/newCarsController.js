
// getting the model
const NewCars = require('./../models/newCarsModel');
const AppError = require('./../utils/appError');  

/*
    { page: '1', limit: '10', price: { gte: '60' } }
    { price: { '$gte': '60' } }

    // in MDB V will write
    {difficulty: 'easy', duration: { $gte:5 }}

    // In postman and log
    postman = getAll?&limit=10&price[gte]=60
    log = {limit: '10', price: { gte: '60' } }

    Difference bw MDB and logged 
    {difficulty: 'easy', duration: { $gte:5 }}
    {difficulty: 'easy', duration: { gte: '5' }}

    I need to create 
    { page: '1', limit: '10', price: { gte: '60' } }
*/
exports.aliasUnder5Lacks = (req, res, next) => {
    // req.query.limit = '5';
    // req.query.price = "lte: 65.7";
    console.log("price==", req.query.price);
    req.query.sort = 'price';
    req.query.fields = 'name,brand,price,rating';    // for sending these fields only to the user
    next();
}

exports.getAllCars = async (req, res) => {
    try {
        console.log("complete query: ", req.query);

        // ==== Build the query: Here V will refractor the query with all options    ====
        // 1A. Filtering
        // Building the query obj and removing the advanced features from it
        const queryObj = { ...req.query };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el]);

        // 1B. Advanced filtering: gte
        let queryString = JSON.stringify(queryObj);
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        console.log(JSON.parse(queryString));

        let query = NewCars.find(JSON.parse(queryString));

        // 2. Sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            // console.log(sortBy);
            // this will handle the when 2 or more have same res but V wants to even sort them also
            query = query.sort(req.query.sort);
        }

        // Field Limiting
        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields);
        }

        // 4. Pagination
        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 100;
        const skip = (page - 1) * limit;

        query = query.skip(skip).limit(limit);

        // if the user requested a page which doesn't exists
        if (req.query.page) {
            const numCars = await NewCars.countDocuments();
            if (skip >= numCars) throw new Error('This page does not exists');
        }
        
        // ==== Execute the query   ====
        const cars = await query;

         // ==== Send Response   ====
        res.status(200).json({
            status: 'success',
            length: cars.length,
            data: {
                cars
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
    
};

exports.getACar = async (req, res) => {
    // console.log(req.params.id);
    const car = await NewCars.findById(req.params.id);

    try {

        // If id is valid by syntax but not present in DB
        if (!car) {
            return next(new AppError('No tour found with that ID', 404));
        }
    
        res.status(200).json({
            status: 'success',
            data: {
                car
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: 'Cannot find the car with given id '
        })
    }
}

exports.deleteCar = async (req, res) => {
    try {
      await Tour.findByIdAndDelete(req.params.id);
  
      res.status(204).json({
        status: 'success',
        data: null
      });
    } catch (err) {
      res.status(404).json({
        status: 'fail',
        message: err
      });
    }
};













































































