import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ text }) => (
    <div className="spinner-wrapper">
        <div className="spinner"></div>
        <p className="spinner-text">{text}</p>
    </div>
);

export default LoadingSpinner;
