const User = require("./../models/userModel");
const jwt = require("jsonwebtoken");
// for making any function return the promise
// const util = require('util');
const { promisify } = require("util");
const sendEmail = require("./../utils/email");
const crypto = require('crypto');


// function for creating a new token
const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// create and sending token and cookie
const createSendToken = (user, statusCode, res) => {
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
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      // passwordChangedAt: req.body.passwordChangedAt
    });

    // // creating a token
    // // const token = signToken(newUser._id);
    // const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN});

    // // Cookie
    // const cookieOptions = {
    //   expires: new Date(
    //     Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    //   ),
    //   secure: true,
    //   httpOnly: true
    // };
    // // if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  
    // res.cookie('jwt', token, cookieOptions);
    
    // // Remove password from output
    // newUser.password = undefined;

    // res.status(201).json({
    //   status: "success",
    //   token, // sending the Token
    //   data: {
    //     user: newUser, 
    //   },
    // });

    createSendToken(newUser, 201, res);
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

//  ---------- Login ---------------
exports.login = async (req, res, next) => {
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
 
    // 3. If everything ok, generate and send token to the Client
    // const token = signToken(user._id);
 
    // res.status(200).json({
    //   status: "success",
    //   token,
    // });
    createSendToken(user, 200, res);

  } catch (err) {
    res.status(401).json({ 
      status: "fail",
      message: err,
    });
  }
};

// ---------- Protect ---------------       for protecting the routes
exports.protect = async (req, res, next) => {
  // 1. Getting the token and checking if it exists
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    // here means, authorization headers exists
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    // here means, authorization headers doesn't exists so checking if the cookie exists or not in the 
    token = req.cookies.jwt;  
  }
  // console.log(token);

  // else if (req.cookies.jwt) {
  //   token = req.cookies.jwt;
  // }

  if (!token) {
    return res.status(401).json({
      // unauthorized
      status: "fail",
      message: "you are not logged in. Please login to get access",
    });
  }

  // // 2. Verifying the token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  /*                          1                      2 
    1 => promisifying the verify function
    2 => calling the verify function which will return a promise after calling
  */
  // console.log(decoded);  
     
  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  // console.log("currentUser", currentUser);
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

  next();
}; 

// ---------- IsLoggedIn ---------------      Only for rendered pages, no errors!
exports.isLoggedIn = async (req, res, next) => {
  
  // check if the cookie exists
  if (req.cookies.jwt) {
    // 1. Verify the token
    const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);

    // 2. check if user still exists
    const currentUser = await User.findById(decoded.id);
    // console.log("currentUser", currentUser);
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

  // here means, V have no cookie
  next();
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: "fail",
        message: "You are not allowed to perform this action",
      });
    }

    next();
  };
};

exports.forgotPassword = async (req, res, next) => {
  console.log("--- Running ----");
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
  // console.log();

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message
    });

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

exports.resetPassword = async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  console.log("---- running ------");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return res.status(400).json({
      status: "fail", 
      message: "Token is invalid or has expired",
    });
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // // 3) Update changedPasswordAt property for the user => implemented using the presave MW

  // // 4) Log the user in, send JWT
  const token = signToken(user._id);
 
  res.status(200).json({
    status: "success",
    token,
  });
}




/* 

 */









// ******************************************************************************************
// ******************************************************************************************
// ******************************************************************************************
// ******************************************************************************************
// ******************************************************************************************















