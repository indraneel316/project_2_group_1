import React from 'react';

const LoadingSpinner = ({ text }) => (
    <div className="text-center my-5">
        <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-white">{text}</p>
    </div>
);

export default LoadingSpinner;
