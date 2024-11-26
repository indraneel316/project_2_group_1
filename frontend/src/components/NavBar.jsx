import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './NavBar.css'; // Import custom styles

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
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top" style={{position:"sticky"}}>
            <div className="container-fluid">
                <Link className="navbar-brand text-danger" to="/">NutriNinja</Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    onClick={toggleBreadcrumbs}
                    aria-controls="navbarNav"
                    aria-expanded={showBreadcrumbs}
                    aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className={`collapse navbar-collapse ${showBreadcrumbs ? 'show' : ''}`} id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/" onClick={handleLinkClick}>Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/about" onClick={handleLinkClick}>About</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/product" onClick={handleLinkClick}>Photos</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/contact" onClick={handleLinkClick}>Contact</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/users" onClick={handleLinkClick}>Users</Link>
                        </li>
                        {user ? (
                            <>
                                <li className="nav-item">
                                    <span className="nav-link" style={{cursor: 'pointer'}} onClick={onSignOut}>
                                        Sign Out
                                    </span>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/profile" onClick={handleLinkClick}>
                                        <img
                                            src={user.profilePicture || 'https://www.clipartmax.com/png/middle/17-172602_computer-icons-user-profile-male-portrait-of-a-man.png'}
                                            alt="Profile"
                                            className="rounded-circle"
                                            style={{
                                                width: '40px',
                                                height: '40px',
                                                objectFit: 'cover',
                                                border: '2px solid #fff'
                                            }}
                                        />
                                    </Link>
                                </li>
                            </>
                        ) : (
                            <li className="nav-item">
                                <Link className="nav-link text-danger" to="/signin" onClick={handleLinkClick}>Sign
                                    In</Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
