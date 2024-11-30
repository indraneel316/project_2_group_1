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
                            Discover Nutrition with Precision
                        </h1>
                    </Fade>
                    <Fade delay={300}>
                        <p className="lead mb-5">
                            Our cutting-edge app uses AI to recognize food and provides real-time nutritional
                            information. Make smarter dietary choices instantly!
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
                                            Unleash the Power of Nutrition
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
                                            Discover how our innovative app transforms your food choices with precise
                                            nutritional insights. Here’s what we offer:
                                        </p>
                                        <ul>
                                            <li>
                                                <strong>Smart Food Recognition:</strong> Instantly identify a variety of
                                                foods using your smartphone camera.
                                            </li>
                                            <li>
                                                <strong>Nutritional Breakdown:</strong> Get detailed information on
                                                calories, proteins, fats, carbs, and essential vitamins for every food
                                                item.
                                            </li>
                                            <li>
                                                <strong>Personalized Nutrition:</strong> Receive tailored
                                                recommendations based on your dietary goals and preferences.
                                            </li>
                                            <li>
                                                <strong>Meal Logging Made Easy:</strong> Keep track of your meals
                                                effortlessly with simple logging features.
                                            </li>
                                            <li>
                                                <strong>Diet Compatibility:</strong> Support for various dietary
                                                lifestyles, including vegan, keto, gluten-free, and more.
                                            </li>
                                        </ul>
                                        <p>
                                            Elevate your nutrition game and make informed choices effortlessly!
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
