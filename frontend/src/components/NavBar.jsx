import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userContext'; // Adjust the path according to your project structure
import 'bootstrap/dist/css/bootstrap.min.css';
import './NavBar.css'; // Import custom styles

const NavBar = () => {
    const { user, setUser } = useContext(UserContext); // Get user state from context
    const navigate = useNavigate();
    const [showBreadcrumbs, setShowBreadcrumbs] = useState(false);

    const onSignOut = () => {
        // Clear user context and any other related data (like tokens)
        setUser(null); // Clear the user session
        // Redirect to the Sign In page
        navigate('/signin');
    };

    const toggleBreadcrumbs = () => {
        setShowBreadcrumbs(!showBreadcrumbs);
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
            <div className="container-fluid">
                <Link className="navbar-brand text-danger" to="/">FoodRecognition</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
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
                        {user ? (
                            <>
                                <li className="nav-item">
                                    <span className="nav-link" style={{ cursor: 'pointer' }} onClick={onSignOut}>Sign Out</span>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link text-danger" to="/upload-profile-picture">👤</Link>
                                </li>
                            </>
                        ) : (
                            <li className="nav-item">
                                <Link className="nav-link text-danger" to="/signin">Sign In</Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
