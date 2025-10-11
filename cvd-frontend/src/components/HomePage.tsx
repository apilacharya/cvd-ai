import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Heart,
  Activity,
  Users,
  Shield,
  TrendingUp,
  Award,
  BarChart3,
  Clock,
  Star,
} from "lucide-react";
import { CVDPredictionForm } from "@/components/CVDPredictionForm";
import { PredictionResult } from "@/components/PredictionResult";
import { AIHealthAssistant } from "@/components/AIHealthAssistant";
import { useAuth } from "../hooks/useAuth";

// Mock API response for demonstration
const mockPredictionAPI = async (_data: any) => {
  await new Promise((resolve) => setTimeout(resolve, 3000)); // Simulate API delay

  // Mock results from different models
  return {
    success: true,
    results: [
      {
        name: "Random Forest",
        accuracy: 0.89,
        prediction: Math.random() * 0.3 + 0.1, // Random prediction between 0.1-0.4
        confidence: 0.92,
      },
      {
        name: "Logistic Regression",
        accuracy: 0.85,
        prediction: Math.random() * 0.3 + 0.1,
        confidence: 0.88,
      },
      {
        name: "Support Vector Machine",
        accuracy: 0.87,
        prediction: Math.random() * 0.3 + 0.1,
        confidence: 0.9,
      },
      {
        name: "Neural Network",
        accuracy: 0.91,
        prediction: Math.random() * 0.3 + 0.1,
        confidence: 0.94,
      },
    ],
  };
};

export function HomePage() {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [predictionData, setPredictionData] = useState(null);
  const [predictionResults, setPredictionResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePredictionResult = (data: any) => {
    setPredictionData(data);
    setShowForm(false);
    setShowResult(true);
  };

  const handleFormSubmit = async (formData: any) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await mockPredictionAPI(formData);
      setPredictionResults(response.results);
    } catch (err) {
      setError("Failed to analyze your data. Please try again.");
      console.error("Prediction error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // If user is logged in, show dashboard instead of hero section
  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome back, {user.firstName}!
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Ready to analyze your cardiovascular health?
            </p>
          </motion.div>

          {/* Quick Stats Dashboard */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
              <div className="flex items-center">
                <Heart className="h-8 w-8 text-blue-500 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Health Analysis
                  </h3>
                  <p className="text-gray-600">
                    Get instant CVD risk assessment
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-green-500 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Track Progress
                  </h3>
                  <p className="text-gray-600">Monitor your health journey</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
              <div className="flex items-center">
                <Star className="h-8 w-8 text-purple-500 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    AI Assistant
                  </h3>
                  <p className="text-gray-600">
                    Get personalized health insights
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Action Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8"
          >
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Activity className="h-6 w-6 text-red-500 mr-2" />
                CVD Risk Analysis
              </h3>
              <p className="text-gray-600 mb-6">
                Get an instant assessment of your cardiovascular disease risk
                using our advanced AI model.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
              >
                Start Health Analysis
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Clock className="h-6 w-6 text-blue-500 mr-2" />
                Previous Results
              </h3>
              <p className="text-gray-600 mb-6">
                View your historical health assessments and track your progress
                over time.
              </p>
              <Link
                to="/history"
                className="w-full inline-block text-center bg-gray-100 text-gray-800 font-semibold py-3 px-6 rounded-lg hover:bg-gray-200 transition-all duration-300"
              >
                View History
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Show CVD Prediction Form if requested
  if (showForm) {
    return (
      <CVDPredictionForm
        onSubmit={handlePredictionResult}
        isLoading={isLoading}
      />
    );
  }

  // Show Prediction Result if available
  if (showResult && predictionData) {
    return (
      <PredictionResult
        results={predictionData}
        isLoading={isLoading}
        error={error || undefined}
      />
    );
  }

  // Default homepage for non-authenticated users (original hero section)
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-r from-red-500 via-pink-500 to-blue-600 text-white"
      >
        <div className="container mx-auto px-6 py-16">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="mb-6"
            >
              <Heart className="h-20 w-20 mx-auto mb-4 heart-pulse" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-5xl md:text-7xl font-bold mb-6"
            >
              Cardiovascular Disease
              <br />
              <span className="text-yellow-300">Prediction System</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto"
            >
              Advanced AI-powered analysis to assess your cardiovascular health
              risk and provide personalized health insights
            </motion.p>

            {/* Get Started CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mb-8"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-2xl mx-auto border border-white/20">
                <p className="text-lg mb-4 text-yellow-200">
                  🏥 Get Started to get historical record of your predictions
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/signup"
                    className="bg-yellow-400 text-gray-900 px-8 py-3 rounded-full font-bold text-lg hover:bg-yellow-300 transition-all transform hover:scale-105 shadow-lg min-w-[160px]"
                  >
                    Get Started
                  </Link>
                  <Link
                    to="/login"
                    className="bg-white/20 text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-white/30 transition-all transform hover:scale-105 border border-white/30 min-w-[160px]"
                  >
                    Log In
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Feature Highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
            >
              {[
                {
                  icon: Activity,
                  label: "4 AI Models",
                  desc: "Multi-model analysis",
                },
                {
                  icon: Users,
                  label: "Personalized",
                  desc: "Tailored insights",
                },
                { icon: Shield, label: "Secure", desc: "Privacy protected" },
                { icon: Award, label: "Accurate", desc: "90%+ precision" },
              ].map((feature, index) => (
                <div key={index} className="text-center">
                  <feature.icon className="h-8 w-8 mx-auto mb-2 text-yellow-300" />
                  <div className="font-semibold">{feature.label}</div>
                  <div className="text-sm opacity-90">{feature.desc}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Main Content */}
      <section className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-4"
          >
            <CVDPredictionForm
              onSubmit={handleFormSubmit}
              isLoading={isLoading}
            />
          </motion.div>

          {/* Right Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            {/* AI Assistant */}
            <AIHealthAssistant />

            {/* Prediction Results */}
            <PredictionResult
              results={predictionResults}
              isLoading={isLoading}
              error={error || undefined}
            />
          </motion.div>
        </div>
      </section>

      {/* Statistics Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="bg-gray-900 text-white py-16"
      >
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Trusted by Healthcare Professionals
            </h2>
            <p className="text-xl text-gray-300">
              Our AI models are trained on extensive medical datasets
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "90%+", label: "Model Accuracy", icon: TrendingUp },
              { number: "50K+", label: "Assessments", icon: Users },
              { number: "4", label: "AI Models", icon: Activity },
              { number: "24/7", label: "AI Assistant", icon: Heart },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <stat.icon className="h-12 w-12 mx-auto mb-4 text-red-400" />
                <div className="text-4xl font-bold text-red-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-lg">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Call to Action */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16"
      >
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Take Control of Your Heart Health Today
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Get started with your personalized cardiovascular risk assessment
            and receive AI-powered health insights.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                document.querySelector("form")?.scrollIntoView({
                  behavior: "smooth",
                });
              }}
              className="bg-white text-purple-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors duration-200"
            >
              Start Your Assessment
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                window.location.href = "/signup";
              }}
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-purple-600 transition-all duration-200"
            >
              Create Account for History
            </motion.button>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
