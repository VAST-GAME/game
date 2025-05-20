// controllers/authController.js
const User = require("../models/User");
const { generateToken } = require("../utils/jwtHelper");
const { validatePassword } = require("../utils/passwordHelper"); // Assuming this helper is still relevant
const { validationResult } = require("express-validator");

// POST /api/login
exports.loginUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await User.comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user.id); // Use user.id from SQLite
    res.status(200).json({
      token: token,
      message: "Login successful",
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/register
exports.registerUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  // Password complexity validation (from README)
  if (!validatePassword(password)) {
    return res.status(400).json({ message: "Password does not meet requirements (min 8 characters, special chars, numbers, uppercase)." });
  }

  try {
    // User.create will handle email uniqueness check by rejecting if email exists
    const newUser = await User.create({ email, password, profile: {} }); // Default empty profile
    const token = generateToken(newUser.id);
    res.status(201).json({
      token: token,
      message: "Registration successful",
    });
  } catch (error) {
    if (error.message === "Email already exists") {
      return res.status(400).json({ message: "Email already exists" });
    }
    next(error);
  }
};

// POST /api/logout - remains the same conceptually
exports.logoutUser = (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
};

// POST /api/forget-password - remains the same conceptually
exports.forgetPassword = async (req, res, next) => {
  // ... (validation and response logic as before)
  const { email } = req.body;
  console.log(`Password reset requested for: ${email}`);
  res.status(200).json({
    message: "If an account exists with this email, you will receive a password reset link",
  });
};
