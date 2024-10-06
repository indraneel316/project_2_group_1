import express from 'express';
import multer from 'multer';
import { uploadToS3 } from '../config/s3Config.js';
import User from '../model/User.js';
import bcrypt from 'bcryptjs';
import { S3 } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import authenticateToken from '../middleware/authenticateToken.js'; // JWT Middleware



dotenv.config();

const router = express.Router();

const s3 = new S3({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Sign Up Route
router.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Generate a unique user ID
        const userId = uuidv4();

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            userId,
            username,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        // Create JWT Token
        const token = jwt.sign({ userId: newUser.userId }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({
            message: 'User created successfully!',
            user: {
                userId: newUser.userId,
                username: newUser.username,
                email: newUser.email,
            },
            token, // Send the token to the client
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

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

        // Create JWT Token
        const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            message: 'Sign in successful',
            user: {
                userId: user.userId,
                username: user.username,
                email: user.email,
            },
            token,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.post('/upload-profile-picture', upload.single('profilePicture'), async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.profilePicture) {
            const oldFileName = user.profilePicture.split('/').pop(); // Extract the filename from URL

            const deleteParams = {
                Bucket: process.env.S3_BUCKET_NAME, // Your S3 bucket name
                Key: oldFileName, // The file name you want to delete
            };

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

router.post('/auth/facebook', async (req, res) => {
    const { accessToken } = req.body;

    try {
        // Verify the access token with Facebook
        const userData = await axios.get(`https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`);

        const { id, name, email, picture } = userData.data;

        // Check if user already exists in your database using email
        let user = await User.findOne({ email });
        if (!user) {
            // Create a new user if they don't exist
            const defaultPassword = Math.random().toString(36).slice(-8); // Generate a random password
            const hashedPassword = await bcrypt.hash(defaultPassword, 10); // Hash the password
            const userId = uuidv4();


            user = new User({
                userId: userId,
                username: name,
                email: email,
                password: hashedPassword, // Set the hashed password
                profilePicture: picture.data.url
            });
            await user.save();
        }

        const token = jwt.sign({ id: user.userId }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                userId: user.userId,
                email: user.email,
                username: user.username,
                profilePicture: user.profilePicture
            }
        });
    } catch (error) {
        console.error('Error verifying access token:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
