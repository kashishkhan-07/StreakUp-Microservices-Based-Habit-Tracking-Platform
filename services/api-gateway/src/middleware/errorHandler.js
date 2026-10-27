export const gatewayErrorHandler = (err, req, res, next) => {
  console.error('[API Gateway Error]:', err.message);

  if (err.code === 'ECONNREFUSED') {
    return res.status(503).json({
      success: false,
      message: 'Target microservice is temporarily unavailable. Please try again shortly.',
    });
  }

  res.status(500).json({
    success: false,
    message: 'API Gateway internal error: ' + err.message,
  });
};