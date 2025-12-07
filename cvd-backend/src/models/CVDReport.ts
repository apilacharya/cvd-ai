import mongoose, { Document, Schema, Types } from "mongoose";
import type { CVDReport as CVDReportType, HealthData } from "../types/index.js";

export interface CVDReportDocument
  extends Omit<CVDReportType, "_id" | "user">,
    Document {
  user: Types.ObjectId;
  healthData: HealthData;
}

const cvdReportSchema = new Schema<CVDReportDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userAge: {
      type: Number,
      required: true,
      min: 1,
      max: 120,
    },
    userGender: {
      type: String,
      required: true,
      enum: ["male", "female", "other"],
    },
    healthData: {
      sysBP: {
        type: Number,
        required: true,
      },
      diaBP: {
        type: Number,
        required: true,
      },
      BMI: {
        type: Number,
        required: true,
      },
      heartRate: {
        type: Number,
        required: true,
      },
      glucose: {
        type: Number,
        required: true,
      },
      totChol: {
        type: Number,
        required: true,
      },
    },
    predictionResult: {
      riskLevel: {
        type: String,
        required: true,
        enum: ["low", "medium", "high"],
      },
      riskScore: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
      },
      recommendations: [
        {
          type: String,
        },
      ],
      modelUsed: {
        type: String,
        required: true,
      },
      additionalInfo: {
        type: Schema.Types.Mixed,
        default: {},
      },
    },
    reportDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
cvdReportSchema.index({ user: 1, reportDate: -1 });
cvdReportSchema.index({ "predictionResult.riskLevel": 1 });

export const CVDReport = mongoose.model<CVDReportDocument>(
  "CVDReport",
  cvdReportSchema
);
