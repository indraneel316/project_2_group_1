import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './Home.css'; // Custom styles

const Home = () => {
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="home-container">
            {/* Background Video */}
            <video className="background-video" autoPlay loop muted>
                <source src="/path-to-your-video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            {/* Overlay for Text Content */}
            <div className="overlay d-flex justify-content-center align-items-center">
                <div className="text-center text-white">
                    <h1 className="display-4 mb-4 text-danger">Discover Nutrition with Precision</h1>
                    <p className="lead mb-5">
                        Our cutting-edge app uses AI to recognize food and provides real-time nutritional information. Make smarter dietary choices instantly!
                    </p>
                    <button
                        className="btn btn-lg btn-danger"
                        onClick={() => setShowModal(true)}>Learn More
                    </button>
                </div>
            </div>

            {/* Modal for additional information */}
            {showModal && (
                <div className="modal" tabIndex="-1" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content" style={{ backgroundColor: 'black', color: 'white' }}>
                            <div className="modal-header" style={{ position: 'relative' }}>
                                <h5 className="modal-title text-danger">Unleash the Power of Nutrition</h5>
                                {/* Close button with no background positioned at the top right */}
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
                                        cursor: 'pointer'
                                    }}>
                                    &times;
                                </button>
                            </div>
                            <div className="modal-body">
                                <p>Discover how our innovative app transforms your food choices with precise nutritional insights. Here’s what we offer:</p>
                                <ul>
                                    <li><strong>Smart Food Recognition:</strong> Instantly identify a variety of foods using your smartphone camera.</li>
                                    <li><strong>Nutritional Breakdown:</strong> Get detailed information on calories, proteins, fats, carbs, and essential vitamins for every food item.</li>
                                    <li><strong>Personalized Nutrition:</strong> Receive tailored recommendations based on your dietary goals and preferences.</li>
                                    <li><strong>Meal Logging Made Easy:</strong> Keep track of your meals effortlessly with simple logging features.</li>
                                    <li><strong>Diet Compatibility:</strong> Support for various dietary lifestyles, including vegan, keto, gluten-free, and more.</li>
                                </ul>
                                <p>Elevate your nutrition game and make informed choices effortlessly!</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
