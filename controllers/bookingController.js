
const stripeSecretKey = "sk_test_51KpmUbSBCMWBXDgKJ1XQjEryrT1NARchJSMnXkIsLuzPIrblmpbCejYFfwVfcLDMxFuUEkeXHdL54FTQsHXO8gBp00SlfyTtK1";

const stripe = require("stripe")(stripeSecretKey);
const NewCars = require("../models/newCarsModel");
const UsedCars = require("../models/usedCarModel");
// const overviewQueryCars = require("../utils/overviewQueryCars");


exports.getCheckoutSession = async (req, res, next) => {
    console.log("*** bookingController.js :: getCheckoutSession ***");
    
    try {
        // 1) Get the currently booked Car
        console.log("bookingController, req.params", req.params);

        let car;
        if (req.params.modelName === "NewCars") {
          car = await NewCars.findById(req.params.carId); 
        } else {
          car = await UsedCars.findById(req.params.carId); 
        }

        console.log("car", car);
      
        // 2) Create checkout session
        if (car.price > 10) {     
            car.price = 99999999;
        } else {     
          car.price = car.price * 10000000;
        }

        const coverLink = car.coverLink;

        // capitalize 1st letter of carName
        let carName = car.name;
        carName = carName.charAt(0).toUpperCase() + carName.slice(1);
        console.log(carName);

        const cardDetails = "Card Number: " + "4242 4242 4242 4242"  + " Expiry: " + "Any date(future)"  + " CVV: " + "Any 3 digits"; 

        const sendCar = `${car.brand} ${carName}`;
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],      
          success_url: `${req.protocol}://${req.get('host')}/order/success/${car.name}`,   
          cancel_url: `${req.protocol}://${req.get('host')}/`,  
          customer_email: `${req.user.email}`,
          client_reference_id: req.params.carId,    
          line_items: [   
            {     
              name: `${car.brand}: ${carName}`,
              description: `${car.summary}\n` + `\n${cardDetails}`, 
              images: [ 
                `${coverLink}`,
              ],
              amount: car.price ,
              currency: 'inr',              
              quantity: 1
            }  
          ]
        });   
          
        // 3) Create session as response
        res.status(200).json({
          status: 'success',          
          session 
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            status: "fail",
            err
        })
    }

    // const tempOptions = await overviewQueryCars.generateSession(req, res, )

    // 3) Create session as response
    // res.status(200).json({
    //   status: 'success',          
    //   session: tempOptions.session
    // });
};









 















































