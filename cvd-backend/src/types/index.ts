export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  age: number;
  gender: "male" | "female" | "other";
  isActive: boolean;
  lastLogin: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserCreateInput {
  name: string;
  email: string;
  password: string;
  age: number;
  gender: "male" | "female" | "other";
}

export interface UserLoginInput {
  email: string;
  password: string;
}

export interface CVDPredictionResult {
  riskLevel: "low" | "medium" | "high";
  riskScore: number; // 0-100
  confidence: number; // 0-1
  recommendations: string[];
  modelUsed: string;
  additionalInfo?: Record<string, any>;
}

export interface CVDReport {
  _id: string;
  user: string; // User ID
  userName: string;
  userAge: number;
  userGender: "male" | "female" | "other";
  predictionResult: CVDPredictionResult;
  reportDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CVDReportCreateInput {
  predictionResult: CVDPredictionResult;
}

export interface AuthPayload {
  id: string;
  email: string;
  iat: number;
  exp: number;
}

export interface ApiResponse<T = any> {
  status: "success" | "error";
  message?: string;
  data?: T;
  errors?: any[];
  token?: string;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
