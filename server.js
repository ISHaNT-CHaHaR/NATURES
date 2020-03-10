const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');

const port =3000;



//console.log(process.env);
app.listen(port, () => {
  console.log(`APP runnning on port ${port}.....`);
});
