import jwt from 'jsonwebtoken';

export const extractUser = (req, res, next) => {
  const forwardedUserId = req.headers['x-user-id'];
  if (forwardedUserId) {
    req.user = { id: forwardedUserId };
    return next();
  }

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
      req.user = decoded;
      return next();
    } catch (e) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }
  }

  return res.status(401).json({ success: false, message: 'Unauthorized' });
};