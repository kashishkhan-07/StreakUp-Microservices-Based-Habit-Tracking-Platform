import jwt from 'jsonwebtoken';

// 🔒 Exact same guaranteed key
const JWT_SECRET = 'streakup_super_secret_jwt_key_2026_dev';

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
    const decoded = jwt.verify(token, JWT_SECRET);
    req.headers['x-user-id'] = decoded.id;
    req.headers['x-user-email'] = decoded.email;
    req.headers['x-user-timezone'] = decoded.timezone || 'UTC';
    next();
  } catch (error) {
    console.error('🚨 [Gateway AuthGuard Verify Failed]:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Invalid or expired token: ' + error.message,
    });
  }
};