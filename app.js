const express = require('express');

const morgan = require(`morgan`);
const app = express();
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const AppError = require('./utils/appError');

const globalErrorHandler = require('./controllers/errorController');
///////////////////////////////////////1. MIDDLEWARE/////////////////////////////////////
console.log(process.env.NODE_ENV);

if (process.env.NODE_ENV === 'development') {
  ////////for logging module
  app.use(morgan('dev'));
}
app.use(express.json());

app.use(express.static(`${__dirname}/public`)); ///only works for static files.

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// app.get('/', (req, res) => {
//   res.status(200).json({ message: 'Herro from server', app: 'Natours' });
// });
// app.post('/',(req,res)=>{
//     res.send(`You can post to this input.... `);
// })

// app.get('/api/v1/tours', getALLTours);
// app.get(`/api/v1/tours/:id`, getTour);
// app.post('/api/v1/tours', createTour);
// app.delete('/api/v1/tours/:id', deleteTour);
// app.patch('/api/v1/tours/:id', updateTour);
// This all will work same as written below by  .route method.

//////////////////////////////////////////////ROUTES/////////////////////////////////

app.use('/api/v1/tours', tourRouter); /////This is mounting of routers

app.use('/api/v1/users', userRouter);

//////////////////////////////////////////////////////////////////////////////////////
app.all('*', (req, res, next) => {
  /////ye different url ke liye h

  // const err = new Error(`Can't find  ${req.originalUrl} on this server`);
  // err.status = 'fail';
  // err.statusCode = 404;
  next(new AppError(`Can't find  ${req.originalUrl} on this server`, 404)); //// agar next me argument h, then it is automatically an error.
});

//////////////////////Global HAndler /////////////////////////////

app.use(globalErrorHandler);

module.exports = app;
