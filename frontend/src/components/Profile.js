import React, { useContext, useState } from 'react';
import axios from 'axios';
import { UserContext } from '../context/userContext';
import './Profile.css';

const Profile = () => {
    const { user, setUser } = useContext(UserContext);
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState(user?.username || '');
    const [email, setEmail] = useState(user?.email || '');
    const [profilePicture, setProfilePicture] = useState(user?.profilePicture || '');
    const [newProfilePicture, setNewProfilePicture] = useState(null);

    const handleEdit = () => setEditing(true);

    const handleCancel = () => {
        setEditing(false);
        // Restore the user's original data
        setName(user?.username || '');
        setEmail(user?.email || '');
        setProfilePicture(user?.profilePicture || '');
        setNewProfilePicture(null); // Reset the new profile picture selection
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0]; // Get the first selected file
        if (file && file.type.startsWith('image/')) { // Ensure it's an image
            setNewProfilePicture(file);
            setProfilePicture(URL.createObjectURL(file)); // Preview new profile picture
        } else {
            alert('Please select a valid image file.');
        }
    };

    const handleSave = async () => {
        try {
            const formData = new FormData();
            formData.append('userId', user?.userId);
            formData.append('username', name);
            formData.append('email', email);
            if (newProfilePicture) formData.append('profilePicture', newProfilePicture);

            const response = await axios.put('http://localhost:5000/api/users/profile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            setUser(response.data.user);
            setProfilePicture(response.data.user.profilePicture || '');
            setEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <div className="card p-4" style={{ width: '450px', maxWidth: '90%' }}>
                <h2 className="text-center mb-4">Profile</h2>
                <div className="d-flex justify-content-center mb-3 position-relative">
                    <img
                        src={profilePicture || 'https://www.clipartmax.com/png/middle/17-172602_computer-icons-user-profile-male-portrait-of-a-man.png'}
                        alt="Profile"
                        className={`rounded-circle profile-icon ${editing ? 'editing' : ''}`}
                        style={{ width: '100px', height: '100px', objectFit: 'cover', border: '2px solid #fff' }}
                    />
                    {editing && (
                        <input
                            type="file"
                            className="d-none"
                            id="fileInput"
                            onChange={handleFileChange}
                        />
                    )}
                    <label
                        htmlFor="fileInput"
                        className="edit-icon"
                        style={{
                            position: 'absolute',
                            top: '50%', // Center vertically
                            left: '50%', // Center horizontally
                            transform: 'translate(-50%, -50%)', // Adjust for icon size
                            cursor: 'pointer',
                            display: editing ? 'block' : 'none', // Show only when editing
                            color: '#e74c3c', // Pencil color
                            fontSize: '24px', // Adjust icon size as needed
                            background: 'rgba(255, 255, 255, 0.6)', // Optional background to highlight icon
                            borderRadius: '50%', // Optional: round background
                            padding: '5px', // Optional: padding for click area
                        }}
                    >
                        ✏️
                    </label>
                </div>
                <div className="mb-3">
                    <label className="form-label">Name:</label>
                    <p className="form-control bg-dark text-light">{name}</p>
                </div>
                <div className="mb-3">
                    <label className="form-label">Email:</label>
                    <p className="form-control bg-dark text-light">{email}</p>
                </div>
                {!editing ? (
                    <button className="btn btn-outline-secondary w-100" onClick={handleEdit}>
                        ✏️ Edit Profile
                    </button>
                ) : (
                    <div className="d-flex justify-content-between">
                        <button type="button" className="btn btn-outline-danger" onClick={handleCancel}>
                            Cancel
                        </button>
                        <button type="button" className="btn btn-success" onClick={handleSave}>
                            Save
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
