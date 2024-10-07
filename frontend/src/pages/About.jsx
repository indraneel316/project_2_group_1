import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const About = () => {
    return (
        <div className="container-fluid bg-black text-white min-vh-100 d-flex align-items-center justify-content-center"
        style={{position:'absolute', marginTop:'3rem'}}>
            <div className="p-5 rounded" style={{maxWidth: '900px'}}>
                <h1 className="display-4 mb-4 text-danger text-center">Discover Nutrition with Precision</h1>

                <p className="lead text-center mb-5">
                    Welcome to <strong>NutriNinja</strong>, where we are changing the way you interact with food! Our
                    mission is to provide instant, accurate, and easy-to-understand nutrition information using
                    innovative food recognition technology. Whether you're trying to improve your diet, manage health
                    conditions, or simply curious about what’s in your food, we’ve got you covered.
                </p>

                <h2 className="text-danger mt-5 mb-3">Our Mission</h2>
                <p className="lead text-center mb-5">
                    At NutriNinja, we believe that making informed food choices should be accessible to everyone. Our
                    mission is to empower individuals with the knowledge they need to live healthier, happier lives by
                    breaking down the complex world of nutrition into simple, actionable insights. With real-time
                    analysis, our app helps users understand the nutritional content of meals, plan their diet, and
                    achieve their health goals more easily than ever before.
                </p>

                <h2 className="text-danger mt-5 mb-3">How It Works</h2>
                <p className="lead text-center mb-5">
                    Our technology uses advanced image recognition algorithms to analyze food photos and provide
                    accurate nutritional breakdowns within seconds. Whether you're at home, in a restaurant, or shopping
                    for groceries, simply snap a picture, and our app will detect the food and its nutritional values,
                    including calories, macronutrients, vitamins, and minerals.
                </p>
                <p className="lead text-center mb-5">
                    We leverage the power of machine learning and a vast food database to constantly improve our
                    recognition accuracy and expand the types of foods we can identify, including regional dishes and
                    specialty diets.
                </p>

                <h2 className="text-danger mt-5 mb-3">Why Choose NutriNinja?</h2>
                <ul className="list-unstyled">
                    <li className="lead mb-2">
                        <span className="text-danger">Instant Feedback:</span> Receive quick and accurate nutrition
                        insights with just a photo.
                    </li>
                    <li className="lead mb-2">
                        <span className="text-danger">Comprehensive Database:</span> Access detailed information on
                        thousands of foods and ingredients from around the world.
                    </li>
                    <li className="lead mb-2">
                        <span className="text-danger">Custom Diet Planning:</span> Tailor your food choices based on
                        your goals—whether it's weight loss, muscle gain, or specific health concerns like diabetes or
                        heart health.
                    </li>
                    <li className="lead mb-2">
                        <span className="text-danger">User-Friendly Interface:</span> Our app is designed with
                        simplicity in mind, making it easy for everyone, from health enthusiasts to beginners, to
                        navigate and use.
                    </li>
                </ul>

                <h2 className="text-danger mt-5 mb-3">Join Us in the Journey to Health</h2>
                <p className="lead text-center mb-5">
                    We’re not just a tech company — we’re part of a global movement towards better nutrition, healthier
                    lifestyles, and more informed eating. Join thousands of users who are making smarter, healthier food
                    choices every day with NutriNinja.
                </p>
                <p className="text-center mt-4">
                    <a href="/product" className="btn btn-danger btn-lg">
                        Explore Our Work
                    </a>
                </p>
            </div>
        </div>
    );
};

export default About;
