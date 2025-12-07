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
  body("userAge")
    .optional()
    .isInt({ min: 1, max: 120 })
    .withMessage("Age must be between 1 and 120"),

  body("userGender")
    .optional()
    .isIn(["male", "female", "other"])
    .withMessage("Gender must be male, female, or other"),

  body("healthData.sysBP")
    .isFloat({ min: 70, max: 250 })
    .withMessage("Systolic BP must be between 70 and 250"),

  body("healthData.diaBP")
    .isFloat({ min: 40, max: 150 })
    .withMessage("Diastolic BP must be between 40 and 150"),

  body("healthData.BMI")
    .isFloat({ min: 10, max: 60 })
    .withMessage("BMI must be between 10 and 60"),

  body("healthData.heartRate")
    .isFloat({ min: 40, max: 200 })
    .withMessage("Heart rate must be between 40 and 200"),

  body("healthData.glucose")
    .isFloat({ min: 50, max: 400 })
    .withMessage("Glucose level must be between 50 and 400"),

  body("healthData.totChol")
    .isFloat({ min: 100, max: 500 })
    .withMessage("Total cholesterol must be between 100 and 500"),

  body("predictionResult.riskLevel")
    .isIn(["low", "medium", "high"])
    .withMessage("Risk level must be low, medium, or high"),

  body("predictionResult.riskScore")
    .isFloat({ min: 0, max: 100 })
    .withMessage("Risk score must be between 0 and 100"),

  body("predictionResult.recommendations")
    .isArray({ min: 1 })
    .withMessage("At least one recommendation is required"),

  body("predictionResult.modelUsed")
    .notEmpty()
    .withMessage("Model used is required"),

  handleValidationErrors,
];
