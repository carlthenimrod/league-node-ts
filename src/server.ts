import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.send('truckz!');
});

app.listen(8000, () => {
  console.log('listening');
});