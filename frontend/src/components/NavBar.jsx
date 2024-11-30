import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userContext';
import { motion, AnimatePresence } from 'framer-motion';
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
        <motion.nav
            className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
            <div className="container-fluid">
                <Link
                    className="navbar-brand text-danger"
                    to="/"
                    style={{ textDecoration: 'none' }}
                >
                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        NutriNinja
                    </motion.div>
                </Link>
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
                <AnimatePresence>
                    {showBreadcrumbs && (
                        <motion.div
                            className={`collapse navbar-collapse ${showBreadcrumbs ? 'show' : ''}`}
                            id="navbarNav"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <ul className="navbar-nav ms-auto">
                                <motion.li
                                    className="nav-item"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <Link className="nav-link" to="/" onClick={handleLinkClick}>
                                        Home
                                    </Link>
                                </motion.li>
                                <motion.li
                                    className="nav-item"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <Link className="nav-link" to="/about" onClick={handleLinkClick}>
                                        About
                                    </Link>
                                </motion.li>
                                <motion.li
                                    className="nav-item"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <Link className="nav-link" to="/product" onClick={handleLinkClick}>
                                        Photos
                                    </Link>
                                </motion.li>
                                <motion.li
                                    className="nav-item"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <Link className="nav-link" to="/contact" onClick={handleLinkClick}>
                                        Contact
                                    </Link>
                                </motion.li>
                                <motion.li
                                    className="nav-item"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <Link className="nav-link" to="/users" onClick={handleLinkClick}>
                                        Users
                                    </Link>
                                </motion.li>
                                {user ? (
                                    <>
                                        <motion.li
                                            className="nav-item"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <span
                                                className="nav-link"
                                                style={{ cursor: 'pointer' }}
                                                onClick={onSignOut}
                                            >
                                                Sign Out
                                            </span>
                                        </motion.li>
                                        <motion.li
                                            className="nav-item"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <Link
                                                className="nav-link"
                                                to="/profile"
                                                onClick={handleLinkClick}
                                            >
                                                <img
                                                    src={
                                                        user.profilePicture ||
                                                        'https://www.clipartmax.com/png/middle/17-172602_computer-icons-user-profile-male-portrait-of-a-man.png'
                                                    }
                                                    alt="Profile"
                                                    className="rounded-circle"
                                                    style={{
                                                        width: '40px',
                                                        height: '40px',
                                                        objectFit: 'cover',
                                                        border: '2px solid #fff',
                                                    }}
                                                />
                                            </Link>
                                        </motion.li>
                                    </>
                                ) : (
                                    <motion.li
                                        className="nav-item"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <Link
                                            className="nav-link text-danger"
                                            to="/signin"
                                            onClick={handleLinkClick}
                                        >
                                            Sign In
                                        </Link>
                                    </motion.li>
                                )}
                            </ul>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.nav>
    );
};

export default NavBar;
