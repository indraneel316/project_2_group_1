import React from 'react';
import './PhotoCard.css';

const PhotoCard = ({ photoUrl, onClick }) => (
    <div className="col-md-4 mb-4 d-flex justify-content-center photo-card-wrapper">
        <div className="photo-card shadow" onClick={onClick}>
            <img
                src={photoUrl}
                alt="User photo"
                className="photo-card-img"
            />
            <div className="photo-card-overlay">
                <h5 className="photo-card-title">View Photo</h5>
            </div>
        </div>
    </div>
);

export default PhotoCard;
