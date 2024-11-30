import express from 'express';
import multer from 'multer';
import { checkIfS3FileExists, uploadToS3 } from '../config/s3Config.js';
import db from '../config/firebase.js';
import crypto from 'crypto';
import { isFoodImage } from "../middleware/filterFoodPhotos.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.put("/add-photo/:email", upload.single("photo"), async (req, res) => {
    const { email } = req.params;

    try {
        if (!email) {
            console.error("Email is missing in the request.");
            return res.status(400).json({ message: "Email is required in the URL params." });
        }

        if (!req.file) {
            console.error("No file uploaded.");
            return res.status(400).json({ message: "A photo file must be uploaded." });
        }

        const base64Photo = req.file.buffer.toString("base64");
        console.log("Base64 string generated for the photo.");

        const customerRef = db.collection("customers");
        const snapshot = await customerRef.where("email", "==", email).get();

        if (snapshot.empty) {
            console.error("No user found with the provided email.");
            return res.status(404).json({ message: "User not found." });
        }

        const userDoc = snapshot.docs[0];
        const userId = userDoc.id;
        const userData = userDoc.data();
        const currentPhotos = userData.photos || [];

        if (await isFoodImage(base64Photo)) {
            console.log("Photo passed validation as a food image.");

            const fileBuffer = Buffer.from(base64Photo, 'base64');
            const fileHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
            const uniqueFileName = `food-photos/${fileHash}.jpg`;

            // Check if the file already exists in S3
            const fileExists = await checkIfS3FileExists(uniqueFileName);
            let s3Url;
            if (fileExists) {
                console.log("File already exists in S3.");
                s3Url = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueFileName}`;
            } else {
                console.log("Uploading new file to S3.");
                s3Url = await uploadToS3(uniqueFileName, fileBuffer);
            }

            if (!currentPhotos.includes(s3Url)) {
                const updatedPhotos = [...currentPhotos, s3Url];
                await customerRef.doc(userId).update({ photos: updatedPhotos });

                return res.status(200).json({
                    message: "Photo successfully added to user's photos array.",
                    photos: updatedPhotos,
                });
            } else {
                return res.status(200).json({
                    message: "The photo already exists in the user's photos array.",
                    photos: currentPhotos,
                });
            }
        } else {
            console.error("Photo failed validation.");
            return res.status(400).json({ message: "Invalid Photo" });
        }

    } catch (error) {
        console.error("Error adding photo to user's Firestore document:", error);
        return res.status(500).json({ error: "Failed to add photo." });
    }
});

export default router;
