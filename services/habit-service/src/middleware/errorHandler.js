export const errorHandler = (err, req, res, next) => {
  console.error('[Habit Service Error]:', err);

  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: 'This habit has already been marked completed for this date',
    });
  }

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({ success: false, message: messages.join(', ') });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
};