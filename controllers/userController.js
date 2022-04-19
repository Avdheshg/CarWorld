/*
    In Controller.js V define the route handler functions
*/
const User = require('./../models/userModel');

exports.getAllUsers = async (req, res, next) => {
    // res.status(500).json({
    //     status: 'error',
    //     message: 'This route is not yet defined'
    // })

    const users = await User.find();

        // ==== Send Response   ====
    res.status(200).json({
        status: 'success',
        length: users.length,
        data: {
            users
        }
    });
};
// implement the /getAllUsers route
// 500: internal server error

exports.getUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    })
};

exports.createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    })
};

exports.updateUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    })
};

exports.deleteUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    })
};

