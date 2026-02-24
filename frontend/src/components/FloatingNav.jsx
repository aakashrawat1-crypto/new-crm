import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Users, Building2, Briefcase, Contact, UserCircle, LogOut, Sun, Moon, Grid } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';

const MotionLink = motion(Link);

const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Leads', href: '/leads', icon: Users },
    { name: 'Accounts', href: '/accounts', icon: Building2 },
    { name: 'Opportunities', href: '/opportunities', icon: Briefcase },
    { name: 'Contacts', href: '/contacts', icon: Contact },
];

const FloatingNav = () => {
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const { logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();

    const layoutTransition = {
        type: "spring",
        stiffness: 400,
        damping: 30,
        mass: 1
    };

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-full max-w-fit px-4 pointer-events-none">
            <motion.div
                layout
                transition={layoutTransition}
                className="flex items-center gap-1.5 p-1.5 bg-black/95 backdrop-blur-2xl rounded-[28px] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] pointer-events-auto origin-bottom"
            >
                {/* Logo Section */}
                <motion.div layout transition={layoutTransition} className="px-3 flex items-center justify-center">
                    <Grid size={18} className="text-white opacity-40" />
                </motion.div>

                <motion.div layout transition={layoutTransition} className="w-[1px] h-5 bg-white/10 mx-0.5" />

                {navItems.map((item, index) => {
                    const isActive = location.pathname.startsWith(item.href);
                    const isHovered = hoveredIndex === index;
                    const Icon = item.icon;

                    return (
                        <MotionLink
                            key={item.href}
                            to={item.href}
                            layout
                            transition={layoutTransition}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            className={`h-11 flex items-center rounded-[20px] px-3.5 gap-2 no-underline overflow-hidden relative group`}
                            animate={{
                                backgroundColor: isActive ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0)',
                                color: isActive ? '#000000' : 'rgba(255, 255, 255, 0.7)'
                            }}
                        >
                            <Icon size={19} className="flex-shrink-0" />

                            <AnimatePresence initial={false}>
                                {isHovered && (
                                    <motion.span
                                        initial={{ opacity: 0, width: 0 }}
                                        animate={{ opacity: 1, width: 'auto' }}
                                        exit={{ opacity: 0, width: 0 }}
                                        transition={{ duration: 0.15 }}
                                        className="text-sm font-semibold whitespace-nowrap overflow-hidden"
                                    >
                                        {item.name}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </MotionLink>
                    );
                })}

                <motion.div layout transition={layoutTransition} className="w-[1px] h-5 bg-white/10 mx-0.5" />

                {/* Profile Section */}
                <MotionLink
                    to="/profile"
                    layout
                    transition={layoutTransition}
                    onMouseEnter={() => setHoveredIndex('profile')}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className={`h-11 flex items-center rounded-[20px] px-3.5 gap-2 no-underline overflow-hidden relative group`}
                    animate={{
                        backgroundColor: location.pathname === '/profile' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0)',
                        color: location.pathname === '/profile' || hoveredIndex === 'profile' ? '#60a5fa' : 'rgba(255, 255, 255, 0.7)'
                    }}
                >
                    <UserCircle size={19} className="flex-shrink-0" />
                    <AnimatePresence initial={false}>
                        {(location.pathname === '/profile' || hoveredIndex === 'profile') && (
                            <motion.span
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: 'auto' }}
                                exit={{ opacity: 0, width: 0 }}
                                transition={{ duration: 0.15 }}
                                className="text-sm font-semibold whitespace-nowrap overflow-hidden"
                            >
                                Profile
                            </motion.span>
                        )}
                    </AnimatePresence>
                </MotionLink>

                {/* Theme Toggle */}
                <motion.button
                    layout
                    onClick={() => window.dispatchEvent(new CustomEvent('antigravity:toggleTheme'))}
                    onMouseEnter={() => setHoveredIndex('theme')}
                    onMouseLeave={() => setHoveredIndex(null)}
                    transition={layoutTransition}
                    animate={{
                        color: hoveredIndex === 'theme' ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
                        backgroundColor: hoveredIndex === 'theme' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0)'
                    }}
                    className={`h-11 flex items-center rounded-[20px] px-3.5 gap-2 outline-none overflow-hidden`}
                >
                    {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
                    <AnimatePresence initial={false}>
                        {hoveredIndex === 'theme' && (
                            <motion.span
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: 'auto' }}
                                exit={{ opacity: 0, width: 0 }}
                                transition={{ duration: 0.15 }}
                                className="text-sm font-semibold whitespace-nowrap overflow-hidden"
                            >
                                {theme === 'dark' ? 'Light' : 'Dark'}
                            </motion.span>
                        )}
                    </AnimatePresence>
                </motion.button>

                {/* Logout */}
                <motion.button
                    layout
                    onClick={logout}
                    onMouseEnter={() => setHoveredIndex('logout')}
                    onMouseLeave={() => setHoveredIndex(null)}
                    transition={layoutTransition}
                    animate={{
                        color: hoveredIndex === 'logout' ? '#f87171' : 'rgba(255, 255, 255, 0.7)',
                        backgroundColor: hoveredIndex === 'logout' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255, 255, 255, 0)'
                    }}
                    className={`h-11 flex items-center rounded-[20px] px-3.5 gap-2 outline-none overflow-hidden`}
                >
                    <LogOut size={19} />
                    <AnimatePresence initial={false}>
                        {hoveredIndex === 'logout' && (
                            <motion.span
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: 'auto' }}
                                exit={{ opacity: 0, width: 0 }}
                                transition={{ duration: 0.15 }}
                                className="text-sm font-semibold whitespace-nowrap overflow-hidden"
                            >
                                Logout
                            </motion.span>
                        )}
                    </AnimatePresence>
                </motion.button>
            </motion.div>
        </div>
    );
};

export default FloatingNav;
