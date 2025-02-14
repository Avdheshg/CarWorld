
const User = require('./../models/userModel');

exports.getAllUsers = async (req, res, next) => {
    console.log("*** userCOntroller.js :: getAllUsers ***");
    
    const users = await User.find();
    
    res.status(200).json({
        status: 'success',
        length: users.length,
        data: {
            users
        }
    });
};

exports.getUser = (req, res) => {
    console.log("*** userCOntroller.js :: getUser ***");
    
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    })
};

exports.createUser = (req, res) => {
    console.log("*** userCOntroller.js :: createUser ***");
    
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    })
};

exports.updateUser = (req, res) => {
    console.log("*** userCOntroller.js :: updateUser ***");
    
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    })
};

exports.deleteUser = (req, res) => {
    console.log("*** userCOntroller.js :: deleteUser ***");
    
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    })
};

