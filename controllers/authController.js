const User = require("./../models/userModel");
const jwt = require("jsonwebtoken");
// for making any function return the promise
// const util = require('util');
const { promisify } = require("util");

// function for creating a new token
const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = async (req, res, next) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      // passwordChangedAt: req.body.passwordChangedAt
    });

    // creating a token
    // const token = signToken(newUser._id);
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN});

    res.status(201).json({
      status: "success",
      token, // sending the Token
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

// Login
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
    const token = signToken(user._id);
 
    res.status(200).json({
      status: "success",
      token,
    });
  } catch (err) {
    res.status(401).json({ 
      status: "fail",
      message: err,
    });
  }
};

// for protecting the routes
exports.protect = async (req, res, next) => {
  // 1. Getting the token and checking if it exists
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
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

// Only for rendered pages, no errors!
exports.isLoggedIn = async (req, res, next) => {
  // 1. Getting the token and checking if it exists
  let token;
  if ( req.headers.authorization && req.headers.authorization.startsWith("Bearer") ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  // console.log(token);

  if (!token) {
    return res.status(401).json({
      // unauthorized
      status: "fail",
      message: "you are not logged in. Please login to get access",
    });
  }

  // 2. Verifying the token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // console.log(decoded);

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









/* 

 */




































