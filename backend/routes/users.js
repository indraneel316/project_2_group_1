import express from 'express';
import multer from 'multer';
import { uploadToS3 } from '../config/s3Config.js';
import db from '../config/firebase.js';  // Firestore initialization
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Update profile route
router.put('/profile', upload.single('profilePicture'), async (req, res) => {
    const { name, email } = req.body;

    try {
        const updates = {};
        if (name) updates.name = name;
        if (email) updates.email = email;

        if (req.file) {
            updates.profilePicture = await uploadToS3(req.file.originalname, req.file.buffer);
        }

        // Update user in Firestore's 'customers' collection
        const customerRef = db.collection('customers');
        const snapshot = await customerRef.where('email', '==', email).get();

        if (snapshot.empty) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userDoc = snapshot.docs[0];
        await customerRef.doc(userDoc.id).update(updates);

        // Retrieve the updated user info from Firestore
        const updatedUser = (await customerRef.doc(userDoc.id).get()).data();

        res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get all users route
router.get('/info', async (req, res) => {
    try {
        const customerRef = db.collection('customers');
        const snapshot = await customerRef.limit(10).get();

        if (snapshot.empty) {
            return res.status(404).json({ message: 'No users found' });
        }

        const users = snapshot.docs.map(doc => doc.data());
        res.status(200).json({ message: 'First 10 users retrieved successfully', users });
    } catch (error) {
        console.error('Error retrieving users:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get user's photos route
router.get('/photos', async (req, res) => {
    try {
        const { email } = req.query;  // Get email from query params

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // Find user by email in Firestore
        const customerRef = db.collection('customers');
        const snapshot = await customerRef.where('email', '==', email).get();

        if (snapshot.empty) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = snapshot.docs[0].data();

        // Send back the photo details (e.g., URLs or other info)
        res.status(200).json({
            photos: user.photos || [],  // Assuming `photos` is an array of photo URLs or photo objects
        });
    } catch (error) {
        console.error('Error fetching photos:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
