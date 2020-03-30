///////////////////////////////Global HAndler///////////////////////
const AppError = require('./../utils/appError');

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    //////for all the operational errors
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    // for all the rogramming error, we don't want to leak details.

    //1. Log Error
    console.log('Error ', err);

    //2. Send generic message.
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!'
    });
  }
};
/////////////////////////HAndling invalid IDS////////////////////////////////
const handleCastErrorDB = err => {
  const message = `Invalid ${err.path} : ${err.value}`;
  return new AppError(message, 400);
};

//////////////////////////HAndling duplucations /////////////////////////////

const handleDuplicateFieldsDB = err => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  console.log(value);
  const message = `Duplicate Field value: ${value} Please use another value`;
  return new AppError(message, 400);
};

/////////////////////////////////VAlidations error//////////////////////////////
const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);

  const message = `Invalid input Data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};
/////////////////////////////////////////////////////////////////////////////////////

module.exports = (err, req, res, next) => {
  //Error function hmesha 4 arguments leta h in express.
  err.statusCode = err.statusCode || 500;

  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV.trim() === 'production') {
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    let error = { ...err };

    console.log(process.env.NODE_ENV);

    if (error.name === 'CastError') error = handleCastErrorDB(error);

    if (error.code === 11000) error = handleDuplicateFieldsDB(error);

    if (error.name === 'ValidationError') {
      error = handleValidationErrorDB(error);
    }
    sendErrorProd(error, res);
  }
};
