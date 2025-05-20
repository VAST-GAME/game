// middleware/rateLimitMiddleware.js
const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 3, // Limit each IP to 3 login requests per windowMs
  message: { message: "Too many login attempts from this IP, please try again after a minute" },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const forgetPasswordLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 3, // Limit each IP to 3 forget password requests per windowMs
  message: { message: "Too many password reset requests from this IP, please try again after a minute" },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { loginLimiter, forgetPasswordLimiter };
