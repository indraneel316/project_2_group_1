import React, { useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../context/userContext'; // Adjusted import for consistency
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSignUp = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous error

        try {
            const response = await axios.post('http://localhost:5000/api/users/signup', { username, email, password });
            setUser(response.data.user); // Set user information in context
            navigate('/'); // Redirect to home page
        } catch (error) {
            console.error('Error signing up:', error);
            setError('Failed to sign up. Please try again.'); // Set error message
        }
    };

    return (
        <div className="bg-dark min-vh-100 d-flex flex-column align-items-center justify-content-center text-white">
            <h1 className="text-center mb-4">Sign Up</h1>
            <form onSubmit={handleSignUp} className="w-25 bg-danger p-4 rounded shadow">
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
                <button type="submit" className="btn btn-dark w-100">
                    Sign Up
                </button>
                {error && <p className="text-warning mt-2">{error}</p>}
            </form>
            <p className="mt-3">
                Already have an account? <a href="/signin" className="text-danger">Sign In</a>
            </p>
        </div>
    );
};

export default SignUp;
