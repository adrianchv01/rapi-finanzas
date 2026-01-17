import React, { createContext, useState, useEffect, useContext } from 'react';
import { storage } from '../utils/storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        const logged = await storage.getItem('user_session');
        if (logged) setUser(logged);
        setLoading(false);
    };

    const login = async (email, password) => {
        if (email === 'prueba@gmail.com' && password === 'prueba') {
            const userData = { email };
            setUser(userData);
            await storage.setItem('user_session', userData);
            return true;
        }
        return false;
    };

    const logout = async () => {
        setUser(null);
        await storage.removeItem('user_session');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
