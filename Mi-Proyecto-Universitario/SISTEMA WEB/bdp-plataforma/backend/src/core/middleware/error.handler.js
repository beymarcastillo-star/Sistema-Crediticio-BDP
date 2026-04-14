// backend/src/core/middleware/error.handler.js
const errorHandler = (err, req, res, next) => {
  const status  = err.status || 500;
  const message = err.message || 'Error interno del servidor';

  if (process.env.NODE_ENV !== 'production') {
    console.error(`[${new Date().toISOString()}] ${req.method} ${req.path} → ${status}: ${message}`);
  }

  res.status(status).json({
    error: message,
    ...(err.intentosRestantes !== undefined && { intentosRestantes: err.intentosRestantes }),
  });
};

module.exports = errorHandler;
