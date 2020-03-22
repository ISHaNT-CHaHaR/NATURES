const fs = require('fs');

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../models/tourModel');

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

///REad JSON file....
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

//IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};
/////Delete all data from collection
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log(' Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  // node dev-data/data/import-dev-data.js --import
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

console.log(process.argv);
