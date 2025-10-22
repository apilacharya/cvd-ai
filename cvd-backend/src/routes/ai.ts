import express from "express";
import {
  authenticateToken,
  type AuthenticatedRequest,
} from "../middleware/auth";
import { streamAIHealthResponse } from "../services/aiHealthAgent";

const router = express.Router();

// POST /api/ai/chat - Streaming chat
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

      // Set headers for streaming
      res.setHeader("Content-Type", "text/plain");
      res.setHeader("Transfer-Encoding", "chunked");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      res.setHeader("Access-Control-Allow-Origin", "*");

      const streamResult = await streamAIHealthResponse(message);

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
