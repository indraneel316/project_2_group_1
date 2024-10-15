import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    userId: {type: String, required: true, unique: true},
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    location: { type: String },
    phoneNumber: { type: String },
    profilePicture: { type: String }
});

const User = mongoose.model('customers', UserSchema);
export default User;
