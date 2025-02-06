/*jshint esversion: 8 */

// Step 1: Load Environment Variables
require('dotenv').config();

// Step 2: Import Required Packages
const express = require('express');
const cors = require('cors');
const pinoLogger = require('./logger');  // Custom logger using Pino
const connectToDatabase = require('./models/db');  // MongoDB connection
const { loadData } = require("./util/import-mongo/index");  // Function to import data into MongoDB

// Step 3: Initialize Express App
const app = express();



// Step 4: Middleware Configuration
app.use("*", cors());  // Enable CORS for all routes
app.use(express.json());  // Parse incoming JSON requests


const port = 3060;  // Set the server port

// Step 5: Connect to MongoDB
connectToDatabase()
    .then(() => {
        pinoLogger.info('Connected to DB');  // Log successful DB connection
    })
    .catch((e) => console.error('Failed to connect to DB', e));  // Log DB connection errors

// Step 6: Import Route Files
const giftRoutes = require('./routes/giftRoutes');  // Gifts-related routes
const authRoutes = require('./routes/authRoutes');  // Authentication-related routes
const searchRoutes = require('./routes/searchRoutes');  // Search-related routes

// Step 7: Configure Logging Middleware
const pinoHttp = require('pino-http');
const logger = require('./logger');
app.use(pinoHttp({ logger }));  // Attach Pino logger to HTTP requests

// Step 8: Use Routes
app.use('/api/gifts', giftRoutes);  // Gifts API routes (e.g., /api/gifts)
app.use('/api/auth', authRoutes);  // Auth API routes (e.g., /api/auth/register)
app.use('/api/search', searchRoutes);  // Search API routes (e.g., /api/search)

// Step 9: Global Error Handler
app.use((err, req, res, next) => {
    console.error(err);  // Log errors to the console
    res.status(500).send('Internal Server Error');  // Send generic error response
});

// Step 10: Define Root Route
app.get("/", (req, res) => {
    res.send("Inside the server");  // Default response for the root URL
});

// Step 11: Start the Server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);  // Log when the server starts successfully
});
