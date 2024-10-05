import React, { useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../context/userContext'; // Adjusted import for consistency
import { useNavigate } from 'react-router-dom';
import './SignIn.css'; // Import custom styles

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate(); // Changed to useNavigate hook
    const [error, setError] = useState('');

    const handleSignIn = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous error

        try {
            const response = await axios.post('http://localhost:5000/api/users/signin', { email, password });
            setUser(response.data.user); // Set user information in context
            navigate('/'); // Redirect to home page
        } catch (error) {
            console.error('Error signing in:', error);
            setError('Failed to sign in. Please check your credentials.'); // Set error message
        }
    };

    return (
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
            <p className="mt-3">
                Don't have an account? <a href="/frontend/src/pages/SignUp" className="text-danger">Sign Up</a>
            </p>
        </div>
    );
};

export default SignIn;
