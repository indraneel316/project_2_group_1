import React, { useState, useContext } from 'react';
import axios from 'axios';
import FacebookLogin from 'react-facebook-login';
import { UserContext } from '../context/userContext';
import { useNavigate } from 'react-router-dom';
import './SignIn.css';
import {getApiUrl} from "../util/ApiUrl";




const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSignIn = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const apiUrl = await getApiUrl();
            const response = await axios.post(`${apiUrl}/auth/users/signin`, { email, password });

            sessionStorage.setItem('authToken', response.data.token);

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
                const apiUrl = await getApiUrl();

                const res = await axios.post(`${apiUrl}/auth/users/facebook`, {
                    accessToken: response.accessToken
                });

                sessionStorage.setItem('authToken', res.data.token);

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
        <div className="sign-in-wrapper" style={{position: 'absolute',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            top: '25%',
            width: '100%'}}>
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
                    scope="public_profile,email,user_photos"
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
