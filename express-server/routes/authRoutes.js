// routes/authRoutes.js
const express = require("express");
const { body } = require("express-validator");
const authController = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const { loginLimiter, forgetPasswordLimiter } = require("../middleware/rateLimitMiddleware");
const { validatePassword } = require("../utils/passwordHelper");

const router = express.Router();

// POST /api/login
router.post(
  "/login",
  loginLimiter, // Apply rate limit
  [body("email").isEmail().withMessage("Please enter a valid email").normalizeEmail(), body("password").notEmpty().withMessage("Password is required")],
  authController.loginUser
);

// POST /api/register
router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Please enter a valid email").normalizeEmail(),
    body("password").custom((value) => {
      if (!validatePassword(value)) {
        throw new Error("Password must be min 8 characters, with special char, number, and uppercase letter.");
      }
      return true;
    }),
  ],
  authController.registerUser
);

// POST /api/logout
router.post("/logout", protect, authController.logoutUser);

// POST /api/forget-password
router.post(
  "/forget-password",
  forgetPasswordLimiter, // Apply rate limit
  [body("email").isEmail().withMessage("Please enter a valid email or the format is incorrect.").normalizeEmail()],
  authController.forgetPassword
);

module.exports = router;
