import React, { useContext, useState } from 'react';
import axios from 'axios';
import { UserContext } from '../context/userContext';
import Particles from 'react-tsparticles';
import { loadFirePreset } from 'tsparticles-preset-fire';
import './CustomUpload.css';

const CustomUpload = ({ onUploadComplete }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadPreview, setUploadPreview] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { user } = useContext(UserContext);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const validTypes = ['image/jpeg', 'image/png'];
            if (!validTypes.includes(file.type)) {
                setError('Invalid file type. Please upload a JPEG or PNG image.');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                setError('File size exceeds 5MB. Please choose a smaller image.');
                return;
            }
            setSelectedFile(file);
            setUploadPreview(URL.createObjectURL(file));
            setError('');
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setError('Please select a photo');
            return;
        }

        const formData = new FormData();
        formData.append('photo', selectedFile);

        setLoading(true);
        setError('');

        try {
            const response = await axios.put(
                `http://localhost:5000/backend/api/users/add-photo/${user.email}`,
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );

            if (onUploadComplete) onUploadComplete(response.data.photos);
            setSelectedFile(null);
            setUploadPreview('');
        } catch (err) {
            console.error('Error uploading photo:', err.response?.data || err.message);
            setError(err.response?.data?.message || 'Failed to upload photo.');
        } finally {
            setLoading(false);
        }
    };

    const particlesInit = async (engine) => {
        await loadFirePreset(engine);
    };

    return (
        <div className="custom-upload-container">
            {/* Fire effect background */}
            <Particles
                id="tsparticles"
                init={particlesInit}
                options={{
                    preset: "fire",
                    background: {
                        color: "transparent",
                    },
                }}
            />

            <div className="upload-card">
                <h4 className="upload-title">Get Your Recipe!</h4>
                {error && <div className="error-message">{error}</div>}
                {uploadPreview && (
                    <div className="preview-container">
                        <img
                            src={uploadPreview}
                            alt="Preview"
                            className="preview-image"
                        />
                    </div>
                )}
                <div className="file-input-wrapper">
                    <input
                        type="file"
                        id="file-input"
                        className="file-input"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                    <label htmlFor="file-input" className="file-label">
                        {selectedFile ? 'Change Photo' : 'Upload Photo'}
                    </label>
                </div>
                <button
                    className={`upload-button ${loading ? 'disabled' : ''}`}
                    onClick={handleUpload}
                    disabled={loading}
                >
                    {loading ? 'Uploading...' : 'Post'}
                </button>
            </div>
        </div>
    );
};

export default CustomUpload;
