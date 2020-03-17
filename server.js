const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose ////////use mongoose variable here

  ////.connect(process..env.DATABASE_LOCAL,{///////in order to connect to  ,local database
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => {
    ///// con variable returns an object
    console.log('DB Connection successful');
  });

const tourSchema = new mongoose.Schema({
  ////////Defining schema using MONgoose
  name: {
    type: String,
    required: [true, 'A tour must have a name']
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
////////////////////////////////SCHGEMA ENDED////////////////////////////

const Tour = mongoose.model('Tour', tourSchema); //////IT IS a schema model.

const testTour = new Tour({
  //////CReated document data from MONgoose model schema.
  name: 'The Forest Hiker',
  rating: 4.7,
  price: 497
});

testTour
  .save() ///////THis will save document into database.\
  .then(doc => {
    console.log(doc);
  })
  .catch(err => {
    console.log('ERROR', err);
  });
////Save will returen a promise that we can consume.

const port = process.env.PORT || 3000;

//console.log(process.env);
app.listen(port, () => {
  console.log(`APP runnning on port ${port}.....`);
});
