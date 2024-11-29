import { ImageAnnotatorClient } from '@google-cloud/vision';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { v4 as uuidv4 } from 'uuid';
import {uploadToS3, checkIfS3FileExists} from "../config/s3Config.js";
import crypto from 'crypto';


const visionClient = new ImageAnnotatorClient();

/**
 * Downloads an image from a URL and saves it locally.
 * @param {string} url - The image URL.
 * @returns {string} - The local file path of the downloaded image.
 */
async function downloadImage(url) {
    const tempDir = os.tmpdir(); // Get system temporary directory
    const filePath = path.join(tempDir, `${uuidv4()}.jpg`);
    const response = await axios({
        url,
        responseType: 'stream',
    });

    return new Promise((resolve, reject) => {
        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);
        writer.on('finish', () => resolve(filePath));
        writer.on('error', reject);
    });
}

/**
 * Converts an image file to a Base64 string.
 * @param {string} filePath - Path to the image file.
 * @returns {string} - The Base64 encoded string of the image.
 */
function convertImageToBase64(filePath) {
    const imageBuffer = fs.readFileSync(filePath);
    return imageBuffer.toString('base64');
}


 export async function isFoodImage(input) {
    let fileContent; // Buffer containing the image content

    try {
        if (input.startsWith('http')) {
            // Input is a URL, so download the image content
            const filePath = await downloadImage(input);
            fileContent = fs.readFileSync(filePath); // Read image as buffer
            fs.unlinkSync(filePath); // Delete the local file after reading
        } else {
            // Input is a Base64 string, decode into a buffer
            fileContent = Buffer.from(input, 'base64');
        }

        // Call Google Vision API with the image content (buffer)
        const [result] = await visionClient.labelDetection({ image: { content: fileContent } });

        if (!result.labelAnnotations || result.labelAnnotations.length === 0) {
            console.log('No labels found for image.');
            return false; // No labels, so not a food image
        }

        // Extract label descriptions
        const labels = result.labelAnnotations.map((label) => label.description.toLowerCase());

        // Define food-related keywords
        const foodKeywords = [
            'food', 'dish', 'meal', 'cuisine', 'snack', 'dessert',
            'breakfast', 'lunch', 'dinner', 'recipe', 'fruit',
            'vegetable', 'ingredient',
        ];

        // Check if any label matches a food keyword
        const isFood = labels.some((label) => foodKeywords.includes(label));
        return isFood;
    } catch (error) {
        console.error('Error detecting labels for image:', error);
        return false; // If an error occurs, assume not a food image
    }
}



export default async function filterFoodPhotos(photoInputs) {
    const s3Urls = [];
    const individualRequests = photoInputs.map(async (photoInput) => {
        try {
            // Check if the photo is food-related
            const isFood = await isFoodImage(photoInput);
            if (isFood) {
                let fileBuffer;

                if (photoInput.startsWith('http')) {
                    // Input is a URL, download the file
                    const filePath = await downloadImage(photoInput);
                    fileBuffer = await fs.readFileSync(filePath);
                    await fs.unlinkSync(filePath);
                } else {
                    fileBuffer = Buffer.from(photoInput, 'base64');
                }

                const fileHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
                const uniqueFileName = `food-photos/${fileHash}.jpg`;


                // Check if the file already exists in S3
                const fileExists = await checkIfS3FileExists(uniqueFileName);


                const s3Url = fileExists
                    ? `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueFileName}` // Reuse existing file URL
                    : await uploadToS3(uniqueFileName, fileBuffer);

                s3Urls.push(s3Url);
            }
        } catch (error) {
            console.error('Error processing photo input:', error);
        }
    });

    await Promise.all(individualRequests);

    return s3Urls;
}

