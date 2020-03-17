const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose ////////use mongoose variable here

  ////.connect(process..env.DATABASE_LOCAL,{///////in order to connefct to  ,local database
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => {
    ///// con variable returns an object
    console.log('DB Connection successful');
  });

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
////////////////////////////////SCHGEMA ENDED////////////////////////////

const Tour = mongoose.model('Tour', tourSchema); //////IT IS a schema model.

const port = process.env.PORT || 3000;

//console.log(process.env);
app.listen(port, () => {
  console.log(`APP runnning on port ${port}.....`);
});
