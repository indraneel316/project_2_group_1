import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Fade, Slide } from 'react-reveal';

const About = () => {
    return (
        <div
            className="container-fluid bg-black text-white min-vh-100 d-flex align-items-center justify-content-center"
            style={{ position: 'absolute', marginTop: '3rem' }}
        >
            <div className="p-5 rounded" style={{ maxWidth: '900px' }}>
                <Fade top>
                    <h1 className="display-4 mb-4 text-danger text-center">Your Personal Cooking Assistant</h1>
                </Fade>

                <Slide bottom>
                    <p className="lead text-justify mb-5">
                        Welcome to <strong>NutriNinja</strong>, your one-stop solution for a personalized culinary
                        experience. With our app, seamlessly integrate your Facebook account to access food photos, or
                        use public URLs and manual uploads to explore recipes tailored to your needs. Let’s redefine how
                        you cook and eat, one dish at a time!
                    </p>
                </Slide>

                <Fade top>
                    <h2 className="text-danger mt-5 mb-3">Key Features</h2>
                </Fade>

                <Slide bottom cascade>
                    <ul className="list-unstyled mb-5">
                        <li className="lead mb-4">
                            <span className="text-danger">Photo Access and Selection:</span> Select food photos from your
                            Facebook account, use a public URL, or upload directly.
                        </li>
                        <li className="lead mb-4">
                            <span className="text-danger">Food Recognition:</span> Powered by Google Vision API to
                            identify and label food items in your photos.
                        </li>
                        <li className="lead mb-4">
                            <span className="text-danger">Recipe Suggestions:</span> Get recipe recommendations through
                            Spoonacular API based on identified food items.
                        </li>
                        <li className="lead mb-4">
                            <span className="text-danger">Interactive Recipe Exploration:</span> View detailed recipes
                            with step-by-step cooking instructions for a delightful cooking experience.
                        </li>
                    </ul>
                </Slide>

                <Fade top>
                    <h2 className="text-danger mt-5 mb-3">Why NutriNinja?</h2>
                </Fade>

                <Slide bottom>
                    <p className="lead text-justify mb-5">
                        NutriNinja combines cutting-edge technology with user-friendly design to bring the joy of
                        cooking to everyone. Whether you're a seasoned chef or a beginner, our app makes exploring,
                        preparing, and enjoying meals a breeze.
                    </p>
                </Slide>

                <Fade top>
                    <h2 className="text-danger mt-5 mb-3">Join Our Culinary Revolution</h2>
                </Fade>

                <Slide bottom>
                    <p className="lead text-justify mb-5">
                        Join thousands of users in creating delicious meals and making informed cooking decisions every
                        day. With NutriNinja, you’re not just cooking—you’re embracing a smarter, more personalized
                        culinary journey.
                    </p>
                    <p className="text-center mt-4">
                        <a href="/frontend/src/pages/UserPhotos" className="btn btn-danger btn-lg">
                            Explore Recipes
                        </a>
                    </p>
                </Slide>
            </div>
        </div>
    );
};

export default About;
