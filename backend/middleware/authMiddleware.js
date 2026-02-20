const { verifyToken } = require('../utils/jwtHelper');

/**
 * 🔐 Authenticate Middleware
 * Verifies JWT token and attaches decoded user to req.user
 */
const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // Check if header exists
        if (!authHeader) {
            return res.status(401).json({ message: 'Authorization header missing' });
        }

        // Expecting format: "Bearer <token>"
        if (!authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Invalid authorization format' });
        }

        const token = authHeader.split(' ')[1];

        // Check if token is present
        if (!token) {
            return res.status(401).json({ message: 'Token missing' });
        }

        // Verify token
        const user = verifyToken(token);

        if (!user) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }

        // Attach user to request object
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

            // If roles array is empty, allow all authenticated users
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
