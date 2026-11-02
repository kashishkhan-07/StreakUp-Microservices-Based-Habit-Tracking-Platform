export const errorHandler = (err, req, res, next) => {
  console.error('[Analytics Service Error]:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error in Analytics Service',
  });
};