const express = require('express');
const app = express();

const STARTUP_DELAY = process.env.STARTUP_DELAY || 30;
let isReady = false;

app.get('/ready', (req, res) => {
  console.log('Readiness probe called');
  if (isReady) {
    console.log('Application is ready');
    res.status(200).send('Application is ready');
  } else {
    console.log('Application is not ready yet');
    res.status(503).send('Application is not ready yet');
  }
});

app.get('/healthz', (req, res) => {
  console.log('Liveness probe called');
  console.log('Application is healthy');
  res.status(200).send('Application is healthy');
});

app.get('/startup', (req, res) => {
  console.log('Startup probe called');
  if (isReady) {
    console.log('Application has started successfully');
    res.status(200).send('Application has started successfully');
  } else {
    console.log('Application is still starting up');
    res.status(503).send('Application is still starting up');
  }
});

app.get('/', (req, res) => {
  console.log('Serving request');
  res.send('Hello, World!');
});

setTimeout(() => {
  isReady = true;
  console.log('Startup completed');
  console.log('Application is ready');
}, STARTUP_DELAY * 1000);

app.listen(3000, () => {
  console.log('Application is running on port 3000');
});
