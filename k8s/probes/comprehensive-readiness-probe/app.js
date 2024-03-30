const express = require('express');
const mongoose = require('mongoose');
const redis = require('redis');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;
const CACHE_URL = process.env.CACHE_URL;

let isReady = false;
let cacheClient;

// Connect to Redis
const connectToCache = async () => {
    try {
        cacheClient = redis.createClient({
            url: CACHE_URL,
        });

        cacheClient.on('connect', () => {
            console.log('Connected to Redis');
            isReady = true; // Set isReady to true when connected to Redis
        });

        cacheClient.on('error', (error) => {
            console.error('Redis connection error:', error);
            isReady = false; // Set isReady to false when Redis connection error occurs
        });

        await cacheClient.connect();
    } catch (error) {
        console.error('Error connecting to Redis:', error);
        isReady = false; // Set isReady to false when error occurs while connecting to Redis
        throw error;
    }
};
// Readiness probe endpoint
app.get('/ready', async (req, res) => {
    console.log('Received readiness probe request');

    if (!isReady) {
        console.log('Application is not ready');
        return res.status(503).json({ status: 'Not Ready' });
    }

    // Check database connectivity
    try {
        await mongoose.connection.db.command({ ping: 1 });
        console.log('Database connection is active');
    } catch (error) {
        console.error('Database connection error:', error);
        return res.status(503).json({ status: 'Not Ready' });
    }

    // Check cache connectivity
    try {
        await cacheClient.ping();
        console.log('Cache connection is active');
    } catch (error) {
        console.error('Cache connection error:', error);
        return res.status(503).json({ status: 'Not Ready' });
    }

    console.log('Application is ready');
    res.json({ status: 'Ready' });
});

// Hostname endpoint
app.get('/hostname', (req, res) => {
    const hostname = os.hostname();
    console.log(`Received request for hostname. Hostname: ${hostname}`);
    res.json({ hostname });
});

// Connect to MongoDB and start the server
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('Connected to MongoDB');
        return connectToCache();
    })
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            isReady = true;
            console.log('Application is ready to serve requests');
        });
    })
    .catch((error) => {
        console.error('Error starting the application:', error);
        process.exit(1);
    });
