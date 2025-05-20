const express = require("express");
const router = express.Router();
const { register, login, logout, forgotPassword, getProtected } = require("../controllers/authController");
const { protect } = require("../middleware/auth");
const { validateLogin, validateRegister, validateForgotPassword } = require("../utils/validators");
const { loginLimiter, forgotPasswordLimiter } = require("../middleware/rateLimiter");

// Public routes
router.post("/register", validateRegister, register);
router.post("/login", loginLimiter, validateLogin, login);
router.post("/forget-password", forgotPasswordLimiter, validateForgotPassword, forgotPassword);

// Protected routes
router.post("/logout", protect, logout);
router.get("/protected", protect, getProtected);

module.exports = router;
