const User = require("./../models/userModel");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const sendEmail = require("./../utils/email");
const crypto = require('crypto');


// function for creating a new token
const signToken = (id) => {
  console.log("*** authController.js :: signToken ***");

  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// create and sending token and cookie
const createSendToken = (user, statusCode, res) => {
  console.log("*** authController.js :: createSendToken ***");

  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };
  // if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',  
    token,
    data: {
      user
    }
  });
}

//  ---------- Signup ---------------
exports.signup = async (req, res, next) => {
  console.log("*** authController.js :: signup ***");

  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      // passwordChangedAt: req.body.passwordChangedAt
    }); 

    createSendToken(newUser, 201, res);

  } catch (err) {   
    if (err.name === "ValidationError") {
      err = "Passwords are not matching";
      console.log(err);                                       
      // err = err.name;
    }
    console.log(err);                                       
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

//  ---------- Login ---------------
exports.login = async (req, res, next) => {
  console.log("*** authController.js :: login ***");

  try {
    // object restructuring
    const { email, password } = req.body;
 
    // 1. Check if the email and password exists(provided by the user)
    if (!email || !password) {
      res.status(400).json({
        status: "fail",
        message: "Please provide email and password",
      });
    }
 
    // 2. Check if the user exists and pass is correct
    const user = await User.findOne({ email: email }).select("+password");
 
    // if there is no user or pass is incorrect
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        status: "fail",
        message: "Incorrect email or pass",
      });
    }
 
    console.log(user);   
    
    createSendToken(user, 200, res);

  } catch (err) {
    res.status(401).json({ 
      status: "fail",
      message: err,
    });
  }
};

// ---------- Logout ---------------  
exports.logout = (req, res) => {
  console.log("*** authController.js :: logout ***");

  // res.cookie('jwt', 'loggedout', {
  res.cookie('jwt', '', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({ status: 'success' });
};

// ---------- Protect ---------------       for protecting the routes
exports.protect = async (req, res, next) => {
  console.log("*** authController.js :: protect ***");

  // for home restricted route
  // let restrictedHomeCar = undefined, hoemRestrictedBrand = undefined;
  let restrictedHomeRoute= undefined;
    
  // 1. Getting the token and checking if it exists
  try {
      let token;
      if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
      } else if (req.cookies.jwt) {
        token = req.cookies.jwt;                                                
      }
                                                                                                    
      if (!token) {
        throw "No token exists"
      }

      // 2. Verifying the token
      const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
      
      // 3) Check if user still exists
      const currentUser = await User.findById(decoded.id);
      
      if (!currentUser) {
        return res.status(401).json({
          status: "fail",
          message: "The user belonging to this token does no longer exist.",
        });
      }
    
      // 4) Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {    
        return res.status(401).json({
          status: "fail",
          message: "User recently changed password! Please log in again.",  
        });     
      }

      // Here means, user is logged in
      res.locals.user = currentUser;    // sending this to change the login and signup buttons into user btns
      req.user = currentUser;

  } catch (err) {
    console.log("authController, req.locals", res.locals);

    if (req.query.brand !== undefined) {
      restrictedHomeRoute = `brand=${req.query.brand}`;
    }
    if (req.params.carName !== undefined) {   
      restrictedHomeRoute = `${req.params.carName}`;      
    }
      console.log("protect MW error and no token present, so sending the Login Form. Error => ", err);
      return res.status(200).render("login", {
        title: "Login", 
        restrictedHomeRoute, 
        homeRoute: res.locals.homeRoute
      });     
  }  
      
  // console.log("protect MW, and calling the next MW");
  next();
};      

// ---------- IsLoggedIn ---------------      Only for rendered pages, no errors!
// We have defined this new middleware only for render pages and it is not in relation with the  back end. We will use this middleware only for checking if the user is logged in or not in case of rendering the pug templates
exports.isLoggedIn = async (req, res, next) => {
  console.log("*** authController.js :: isLoggedIn ***");

  try {
    // check if the cookie exists
    if (req.cookies.jwt) {    
      // 1. Verify the token   
      
      if (req.cookies.jwt === "") {
        throw "New token";
      }

      const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);

      // 2. check if user still exists
      const currentUser = await User.findById(decoded.id);
      
      if (!currentUser) {
        return next();
      }

      // 3. Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(); 
      }
      
      // Here means, user is logged in
      res.locals.user = currentUser;
      
      return next();
    } 
  } catch (err) {
    console.log("------------ error in JWT vaerify  --------", err);
    return next();    // moving to the next MW which means that there is not logged in user
  }

  // here means, V have no cookie
  next();
};


exports.forgotPassword = async (req, res, next) => {
  console.log("*** authController.js :: forgotPassword ***");
  
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).json({
      status: "fail",
      message: "There is no user with email address.",
    });
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false});
  
  // 3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? click the given button and submit your new password and passwordConfirm.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail(
      {
        email: user.email,
        subject: 'Your password reset token (valid for 10 min)',   
        message,
        resetToken      
      }, req);

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!'
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    console.log(err);

    return res.status(500).json({
      status: "fail",
      message: "There was an error sending the email. Try again later!",
    });
  }
};

// ===========         Password Reset      =======================
/* 
Algorithm to implement reset password function 
    1. Get the user based on the token
    2. We will set the new password only when if the token has not expired and there is a user available for this token in the database
    3. Update the changedPasswordAt property for the user
    4. Finally, log the user in ie send the jwt token to the client
*/
exports.resetPassword = async (req, res, next) => {
  console.log("*** authController.js :: resetPassword  ***");
           
  // 1. Get the user based on the token
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({passwordResetToken: hashedToken, passwordResetExpires: {$gt: Date.now()}});
  
  // 2. If user is present and the token is stil valid(not expired), set the password
  if (!user) {   
    return res.status(400).json({
      status: "fail",      
      message: "Token is invalid or has expired"        
    })
  }
      
  // if the user exists
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  // 3. update the changedPasswordAt property for the curr user => presave MW

  // 4. Log the user in and send the JWT
  // const token = jwt.sign({id: user._id}, "this is the secret of jwt");

  res.status(200).json({
    status: "success",
    // token
  })

}
 











