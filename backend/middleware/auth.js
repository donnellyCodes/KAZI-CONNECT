// Handles JWT verification and Role-based check

const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Not authorized" });
    }

    const token = authHeader.split(" ")[1]

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Contains id and role
        next();
    } catch (error) {
        res.status(401).json({ message: "Token failed" });
    }
};

// Role authorization
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Permission denied" });
        }
        next();
    };
};

module.exports = { protect, authorize };