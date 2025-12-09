import express, { Request, Router } from "express";
import { User } from "../models/User.js";
import { createSendToken } from "../utils/auth.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import {
  validateRegistration,
  validateLogin,
} from "../middleware/validation.js";
import type {
  UserCreateInput,
  UserLoginInput,
  ApiResponse,
} from "../types/index.js";

const router: Router = express.Router();

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post(
  "/register",
  validateRegistration,
  asyncHandler(async (req: Request, res: express.Response<ApiResponse>) => {
    const { firstName, lastName, email, password }: UserCreateInput = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({
        status: "error",
        message: "User with this email already exists",
      });
      return;
    }

    // Create new user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
    });

    // Create and send token
    createSendToken(user, 201, res);
  })
);

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post(
  "/login",
  validateLogin,
  asyncHandler(async (req: Request, res: express.Response<ApiResponse>) => {
    const { email, password }: UserLoginInput = req.body;

    // Check if user exists and password is correct
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      res.status(401).json({
        status: "error",
        message: "Invalid email or password",
      });
      return;
    }

    // Check if user is active
    if (!user.isActive) {
      res.status(401).json({
        status: "error",
        message: "Your account has been deactivated. Please contact support",
      });
      return;
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    // Create and send token
    createSendToken(user, 200, res);
  })
);

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Public
router.post("/logout", (_req, res: express.Response<ApiResponse>) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
});

// @desc    Check if user is authenticated
// @route   GET /api/auth/me
// @access  Private
router.get("/me", async (req: any, res: express.Response<ApiResponse>) => {
  // This will be called after auth middleware
  res.status(200).json({
    status: "success",
    data: {
      user: req.user.toJSON(),
    },
  });
});

export default router;
