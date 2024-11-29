import express from 'express';
import multer from 'multer';
import {checkIfS3FileExists, uploadToS3} from '../config/s3Config.js';
import db from '../config/firebase.js';  // Firestore initialization
import dotenv from 'dotenv';
import filterFoodPhotos, {isFoodImage} from "../middleware/filterFoodPhotos.js";
import crypto from "crypto";

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

        res.status(200).json({
            photos: user.photos || [],  // Assuming `photos` is an array of photo URLs or photo objects
        });
    } catch (error) {
        console.error('Error fetching photos:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.put("/add-photo/:email", upload.single("photo"), async (req, res) => {
    const { email } = req.params;

    try {
        if (!email) {
            return res.status(400).json({ message: "Email is required in the URL params." });
        }

        if (!req.file) {
            return res.status(400).json({ message: "A photo file must be uploaded." });
        }

        const base64Photo = req.file.buffer.toString("base64");
        const customerRef = db.collection("customers");
        const snapshot = await customerRef.where("email", "==", email).get();

        if (snapshot.empty) {
            return res.status(404).json({ message: "User not found." });
        }

        if (await isFoodImage(base64Photo)) {
            const userDoc = snapshot.docs[0];
            const userId = userDoc.id;
            const userData = userDoc.data();
            const currentPhotos = userData.photos || [];

            const fileBuffer = Buffer.from(base64Photo, 'base64');
            const fileHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
            const uniqueFileName = `food-photos/${fileHash}.jpg`;

            // Check if the file already exists in S3
            const fileExists = await checkIfS3FileExists(uniqueFileName);

            let s3Url;
            if (fileExists) {
                s3Url = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueFileName}`;
            } else {
                s3Url = await uploadToS3(uniqueFileName, fileBuffer);
            }

            // Check if the URL already exists in Firestore
            if (!currentPhotos.includes(s3Url)) {
                const updatedPhotos = [...currentPhotos, s3Url];
                console.log("TRACK DATA 1 ", updatedPhotos.length);

                await customerRef.doc(userId).update({ photos: updatedPhotos });

                res.status(200).json({
                    message: "Photo successfully added to user's photos array.",
                    photos: updatedPhotos,
                });
            } else {
                res.status(200).json({
                    message: "The photo already exists in the user's photos array.",
                    photos: currentPhotos,
                });
            }
        } else {
            res.status(400).json({
                message: "Invalid Photo",
            });
        }

    } catch (error) {
        console.error("Error adding photo to user's Firestore document:", error);
        return res.status(500).json({ error: "Failed to add photo." });
    }
});

router.post('/save-results', async (req, res) => {
    const { email, photoData } = req.body;


    console.log("PHOTO DATA ", photoData)

    try {
        if (!email || !photoData) {
            return res.status(400).json({ message: 'Email and photoData are required.' });
        }

        const photoResultsRef = db.collection('photoResults');

        // Check if the user already has a photoResults document
        const snapshot = await photoResultsRef.where('email', '==', email).get();

        let docRef;
        if (snapshot.empty) {
            const newPhotoResult = {
                email,
                photoData: [photoData], // Initialize photoData as an array if it's the first entry
            };
            docRef = await photoResultsRef.add(newPhotoResult);
        } else {
            // Update the existing document
            const existingDoc = snapshot.docs[0];
            const existingData = existingDoc.data();

            // Ensure photoData is an array before calling .concat()
            const updatedPhotoData = Array.isArray(existingData.photoData)
                ? existingData.photoData.concat(photoData)
                : [photoData]; // Initialize as an array if it's not already

            await photoResultsRef.doc(existingDoc.id).update({
                photoData: updatedPhotoData,
                createdAt: new Date(),
            });

            docRef = existingDoc.ref; // Use the existing document reference
        }

        return res.status(201).json({
            message: 'Photo data saved successfully.',
            photoResult: { id: docRef.id, email, photoData },
        });
    } catch (error) {
        console.error('Error saving photo data:', error);
        return res.status(500).json({ error: 'Failed to save photo data.' });
    }
});



router.get('/retrieve-results/:email', async (req, res) => {
    const { email }  = req.params;

    try {
        if (!email) {
            return res.status(400).json({ message: 'Email is required in the request parameters.' });
        }

        const photoResultsRef = db.collection('photoResults');

        const snapshot = await photoResultsRef.where('email', '==', email).get();

        if (snapshot.empty) {
            return res.status(404).json({ message: `No photo data found for email: ${email}` });
        }

        const photoData = snapshot.docs.map(doc => doc.data().results);  // Return only the `results` field
        console.log("TRACK DATA 1", photoData);
        return res.status(200).json({
            photoData
        });
    } catch (error) {
        console.error('Error retrieving photo data:', error);
        return res.status(500).json({ error: 'Failed to retrieve photo data.' });
    }
});


export default router;
