// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error(err.stack); // Log error stack for debugging

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode; // Default to 500 if status code not set
  res.status(statusCode);

  res.json({
    message: err.message,
    // Provide stack trace only in development mode for security reasons
    stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
  });
};

module.exports = { errorHandler };
