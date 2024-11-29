import {GetObjectCommand, HeadObjectCommand, S3} from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

const s3 = new S3({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

export async function checkIfS3FileExists(filePath) {
    try {
        const command = new GetObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: filePath,
        });
        await s3.send(command); // Attempt to fetch the object
        return true; // File exists
    } catch (error) {
        if (error.name === "NoSuchKey" || error.name === "NotFound") {
            return false; // File does not exist
        }
        throw error; // Other errors
    }
}

export const uploadToS3 = async (fileName, fileContent) => {
    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileName,
        Body: fileContent,
    };

    try {
        const data = await s3.putObject(params);
        const fileUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

        return fileUrl;
    } catch (err) {
        console.error('Error uploading file:', err);
        throw err;
    }
};
