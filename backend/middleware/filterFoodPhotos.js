import { ImageAnnotatorClient } from '@google-cloud/vision';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { v4 as uuidv4 } from 'uuid';

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

/**
 * Filters an array of photo URLs to return only food-related photos using Google Vision API.
 * @param {string[]} photoUrls - An array of photo URLs.
 * @returns {Promise<{foodPhotos: string[], base64Images: string[]}>} - A promise that resolves to food photo URLs and Base64 strings.
 */
async function filterFoodPhotos(photoUrls) {
    const base64Images = [];

    const individualRequests = photoUrls.map(async (photoUrl) => {
        try {
            const filePath = await downloadImage(photoUrl);

            const [result] = await visionClient.labelDetection({ image: { content: fs.readFileSync(filePath) } });

            if (!result.labelAnnotations || result.labelAnnotations.length === 0) {
                console.log("Empty labels for image:", photoUrl);
                fs.unlinkSync(filePath); // Clean up after processing
                return;
            }

            const labels = result.labelAnnotations.map(label => label.description.toLowerCase());

            const isFood = labels.some(label =>
                ['food', 'dish', 'meal', 'cuisine', 'snack', 'dessert', 'breakfast', 'lunch', 'dinner', 'recipe', 'fruit', 'vegetable', 'ingredient'].includes(label)
            );

            if (isFood) {
                const base64Image = convertImageToBase64(filePath);
                base64Images.push(base64Image);
            }

            fs.unlinkSync(filePath);
        } catch (error) {
            console.error(`Error processing image at ${photoUrl}:`, error);
            // You could capture and log the specific error and URL for debugging
        }
    });

    await Promise.all(individualRequests);

    return base64Images;
}

export default filterFoodPhotos;
