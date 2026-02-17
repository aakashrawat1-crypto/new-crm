import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const LoginCursor = () => {
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    const springConfig = { stiffness: 150, damping: 25 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    useEffect(() => {
        const moveCursor = (e) => {
            cursorX.set(e.clientX - 15);
            cursorY.set(e.clientY - 15);
        };

        window.addEventListener('mousemove', moveCursor);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
        };
    }, [cursorX, cursorY]);

    return (
        <motion.div
            style={{
                position: 'fixed',
                left: 0,
                top: 0,
                width: 30,
                height: 30,
                borderRadius: '50%',
                backgroundColor: 'white',
                opacity: 0.6,
                mixBlendMode: 'difference',
                pointerEvents: 'none',
                zIndex: 9999,
                translateX: cursorXSpring,
                translateY: cursorYSpring,
            }}
        />
    );
};

export default LoginCursor;
