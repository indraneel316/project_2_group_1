import React, { useState } from 'react';
import { Fade, Slide, Zoom } from 'react-reveal';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css';

const Home = () => {
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="home-container">
            <div className="overlay d-flex justify-content-center align-items-center">
                <div className="text-center text-white">
                    <Fade top>
                        <h1 className="display-4 mb-4 text-danger">
                            Your Personal Cooking Assistant
                        </h1>
                    </Fade>
                    <Fade delay={300}>
                        <p className="lead mb-5">
                            Welcome to <strong>NutriNinja</strong>, your one-stop solution for a personalized culinary
                            experience. Explore recipes tailored to your needs with advanced AI-driven insights.
                        </p>
                    </Fade>
                    <Zoom>
                        <button
                            className="btn btn-lg btn-danger"
                            onClick={() => setShowModal(true)}
                        >
                            Learn More
                        </button>
                    </Zoom>
                </div>
            </div>

            {showModal && (
                <div
                    className="modal"
                    tabIndex="-1"
                    style={{
                        display: 'block',
                        backgroundColor: 'rgba(0, 0, 0, 0.9)',
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                    }}
                >
                    <div className="modal-dialog">
                        <Slide bottom>
                            <div
                                className="modal-content"
                                style={{
                                    backgroundColor: 'black',
                                    color: 'white',
                                    borderRadius: '8px',
                                }}
                            >
                                <div className="modal-header">
                                    <Fade top>
                                        <h5 className="modal-title text-danger">
                                            Key Features of NutriNinja
                                        </h5>
                                    </Fade>
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        aria-label="Close"
                                        style={{
                                            position: 'absolute',
                                            right: '10px',
                                            top: '10px',
                                            background: 'none',
                                            border: 'none',
                                            color: 'red',
                                            fontSize: '1.5rem',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        &times;
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <Fade bottom cascade>
                                        <p>
                                            NutriNinja redefines how you cook and eat. Here’s what we offer:
                                        </p>
                                        <ul>
                                            <li>
                                                <strong>Photo Access and Selection:</strong> Select food photos from
                                                your Facebook account, use a public URL, or upload directly.
                                            </li>
                                            <li>
                                                <strong>Food Recognition:</strong> Powered by Google Vision API to
                                                identify and label food items in your photos.
                                            </li>
                                            <li>
                                                <strong>Recipe Suggestions:</strong> Get personalized recommendations
                                                through Open-ai API based on identified food items.
                                            </li>
                                            <li>
                                                <strong>Interactive Recipe Exploration:</strong> View detailed recipes
                                                with step-by-step cooking instructions.
                                            </li>
                                        </ul>
                                        <p>
                                            Join thousands of users in creating delicious meals and embracing a smarter,
                                            more personalized culinary journey.
                                        </p>
                                    </Fade>
                                </div>
                            </div>
                        </Slide>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
