const mongoose = require('mongoose');

const slugify = require('slugify');

//const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    ////////Defining schema using MONgoose
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equal then 40 characters'],
      minlength: [10, 'A Tour name must have more or equal than 10 characters'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A Tour must have duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'Tour must have a group-size'],
    },
    difficulty: {
      type: String,
      required: [true, 'Tour must have a level of difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium or difficult',
      },
    },

    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'RAting must be more than 1,0'],
      max: [5, 'Rating must be less than 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          ////This is only gonna work in post nit in update.
          ///ONly works while new document is created.
          return val < this.price; //100<200
        },
        message: 'Discount price ({VALUE}) should be correct!',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A Tour Must have summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A Tour must have acover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    }, //Mongo will parse all types of fromats in dates
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
////////////////////////////////SCHEMA ENDED////////////////////////////

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

///////DOCUMNET MIDDLEWARE : runs before the save command and .create() command
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.post('save', function(doc, next) {
//   console.log(doc);
//   next();
// });
///Query MIDDLEWare
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`);

  next();
});

//Aggregation middleware//////
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({
    $match: { secretTour: { $ne: true } },
  });
  console.log(this.pipeline());
  next();
});

/////AGGREgation middleware///////////////

const Tour = mongoose.model('Tour', tourSchema); //////IT IS a schema model.

module.exports = Tour;
