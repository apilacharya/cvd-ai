import type {
  User,
  UserCreateInput,
  UserLoginInput,
  CVDReport,
  CVDReportCreateInput,
  ApiResponse,
  PaginationResult,
  HealthDataInput,
} from "../types/auth";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

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

    if (response.data?.token) {
      setToken(response.data.token);
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

  // Update user profile
  updateProfile: async (
    userData: Partial<User>
  ): Promise<ApiResponse<User>> => {
    return apiRequest<ApiResponse<User>>("/users/profile", {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  },

  // Change password
  changePassword: async (
    currentPassword: string,
    newPassword: string
  ): Promise<ApiResponse<void>> => {
    return apiRequest<ApiResponse<void>>("/auth/change-password", {
      method: "PUT",
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },
};

// CVD Reports API
export const cvdReportsApi = {
  // Get user's CVD reports
  getReports: async (
    page = 1,
    limit = 10
  ): Promise<ApiResponse<PaginationResult<CVDReport>>> => {
    return apiRequest<ApiResponse<PaginationResult<CVDReport>>>(
      `/cvd-reports?page=${page}&limit=${limit}`
    );
  },

  // Get single CVD report
  getReport: async (reportId: string): Promise<ApiResponse<CVDReport>> => {
    return apiRequest<ApiResponse<CVDReport>>(`/cvd-reports/${reportId}`);
  },

  // Create new CVD report
  createReport: async (
    reportData: CVDReportCreateInput
  ): Promise<ApiResponse<CVDReport>> => {
    return apiRequest<ApiResponse<CVDReport>>("/cvd-reports", {
      method: "POST",
      body: JSON.stringify(reportData),
    });
  },

  // Delete CVD report
  deleteReport: async (reportId: string): Promise<ApiResponse<void>> => {
    return apiRequest<ApiResponse<void>>(`/cvd-reports/${reportId}`, {
      method: "DELETE",
    });
  },
};

// CVD Prediction API (placeholder - will be implemented by Python backend)
export const cvdPredictionApi = {
  // Predict CVD risk
  predict: async (healthData: HealthDataInput): Promise<ApiResponse<any>> => {
    // This will be implemented when the Python backend is ready
    throw new Error("CVD prediction API not yet implemented");
  },
};
