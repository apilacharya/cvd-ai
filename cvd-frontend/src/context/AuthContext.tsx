import React, { createContext, useReducer, useEffect, ReactNode } from "react";
import type { User, UserLoginInput, UserCreateInput } from "../types/auth";
import { authApi } from "../services/api";

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: "AUTH_START" }
  | { type: "AUTH_SUCCESS"; payload: User }
  | { type: "AUTH_ERROR"; payload: string }
  | { type: "AUTH_LOGOUT" }
  | { type: "CLEAR_ERROR" };

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "AUTH_START":
      return {
        ...state,
        loading: true,
        error: null,
      };
    case "AUTH_SUCCESS":
      return {
        ...state,
        user: action.payload,
        loading: false,
        error: null,
      };
    case "AUTH_ERROR":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case "AUTH_LOGOUT":
      return {
        ...state,
        user: null,
        loading: false,
        error: null,
      };
    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

interface AuthContextType extends AuthState {
  login: (credentials: UserLoginInput) => Promise<void>;
  register: (userData: UserCreateInput) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing token and user on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      try {
        const user = JSON.parse(storedUser);
        dispatch({ type: "AUTH_SUCCESS", payload: user });
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  }, []);

  const login = async (credentials: UserLoginInput) => {
    try {
      dispatch({ type: "AUTH_START" });
      const response = await authApi.login(credentials);
      if (response.data?.user) {
        dispatch({ type: "AUTH_SUCCESS", payload: response.data.user });
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error: any) {
      dispatch({
        type: "AUTH_ERROR",
        payload: error.message || "Login failed",
      });
      throw error;
    }
  };

  const register = async (userData: UserCreateInput) => {
    try {
      dispatch({ type: "AUTH_START" });
      const response = await authApi.register(userData);
      if (response.data?.user) {
        dispatch({ type: "AUTH_SUCCESS", payload: response.data.user });
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error: any) {
      dispatch({
        type: "AUTH_ERROR",
        payload: error.message || "Registration failed",
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      dispatch({ type: "AUTH_LOGOUT" });
    }
  };

  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  const contextValue: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
