const { validationResult } = require("express-validator");
const { UniqueConstraintError, ValidationError } = require("sequelize");

// Handle request validation errors
exports.validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((error) => ({
        field: error.param,
        message: error.msg,
      })),
    });
  }
  next();
};

// General error handler middleware
exports.errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Default error status and message
  let statusCode = err.statusCode || 500;
  let message = err.message || "Server Error";

  // Handle Sequelize specific errors
  if (err instanceof UniqueConstraintError) {
    statusCode = 400;
    message = "Duplicate field value entered";

    // If error is on email field
    if (err.errors && err.errors[0] && err.errors[0].path === "email") {
      message = "Email already exists";
    }
  } else if (err instanceof ValidationError) {
    statusCode = 400;
    message = err.errors[0] ? err.errors[0].message : "Validation error";
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    message,
  });
};
