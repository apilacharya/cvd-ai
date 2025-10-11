import { body, validationResult } from "express-validator";
import type { Request, Response, NextFunction } from "express";
import type { ApiResponse } from "../types/index.js";

// Validation middleware to handle errors
export const handleValidationErrors = (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      status: "error",
      message: "Validation failed",
      errors: errors.array().map((error) => ({
        field: "path" in error ? error.path : "unknown",
        message: error.msg,
      })),
    });
    return;
  }
  next();
};

// User registration validation
export const validateRegistration = [
  body("firstName")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("First name must be between 2 and 50 characters"),

  body("lastName")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Last name must be between 2 and 50 characters"),

  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please enter a valid email"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must contain at least one lowercase letter, one uppercase letter, and one number"
    ),

  handleValidationErrors,
];

// User login validation
export const validateLogin = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please enter a valid email"),

  body("password").notEmpty().withMessage("Password is required"),

  handleValidationErrors,
];

// CVD analysis validation (for collecting user health data)
export const validateCVDAnalysisData = [
  body("age")
    .isInt({ min: 1, max: 120 })
    .withMessage("Age must be between 1 and 120"),

  body("gender")
    .isIn(["male", "female", "other"])
    .withMessage("Gender must be male, female, or other"),

  // Add other health data validations as needed
  body("systolicBP")
    .optional()
    .isInt({ min: 80, max: 250 })
    .withMessage("Systolic blood pressure must be between 80 and 250"),

  body("diastolicBP")
    .optional()
    .isInt({ min: 40, max: 150 })
    .withMessage("Diastolic blood pressure must be between 40 and 150"),

  handleValidationErrors,
];

// CVD report validation
export const validateCVDReport = [
  body("predictionResult.riskLevel")
    .isIn(["low", "medium", "high"])
    .withMessage("Risk level must be low, medium, or high"),

  body("predictionResult.riskScore")
    .isFloat({ min: 0, max: 100 })
    .withMessage("Risk score must be between 0 and 100"),

  body("predictionResult.confidence")
    .isFloat({ min: 0, max: 1 })
    .withMessage("Confidence must be between 0 and 1"),

  body("predictionResult.recommendations")
    .isArray({ min: 1 })
    .withMessage("At least one recommendation is required"),

  body("predictionResult.modelUsed")
    .notEmpty()
    .withMessage("Model used is required"),

  handleValidationErrors,
];
