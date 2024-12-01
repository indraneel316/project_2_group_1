import React from 'react';

import "./PhotoCard.css";

const PhotoCard = ({ photoUrl, index, onClick, onRemove }) => {
    // This function ensures the close button triggers the removal, not the card itself
    const handleRemoveClick = (e) => {
        e.stopPropagation(); // Prevent triggering the card click event
        onRemove(photoUrl); // Call onRemove prop with the photoUrl
    };

    return (
        <div className="col-md-4 mb-4 d-flex justify-content-center">
            <div
                className="card bg-danger text-white h-100 shadow"
                onClick={() => onClick(photoUrl)} // Trigger onClick passed from the parent
            >
                {/* Photo image */}
                <img
                    src={photoUrl}
                    alt={`User photo ${index + 1}`}
                    className="card-img-top consistent-img"
                />

                {/* Close button */}
                <button
                    className="photo-card-close-btn"
                    onClick={handleRemoveClick}
                    aria-label="Remove Photo"
                >
                    X
                </button>

                {/* Card body (optional extra content) */}
                <div className="card-body d-flex flex-column justify-content-between">
                    <h5 className="card-title">Photo {index + 1}</h5>
                </div>
            </div>
        </div>
    );
};

export default PhotoCard;

