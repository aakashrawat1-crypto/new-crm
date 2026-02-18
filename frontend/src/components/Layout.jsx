import React from 'react';
import { Outlet } from 'react-router-dom';
import FloatingNav from './FloatingNav.jsx';
import CelestialToggle from './CelestialToggle.jsx';

const Layout = () => {
    return (
        <div className="min-h-screen bg-[var(--background)] transition-colors duration-300">
            {/* Main Content */}
            <main className="pb-32 bg-[var(--background)] text-[var(--text-primary)] min-h-screen">
                <div className="p-8 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>

            {/* Floating Navigation */}
            <FloatingNav />
            <CelestialToggle />
        </div>
    );
};

export default Layout;
