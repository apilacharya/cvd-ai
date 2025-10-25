import mongoose, { Document, Schema, Types } from "mongoose";
import type { CVDReport as CVDReportType } from "../types/index";

export interface CVDReportDocument
  extends Omit<CVDReportType, "_id" | "user">,
    Document {
  user: Types.ObjectId;
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
      confidence: {
        type: Number,
        required: true,
        min: 0,
        max: 1,
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
