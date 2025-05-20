import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { auth } from "../middleware/auth";
import { rateLimiter } from "../middleware/rateLimiter";
import { validateEmail, validatePassword } from "../middleware/validation";
import { User, AuthResponse } from "../types/auth";

const router = Router();

// In-memory user store (replace with database in production)
const users = new Map<string, User>();

// Login route
router.post("/login", validateEmail, rateLimiter, async (req, res) => {
  const { email, password } = req.body;
  const user = Array.from(users.values()).find((u) => u.email === email);

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET || "your-secret-key",
    { expiresIn: "24h" }
  );

  const response: AuthResponse = {
    success: true,
    message: "Login successful",
    token,
    user: { id: user.id, email: user.email },
  };

  res.json(response);
});

// Register route
router.post("/register", validateEmail, validatePassword, async (req, res) => {
  const { email, password } = req.body;

  if (Array.from(users.values()).some((u) => u.email === email)) {
    return res.status(400).json({
      success: false,
      message: "Email already registered",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user: User = {
    id: uuidv4(),
    email,
    password: hashedPassword,
  };

  users.set(user.id, user);

  const response: AuthResponse = {
    success: true,
    message: "Registration successful",
    user: { id: user.id, email: user.email },
  };

  res.status(201).json(response);
});

// Logout route
router.post("/logout", validateEmail, async (req, res) => {
  const { email } = req.body;
  const user = Array.from(users.values()).find((u) => u.email === email);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  res.json({
    success: true,
    message: "Logged out successfully",
  });
});

// Protected route
router.get("/protected", auth, (req, res) => {
  res.json({
    success: true,
    message: "This is a protected route",
    user: req.user,
  });
});

// Forgot password route
router.post("/forgot-password", validateEmail, async (req, res) => {
  const { email } = req.body;
  const user = Array.from(users.values()).find((u) => u.email === email);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  const resetToken = jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET || "your-secret-key",
    { expiresIn: "1h" }
  );

  user.resetToken = resetToken;
  user.resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour
  users.set(user.id, user);

  // In a real application, send this token via email
  res.json({
    success: true,
    message: "Password reset token generated",
    resetToken, // Remove this in production and send via email instead
  });
});

// Reset password route
router.post("/reset-password", validatePassword, async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    ) as { id: string };
    const user = users.get(decoded.id);

    if (
      !user ||
      user.resetToken !== token ||
      !user.resetTokenExpiry ||
      user.resetTokenExpiry < new Date()
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    users.set(user.id, user);

    res.json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid reset token",
    });
  }
});

export default router;
