const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  ////////Defining schema using MONgoose
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true
  },
  rating: {
    type: String,
    default: 4.5
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price']
  }
});
////////////////////////////////SCHEMA ENDED////////////////////////////

const Tour = mongoose.model('Tour', tourSchema); //////IT IS a schema model.

module.exports = Tour;
