import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [token, setToken] = useState(() => {
        return sessionStorage.getItem('authToken') || null;
    });

    const [user, setUser] = useState(() => {
        return JSON.parse(sessionStorage.getItem('user')) || null;
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

    return (
        <UserContext.Provider value={{ token, setToken, user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};
