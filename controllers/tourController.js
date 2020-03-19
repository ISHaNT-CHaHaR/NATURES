//const fs = require('fs');

const Tour = require('./../models/tourModel');

//const tours = JSON.parse(
//  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
//);

//////////////////////////////////////////2. ROUTE HANDLERS///////////////////////////

// exports.checkId = (req, res, next, val) => {
//   console.log(`This is i'd ${val}`);

//   if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid ID'
//     });
//   }
//   next();
// };

// exports.checkBody = (req, res, next) => {
//   if (req.body.name == null || req.body.price == null) {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'Missing name or price'
//     });
//   }
//   next();
// };

exports.getALLTours = (req, res) => {
  ///// for getting all tours.
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime
    // results: tours.length,
    // data: {
    //   tours
    //}
  });
};

exports.getTour = (req, res) => {
  //////for retrieving a single tour.
  console.log(req.params);
  //const id = req.params.id * 1;
  // const tour = tours.find(el => el.id === id);

  // //if (id > tours.length)

  // res.status(200).json({
  //   status: 'success',

  //   data: {
  //     tour
  //   }
  // });
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent!'
    });
  }
};
////////////////////for adding a single tour
//console.log(req.body);
//   const newId = tours[tours.length - 1].id + 1;
//   const newTour = Object.assign({ id: newId }, req.body);

//   tours.push(newTour);

//   fs.writeFile(
//     `${__dirname}/dev-data/data/tours-simple.json`,
//     JSON.stringify(tours),
//     err => {
//       res.status(201).json({
//         status: 'success',
//         data: {
//           tour: newTour
//         }
//       });
//     }
//   );
// };

exports.deleteTour = (req, res) => {
  /////Deletes a single id from json
  ////////////for deleting a tour.
  console.log(req.params);

  res.status(204).json({
    status: 'success',
    data: null
  });
};

exports.updateTour = (req, res) => {
  ////Updates a single tour.
  ///////for updating a tour.
  console.log(req.params);

  res.status(204).json({
    status: 'success',
    data: {
      tour: '<Update tour here.>'
    }
  });
};
