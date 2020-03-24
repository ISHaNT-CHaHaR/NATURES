const express = require('express');
const tourController = require('./../controllers/tourController');
///or/////
//// const {getALLTours,createTour..etc} = require('./../controllers/tourController);
////and then use them without any efforts directly/

const router = express.Router();

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getALLTours);

//router.param('id', tourController.checkId);
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
