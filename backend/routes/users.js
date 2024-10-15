import express from 'express';
import multer from 'multer';
import {uploadToS3} from '../config/s3Config.js';
import User from '../model/User.js';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.put('/profile', upload.single('profilePicture'), async (req, res) => {
    const { name, email } = req.body;

    try {
        const updates = {};
        if (name) updates.name = name;
        if (email) updates.email = email;

        if (req.file) {
            updates.profilePicture = await uploadToS3(req.file.originalname, req.file.buffer);

        }

        const updatedUser = await User.findOneAndUpdate(
            { email },
            updates,
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: error.message });
    }
});



// get all users


router.get('/info', async (req, res) => {
    try {
        const users = await User.find().limit(10);
        if (!users.length) {
            return res.status(404).json({ message: 'No users found' });
        }
        res.status(200).json({ message: 'First 10 users retrieved successfully', users });
    } catch (error) {
        console.error('Error retrieving users:', error);
        res.status(500).json({ error: error.message });
    }
});
g

export default router;

