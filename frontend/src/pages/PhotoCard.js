import React from 'react';
import "./PhotoCard.css";

const PhotoCard = ({ photoUrl, index, onClick, onRemove }) => {
    const handleRemoveClick = (e) => {
        e.stopPropagation(); // Prevent the card's click event from firing
        onRemove(photoUrl); // Trigger the onRemove callback
    };

    return (
        <div className="col-md-4 mb-4 d-flex justify-content-center photo-card-wrapper">
            <div
                className="photo-card shadow"
                onClick={() => onClick(photoUrl)} // Handle card click
            >
                {/* Image */}
                <img
                    src={photoUrl}
                    alt={`User photo ${index + 1}`}
                    className="photo-card-img"
                />

                {/* Overlay with title */}
                <div className="photo-card-overlay">
                    <h5 className="photo-card-title">View Photo</h5>
                </div>

                {/* Remove Button */}
                <button
                    className="photo-card-close-btn"
                    onClick={handleRemoveClick}
                    aria-label="Remove Photo"
                >
                    X
                </button>
            </div>
        </div>
    );
};

export default PhotoCard;
