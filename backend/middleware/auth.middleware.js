const { verifyToken } = require('../utils/jwtHelper');

/**
 * 🔐 Authenticate Middleware
 * Verifies JWT token and attaches decoded user to req.user
 */
const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ message: 'Authorization header missing' });
        }

        if (!authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Invalid authorization format' });
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Token missing' });
        }

        const user = verifyToken(token);

        if (!user) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(401).json({ message: 'Authentication failed' });
    }
};

/**
 * 🛡 Authorize Middleware
 * Role-based access control
 * Usage: authorize(['admin', 'project_manager'])
 */
const authorize = (roles = []) => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            if (roles.length === 0) return next();

            if (!roles.includes(req.user.role)) {
                return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
            }

            next();
        } catch (error) {
            console.error('Authorization error:', error);
            return res.status(403).json({ message: 'Forbidden' });
        }
    };
};

module.exports = { authenticate, authorize };
