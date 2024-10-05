// routes/userRoutes.js
import express from 'express';
import multer from 'multer';
import { uploadToS3 } from '../config/s3Config.js';
import User from '../model/User.js';
import bcrypt from 'bcryptjs';
import { S3 } from '@aws-sdk/client-s3'; // Import the S3 client from AWS SDK v3
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Create an S3 instance
const s3 = new S3({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

// Configure multer to handle file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Sign Up Route
router.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        await newUser.save();
        res.status(201).json({ message: 'User created successfully!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Sign In Route
router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        res.status(200).json({ message: 'Sign in successful', user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Upload Profile Picture Route
router.post('/upload-profile-picture', upload.single('profilePicture'), async (req, res) => {
    try {
        const { email } = req.body; // Get email from request body to find the user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Delete old profile picture from S3 if it exists
        if (user.profilePicture) {
            const oldFileName = user.profilePicture.split('/').pop(); // Extract the filename from URL

            const deleteParams = {
                Bucket: process.env.S3_BUCKET_NAME, // Your S3 bucket name
                Key: oldFileName, // The file name you want to delete
            };

            // Use the deleteObject method from the S3 instance
            await s3.deleteObject(deleteParams);
        }

        // Upload new profile picture to S3
        const fileName = `${Date.now()}_${req.file.originalname}`;
        const uploadedFile = await uploadToS3(fileName, req.file.buffer);

        // Update user with new profile picture URL
        const updatedUser = await User.findOneAndUpdate(
            { email }, // Find user by email
            { profilePicture: uploadedFile }, // Update profile picture URL
            { new: true }
        );

        res.status(200).json({
            message: 'Profile picture updated successfully!',
            profilePicture: uploadedFile, // Assuming uploadToS3 returns the URL
            user: updatedUser,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
