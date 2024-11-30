
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/auth.js';
import updateProfile from './routes/users.js';
import User from "./model/User.js";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

app.use('/backend/auth/users', userRoutes);
app.use('/backend/api/users', updateProfile);
app.get('/backend/healthcheck', (req, res) => {
    res.status(200).json({ status: 'ok' });
});



const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
