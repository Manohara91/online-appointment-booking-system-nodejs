const jwt = require('jsonwebtoken');

// This middleware verifies if the user is authenticated
const verifyJWT = (req, res, next) => {
  const token = req.header('Authorization') && req.header('Authorization').split(' ')[1]; // Extract token from header

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach the decoded user data to the request object
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

// This middleware checks if the authenticated user has the right role
const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: You do not have access' });
    }
    next();
  };
};

module.exports = { verifyJWT, authorizeRole };

