import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Listen for Firebase auth state changes (handles Google login)
        const unsubscribeFirebase = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // User is signed in via Firebase (Google)
                // Check if we already have a CRM token from a backend exchange
                const crmToken = localStorage.getItem('token');
                const crmUser = localStorage.getItem('user');

                if (crmToken && crmUser) {
                    try {
                        setUser(JSON.parse(crmUser));
                    } catch (e) {
                        // Fallback: use Firebase user data directly
                        const fbUser = {
                            id: firebaseUser.uid,
                            name: firebaseUser.displayName || firebaseUser.email,
                            email: firebaseUser.email,
                            role: 'SALES_REP',
                            photoURL: firebaseUser.photoURL,
                        };
                        setUser(fbUser);
                        localStorage.setItem('user', JSON.stringify(fbUser));
                    }
                } else {
                    // No CRM token yet — try to exchange Firebase token for CRM token
                    try {
                        const idToken = await firebaseUser.getIdToken();
                        const response = await api.post('/auth/firebase-login', { idToken });
                        const { token, user: crmUserData } = response.data;
                        localStorage.setItem('token', token);
                        localStorage.setItem('user', JSON.stringify(crmUserData));
                        setUser(crmUserData);
                    } catch (err) {
                        // Backend unavailable — use Firebase user data directly
                        console.warn('Backend unavailable, using Firebase user data:', err.message);
                        const fbUser = {
                            id: firebaseUser.uid,
                            name: firebaseUser.displayName || firebaseUser.email,
                            email: firebaseUser.email,
                            role: 'SALES_REP',
                            photoURL: firebaseUser.photoURL,
                        };
                        setUser(fbUser);
                        localStorage.setItem('user', JSON.stringify(fbUser));
                        // Store Firebase token as CRM token for API calls
                        const idToken = await firebaseUser.getIdToken();
                        localStorage.setItem('token', idToken);
                    }
                }
            } else {
                // Firebase user signed out — check for email/password CRM session
                const token = localStorage.getItem('token');
                const userData = localStorage.getItem('user');

                if (token && userData) {
                    try {
                        setUser(JSON.parse(userData));
                        // Verify with backend in background
                        api.get('/auth/verify')
                            .then((response) => {
                                setUser(response.data.user);
                                localStorage.setItem('user', JSON.stringify(response.data.user));
                            })
                            .catch((error) => {
                                if (error.response?.status === 401) {
                                    localStorage.removeItem('token');
                                    localStorage.removeItem('user');
                                    setUser(null);
                                }
                            });
                    } catch (e) {
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                    }
                }
            }
            setLoading(false);
        });

        return () => unsubscribeFirebase();
    }, []);

    const login = async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        return user;
    };

    const firebaseLogin = async (idToken) => {
        // Try backend exchange first
        try {
            const response = await api.post('/auth/firebase-login', { idToken });
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setUser(user);
            return user;
        } catch (err) {
            // Backend unavailable — Firebase onAuthStateChanged will handle it
            console.warn('Backend firebase-login failed, Firebase auth state will handle session:', err.message);
            // Don't throw — let onAuthStateChanged pick up the Firebase session
        }
    };

    const logout = async () => {
        try {
            await signOut(auth); // Sign out of Firebase
        } catch (e) {
            console.warn('Firebase signOut error:', e);
        }
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, firebaseLogin }}>
            {children}
        </AuthContext.Provider>
    );
};
