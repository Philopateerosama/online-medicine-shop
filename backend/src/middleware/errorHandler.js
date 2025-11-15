export function errorHandler(err, req, res, next) {
  // Basic centralized error handler
  if (res.headersSent) return next(err);
  const status = err.status || 500;
  const message = err.message || 'Internal server error';
  return res.status(status).json({ message });
}
