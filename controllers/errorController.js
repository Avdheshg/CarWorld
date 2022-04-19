
// const AppError = require('./../utils/appError');

// const handleCastErrorDB = err => {
//     const message = `Invalid ${err.path}: ${err.value}.`;
//     return new AppError(message, 400);
// }

// const sendErrorDev = (err, res) => {
//     res.status(err.statusCode).json({
//         status: err.status,
//         error: err,
//         message: err.message,
//         stack: err.stack
//     });
// }

// const sendErrorProd = (err, res) => {
//     // Operational, trusted Error: send the message to the Client
//     // checking if the current error has occurred due to user or us

//     if (err.isOperational) {
//         res.status(err.statusCode).json({
//             status: err.status,
//             message: err.message
//         });
//     } else {
//         // Programming or other unknown error: Don't send error details to the client
//         // if the error occured due to some package failure or anything not related to us

//         // 1. Log error for us
//         console.error('ERROR', err);

//         // 2. Send the message
//         res.status(500).json({
//             status: 'error',
//             message: 'Something went wrong'
//         });
//     }
// }

// module.exports = (err, req, res, next) => {

//     // console.log(err.stack);
    
//     err.statusCode = err.statusCode || 500;
//     err.status = err.status || 'error';

//     if (process.env.NODE_ENV === 'development') {
//         sendErrorDev(err, res);
//     } else if (process.env.NODE_ENV === 'production') {

//         // Making the error created by MDB "isOperational" so that the user will get a meaningful message and if V don't mark MDB errors as "isOperational" then those errors will be handled by "sendErrorProd()"'s "else" block which will send 500 for all these MDB errors
//         let error = { ...err };
        
//         if (error.name === 'CastError') {
//             error = handleCastErrorDB(error);
//         }

//         sendErrorProd(error, res);
//     }

    
// };