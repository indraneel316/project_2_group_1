import React, { useContext, useState } from 'react';
import axios from 'axios';
import { UserContext } from '../context/userContext';
// import 'bootstrap/dist/css/bootstrap.min.css';
import './Profile.css'

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

    const handleFileChange = (e) => setNewProfilePicture(e.target.files[0]);

    const handleSave = async () => {
        try {
            const formData = new FormData();
            formData.append('name', name);
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
                {!editing ? (
                    <div>
                        <div className="d-flex justify-content-center mb-3">
                            <img
                                src={profilePicture || 'https://www.clipartmax.com/png/middle/17-172602_computer-icons-user-profile-male-portrait-of-a-man.png'}
                                alt="Profile"
                                className="rounded-circle"
                                style={{ width: '100px', height: '100px', objectFit: 'cover', border: '2px solid #fff' }}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Name:</label>
                            <p className="form-control bg-dark text-light">{name}</p>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Email:</label>
                            <p className="form-control bg-dark text-light">{email}</p>
                        </div>
                        <button className="btn btn-outline-secondary w-100" onClick={handleEdit}>
                            ✏️ Edit Profile
                        </button>
                    </div>
                ) : (
                    <form>
                        <div className="mb-3">
                            <label className="form-label">Name:</label>
                            <input
                                type="text"
                                className="form-control bg-dark text-light"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Email:</label>
                            <input
                                type="email"
                                className="form-control bg-dark text-light"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Profile Picture:</label>
                            <input
                                type="file"
                                className="form-control bg-dark text-light"
                                onChange={handleFileChange}
                            />
                        </div>
                        <div className="d-flex justify-content-between">
                            <button type="button" className="btn btn-outline-danger" onClick={handleCancel}>
                                Cancel
                            </button>
                            <button type="button" className="btn btn-success" onClick={handleSave}>
                                Save Changes
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Profile;
