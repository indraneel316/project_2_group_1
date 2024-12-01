import React from 'react';

const PhotoCard = ({ photoUrl, index, onClick }) => (
    <div className="col-md-4 mb-4 d-flex justify-content-center">
        <div
            className="card bg-danger text-white h-100 shadow"
            onClick={() => onClick(photoUrl)}
        >
            <img
                src={photoUrl}
                alt={`User photo ${index + 1}`}
                className="card-img-top consistent-img"
            />
            <div className="card-body d-flex flex-column justify-content-between">
                <h5 className="card-title">Photo {index + 1}</h5>
            </div>
        </div>
    </div>
);

export default PhotoCard;
