import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { User } from "../models/User.js";
import type { AuthPayload, ApiResponse } from "../types/index.js";

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({
        status: "error",
        message: "Access token is required",
      });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthPayload;

    // Check if user still exists
    const currentUser = await User.findById(decoded.id).select("+password");
    if (!currentUser) {
      res.status(401).json({
        status: "error",
        message: "The user belonging to this token no longer exists",
      });
      return;
    }

    // Check if user is active
    if (!currentUser.isActive) {
      res.status(401).json({
        status: "error",
        message: "Your account has been deactivated. Please contact support",
      });
      return;
    }

    req.user = currentUser;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        status: "error",
        message: "Invalid token",
      });
    } else if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        status: "error",
        message: "Token expired",
      });
    } else {
      res.status(500).json({
        status: "error",
        message: "Token verification failed",
      });
    }
  }
};

export const optionalAuth = async (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthPayload;
      const currentUser = await User.findById(decoded.id);
      if (currentUser && currentUser.isActive) {
        req.user = currentUser;
      }
    }

    next();
  } catch (error) {
    // Continue without user authentication
    next();
  }
};
