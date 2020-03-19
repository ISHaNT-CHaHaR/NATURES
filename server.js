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

const port = process.env.PORT || 3000;

//console.log(process.env);
app.listen(port, () => {
  console.log(`APP runnning on port ${port}.....`);
});
