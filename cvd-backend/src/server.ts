import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

// Import routes
import authRoutes from "./routes/auth";
import reportRoutes from "./routes/reports";
import aiRoutes from "./routes/ai";

// Import middleware
import { errorHandler } from "./middleware/errorHandler";
import { authenticateToken } from "./middleware/auth";

// Load environment variables
dotenv.config();

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api/", limiter);

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
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

// Protected route for getting current user
app.get("/api/auth/me", authenticateToken, (req: any, res) => {
  res.status(200).json({
    status: "success",
    data: {
      user: req.user.toJSON(),
    },
  });
});

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
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};
// Start server and connect to DB if configured
const PORT = process.env.PORT || 3001;

const startServer = async () => {
  try {
    if (process.env.MONGODB_URI) {
      await connectDB();
    } else {
      console.warn(
        "MongoDB connection disabled - AI routes will work but auth routes need database"
      );
    }

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
