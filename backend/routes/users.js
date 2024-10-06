import express from 'express';
import multer from 'multer';
import {uploadToS3} from '../config/s3Config.js';
import User from '../model/User.js';
import authenticateToken from '../middleware/authenticateToken.js';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.put('/profile', upload.single('profilePicture'), async (req, res) => {
    const { name, email } = req.body;
    // const userId = req.user.userId;

    console.log("TRACK DATA REQUEST ", req);

    try {
        const updates = {};
        if (name) updates.name = name;
        if (email) updates.email = email;

        if (req.file) {
            // const fileName = `${Date.now()}_${req.file.originalname}`;
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


export default router;
