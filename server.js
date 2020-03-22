const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

//console.log(process.env);
app.listen(port, () => {
  console.log(`APP runnning on port ${port}.....`);
});
