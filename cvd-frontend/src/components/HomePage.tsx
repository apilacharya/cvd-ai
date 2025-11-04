import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Activity, Users, Shield, TrendingUp } from "lucide-react";
import { CVDPredictionForm } from "@/components/CVDPredictionForm";
import { PredictionResult } from "@/components/PredictionResult";
import { AIHealthAssistant } from "@/components/AIHealthAssistant";
import { cvdPredictionApi } from "@/services/api";

interface ModelResult {
  name: string;
  prediction: number;
  probabilities: number[];
}

export function HomePage() {
  const [showForm] = useState(false);
  const [predictionResults, setPredictionResults] = useState<
    ModelResult[] | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = async (formData: any) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("Submitting form data:", formData);
      const results = await cvdPredictionApi.predictWithAllModels(formData);
      console.log("Prediction results:", results);

      // Set Random Forest as the best model by reordering results
      const reorderedResults = results.sort((a, b) => {
        if (a.name === "Random Forest") return -1;
        if (b.name === "Random Forest") return 1;
        return 0;
      });

      setPredictionResults(reorderedResults);
    } catch (err) {
      setError(
        "Failed to analyze your data. Please check your connection and try again."
      );
      console.error("Prediction error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Show CVD Prediction Form if requested
  if (showForm) {
    return (
      <CVDPredictionForm onSubmit={handleFormSubmit} isLoading={isLoading} />
    );
  }

  // Default homepage for non-authenticated users (original hero section)
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-600 text-white relative overflow-hidden"
      >
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-6 py-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Text content */}
            <div className="text-center lg:text-left">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="mb-6 lg:hidden"
              >
                <Heart className="h-20 w-20 mx-auto mb-4 heart-pulse" />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
              >
                <span className="inline-block bg-gradient-to-r from-white via-emerald-50 to-white bg-clip-text text-transparent">
                  Cardiovascular Disease
                </span>
                <br />
                <span className="inline-block bg-gradient-to-r from-emerald-100 via-teal-100 to-emerald-100 bg-clip-text text-transparent drop-shadow-lg">
                  Prediction System
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="text-lg md:text-xl mb-8 max-w-2xl mx-auto lg:mx-0 text-white/95"
              >
                Advanced AI-powered analysis to assess your cardiovascular
                health risk and provide personalized health insights with our
                Premium AI Health Assistant
              </motion.p>

              {/* Get Started CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mb-8"
              >
                <div className="bg-emerald-50/80 rounded-2xl p-8 shadow-xl border-2 border-emerald-200/50">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-md">
                        <span className="text-xl">❤️</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base font-bold text-gray-800 mb-1">
                          Analyze Your Heart Health for Free
                        </h3>
                        <p className="text-sm text-gray-600">
                          Get instant cardiovascular risk assessment using
                          advanced AI models
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center shadow-md">
                        <span className="text-xl">📊</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base font-bold text-gray-800 mb-1">
                          Save Your Health History
                        </h3>
                        <p className="text-sm text-gray-600">
                          Create a free account to track predictions and monitor
                          progress over time
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center shadow-md">
                        <span className="text-xl">🤖</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base font-bold text-gray-800 mb-1">
                          Premium AI Health Assistant
                        </h3>
                        <p className="text-sm text-gray-600">
                          Get personalized insights and guidance with account
                          (coming soon)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Buttons outside card */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-6">
                  <Link
                    to="/signup"
                    className="inline-flex items-center justify-center bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-10 py-4 rounded-full font-bold text-base hover:from-emerald-600 hover:to-teal-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Get Started Free
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center bg-white text-emerald-600 px-10 py-4 rounded-full font-semibold text-base hover:bg-emerald-50 transition-all transform hover:scale-105 shadow-md border-2 border-white"
                  >
                    Log In
                  </Link>
                </div>
              </motion.div>
            </div>

            {/* Right side - Heart Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="hidden lg:flex justify-center items-center"
            >
              <div className="relative">
                {/* Glowing effect behind heart */}
                <div className="absolute inset-0 bg-emerald-400/20 rounded-full blur-3xl scale-110 animate-pulse"></div>

                {/* Heart Image */}
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="relative z-10"
                >
                  <img
                    src="/heart.svg"
                    alt="Heart Health"
                    className="w-96 h-96 drop-shadow-2xl"
                  />
                </motion.div>

                {/* Floating health icons around heart */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -top-8 -right-8 bg-white/90 p-3 rounded-full shadow-lg"
                >
                  <Activity className="h-6 w-6 text-green-600" />
                </motion.div>
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{
                    duration: 3.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -bottom-8 -left-8 bg-white/90 p-3 rounded-full shadow-lg"
                >
                  <Shield className="h-6 w-6 text-emerald-600" />
                </motion.div>
              </div>
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
            className="lg:col-span-2 space-y-6"
          >
            {/* AI Assistant - Premium Feature for Logged Users */}
            <AIHealthAssistant />

            {/* Prediction Results */}
            <PredictionResult
              results={predictionResults || undefined}
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
                <stat.icon className="h-12 w-12 mx-auto mb-4 text-emerald-400" />
                <div className="text-4xl font-bold text-emerald-400 mb-2">
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
        className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-16"
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
              className="bg-white text-green-700 px-8 py-4 rounded-full font-bold text-lg hover:bg-emerald-50 transition-colors duration-200"
            >
              Start Your Assessment
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                window.location.href = "/signup";
              }}
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-green-600 transition-all duration-200"
            >
              Create Account for History
            </motion.button>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
