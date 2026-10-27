export const errorHandler = (err, req, res, next) => {
  console.error('[Auth Service Error]:', err);

  // Mongoose duplicate key error (e.g. duplicate email)
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'An account with this email already exists',
    });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({
      success: false,
      message: messages.join(', '),
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
};