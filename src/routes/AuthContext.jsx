import React, { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch('/api/check-auth');
                const data = await response.json();
                setLoggedIn(data.loggedIn);
            } catch (error) {
                console.error('Error checking authentication:', error);
            }
        };

        checkAuth();
    }, []);  // 空的依賴陣列意味著這個 useEffect 只會在首次渲染時運行

    const updateLoggedInStatus = (status) => {
        setLoggedIn(status);
    };

    return (
        <AuthContext.Provider value={{ loggedIn, updateLoggedInStatus }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
