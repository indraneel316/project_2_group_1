import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../context/userContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './UserPhotos.css';
import CustomUpload from './CustomUpload';
import PhotoCard from './PhotoCard';
import PhotoModal from './PhotoModal';
import LoadingSpinner from './LoadingSpinner';

const UserPhotos = () => {
    const { user } = useContext(UserContext);
    const [photos, setPhotos] = useState([]);
    const [photoData, setPhotoData] = useState({});
    const [error, setError] = useState('');
    const [selectedPhotoUrl, setSelectedPhotoUrl] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchPhotos = async () => {
            if (!user?.email) {
                setError('User email is missing.');
                return;
            }
            try {
                const response = await axios.get('http://localhost:5001/backend/api/users/photos', {
                    params: { email: user.email },
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                setPhotos(response.data.photos);
            } catch (err) {
                setError('Failed to load photos.');
                console.error('Error fetching photos:', err);
            }
        };

        fetchPhotos();
    }, [user]);

    const updatePhotoData = (photoUrl, update) => {
        setPhotoData((prevState) => ({
            ...prevState,
            [photoUrl]: {
                ...prevState[photoUrl],
                ...update,
            },
        }));
    };

    const handleUploadComplete = (newPhotos) => {
        setPhotos(newPhotos);
        setError('');
    };

    return (
        <div className="container user-photos">
            <h1 className="text-center mb-4 title">Review Your Food Photos</h1>
            {error && <div className="alert alert-danger">{error}</div>}

            <CustomUpload onUploadComplete={handleUploadComplete} />

            <div className="row photo-gallery">
                {photos.map((photoUrl, index) => (
                    <PhotoCard
                        key={index}
                        photoUrl={photoUrl}
                        onClick={() => setSelectedPhotoUrl(photoUrl)}
                    />
                ))}
            </div>

            {selectedPhotoUrl && (
                <PhotoModal
                    photoUrl={selectedPhotoUrl}
                    photoData={photoData[selectedPhotoUrl] || {}}
                    setSelectedPhotoUrl={setSelectedPhotoUrl}
                    updatePhotoData={updatePhotoData}
                    setLoading={setLoading}
                />
            )}

            {loading && <LoadingSpinner text="Processing..." />}
        </div>
    );
};

export default UserPhotos;
