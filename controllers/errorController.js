module.exports = (err, req, res, next) => {
  //console.log(err.stack);
  //Error function hmesha 4 arguments leta h in express.
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  });
};
