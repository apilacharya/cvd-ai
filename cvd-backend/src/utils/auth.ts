import jwt from "jsonwebtoken";
import type { Response } from "express";
import type { UserDocument } from "../models/User.js";
import type { ApiResponse } from "../types/index.js";

export const generateToken = (id: string): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

export const createSendToken = (
  user: UserDocument,
  statusCode: number,
  res: Response<ApiResponse>
): void => {
  const token = generateToken(user._id.toString());

  const cookieOptions = {
    expires: new Date(
      Date.now() +
        (Number(process.env.JWT_COOKIE_EXPIRES_IN) || 7) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
  };

  res.cookie("jwt", token, cookieOptions);

  // Remove password from output
  const userObj = user.toJSON();

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user: userObj,
    },
  });
};
