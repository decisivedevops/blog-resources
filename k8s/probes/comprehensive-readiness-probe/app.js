const express = require('express');
const mongoose = require('mongoose');
const redis = require('redis');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;
const CACHE_URL = process.env.CACHE_URL;

let isReady = false;
let cacheClient;

// Connect to Redis
const connectToCache = async () => {
    cacheClient = redis.createClient({
        url: CACHE_URL,
    });

    cacheClient.on('error', (error) => {
        console.error('Redis connection error:', error);
        isReady = false;
    });

    await cacheClient.connect();
};

// Readiness probe endpoint
app.get('/ready', async (req, res) => {
    if (!isReady) {
        return res.status(503).json({ status: 'Not Ready' });
    }

    // Check database connectivity
    try {
        await mongoose.connection.db.command({ ping: 1 });
    } catch (error) {
        console.error('Database connection error:', error);
        return res.status(503).json({ status: 'Not Ready' });
    }

    // Check cache connectivity
    try {
        await cacheClient.ping();
    } catch (error) {
        console.error('Cache connection error:', error);
        return res.status(503).json({ status: 'Not Ready' });
    }

    res.json({ status: 'Ready' });
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
        console.log('Connected to Redis');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            isReady = true;
        });
    })
    .catch((error) => {
        console.error('Error starting the application:', error);
        process.exit(1);
    });
