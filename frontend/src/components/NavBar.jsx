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
    };

    const toggleBreadcrumbs = () => {
        setShowBreadcrumbs(!showBreadcrumbs);
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
            <div className="container-fluid">
                <Link className="navbar-brand text-danger" to="/">NutriNinja</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item d-lg-none">
                            <span className="nav-link" onClick={toggleBreadcrumbs}
                                  style={{cursor: 'pointer'}}>Menu</span>
                        </li>
                        {showBreadcrumbs && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/">Home</Link>
                                <Link className="nav-link" to="/about">About</Link>
                                <Link className="nav-link" to="/product">Product</Link>
                                <Link className="nav-link" to="/contact">Contact</Link>

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
                            <Link className="nav-link" to="/contact">Contact</Link>
                        </li>
                        {user ? (
                            <>
                                <li className="nav-item">
                                    <span className="nav-link" style={{cursor: 'pointer'}}
                                          onClick={onSignOut}>Sign Out</span>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/profile">
                                        <img
                                            src={user.profilePicture || 'https://via.placeholder.com/40'}
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
