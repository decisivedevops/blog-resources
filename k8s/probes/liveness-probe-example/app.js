const express = require('express');
const app = express();

let healthy = true;

app.get('/healthz', (req, res) => {
  if (healthy) {
    res.sendStatus(200);
  } else {
    res.sendStatus(500);
  }
});

app.get('/make-unhealthy', (req, res) => {
  healthy = false;
  res.send('Application is now unhealthy');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
