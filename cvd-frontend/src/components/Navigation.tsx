import { Link, useLocation, useNavigate } from "react-router-dom";
import { User, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";

export const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      setIsMenuOpen(false);
      navigate("/home");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-emerald-50/40 shadow-sm border-b border-emerald-100 sticky top-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto px-4 md:px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            to={user ? "/dashboard" : "/home"}
            className="flex items-center gap-2 md:gap-3 hover:opacity-80 transition-opacity flex-shrink-0"
          >
            <div className="h-8 w-8 bg-gradient-to-r from-green-700 to-green-900 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">CVD</span>
            </div>
            <span className="hidden sm:inline font-bold text-lg md:text-xl bg-gradient-to-r from-green-700 to-green-900 bg-clip-text text-transparent">
              Health Predictor
            </span>
          </Link>

          {/* Desktop Navigation */}
          {!isAuthPage && (
            <div className="hidden md:flex items-center gap-6">
              {user ? (
                <Link
                  to="/dashboard"
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === "/dashboard"
                      ? "text-green-600 border-b-2 border-green-600 pb-1"
                      : "text-gray-600 hover:text-green-600"
                  }`}
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  to="/home"
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === "/home"
                      ? "text-green-600 border-b-2 border-green-600 pb-1"
                      : "text-gray-600 hover:text-green-600"
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
                        ? "text-green-600 border-b-2 border-green-600 pb-1"
                        : "text-gray-600 hover:text-green-600"
                    }`}
                  >
                    Analyze
                  </Link>
                  <Link
                    to="/history"
                    className={`text-sm font-medium transition-colors ${
                      location.pathname === "/history"
                        ? "text-green-600 border-b-2 border-green-600 pb-1"
                        : "text-gray-600 hover:text-green-600"
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
                    <span>{user.firstName || user.email}</span>
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
                    className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-gradient-to-r from-green-700 to-green-900 text-white px-4 py-2 rounded-full text-sm font-medium hover:from-emerald-600 hover:to-teal-700 transition-all transform hover:scale-105"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Auth Pages Navigation (Desktop) */}
          {isAuthPage && (
            <div className="hidden md:flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {location.pathname === "/login"
                  ? "New to CVD Health?"
                  : "Already have an account?"}
              </span>
              <Link
                to={location.pathname === "/login" ? "/signup" : "/login"}
                className="text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
              >
                {location.pathname === "/login" ? "Create Account" : "Log In"}
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Menu Button */}
          {!isAuthPage && (
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 text-gray-600 hover:text-green-600 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          )}
        </div>

        {/* Mobile Menu */}
        {!isAuthPage && isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-emerald-100 space-y-3">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className={`block text-sm font-medium py-2 px-3 rounded transition-colors ${
                    location.pathname === "/dashboard"
                      ? "bg-green-100 text-green-700"
                      : "text-gray-600 hover:bg-emerald-50 hover:text-green-600"
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/analyze"
                  onClick={() => setIsMenuOpen(false)}
                  className={`block text-sm font-medium py-2 px-3 rounded transition-colors ${
                    location.pathname === "/analyze"
                      ? "bg-green-100 text-green-700"
                      : "text-gray-600 hover:bg-emerald-50 hover:text-green-600"
                  }`}
                >
                  Analyze
                </Link>
                <Link
                  to="/history"
                  onClick={() => setIsMenuOpen(false)}
                  className={`block text-sm font-medium py-2 px-3 rounded transition-colors ${
                    location.pathname === "/history"
                      ? "bg-green-100 text-green-700"
                      : "text-gray-600 hover:bg-emerald-50 hover:text-green-600"
                  }`}
                >
                  Health History
                </Link>
                <div className="border-t border-emerald-100 pt-3 mt-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600 px-3 py-2">
                    <User className="h-4 w-4" />
                    <span>{user.firstName || user.email}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center gap-2 text-sm text-red-600 hover:text-red-700 font-medium transition-colors py-2 px-3 rounded hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/home"
                  onClick={() => setIsMenuOpen(false)}
                  className={`block text-sm font-medium py-2 px-3 rounded transition-colors ${
                    location.pathname === "/home"
                      ? "bg-green-100 text-green-700"
                      : "text-gray-600 hover:bg-emerald-50 hover:text-green-600"
                  }`}
                >
                  Home
                </Link>
                <div className="border-t border-emerald-100 pt-3 mt-3 space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-sm font-medium text-gray-600 hover:text-green-600 transition-colors py-2 px-3"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMenuOpen(false)}
                    className="block bg-gradient-to-r from-green-700 to-green-900 text-white px-4 py-2 rounded-full text-sm font-medium hover:from-emerald-600 hover:to-teal-700 transition-all text-center"
                  >
                    Get Started
                  </Link>
                </div>
              </>
            )}
          </div>
        )}

        {/* Mobile Auth Pages Navigation */}
        {isAuthPage && (
          <div className="md:hidden mt-4 pt-4 border-t border-emerald-100">
            <span className="block text-sm text-gray-600 mb-3">
              {location.pathname === "/login"
                ? "New to CVD Health?"
                : "Already have an account?"}
            </span>
            <Link
              to={location.pathname === "/login" ? "/signup" : "/login"}
              className="inline-block text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
            >
              {location.pathname === "/login" ? "Create Account" : "Log In"}
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};
