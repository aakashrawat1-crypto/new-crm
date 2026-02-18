import React, { useState } from 'react';
import useAuth from '../hooks/useAuth.js';
import { useNavigate } from 'react-router-dom';
import { Grid, Fingerprint, User, Moon, Sun } from 'lucide-react';
import SplashCursor from '../components/SplashCursor.jsx';
import CelestialToggle from '../components/CelestialToggle.jsx';
import SocialLogin from '../components/SocialLogin.jsx';
import { useTheme } from '../context/ThemeContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [name, setName] = useState('');
    const { theme, toggleTheme } = useTheme();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    const handleRegister = async () => {
        try {
            const api = (await import('../services/api')).default;
            await api.post('/auth/register', { name, email, password });
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError('Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[var(--background)] transition-colors duration-300">
            <SplashCursor />
            <CelestialToggle />

            {/* Theme Toggle Button */}
            <button
                onClick={() => window.dispatchEvent(new CustomEvent('antigravity:toggleTheme'))}
                className="absolute top-6 right-6 p-2 rounded-full border border-[var(--input-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all z-50"
            >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <div className="w-full max-w-md px-6 py-12 relative z-10">
                <div className="bg-[var(--card)] p-10 rounded-[40px] border border-[var(--input-border)] shadow-2xl backdrop-blur-sm">
                    {/* Brand Icon */}
                    <div className="flex justify-center mb-8">
                        <div className="w-16 h-16 bg-[#1A1D24] rounded-2xl flex items-center justify-center border border-[#2A2E38]">
                            <Grid className="text-white opacity-80" size={32} />
                        </div>
                    </div>

                    <h2 className="text-3xl font-medium mb-2 text-center text-[var(--text-primary)] tracking-tight">
                        {isRegistering ? 'Create Account' : 'Welcome Back'}
                    </h2>
                    <p className="text-[var(--text-secondary)] text-center mb-10 text-sm font-light">
                        {isRegistering ? 'Join the Antigravity community' : 'Enter your credentials to continue'}
                    </p>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl mb-6 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (isRegistering) {
                                const hasUpper = /[A-Z]/.test(password);
                                const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
                                const isLongEnough = password.length >= 8;

                                if (!hasUpper || !hasSpecial || !isLongEnough) {
                                    setError('Password does not meet requirements');
                                    return;
                                }
                                handleRegister();
                            } else {
                                handleSubmit(e);
                            }
                        }}
                        className="space-y-4"
                    >
                        {isRegistering && (
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Name"
                                    className="w-full px-5 py-4 bg-[var(--input-bg)] text-[var(--text-primary)] border border-[var(--input-border)] rounded-2xl focus:ring-1 focus:ring-[var(--text-primary)] outline-none transition-all placeholder:text-[var(--text-secondary)] placeholder:opacity-50"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                        )}
                        <div className="relative">
                            <input
                                type="email"
                                placeholder="Email address"
                                className="w-full px-5 py-4 bg-[var(--input-bg)] text-[var(--text-primary)] border border-[var(--input-border)] rounded-2xl focus:ring-1 focus:ring-[var(--text-primary)] outline-none transition-all placeholder:text-[var(--text-secondary)] placeholder:opacity-50"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="relative">
                            <input
                                type="password"
                                placeholder="Password"
                                className="w-full px-5 py-4 bg-[var(--input-bg)] text-[var(--text-primary)] border border-[var(--input-border)] rounded-2xl focus:ring-1 focus:ring-[var(--text-primary)] outline-none transition-all placeholder:text-[var(--text-secondary)] placeholder:opacity-50"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (error) setError('');
                                }}
                                required
                            />
                        </div>

                        {isRegistering && (
                            <div className="px-2 py-2 space-y-2">
                                <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-2 opacity-50">Security Requirements</div>
                                <div className="grid grid-cols-1 gap-2">
                                    {[
                                        { label: '8+ Characters', met: password.length >= 8 },
                                        { label: 'Uppercase Letter', met: /[A-Z]/.test(password) },
                                        { label: 'Special Character', met: /[!@#$%^&*(),.?":{}|<>]/.test(password) }
                                    ].map((req, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${req.met ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-[var(--input-border)]'}`}></div>
                                            <span className={`text-[10px] font-medium transition-colors ${req.met ? 'text-emerald-500' : 'text-[var(--text-secondary)] opacity-60'}`}>{req.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex items-center justify-between px-1 text-xs text-[var(--text-secondary)] py-2">
                            <label className="flex items-center cursor-pointer hover:text-[var(--text-primary)] transition-colors">
                                <input type="checkbox" className="mr-2 accent-[var(--text-primary)]" />
                                Remember me
                            </label>
                            <button type="button" className="hover:text-[var(--text-primary)] transition-colors">
                                Forgot password?
                            </button>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[var(--button-bg)] text-[var(--button-text)] py-4 rounded-2xl font-medium hover:opacity-90 active:scale-[0.98] transition-all mt-4 tracking-wide shadow-lg"
                        >
                            {isRegistering ? 'Sign Up' : 'Sign In'}
                        </button>

                        {!isRegistering && (
                            <SocialLogin
                                onSuccess={(user) => {
                                    navigate('/dashboard');
                                }}
                                onError={(msg) => setError(msg)}
                            />
                        )}

                        <div className="pt-6 text-center">
                            <button
                                type="button"
                                onClick={() => setIsRegistering(!isRegistering)}
                                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-sm transition-colors decoration-[var(--input-border)] underline-offset-4 hover:underline"
                            >
                                {isRegistering ? 'Already have an account? Login' : 'Need an account? Register'}
                            </button>
                        </div>
                    </form>

                    {/* Footer Branding */}
                    <div className="mt-12 pt-8 border-t border-[var(--input-border)] flex flex-col items-center">
                        <p className="text-[var(--text-secondary)] text-[10px] tracking-[0.2em] font-medium mb-6 uppercase opacity-40">
                            Secured by Smart CRM Encryption
                        </p>
                        <div className="flex gap-6 opacity-30">
                            <Fingerprint size={20} className="text-[var(--text-primary)]" />
                            <User size={20} className="text-[var(--text-primary)]" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
