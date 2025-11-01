import express, { Request } from "express";
import { CVDReport } from "../models/CVDReport";
import { authenticateToken } from "../middleware/auth";
import { asyncHandler } from "../middleware/errorHandler";
import { validateCVDReport } from "../middleware/validation";
import type { CVDReportCreateInput, ApiResponse } from "../types/index";

interface AuthenticatedRequest extends Request {
  user?: any;
}

const router = express.Router();

// @desc    Create new CVD report
// @route   POST /api/reports
// @access  Private
router.post(
  "/",
  authenticateToken,
  validateCVDReport,
  asyncHandler(
    async (req: AuthenticatedRequest, res: express.Response<ApiResponse>) => {
      const { healthData, predictionResult, userAge, userGender }: any =
        req.body;

      // Create full name from user's firstName and lastName
      const userName = `${req.user.firstName} ${req.user.lastName}`;

      // Create CVD report with user info and health data
      const report = await CVDReport.create({
        user: req.user._id,
        userName,
        userAge: userAge || req.user.age, // Use provided age or user's age
        userGender: userGender || req.user.gender, // Use provided gender or user's gender
        healthData,
        predictionResult,
        reportDate: new Date(),
      });

      // Populate user data
      await report.populate("user", "firstName lastName email age gender");

      res.status(201).json({
        status: "success",
        data: {
          report,
        },
      });
    }
  )
);

// @desc    Get user's CVD report history
// @route   GET /api/reports/history
// @access  Private
router.get(
  "/history",
  authenticateToken,
  asyncHandler(
    async (req: AuthenticatedRequest, res: express.Response<ApiResponse>) => {
      const reports = await CVDReport.find({
        user: req.user._id,
      })
        .sort({ reportDate: -1 })
        .select("-user")
        .lean();

      res.status(200).json({
        status: "success",
        data: {
          reports,
        },
      });
    }
  )
);

// @desc    Delete CVD report
// @route   DELETE /api/reports/:id
// @access  Private
router.delete(
  "/:id",
  authenticateToken,
  asyncHandler(
    async (req: AuthenticatedRequest, res: express.Response<ApiResponse>) => {
      const report = await CVDReport.findOne({
        _id: req.params.id,
        user: req.user._id,
      });

      if (!report) {
        res.status(404).json({
          status: "error",
          message: "Report not found",
        });
        return;
      }

      await CVDReport.findByIdAndDelete(req.params.id);

      res.status(200).json({
        status: "success",
        message: "Report deleted successfully",
      });
    }
  )
);

export default router;
