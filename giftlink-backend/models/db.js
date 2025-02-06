require('dotenv').config();
const { MongoClient } = require('mongodb');  // Destructure MongoClient

// MongoDB connection URL with authentication options
const url = process.env.MONGO_URL;  // Ensure .env is configured correctly

let dbInstance = null;

async function connectToDatabase() {
    if (dbInstance) {
        return dbInstance;  // Return cached DB instance if already connected
    }

    const client = new MongoClient(url);  // Removed deprecated options

    try {
        // Task 1: Connect to MongoDB
        await client.connect();  
        console.log("Successfully connected to MongoDB Atlas");

        // Task 2: Get the default database from the connection string
        dbInstance = client.db();  // Atlas will use the DB specified in the connection string

        // Task 3: Return database instance
        return dbInstance;
    } catch (error) {
        console.error("Failed to connect to MongoDB Atlas:", error);
        throw error;  // Propagate the error for handling elsewhere
    }
}

module.exports = connectToDatabase;
