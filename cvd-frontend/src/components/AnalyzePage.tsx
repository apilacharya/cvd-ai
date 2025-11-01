import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Activity } from "lucide-react";
import { Link } from "react-router-dom";
import { CVDPredictionForm } from "@/components/CVDPredictionForm";
import type { ModelPredictionInput } from "@/components/CVDPredictionForm";
import { PredictionResult } from "@/components/PredictionResult";
import { AIHealthAssistant } from "@/components/AIHealthAssistant";
import { useAuth } from "../hooks/useAuth";
import { cvdPredictionApi, cvdReportsApi } from "@/services/api";

export function AnalyzePage() {
  const { user } = useAuth();
  const [predictionResults, setPredictionResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = async (data: ModelPredictionInput) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("Submitting form data:", data);
      const results = await cvdPredictionApi.predictWithAllModels(data);
      console.log("Prediction results:", results);
      setPredictionResults(results);

      // Find Random Forest model result (the best model)
      const randomForestModel = results.find(
        (model: any) => model.name === "Random Forest"
      );

      if (randomForestModel && user) {
        // Calculate risk level based on probability
        const riskProbability = randomForestModel.probabilities[1];
        let riskLevel: "low" | "medium" | "high" = "low";
        if (riskProbability >= 0.7) {
          riskLevel = "high";
        } else if (riskProbability >= 0.4) {
          riskLevel = "medium";
        }

        // Generate recommendations based on risk level
        const recommendations = generateRecommendations(riskLevel, data);

        // Save report to database
        try {
          await cvdReportsApi.createReport({
            userAge: data.age,
            userGender: data.male === 1 ? "male" : "female",
            healthData: {
              sysBP: data.sysBP,
              diaBP: data.diaBP,
              BMI: data.BMI,
              heartRate: data.heartRate,
              glucose: data.glucose,
              totChol: data.totChol,
            },
            predictionResult: {
              riskLevel,
              riskScore: riskProbability * 100,
              recommendations,
              modelUsed: "Random Forest",
              additionalInfo: {
                allModels: results,
                confidence: randomForestModel.probabilities[1],
              },
            },
          });
          console.log("Report saved successfully");
        } catch (saveError) {
          console.error("Failed to save report:", saveError);
          // Don't show error to user as they still got predictions
        }
      }
    } catch (err) {
      setError(
        "Failed to analyze your data. Please check your connection and try again."
      );
      console.error("Prediction error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const generateRecommendations = (
    riskLevel: string,
    data: ModelPredictionInput
  ): string[] => {
    const recommendations: string[] = [];

    if (riskLevel === "high") {
      recommendations.push(
        "Schedule an appointment with your doctor immediately"
      );
      recommendations.push("Monitor your blood pressure daily");
    }

    if (data.sysBP > 140 || data.diaBP > 90) {
      recommendations.push(
        "Your blood pressure is elevated. Reduce sodium intake and exercise regularly"
      );
    }

    if (data.BMI > 30) {
      recommendations.push(
        "Focus on maintaining a healthy weight through diet and exercise"
      );
    } else if (data.BMI > 25) {
      recommendations.push(
        "Consider gradual weight loss through balanced nutrition"
      );
    }

    if (data.glucose > 125) {
      recommendations.push(
        "Your glucose levels are concerning. Monitor blood sugar regularly"
      );
    }

    if (data.totChol > 240) {
      recommendations.push(
        "High cholesterol detected. Consider dietary changes and consult your doctor"
      );
    }

    if (data.currentSmoker === 1) {
      recommendations.push(
        "Quit smoking to significantly reduce cardiovascular risk"
      );
    }

    if (data.heartRate > 100) {
      recommendations.push(
        "Elevated heart rate detected. Practice stress management techniques"
      );
    }

    if (recommendations.length === 0) {
      recommendations.push(
        "Maintain your healthy lifestyle with regular exercise"
      );
      recommendations.push("Continue monitoring your health metrics regularly");
      recommendations.push("Stay hydrated and eat a balanced diet");
    }

    return recommendations;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
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
              className="flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Dashboard
            </Link>
          </div>

          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
              <Activity className="h-10 w-10 text-emerald-500" />
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
