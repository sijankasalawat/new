const jwt = require('jsonwebtoken');

// Middleware to verify JWT token for general users
const authGuard = (req, res, next) => {
    // Check if authorization header is present
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: "Authorization header missing!"
        });
    }

    // Extract token from the authorization header
    // Format: 'Bearer <token>'
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Token missing!"
        });
    }

    // Verify token
    try {
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodedData; // Attach user data to request object
        next(); // Proceed to the next middleware or controller
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid token!",
            error: error.message
        });
    }
};

// Middleware to verify JWT token and check if user is admin
const authGuardAdmin = (req, res, next) => {
    // Check if authorization header is present
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: "Authorization header missing!"
        });
    }

    // Extract token from the authorization header
    // Format: 'Bearer <token>'
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Token missing!"
        });
    }

    // Verify token
    try {
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodedData; // Attach user data to request object

        // Check if the user has admin privileges
        if (!req.user.isAdmin) {
            return res.status(403).json({
                success: false,
                message: "Permission denied! Admin access required."
            });
        }

        next(); // Proceed to the next middleware or controller
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid token!",
            error: error.message
        });
    }
};

module.exports = {
    authGuard,
    authGuardAdmin
};
