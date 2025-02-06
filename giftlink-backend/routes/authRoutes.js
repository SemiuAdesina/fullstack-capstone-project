// Step 1: Import Necessary Packages
const express = require('express');
const bcryptjs = require('bcryptjs');  // For password hashing
const jwt = require('jsonwebtoken');   // For JWT token generation
const connectToDatabase = require('../models/db');  // MongoDB connection
const dotenv = require('dotenv');  // To load environment variables from .env
const pino = require('pino');  // For logging
const { body, validationResult } = require('express-validator');  // For input validation

dotenv.config();
const router = express.Router();
const logger = pino();  // Create a Pino logger instance

// Step 2: Load JWT Secret Key from .env
const JWT_SECRET = process.env.JWT_SECRET;

/* ------------------------------------------
   Step 3: User Registration Endpoint (/register)
------------------------------------------ */
router.post('/register', async (req, res) => {
    try {
        // Task 1: Connect to MongoDB (giftsdb)
        const db = await connectToDatabase();
        const collection = db.collection("users");

        // Task 2: Check for existing email
        const existingEmail = await collection.findOne({ email: req.body.email });
        if (existingEmail) {
            logger.error('Email ID already exists');
            return res.status(400).json({ error: 'Email ID already exists' });
        }

        // Task 3: Hash the password
        const salt = await bcryptjs.genSalt(10);
        const hash = await bcryptjs.hash(req.body.password, salt);

        // Task 4: Save user details in the database
        const newUser = await collection.insertOne({
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: hash,
            createdAt: new Date(),
        });

        // Task 5: Create JWT authentication token with user._id as payload
        const payload = { user: { id: newUser.insertedId } };
        const authtoken = jwt.sign(payload, JWT_SECRET);

        logger.info('User registered successfully');
        res.json({ authtoken, email: req.body.email });

    } catch (e) {
        logger.error(e);
        return res.status(500).send('Internal server error');
    }
});

/* ------------------------------------------
   Step 4: User Login Endpoint (/login)
------------------------------------------ */
router.post('/login', async (req, res) => {
    try {
        // Task 1: Connect to MongoDB
        const db = await connectToDatabase();
        const collection = db.collection("users");

        // Task 2: Find the user by email
        const theUser = await collection.findOne({ email: req.body.email });
        if (!theUser) {
            logger.error('User not found');
            return res.status(404).json({ error: 'User not found' });
        }

        // Task 3: Compare provided password with hashed password in DB
        const isPasswordMatch = await bcryptjs.compare(req.body.password, theUser.password);
        if (!isPasswordMatch) {
            logger.error('Passwords do not match');
            return res.status(404).json({ error: 'Wrong password' });
        }

        // Task 4: Generate JWT token upon successful login
        const payload = { user: { id: theUser._id.toString() } };
        const authtoken = jwt.sign(payload, JWT_SECRET);

        logger.info('User logged in successfully');
        res.status(200).json({ authtoken, userName: theUser.firstName, userEmail: theUser.email });

    } catch (e) {
        logger.error(e);
        return res.status(500).json({ error: 'Internal server error', details: e.message });
    }
});

/* ------------------------------------------
   Step 5: User Profile Update Endpoint (/update)
------------------------------------------ */
router.put('/update',
    // Task 1: Use express-validator for input validation
    [
        body('firstName').notEmpty().withMessage('First name is required'),
        body('lastName').notEmpty().withMessage('Last name is required')
    ],
    async (req, res) => {
        // Task 2: Validate the input using validationResult
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logger.error('Validation errors in update request', errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            // Task 3: Check if `email` is present in request headers
            const email = req.headers.email;
            if (!email) {
                logger.error('Email not found in the request headers');
                return res.status(400).json({ error: "Email not found in the request headers" });
            }

            // Task 4: Connect to MongoDB and access users collection
            const db = await connectToDatabase();
            const collection = db.collection("users");

            // Task 5: Find user by email
            const existingUser = await collection.findOne({ email });
            if (!existingUser) {
                logger.error('User not found');
                return res.status(404).json({ error: "User not found" });
            }

            // Task 6: Update user details
            const updatedUserDetails = {
                ...existingUser,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                updatedAt: new Date()
            };

            const updatedUser = await collection.findOneAndUpdate(
                { email },
                { $set: updatedUserDetails },
                { returnDocument: 'after' }
            );

            // Task 7: Create new JWT token after profile update
            const payload = { user: { id: updatedUser._id.toString() } };
            const authtoken = jwt.sign(payload, JWT_SECRET);

            logger.info('User profile updated successfully');
            res.json({ authtoken });

        } catch (error) {
            logger.error(error);
            return res.status(500).send("Internal Server Error");
        }
    }
);

// Step 6: Export the router to be used in app.js
module.exports = router;
