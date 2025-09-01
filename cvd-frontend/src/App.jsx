import { useState } from "react";
import { HomePage } from "./components/HomePage";
import { SignUpPage } from "./components/SignUpPage";
import { SignInPage } from "./components/SignInPage";
import { HistoricalDataPage } from "./components/HistoricalDataPage";
import { Footer } from "./components/Footer";
import "./App.css";

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [user, setUser] = useState(null);

  const handleSignUp = (userData) => {
    console.log("User signed up:", userData);
    setUser(userData);
    setCurrentPage("home");
  };

  const handleSignIn = (userData) => {
    console.log("User signed in:", userData);
    setUser(userData);
    setCurrentPage("home");
  };

  const renderPage = () => {
    switch (currentPage) {
      case "signup":
        return (
          <SignUpPage
            onSignUp={handleSignUp}
            onNavigateToSignIn={() => setCurrentPage("signin")}
          />
        );
      case "signin":
        return (
          <SignInPage
            onSignIn={handleSignIn}
            onNavigateToSignUp={() => setCurrentPage("signup")}
            onForgotPassword={() => console.log("Forgot password")}
          />
        );
      case "history":
        return <HistoricalDataPage />;
      case "home":
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      {currentPage !== "signin" && currentPage !== "signup" && (
        <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
          <div className="container mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-gradient-to-r from-red-500 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">CVD</span>
                </div>
                <span className="font-bold text-xl bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">
                  Health Predictor
                </span>
              </div>

              <div className="flex items-center gap-6">
                <button
                  onClick={() => setCurrentPage("home")}
                  className={`text-sm font-medium transition-colors ${
                    currentPage === "home"
                      ? "text-blue-600 border-b-2 border-blue-600 pb-1"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  Home
                </button>

                {user && (
                  <button
                    onClick={() => setCurrentPage("history")}
                    className={`text-sm font-medium transition-colors ${
                      currentPage === "history"
                        ? "text-blue-600 border-b-2 border-blue-600 pb-1"
                        : "text-gray-600 hover:text-blue-600"
                    }`}
                  >
                    Health History
                  </button>
                )}

                {user ? (
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">
                      Welcome, {user.firstName || user.email}
                    </span>
                    <button
                      onClick={() => {
                        setUser(null);
                        setCurrentPage("home");
                      }}
                      className="text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setCurrentPage("signin")}
                      className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => setCurrentPage("signup")}
                      className="bg-gradient-to-r from-red-500 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:from-red-600 hover:to-blue-700 transition-all transform hover:scale-105"
                    >
                      Get Started
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className="flex-1">{renderPage()}</main>

      {/* Footer */}
      {currentPage !== "signin" && currentPage !== "signup" && <Footer />}
    </div>
  );
}

export default App;
