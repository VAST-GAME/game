import { Request, Response, NextFunction } from "express";

export const validateEmail = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const { email } = req.body;

  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid email address",
    });
  }
  next();
};

export const validatePassword = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { password } = req.body;
  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

  if (!password || !passwordRegex.test(password)) {
    return res.status(400).json({
      success: false,
      message:
        "Password must be at least 8 characters long and contain at least one letter, one number, and one special character",
    });
  }
  next();
};
