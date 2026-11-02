import jwt from 'jsonwebtoken';

export const extractUser = (req, res, next) => {
  const forwardedUserId = req.headers['x-user-id'];
  const forwardedUserEmail = req.headers['x-user-email'];
  const forwardedTimezone = req.headers['x-user-timezone'];

  if (forwardedUserId) {
    req.user = {
      id: forwardedUserId,
      email: forwardedUserEmail,
      timezone: forwardedTimezone || 'UTC',
    };
    return next();
  }

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      return next();
    } catch (err) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }
  }

  return res.status(401).json({
    success: false,
    message: 'Unauthorized: User identity not found',
  });
};