import { Link, useLocation, useNavigate } from "react-router-dom";
import { User, LogOut } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/home");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link
            to={user ? "/dashboard" : "/home"}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="h-8 w-8 bg-gradient-to-r from-red-500 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">CVD</span>
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">
              Health Predictor
            </span>
          </Link>

          {/* Navigation for non-auth pages */}
          {!isAuthPage && (
            <div className="flex items-center gap-6">
              {user ? (
                <Link
                  to="/dashboard"
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === "/dashboard"
                      ? "text-blue-600 border-b-2 border-blue-600 pb-1"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  to="/home"
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === "/home"
                      ? "text-blue-600 border-b-2 border-blue-600 pb-1"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  Home
                </Link>
              )}

              {user && (
                <>
                  <Link
                    to="/analyze"
                    className={`text-sm font-medium transition-colors ${
                      location.pathname === "/analyze"
                        ? "text-blue-600 border-b-2 border-blue-600 pb-1"
                        : "text-gray-600 hover:text-blue-600"
                    }`}
                  >
                    Analyze
                  </Link>
                  <Link
                    to="/history"
                    className={`text-sm font-medium transition-colors ${
                      location.pathname === "/history"
                        ? "text-blue-600 border-b-2 border-blue-600 pb-1"
                        : "text-gray-600 hover:text-blue-600"
                    }`}
                  >
                    Health History
                  </Link>
                </>
              )}

              {user ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="h-4 w-4" />
                    <span>Hello, {user.firstName || user.email}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Link
                    to="/login"
                    className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-gradient-to-r from-red-500 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:from-red-600 hover:to-blue-700 transition-all transform hover:scale-105"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Navigation for auth pages */}
          {isAuthPage && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {location.pathname === "/login"
                  ? "New to CVD Health?"
                  : "Already have an account?"}
              </span>
              <Link
                to={location.pathname === "/login" ? "/signup" : "/login"}
                className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                {location.pathname === "/login" ? "Create Account" : "Log In"}
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
