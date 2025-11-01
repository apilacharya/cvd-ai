// Basic user types
export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  age?: number; // Optional - collected during CVD analysis
  gender?: "male" | "female" | "other"; // Optional - collected during CVD analysis
  role?: "user" | "admin";
  createdAt: string;
  updatedAt: string;
}

export interface UserCreateInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface UserLoginInput {
  email: string;
  password: string;
}

// API Response wrapper
export interface ApiResponse<T = any> {
  status: "success" | "error";
  data?: T;
  message?: string;
  token?: string;
}

// Basic types for CVD prediction (placeholder)
export interface CVDPredictionResult {
  riskLevel: "low" | "medium" | "high";
  riskScore: number;
  recommendations: string[];
  modelUsed: string;
  additionalInfo?: Record<string, any>;
}

export interface HealthData {
  sysBP: number;
  diaBP: number;
  BMI: number;
  heartRate: number;
  glucose: number;
  totChol: number;
}

export interface CVDReport {
  _id: string;
  user: string;
  userName: string;
  userAge: number;
  userGender: "male" | "female" | "other";
  healthData: HealthData;
  predictionResult: CVDPredictionResult;
  reportDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface CVDReportCreateInput {
  userAge: number;
  userGender: "male" | "female" | "other";
  healthData: HealthData;
  predictionResult: CVDPredictionResult;
}
