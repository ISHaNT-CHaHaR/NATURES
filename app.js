const fs = require('fs');
const express = require('express');

const app = express();
app.use(express.json());
// app.get('/', (req, res) => {
//   res.status(200).json({ message: 'Herro from server', app: 'Natours' });
// });
// app.post('/',(req,res)=>{
//     res.send(`You can post to this input.... `);
// })

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({

    status: 'success',
    results: tours.length ,
    data: {
      tours
    }
  });
});

const port = 3000;

app.listen(port, () => {
  console.log(`APP runnning on port ${port}.....`);
});
