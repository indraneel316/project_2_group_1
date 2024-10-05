import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './NavBar.css'; // Import custom styles

const NavBar = ({ onSignOut }) => {
    const [showBreadcrumbs, setShowBreadcrumbs] = useState(false);

    const toggleBreadcrumbs = () => {
        setShowBreadcrumbs(!showBreadcrumbs);
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
            <div className="container-fluid"> {/* Use container-fluid for full-width */}
                <Link className="navbar-brand text-danger" to="/">FoodRecognition</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto"> {/* ms-auto will align items to the right */}
                        <li className="nav-item d-lg-none">
                            <span className="nav-link" onClick={toggleBreadcrumbs} style={{ cursor: 'pointer' }}>Menu</span>
                        </li>
                        {showBreadcrumbs && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/">Home</Link>
                                <Link className="nav-link" to="/about">About</Link>
                                <Link className="nav-link" to="/product">Product</Link>
                            </li>
                        )}
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/about">About</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/product">Product</Link>
                        </li>
                        <li className="nav-item">
                            <span className="nav-link" style={{ cursor: 'pointer' }} onClick={onSignOut}>Sign Out</span>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link text-danger" to="/upload-profile-picture">👤</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
