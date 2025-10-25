import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Activity } from "lucide-react";
import { Link } from "react-router-dom";
import { CVDPredictionForm } from "@/components/CVDPredictionForm";
import type { ModelPredictionInput } from "@/components/CVDPredictionForm";
import { PredictionResult } from "@/components/PredictionResult";
import { AIHealthAssistant } from "@/components/AIHealthAssistant";
import { useAuth } from "../hooks/useAuth";
import { cvdPredictionApi } from "@/services/api";

export function AnalyzePage() {
  const { user } = useAuth();
  const [predictionResults, setPredictionResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = async (formData: ModelPredictionInput) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("Submitting form data:", formData);
      const results = await cvdPredictionApi.predictWithAllModels(formData);
      console.log("Prediction results:", results);
      setPredictionResults(results);
    } catch (err) {
      setError(
        "Failed to analyze your data. Please check your connection and try again."
      );
      console.error("Prediction error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Dashboard
            </Link>
          </div>

          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
              <Activity className="h-10 w-10 text-red-500" />
              Health Analysis Center
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Get comprehensive cardiovascular risk assessment with AI-powered
              insights, {user?.firstName}
            </p>
          </div>
        </motion.div>

        {/* Main Content */}
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
            className="lg:col-span-2 flex flex-col gap-12"
          >
            {/* AI Health Assistant */}
            <div className="flex-shrink-0">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                AI Health Assistant
              </h2>
              <AIHealthAssistant cvdResults={predictionResults} />
            </div>

            {/* Prediction Results */}
            <div className="flex-shrink-0 pt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Analysis Results
              </h2>
              <PredictionResult
                results={predictionResults}
                isLoading={isLoading}
                error={error || undefined}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
