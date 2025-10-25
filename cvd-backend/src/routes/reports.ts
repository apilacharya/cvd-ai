import express, { Request } from "express";
import { CVDReport } from "../models/CVDReport";
import { authenticateToken } from "../middleware/auth";
import { asyncHandler } from "../middleware/errorHandler";
import { validateCVDReport } from "../middleware/validation";
import type {
  CVDReportCreateInput,
  ApiResponse,
  PaginationQuery,
} from "../types/index";

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
      const { predictionResult }: CVDReportCreateInput = req.body;

      // Create CVD report with user info
      const report = await CVDReport.create({
        user: req.user._id,
        userName: req.user.name,
        userAge: req.user.age,
        userGender: req.user.gender,
        predictionResult,
        reportDate: new Date(),
      });

      // Populate user data
      await report.populate("user", "name email age gender");

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
// @route   GET /api/reports
// @access  Private
router.get(
  "/",
  authenticateToken,
  asyncHandler(
    async (req: AuthenticatedRequest, res: express.Response<ApiResponse>) => {
      const { page = 1, limit = 10 }: PaginationQuery = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const reports = await CVDReport.find({
        user: req.user._id,
      })
        .sort({ reportDate: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate("user", "name email age gender");

      const total = await CVDReport.countDocuments({
        user: req.user._id,
      });

      res.status(200).json({
        status: "success",
        data: {
          reports,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / Number(limit)),
          },
        },
      });
    }
  )
);

// @desc    Get specific CVD report by ID
// @route   GET /api/reports/:id
// @access  Private
router.get(
  "/:id",
  authenticateToken,
  asyncHandler(
    async (req: AuthenticatedRequest, res: express.Response<ApiResponse>) => {
      const report = await CVDReport.findOne({
        _id: req.params.id,
        user: req.user._id,
      }).populate("user", "name email age gender");

      if (!report) {
        res.status(404).json({
          status: "error",
          message: "Report not found",
        });
        return;
      }

      res.status(200).json({
        status: "success",
        data: {
          report,
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

// @desc    Get CVD report statistics
// @route   GET /api/reports/stats/overview
// @access  Private
router.get(
  "/stats/overview",
  authenticateToken,
  asyncHandler(
    async (req: AuthenticatedRequest, res: express.Response<ApiResponse>) => {
      const userId = req.user._id;

      const stats = await CVDReport.aggregate([
        { $match: { user: userId } },
        {
          $group: {
            _id: null,
            totalReports: { $sum: 1 },
            highRiskCount: {
              $sum: {
                $cond: [{ $eq: ["$predictionResult.riskLevel", "high"] }, 1, 0],
              },
            },
            mediumRiskCount: {
              $sum: {
                $cond: [
                  { $eq: ["$predictionResult.riskLevel", "medium"] },
                  1,
                  0,
                ],
              },
            },
            lowRiskCount: {
              $sum: {
                $cond: [{ $eq: ["$predictionResult.riskLevel", "low"] }, 1, 0],
              },
            },
            avgRiskScore: { $avg: "$predictionResult.riskScore" },
            latestReport: { $max: "$reportDate" },
          },
        },
      ]);

      const result = stats[0] || {
        totalReports: 0,
        highRiskCount: 0,
        mediumRiskCount: 0,
        lowRiskCount: 0,
        avgRiskScore: 0,
        latestReport: null,
      };

      res.status(200).json({
        status: "success",
        data: {
          stats: result,
        },
      });
    }
  )
);

export default router;
