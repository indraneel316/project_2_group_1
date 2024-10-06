import React, { useState, useContext } from 'react';
import axios from 'axios';
import FacebookLogin from 'react-facebook-login';
import { UserContext } from '../context/userContext';
import { useNavigate } from 'react-router-dom';
import './SignIn.css';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSignIn = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous error

        try {
            const response = await axios.post('http://localhost:5000/api/users/signin', { email, password });

            // Store token in sessionStorage
            sessionStorage.setItem('authToken', response.data.token);

            // Update user context with the signed-in user data
            setUser(response.data.user);
            navigate('/');
        } catch (error) {
            console.error('Error signing in:', error);
            setError('Failed to sign in. Please check your credentials.'); // Set error message
        }
    };

    const responseFacebook = async (response) => {
        if (response.accessToken) {
            try {
                const res = await axios.post('http://localhost:5000/api/users/auth/facebook', {
                    accessToken: response.accessToken
                });

                // Store token in sessionStorage
                sessionStorage.setItem('authToken', res.data.token);

                // Update user context with Facebook user data
                setUser(res.data.user);
                navigate('/');
            } catch (error) {
                console.error('Error during Facebook authentication:', error);
                setError('Failed to authenticate with Facebook.');
            }
        } else {
            console.error('Failed to obtain access token from Facebook');
            setError('Could not log in with Facebook');
        }
    };

    return (
        <div className="sign-in-wrapper">
            <div className="sign-in-container">
                <h1 className="text-center mb-4">Sign In</h1>
                <form onSubmit={handleSignIn} className="sign-in-form">
                    <div className="mb-3">
                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-danger w-100">
                        Sign In
                    </button>
                    {error && <p className="text-warning mt-2">{error}</p>}
                </form>
                <FacebookLogin
                    appId="1957293021457370"
                    autoLoad={false}
                    fields="name,email,picture"
                    callback={responseFacebook}
                    cssClass="btn btn-primary w-100 mt-3"
                    textButton="Login with Facebook"
                />
                <p className="mt-3">
                    Don't have an account? <a href="/signup" className="text-danger">Sign Up</a>
                </p>
            </div>
        </div>
    );
};

export default SignIn;
