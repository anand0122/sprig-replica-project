export const errorHandler = (err, _req, res, _next) => {
  console.error(err);
  res.status(err?.status || 500).json({
    error: err?.name || 'ServerError',
    message: err?.message || 'Internal Server Error'
  });
}; 