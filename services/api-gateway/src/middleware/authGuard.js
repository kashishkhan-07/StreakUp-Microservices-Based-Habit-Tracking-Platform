import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';

export const authenticateAndForwardUser = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Missing or invalid token',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    // Forward parsed user information via headers so downstream services don't need re-lookup
    req.headers['x-user-id'] = decoded.id;
    req.headers['x-user-email'] = decoded.email;
    req.headers['x-user-timezone'] = decoded.timezone || 'UTC';
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Invalid or expired token',
    });
  }
};