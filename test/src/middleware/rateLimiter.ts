import { Request, Response, NextFunction } from "express";

const loginAttempts = new Map<string, { count: number; timestamp: number }>();

export const rateLimiter = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const email = req.body.email;
  const now = Date.now();
  const attempt = loginAttempts.get(email);

  if (attempt) {
    if (now - attempt.timestamp > 3600000) {
      // Reset after 1 hour
      loginAttempts.set(email, { count: 1, timestamp: now });
      next();
    } else if (attempt.count >= 3) {
      res.status(429).json({
        success: false,
        message: "Too many login attempts. Please try again after an hour.",
      });
    } else {
      attempt.count++;
      loginAttempts.set(email, attempt);
      next();
    }
  } else {
    loginAttempts.set(email, { count: 1, timestamp: now });
    next();
  }
};
