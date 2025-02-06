const express = require('express');
const router = express.Router();
const multer = require('multer');  // Import multer for handling file uploads
const { CloudinaryStorage } = require('multer-storage-cloudinary');  // Cloudinary storage for multer
const cloudinary = require('../config/cloudinary');  // Cloudinary configuration file
const connectToDatabase = require('../models/db');  // Import the database connection function
const { ObjectId } = require('mongodb');  // Import ObjectId globally
const pino = require('pino');  // Import Pino logger for logging

const logger = pino();  // Create a Pino logger instance

// Task 0: Configure multer to use Cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'gift_images',  // Cloudinary folder where images will be stored
        allowed_formats: ['jpeg', 'png', 'jpg'],  // Allowed image formats
    }
});

const upload = multer({ storage: storage });  // Initialize multer with Cloudinary storage configuration

// Task 1: Get all gifts
router.get('/', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('gifts');

        const gifts = await collection.find({}).toArray();

        logger.info(`Fetched ${gifts.length} gifts`);  // Log how many gifts were fetched
        res.status(200).json(gifts);
    } catch (error) {
        logger.error('Error fetching gifts:', error);
        res.status(500).json({ error: 'Failed to fetch gifts' });
    }
});

// Task 2: Add a new gift with Cloudinary image upload
router.post('/', upload.single('image'), async (req, res) => {  // Use multer middleware for single file upload
    try {
        const db = await connectToDatabase();
        const collection = db.collection('gifts');

        // Construct new gift data with Cloudinary image URL
        const newGiftData = {
            name: req.body.name,
            category: req.body.category,
            condition: req.body.condition,
            description: req.body.description,
            image: req.file ? req.file.path : '',  // Cloudinary image URL
            date_added: req.body.date_added || new Date().toISOString()  // Use ISO format for consistency
        };

        const result = await collection.insertOne(newGiftData);
        const newGift = { _id: result.insertedId, ...newGiftData };

        logger.info('Gift added successfully', newGift);
        res.status(201).json(newGift);
    } catch (error) {
        logger.error('Error adding gift:', error);
        res.status(500).json({ error: 'Failed to add gift' });
    }
});

// Task 3: Get a specific gift by ID
router.get('/:id', async (req, res) => {
    const giftId = req.params.id;

    try {
        const db = await connectToDatabase();
        const collection = db.collection('gifts');

        if (!ObjectId.isValid(giftId)) {
            logger.warn(`Invalid ObjectId format for ID: ${giftId}`);
            return res.status(400).json({ error: 'Invalid gift ID format' });
        }

        const gift = await collection.findOne({ _id: new ObjectId(giftId) });

        if (!gift) {
            logger.warn(`Gift with ID ${giftId} not found`);
            return res.status(404).json({ error: 'Gift not found' });
        }

        logger.info(`Gift fetched successfully:`, gift);
        res.status(200).json(gift);
    } catch (error) {
        logger.error(`Error fetching gift with ID ${giftId}:`, error);
        res.status(500).json({ error: 'Failed to fetch gift' });
    }
});

// Task 4: Update a gift by ID with Cloudinary file upload support
router.put('/:id', upload.single('image'), async (req, res) => {
    const giftId = req.params.id;

    try {
        const db = await connectToDatabase();
        const collection = db.collection('gifts');

        if (!ObjectId.isValid(giftId)) {
            logger.warn(`Invalid ObjectId format for ID: ${giftId}`);
            return res.status(400).json({ error: 'Invalid gift ID format' });
        }

        const existingGift = await collection.findOne({ _id: new ObjectId(giftId) });
        if (!existingGift) {
            logger.warn(`Gift with ID ${giftId} not found`);
            return res.status(404).json({ error: 'Gift not found' });
        }

        const updatedGiftData = {
            name: req.body.name || existingGift.name,
            category: req.body.category || existingGift.category,
            condition: req.body.condition || existingGift.condition,
            description: req.body.description || existingGift.description,
            date_added: req.body.date_added || existingGift.date_added,
            image: req.file ? req.file.path : existingGift.image  // Cloudinary image URL
        };

        const result = await collection.updateOne(
            { _id: new ObjectId(giftId) },
            { $set: updatedGiftData }
        );

        if (result.modifiedCount === 0) {
            logger.warn(`Gift with ID ${giftId} was not updated`);
            return res.status(400).json({ error: 'Failed to update gift' });
        }

        logger.info(`Gift with ID ${giftId} updated successfully`, updatedGiftData);
        res.status(200).json({ message: 'Gift updated successfully', updatedGift: updatedGiftData });

    } catch (error) {
        logger.error(`Error updating gift with ID ${giftId}:`, error);
        res.status(500).json({ error: 'Failed to update gift' });
    }
});

// Task 5: Delete a gift by ID
router.delete('/:id', async (req, res) => {
    const giftId = req.params.id;

    try {
        const db = await connectToDatabase();
        const collection = db.collection('gifts');

        if (!ObjectId.isValid(giftId)) {
            logger.warn(`Invalid ObjectId format for deletion: ${giftId}`);
            return res.status(400).json({ error: 'Invalid gift ID format' });
        }

        const result = await collection.deleteOne({ _id: new ObjectId(giftId) });

        if (result.deletedCount === 0) {
            logger.warn(`Gift with ID ${giftId} not found for deletion`);
            return res.status(404).json({ error: 'Gift not found' });
        }

        logger.info(`Gift with ID ${giftId} deleted successfully`);
        res.status(200).json({ message: 'Gift deleted successfully' });
    } catch (error) {
        logger.error(`Error deleting gift with ID ${giftId}:`, error);
        res.status(500).json({ error: 'Failed to delete gift' });
    }
});

module.exports = router;  // Export the router for use in app.js

