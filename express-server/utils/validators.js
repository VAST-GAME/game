const { body } = require("express-validator");

exports.validateLogin = [
  body("email").isEmail().withMessage("Please enter a valid email address").normalizeEmail(),
  body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters long"),
];

exports.validateRegister = [
  body("email").isEmail().withMessage("Please enter a valid email address").normalizeEmail(),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/\d/)
    .withMessage("Password must contain at least one number")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage("Password must contain at least one special character"),
];

exports.validateForgotPassword = [body("email").isEmail().withMessage("Please enter a valid email address").normalizeEmail()];
