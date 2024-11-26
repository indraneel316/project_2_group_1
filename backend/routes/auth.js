import express from 'express';
import multer from 'multer';
import bcrypt from 'bcryptjs';
import { S3 } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import filterFoodPhotos from "../middleware/filterFoodPhotos.js";
import db from '../config/firebase.js';

dotenv.config();

const router = express.Router();

// Initialize S3
const s3 = new S3({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

// Set up multer storage for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

/* SIGNUP */
router.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const userId = uuidv4();
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save user to Firestore in the 'customers' collection
        await db.collection('customers').doc(userId).set({
            userId,
            username,
            email,
            password: hashedPassword,
            photos: [],
            profilePicture: null,
        });

        const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({
            message: 'User created successfully!',
            user: {
                userId,
                username,
                email,
            },
            token,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/* SIGNIN */
router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Fetch user from Firestore in the 'customers' collection
        const customersRef = db.collection('customers');
        const snapshot = await customersRef.where('email', '==', email).get();

        if (snapshot.empty) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userDoc = snapshot.docs[0];
        const user = userDoc.data();

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            message: 'Sign in successful',
            user: {
                userId: user.userId,
                username: user.username,
                email: user.email,
                profilePicture: user.profilePicture,
            },
            token,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/* FACEBOOK LOGIN */
router.post('/facebook', async (req, res) => {
    const { accessToken } = req.body;

    try {
        const userData = await axios.get(`https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`);
        const { id, name, email, picture } = userData.data;

        // Check if the user already exists in 'customers' collection
        const customersRef = db.collection('customers');
        const snapshot = await customersRef.where('email', '==', email).get();

        let user;
        if (snapshot.empty) {
            const defaultPassword = Math.random().toString(36).slice(-8);
            const hashedPassword = await bcrypt.hash(defaultPassword, 10);
            const userId = uuidv4();

            user = {
                userId,
                username: name,
                email,
                password: hashedPassword,
                profilePicture: picture?.data?.url || null,
                photos: [],
            };

            // Save new user to Firestore in the 'customers' collection
            await db.collection('customers').doc(userId).set(user);
        } else {
            user = snapshot.docs[0].data();
        }

        const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            message: 'Login successful',
            token,
            user,
        });

        // Process photos in the background
        await processPhotosInBackground(email, accessToken);

    } catch (error) {
        console.error('Error verifying access token or fetching photos:', error.response ? error.response.data : error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Background function to process Facebook photos
async function processPhotosInBackground(email, accessToken) {
    try {
        let allPhotos = [];
        let nextPageUrl = `https://graph.facebook.com/me/photos?type=uploaded&fields=source&access_token=${accessToken}`;

        // Loop to fetch all pages of photos
        while (nextPageUrl) {
            const photosData = await axios.get(nextPageUrl);
            const photos = photosData.data.data.map(photo => photo.source);
            allPhotos = allPhotos.concat(photos);
            nextPageUrl = photosData.data.paging?.next || null;
        }

        // Filter food-related photos
        const allFoodPhotos = await filterFoodPhotos(allPhotos);
        console.log("ALL FOOD PHOTOS ", allFoodPhotos);

        // Update user document with filtered food photos
        const customersRef = db.collection('customers');
        const snapshot = await customersRef.where('email', '==', email).get();
        const userDoc = snapshot.docs[0];

        await db.collection('customers').doc(userDoc.id).update({
            photos: allFoodPhotos,
        });
    } catch (error) {
        console.error(`Error processing photos for user ${email}:`, error);
    }
}
export default router;
