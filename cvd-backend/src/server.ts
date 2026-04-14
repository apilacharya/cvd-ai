import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

// Import routes
import authRoutes from "./routes/auth.js";
import reportRoutes from "./routes/reports.js";
import aiRoutes from "./routes/ai.js";

// Import middleware
import { errorHandler } from "./middleware/errorHandler.js";

// Load environment variables
dotenv.config();

const app = express();

// Security middleware
app.use(helmet());

app.set("trust proxy", 1);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api/", limiter);

// CORS configuration
const configuredOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map((origin) => origin.trim())
  : ["http://localhost:3000", "http://localhost:5173"];

app.use(
  cors({
    origin: configuredOrigins,
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/ai", aiRoutes);

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    status: "success",
    message: "CVD Prediction API is running",
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware (should be last)
app.use(errorHandler);

// 404 handler
app.use("*", (_req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

// MongoDB connection
const connectDB = async (): Promise<void> => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI);
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};
// Start server and connect to DB if configured
const PORT = process.env.PORT || 8000;

const startServer = async () => {
  try {
    if (process.env.MONGODB_URI) {
      await connectDB();
    } else {
      // MongoDB connection disabled - AI routes will work but auth routes need database
    }

    app.listen(PORT, () => {
      // Server started successfully
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
