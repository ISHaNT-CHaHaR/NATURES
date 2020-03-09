const express = require('express');
const tourController = require('./../controllers/tourController');
///or/////
//// const {getALLTours,createTour..etc} = require('./../controllers/tourController);
////and then use them without any efforts directly/

const router = express.Router();



router.param('id', (req,res,next,val)=>{//// IN param middleware we have 4 parameters.
  console.log(`Tour i'd is ${val}`);
  next(); 


});

router
  .route('/')
  .get(tourController.getALLTours)
  .post(tourController.createTour);

router
  .route(`/:id`)
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
