import type {
  User,
  UserCreateInput,
  UserLoginInput,
  CVDReport,
  CVDReportCreateInput,
  ApiResponse,
} from "../types/auth";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

export class ApiError extends Error {
  public status: number;
  public data: any;

  constructor(message: string, status: number, data: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

// Get stored token
export const getToken = (): string | null => {
  return localStorage.getItem("token");
};

// Store token
export const setToken = (token: string): void => {
  localStorage.setItem("token", token);
};

// Remove token
export const removeToken = (): void => {
  localStorage.removeItem("token");
};

// Base fetch wrapper with error handling
const apiRequest = async <T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getToken();

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorData
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      error instanceof Error ? error.message : "An unexpected error occurred",
      0,
      null
    );
  }
};

// Auth API calls
export const authApi = {
  // Register new user
  register: async (
    userData: UserCreateInput
  ): Promise<ApiResponse<{ user: User; token: string }>> => {
    const response = await apiRequest<
      ApiResponse<{ user: User; token: string }>
    >("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });

    if (response.data?.token) {
      setToken(response.data.token);
    }

    return response;
  },

  // Login user
  login: async (
    credentials: UserLoginInput
  ): Promise<ApiResponse<{ user: User; token: string }>> => {
    const response = await apiRequest<
      ApiResponse<{ user: User; token: string }>
    >("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    console.log(response);
    if (response.token) {
      setToken(response.token);
    }

    return response;
  },

  // Logout user
  logout: async (): Promise<void> => {
    try {
      await apiRequest("/auth/logout", {
        method: "POST",
      });
    } finally {
      removeToken();
    }
  },

  // Get current user profile
  getProfile: async (): Promise<ApiResponse<User>> => {
    return apiRequest<ApiResponse<User>>("/auth/profile");
  },
};

// CVD Reports API
export const cvdReportsApi = {
  // Get user's CVD report history
  getHistory: async (): Promise<ApiResponse<{ reports: CVDReport[] }>> => {
    return apiRequest<ApiResponse<{ reports: CVDReport[] }>>(
      `/reports/history`
    );
  },

  // Create new CVD report
  createReport: async (
    reportData: CVDReportCreateInput
  ): Promise<ApiResponse<CVDReport>> => {
    return apiRequest<ApiResponse<CVDReport>>("/reports", {
      method: "POST",
      body: JSON.stringify(reportData),
    });
  },

  // Delete CVD report
  deleteReport: async (reportId: string): Promise<ApiResponse<void>> => {
    return apiRequest<ApiResponse<void>>(`/reports/${reportId}`, {
      method: "DELETE",
    });
  },
};

// ML Model Prediction Types
interface ModelPredictionInput {
  male: number;
  age: number;
  education: number;
  currentSmoker: number;
  cigsPerDay: number;
  BPMeds: number;
  prevalentStroke: number;
  prevalentHyp: number;
  diabetes: number;
  totChol: number;
  sysBP: number;
  diaBP: number;
  BMI: number;
  heartRate: number;
  glucose: number;
}

interface ModelPredictionOutput {
  prediction: number;
  probabilities: number[];
}

interface ModelResult {
  name: string;
  prediction: number;
  probabilities: number[];
}

// Python ML API Base URL
const ML_API_BASE_URL = "http://localhost:8000";

// CVD Prediction API
export const cvdPredictionApi = {
  // Predict using a specific model
  predictWithModel: async (
    modelName: string,
    data: ModelPredictionInput
  ): Promise<ModelPredictionOutput> => {
    const response = await fetch(`${ML_API_BASE_URL}/predict/${modelName}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`ML API Error: ${response.statusText}`);
    }

    return response.json();
  },

  // Predict using all models
  predictWithAllModels: async (
    data: ModelPredictionInput
  ): Promise<ModelResult[]> => {
    const models = [
      { name: "decision-tree", displayName: "Decision Tree" },
      { name: "random-forest", displayName: "Random Forest" },
      { name: "logistic-regression", displayName: "Logistic Regression" },
      { name: "svm", displayName: "Support Vector Machine" },
      { name: "knn", displayName: "K-Nearest Neighbors" },
    ];

    const results = await Promise.all(
      models.map(async (model) => {
        const prediction = await cvdPredictionApi.predictWithModel(
          model.name,
          data
        );
        return {
          name: model.displayName,
          prediction: prediction.prediction, // 0 or 1 (no CVD risk / CVD risk)
          probabilities: prediction.probabilities, // [no_risk_prob, risk_prob]
        };
      })
    );

    return results;
  },
};
