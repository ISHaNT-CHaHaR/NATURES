const express = require('express');
const app = express();
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Herro from server', app: 'Natours' });
});
app.post('/',(req,res)=>{
    res.send(`You can post to this input.... `); 
})



const port = 3000; 

app.listen(port, () => {
  console.log(`APP runnning on port ${port}.....`);
});


