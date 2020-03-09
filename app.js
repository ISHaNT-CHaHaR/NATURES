const express = require('express');
const morgan = require(`morgan`);
const app = express();
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
///////////////////////////////////////1. MIDDLEWARE/////////////////////////////////////

app.use(morgan('dev'));

app.use(express.json());

app.use(express.static(`${__dirname}/public`)); ///only works for static files.

app.use((req, res, next) => {
  console.log(`Hello from middle of nowhere `);
  next();
});

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

////////////////////////////////////4. START SERVER////////////////////////

module.exports = app;
