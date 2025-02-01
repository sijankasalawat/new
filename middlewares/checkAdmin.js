// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.json({
      success: false,
      message: "Authorization header missing",
    });
  }
  // split the auth header and get the token
  const token = authHeader.split(" ")[1];
  // check if token is present
  if (!token) {
    return res.json({
      success: false,
      message: "Token missing",
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // attach the user data to the request object
    req.user = decoded;

    // Check if the user is an admin
    if (req.user.isAdmin) {
      next(); // User is an admin, proceed with the next middleware/route
    } else {
      res.json({
        success: false,
        message: "You do not have permission to perform this action",
      });
    }
  } catch (error) {
    res.json({
      success: false,
      message: "Invalid token",
    });
  }
};

module.exports = authMiddleware;
