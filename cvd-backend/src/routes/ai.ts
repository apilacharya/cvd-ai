import express, { Router } from "express";
import {
  authenticateToken,
  type AuthenticatedRequest,
} from "../middleware/auth.js";
import {
  streamAIHealthResponse,
  type HealthContext,
  validateHealthContext,
} from "../services/aiHealthAgent.js";
import { CVDReport } from "../models/CVDReport.js";

const router: Router = express.Router();

// POST /api/ai/chat - Streaming chat with dynamic context
router.post(
  "/chat",
  authenticateToken,
  async (req: AuthenticatedRequest, res): Promise<void> => {
    try {
      const { message } = req.body;

      if (!message || typeof message !== "string") {
        res.status(400).json({
          error: "Message is required and must be a string",
        });
        return;
      }

      // Gather dynamic context for personalized responses (only risk percentage)
      let context: HealthContext = {};

      try {
        // Get only the latest CVD risk score
        const latestReport = await CVDReport.findOne({ user: req.user._id })
          .sort({ reportDate: -1 })
          .select("predictionResult.riskScore")
          .lean();

        if (
          latestReport &&
          latestReport.predictionResult.riskScore !== undefined
        ) {
          context.riskPercentage = latestReport.predictionResult.riskScore;
        }
        // Note: If no risk percentage is found, context will be empty and AI will request assessment
      } catch (contextError) {
        console.warn("Error gathering context for AI response:", contextError);
        // Continue without context if there's an error gathering it
      }

      // Set headers for streaming
      res.setHeader("Content-Type", "text/plain");
      res.setHeader("Transfer-Encoding", "chunked");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      res.setHeader("Access-Control-Allow-Origin", "*");

      const streamResult = await streamAIHealthResponse(message, context);

      // Handle streaming response
      for await (const chunk of streamResult.textStream) {
        res.write(chunk);
      }

      res.end();
    } catch (error) {
      console.error("AI Streaming error:", error);
      if (!res.headersSent) {
        res.status(500).json({
          error: "Failed to process your health question. Please try again.",
        });
      }
    }
  }
);

// POST /api/ai/chat-with-context - Streaming chat with explicit risk percentage context
// This endpoint allows overriding the automatic context gathering
// Example body: { "message": "What should I do about my heart health?", "context": { "riskPercentage": 35 } }
// To skip requiring risk assessment: { "message": "test", "context": { "skipAutoContext": true } }
router.post(
  "/chat-with-context",
  authenticateToken,
  async (req: AuthenticatedRequest, res): Promise<void> => {
    try {
      const { message, context: explicitContext } = req.body;

      if (!message || typeof message !== "string") {
        res.status(400).json({
          error: "Message is required and must be a string",
        });
        return;
      }

      // Merge explicit context with auto-gathered context
      let context: HealthContext = explicitContext
        ? validateHealthContext(explicitContext)
        : {};

      // Always gather basic risk percentage unless explicitly disabled
      if (!explicitContext?.skipAutoContext) {
        try {
          // Get only the latest CVD risk score if not provided in explicit context
          if (context.riskPercentage === undefined) {
            const latestReport = await CVDReport.findOne({ user: req.user._id })
              .sort({ reportDate: -1 })
              .select("predictionResult.riskScore")
              .lean();

            if (
              latestReport &&
              latestReport.predictionResult.riskScore !== undefined
            ) {
              context.riskPercentage = latestReport.predictionResult.riskScore;
            }
          }
        } catch (contextError) {
          console.warn(
            "Error gathering auto context for AI response:",
            contextError
          );
        }
      }

      // Set headers for streaming
      res.setHeader("Content-Type", "text/plain");
      res.setHeader("Transfer-Encoding", "chunked");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      res.setHeader("Access-Control-Allow-Origin", "*");

      const streamResult = await streamAIHealthResponse(message, context);

      // Handle streaming response
      for await (const chunk of streamResult.textStream) {
        res.write(chunk);
      }

      res.end();
    } catch (error) {
      console.error("AI Streaming error:", error);
      if (!res.headersSent) {
        res.status(500).json({
          error: "Failed to process your health question. Please try again.",
        });
      }
    }
  }
);

export default router;
