const fs = require('fs');
const express = require('express');
const morgan = require(`morgan`);

///////////////////////////////////////1. MIDDLEWARE/////////////////////////////////////

const app = express();

app.use(express.json());

app.use(morgan('dev'));

app.use((req, res, next) => {
  console.log(`Hello from middle of nowhere `);
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toLocaleDateString();
  next();
});

// app.get('/', (req, res) => {
//   res.status(200).json({ message: 'Herro from server', app: 'Natours' });
// });
// app.post('/',(req,res)=>{
//     res.send(`You can post to this input.... `);
// })

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

//////////////////////////////////////////2. ROUTE HANDLERS///////////////////////////
const getALLTours = (req, res) => {
  ///// for getting all tours.
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours
    }
  });
};

const getTour = (req, res) => {
  //////for retrieving a single tour.
  console.log(req.params);
  const id = req.params.id * 1;
  const tour = tours.find(el => el.id === id);

  //if (id > tours.length)
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    });
  }

  res.status(200).json({
    status: 'success',

    data: {
      tour
    }
  });
};

const createTour = (req, res) => {
  ////////////////////for adding a single tour
  //console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    err => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour
        }
      });
    }
  );
};

const deleteTour = (req, res) => {
  /////Deletes a single id from json
  ////////////for deleting a tour.
  console.log(req.params);
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    });
  }
  res.status(204).json({
    status: 'success',
    data: null
  });
};

const updateTour = (req, res) => {
  ////Updates a single tour.
  ///////for updating a tour.
  console.log(req.params);
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    });
  }
  res.status(204).json({
    status: 'success',
    data: {
      tour: '<Update tour here.>'
    }
  });
};

const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined'
  });
};

const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined'
  });
};

const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not handled yet!'
  });
};

const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: ' not handle again'
  });
};

const updateUser = (req, res) => {
  res.status.json({
    status: 'error',
    message: `not handled yet!`
  });
};

// app.get('/api/v1/tours', getALLTours);
// app.get(`/api/v1/tours/:id`, getTour);
// app.post('/api/v1/tours', createTour);
// app.delete('/api/v1/tours/:id', deleteTour);
// app.patch('/api/v1/tours/:id', updateTour);
// This all will work same as written below by  .route method.

//////////////////////////////////////////////ROUTES/////////////////////////////////


const tourRouter = express.Router();

const userRouter = express.Router();

tourRouter
  .route('/')
  .get(getALLTours)
  .post(createTour);

tourRouter
  .route(`/:id`)
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

userRouter
  .route('/')
  .get(getAllUsers)
  .post(createUser);

userRouter
  .route('/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

app.use('/api/v1/tours', tourRouter);/////This is mounting of routers

app.use('/api/v1/users', userRouter);

////////////////////////////////////4. START SERVER////////////////////////

const port = 3000;
app.listen(port, () => {
  console.log(`APP runnning on port ${port}.....`);
});
