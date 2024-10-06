import React, { createContext, useState, useEffect } from 'react';

// Create UserContext
export const UserContext = createContext();

// Create UserProvider component
export const UserProvider = ({ children }) => {
    const [token, setToken] = useState(() => {
        return sessionStorage.getItem('authToken') || null;
    });

    const [user, setUser] = useState(() => {
        return JSON.parse(sessionStorage.getItem('user')) || null; // Retrieve user data from sessionStorage
    });

    useEffect(() => {
        if (token) {
            sessionStorage.setItem('authToken', token);
        } else {
            sessionStorage.removeItem('authToken');
        }
    }, [token]);

    useEffect(() => {
        if (user) {
            sessionStorage.setItem('user', JSON.stringify(user));
        } else {
            sessionStorage.removeItem('user');
        }
    }, [user]);

    // Return UserContext provider with token, setToken, user, and setUser
    return (
        <UserContext.Provider value={{ token, setToken, user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};
