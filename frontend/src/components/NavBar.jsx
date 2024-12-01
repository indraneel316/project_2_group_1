import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './NavBar.css'; // Custom styles for animations and responsiveness

const NavBar = () => {
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const [showBreadcrumbs, setShowBreadcrumbs] = useState(false);

    const onSignOut = () => {
        setUser(null);
        navigate('/signin');
        setShowBreadcrumbs(false); // Close dropdown after sign-out
    };

    const toggleBreadcrumbs = () => {
        setShowBreadcrumbs(!showBreadcrumbs);
    };

    const handleLinkClick = () => {
        setShowBreadcrumbs(false); // Close dropdown after any link is clicked
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top animated-navbar">
            <div className="container-fluid">
                {/* Navbar Brand */}
                <Link className="navbar-brand text-danger logo-animation" to="/">
                    NutriNinja
                </Link>

                {/* Navbar Toggler for Mobile View */}
                <button
                    className="navbar-toggler"
                    type="button"
                    onClick={toggleBreadcrumbs}
                    aria-controls="navbarNav"
                    aria-expanded={showBreadcrumbs}
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Navbar Items */}
                <div className={`collapse navbar-collapse ${showBreadcrumbs ? 'show' : ''}`} id="navbarNav">
                    <ul className="navbar-nav ms-auto text-right align-items-center">
                        <li className="nav-item">
                            <Link className="nav-link nav-animation" to="/" onClick={handleLinkClick}>
                                Home
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link nav-animation" to="/about" onClick={handleLinkClick}>
                                About
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link nav-animation" to="/product" onClick={handleLinkClick}>
                                Photos
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link nav-animation" to="/contact" onClick={handleLinkClick}>
                                Contact
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link nav-animation" to="/users" onClick={handleLinkClick}>
                                Users
                            </Link>
                        </li>
                        {user ? (
                            <>
                                <li className="nav-item">
                                    <span
                                        className="nav-link nav-animation sign-out"
                                        style={{ cursor: 'pointer' }}
                                        onClick={onSignOut}
                                    >
                                        Sign Out
                                    </span>
                                </li>
                                <li className="nav-item d-flex align-items-center">
                                    <Link className="nav-link p-0" to="/profile" onClick={handleLinkClick}>
                                        <img
                                            src={
                                                user.profilePicture ||
                                                'https://www.clipartmax.com/png/middle/17-172602_computer-icons-user-profile-male-portrait-of-a-man.png'
                                            }
                                            alt="Profile"
                                            className="rounded-circle profile-animation"
                                        />
                                    </Link>
                                </li>
                            </>
                        ) : (
                            <li className="nav-item">
                                <Link
                                    className="nav-link nav-animation text-danger"
                                    to="/signin"
                                    onClick={handleLinkClick}
                                >
                                    Sign In
                                </Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
