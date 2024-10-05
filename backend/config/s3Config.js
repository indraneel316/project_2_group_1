import { S3 } from '@aws-sdk/client-s3'; // Import S3 from the v3 SDK
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Create an S3 instance
const s3 = new S3({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

// Function to upload a file to S3
export const uploadToS3 = async (fileName, fileContent) => {
    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileName,
        Body: fileContent,
        ACL: 'public-read', // Public access; adjust according to your needs
    };

    try {
        const data = await s3.putObject(params); // Use putObject for v3
        console.log(`File uploaded successfully at ${data.Location}`);
        return data; // Return the upload data for further processing if needed
    } catch (err) {
        console.error('Error uploading file:', err);
        throw err; // Rethrow the error after logging
    }
};
