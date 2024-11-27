import React, {useContext, useState} from 'react';
import axios from 'axios';
import './CustomUpload.css';
import {UserContext} from "../context/userContext";

const CustomUpload = ({ onUploadComplete }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadPreview, setUploadPreview] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { user } = useContext(UserContext);


    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setUploadPreview(URL.createObjectURL(file));
            setError(''); // Clear any previous errors
        }
    };



    const handleUpload = async () => {
        if (!selectedFile) {
            setError('Please select a file to upload.');
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
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            const newPhotosArray = response.data.photos;

            if (onUploadComplete) {
                onUploadComplete(newPhotosArray);
            }
            setSelectedFile(null);
            setUploadPreview('');
        } catch (err) {
            console.error('Error uploading photo:', err.response?.data || err.message);
            setError('Failed to upload photo. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="custom-upload bg-light p-4 rounded shadow">
            <h4 className="text-center mb-3 text-danger">Upload a Photo</h4>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="mb-3">
                <input type="file" className="form-control" accept="image/*" onChange={handleFileChange} />
            </div>
            {uploadPreview && (
                <div className="text-center mb-3">
                    <img src={uploadPreview} alt="Preview" className="upload-preview img-thumbnail rounded" />
                </div>
            )}
            <button onClick={handleUpload} className="btn btn-danger w-100" disabled={loading}>
                {loading ? 'Uploading...' : 'Upload Photo'}
            </button>
        </div>
    );
};

export default CustomUpload;
