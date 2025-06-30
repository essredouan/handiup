// middleware/errorHandler.js

const notFound = (req, res, next) => {
  res.status(404);
  res.json({ message: `Not Found - ${req.originalUrl}` });
};

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '😞' : err.stack,
  });
};

export { notFound, errorHandler };
