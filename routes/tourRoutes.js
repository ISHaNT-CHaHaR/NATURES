const express = require('express');
const tourController = require('./../controllers/tourController');

const authController = require('./../controllers/authController');
///or/////
//// const {getALLTours,createTour..etc} = require('./../controllers/tourController);
////and then use them without any efforts directly/

const router = express.Router();

router.route('/tour-stats').get(tourController.getTourStats); ////aggreagation stats

router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getALLTours);

//router.param('id', tourController.checkId);
router
  .route('/')
  .get(authController.protect, tourController.getALLTours)
  .post(tourController.createTour);

router
  .route(`/:id`)
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

module.exports = router;
