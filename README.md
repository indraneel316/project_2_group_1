# Food Recognition App - User Signup and Profile Picture Update

## Overview

The **Food Recognition App** allows users to sign up for an account and update their profile pictures. The application integrates with **AWS S3** for image storage, allowing users to upload and update their profile pictures securely and efficiently.

## Features

- **User Signup**: Users can register for an account using their email, username, and password.
- **Profile Picture Upload**: Users can update their profile pictures, which are uploaded to **AWS S3** and associated with their account.

## Technologies Used

- **Frontend**: React.js, Bootstrap
- **Backend**: Node.js (Express)
- **Database**: MongoDB
- **Containerization**: Docker (for deployment)
- **Cloud Services**: AWS EC2 and AWS S3 for frontend hosting

---

## API Documentation

### POST `/auth/users/signup`

- **Description**: Registers a new user and returns a JWT token.
- **Request Body**:
  - `username`: The user's username.
  - `email`: The user's email address.
  - `password`: The user's password.

- **Response**:
  - A success message and a JWT token.

### PUT `/profile`

- **Description**: Updates the user's profile picture by uploading an image to AWS S3.
- **Request Body**:
  - `profilePicture`: The image file (JPEG, PNG) sent using `multipart/form-data`.

- **Response**:
  - A success message and the URL of the updated profile picture hosted on AWS S3.

---

## Setting Up Locally

### Prerequisites

Before running the app, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v12 or higher)
- [MongoDB](https://www.mongodb.com/)
- [AWS Account](https://aws.amazon.com/) (for S3 access)
- AWS S3 bucket created for storing profile pictures

### Environment Variables

Create a `.env` file in the root directory and add the following variables:

# MongoDB
MONGO_URI=<Your MongoDB URI>

# JWT Secret
JWT_SECRET=<Your JWT Secret>

# AWS S3 Configuration
AWS_ACCESS_KEY_ID=<Your AWS Access Key ID>
AWS_SECRET_ACCESS_KEY=<Your AWS Secret Access Key>
AWS_REGION=<Your AWS Region>
AWS_BUCKET_NAME=<Your S3 Bucket Name>
```

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/username/food-recognition-app.git
   cd food-recognition-app
   ```

2. **Install dependencies**:
   Install the required dependencies for both backend and frontend:
   ```bash
   npm install
   ```

3. **Run the MongoDB server**:
   Ensure MongoDB is running either locally or using a cloud service like MongoDB Atlas.

4. **Start the server**:
   ```bash
   npm start
   ```

---

## AWS S3 Integration for Profile Picture Upload

### Setting Up S3 Bucket

1. **Create an S3 Bucket**:
   - Log in to your **AWS Management Console**.
   - Navigate to **S3** and create a bucket. Set the appropriate region, and ensure that the bucket is public if you want the profile pictures to be accessible publicly.

2. **Update the Bucket Policy**:
   Allow public access to the bucket by configuring the correct **bucket policy**. Here’s an example policy:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicReadGetObject",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::<Your-Bucket-Name>/*"
       }
     ]
   }
   ```

---

## Usage

1. **Sign Up**: Register a new account using the `/auth/users/signup` endpoint.
2. **Update Profile Picture**: Use the `/profile` endpoint to upload a profile picture, which will be stored in AWS S3.

---

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Make your changes and commit (`git commit -m 'Add feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Create a pull request.

---

## Contact

For any questions or support, please contact:

- **Email**: indraneel316@gmail.com
