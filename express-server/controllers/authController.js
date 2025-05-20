const User = require("../models/User");
const { validateRequest } = require("../utils/errorHandler");

// @desc    Register user
// @route   POST /api/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    // Check validation
    validateRequest(req, res, () => {});

    const { email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Create user
    const user = await User.create({
      email,
      password,
    });

    // Generate JWT token
    const token = user.getSignedJwtToken();

    // Send response
    res.status(201).json({
      success: true,
      token,
      message: "Registration successful",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    // Check validation
    validateRequest(req, res, () => {});

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });

    // Check if user exists
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate JWT token
    const token = user.getSignedJwtToken();

    // Send response
    res.status(200).json({
      success: true,
      token,
      message: "Login successful",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user
// @route   POST /api/logout
// @access  Private
exports.logout = (req, res, next) => {
  try {
    // In a real-world scenario, you might want to invalidate the token
    // This could involve storing invalid tokens in a blacklist or using
    // short-lived tokens with refresh tokens

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password
// @route   POST /api/forget-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    // Check validation
    validateRequest(req, res, () => {});

    const { email } = req.body;

    // In a real application, you would:
    // 1. Check if user exists
    // 2. Generate a password reset token
    // 3. Save the token to the user document with an expiry
    // 4. Send an email with a reset link

    // For security, we always respond with a success message
    // even if the email doesn't exist in our database
    res.status(200).json({
      success: true,
      message: "If an account exists with this email, you will receive a password reset link",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Protected route test
// @route   GET /api/protected
// @access  Private
exports.getProtected = (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: "This is a protected route",
      data: {
        user: {
          id: req.user.id,
          email: req.user.email,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
