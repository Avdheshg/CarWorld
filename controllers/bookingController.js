
const stripeSecretKey = "sk_test_51KpmUbSBCMWBXDgKJ1XQjEryrT1NARchJSMnXkIsLuzPIrblmpbCejYFfwVfcLDMxFuUEkeXHdL54FTQsHXO8gBp00SlfyTtK1";

const stripe = require("stripe")(stripeSecretKey);
const Car = require("../models/newCarsModel");


exports.getCheckoutSession = async (req, res, next) => {
    console.log("*** bookingController.js :: getCheckoutSession ***");
    
    try {
        // 1) Get the currently booked Car
        const car = await Car.findById(req.params.carID);
        console.log("image url", `${req.protocol}://${req.get('host')}/img/cars/${car.name}-1.jpg`);
      
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
};


/* 
  Image not loading 
  amount
*/









 






