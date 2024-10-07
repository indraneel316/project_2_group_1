import React, { useState, useContext } from 'react';
import axios from 'axios';
import FacebookLogin from 'react-facebook-login';
import { UserContext } from '../context/userContext';
import { useNavigate } from 'react-router-dom';
import './SignIn.css';



const SignUp = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSignUp = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post('http://3.131.213.236:5000/auth/users/signup', { username, email, password });
            setUser(response.data.user);
            navigate('/');
        } catch (error) {
            console.error('Error signing up:', error);
            setError('Failed to sign up. Please try again.');
        }
    };

    // const responseFacebook = async (response) => {
    //     if (response.accessToken) {
    //         try {
    //             const res = await axios.post('https://18.216.109.236:5000/auth/users/facebook', {
    //                 accessToken: response.accessToken
    //             });
    //             setUser(res.data.user);
    //             navigate('/');
    //         } catch (error) {
    //             console.error('Error during Facebook authentication:', error);
    //             setError('Failed to authenticate with Facebook.');
    //         }
    //     } else {
    //         console.error('Failed to obtain access token from Facebook');
    //         setError('Could not log in with Facebook');
    //     }
    // };

    return (
        <div className="sign-up-wrapper" style={{position: 'absolute',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            top: '25%',
            width: '100%'}}>
            <div className="sign-up-container">
                <h1 className="text-center mb-4">Sign Up</h1>
                <form onSubmit={handleSignUp} className="sign-up-form">
                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Username"
                            required
                        />
                    </div>
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
                        Sign Up
                    </button>
                    {error && <p className="text-warning mt-2">{error}</p>}
                </form>
                {/*<FacebookLogin*/}
                {/*    appId="1957293021457370"*/}
                {/*    autoLoad={false}*/}
                {/*    fields="name,email,picture"*/}
                {/*    callback={responseFacebook}*/}
                {/*    cssClass="btn btn-primary w-100 mt-3"*/}
                {/*    textButton="Login with Facebook"*/}
                {/*/>*/}
                <p className="mt-3">
                    Already have an account? <a href="/signin" className="text-danger">Sign In</a>
                </p>
            </div>
        </div>
    );
};

export default SignUp;
