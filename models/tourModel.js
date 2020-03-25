const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema(
  {
    ////////Defining schema using MONgoose
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true
    },
    duration: {
      type: Number,
      required: [true, 'A Tour must have duration']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'Tour must have a group-size']
    },
    difficulty: {
      type: String,
      required: [true, 'Tour must have a level of difficulty']
    },

    ratingsAverage: {
      type: Number,
      default: 4.5
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price']
    },
    priceDiscount: Number,
    summary: {
      type: String,
      trim: true,
      required: [true, 'A Tour Must have summary']
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, 'A Tour must have acover image']
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now()
    },
    startDates: [Date] //Mongo will parse all types of fromats in dates
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);
////////////////////////////////SCHEMA ENDED////////////////////////////

tourSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7;
});

const Tour = mongoose.model('Tour', tourSchema); //////IT IS a schema model.

module.exports = Tour;
