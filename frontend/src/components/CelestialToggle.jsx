import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const CelestialToggle = () => {
    const { theme, toggleTheme } = useTheme();
    const [isAnimating, setIsAnimating] = useState(false);
    const [showWash, setShowWash] = useState(false);
    const [washTheme, setWashTheme] = useState(theme);

    useEffect(() => {
        const handleCelestialTrigger = () => {
            if (isAnimating) return;

            setIsAnimating(true);
            setWashTheme(theme === 'dark' ? 'light' : 'dark');

            // Start wash effect slightly after orb launch
            setTimeout(() => {
                setShowWash(true);
            }, 240); // 300 * 0.8

            // Actual theme toggle midway through animation
            setTimeout(() => {
                toggleTheme();
            }, 640); // 800 * 0.8

            // Reset animation state
            setTimeout(() => {
                setIsAnimating(false);
                setShowWash(false);
            }, 1600); // 2000 * 0.8
        };

        window.addEventListener('antigravity:toggleTheme', handleCelestialTrigger);
        return () => window.removeEventListener('antigravity:toggleTheme', handleCelestialTrigger);
    }, [isAnimating, theme, toggleTheme]);

    return (
        <>
            {/* Theme Wash Overlay */}
            <AnimatePresence>
                {showWash && (
                    <motion.div
                        initial={{ clipPath: 'circle(0% at 50% 90%)' }} // Origin from bottom center (FloatingNav)
                        animate={{ clipPath: 'circle(150% at 50% 90%)' }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.0, ease: [0.4, 0, 0.2, 1] }} // 1.2 * 0.8
                        className="fixed inset-0 z-[100] pointer-events-none"
                        style={{
                            background: washTheme === 'dark' ? '#0B0E14' : '#ffffff'
                        }}
                    />
                )}
            </AnimatePresence>

            {/* Launching Orb */}
            <AnimatePresence>
                {isAnimating && (
                    <motion.div
                        initial={{ y: '100vh', opacity: 0, scale: 0.5 }}
                        animate={{
                            y: '-20vh',
                            opacity: [0, 1, 1, 0],
                            scale: [0.5, 1.2, 1.2, 0.8],
                            rotate: 360
                        }}
                        transition={{ duration: 1.4, ease: "easeOut" }} // 1.8 * 0.8
                        className="fixed left-1/2 -translate-x-1/2 bottom-0 z-[110] pointer-events-none"
                    >
                        <div className={`p-6 rounded-full blur-[2px] shadow-2xl ${washTheme === 'dark'
                            ? 'bg-indigo-500 shadow-[0_0_50px_#6366f1] text-indigo-100'
                            : 'bg-amber-400 shadow-[0_0_50px_#fbbf24] text-amber-900'
                            }`}>
                            {washTheme === 'dark' ? <Moon size={48} /> : <Sun size={48} />}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default CelestialToggle;
