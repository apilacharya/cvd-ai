import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Activity, HeartPulse, Stethoscope, Shield } from "lucide-react";
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
            userAge: data.originalValues?.age || data.age,
            userGender: data.male === 1 ? "male" : "female",
            healthData: {
              sysBP: data.originalValues?.sysBP || data.sysBP,
              diaBP: data.originalValues?.diaBP || data.diaBP,
              BMI: data.originalValues?.BMI || data.BMI,
              heartRate: data.originalValues?.heartRate || data.heartRate,
              glucose: data.originalValues?.glucose || data.glucose,
              totChol: data.originalValues?.totChol || data.totChol,
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
    
    // Use original values for comparisons (fall back to normalized if not available)
    const sysBP = data.originalValues?.sysBP || data.sysBP;
    const diaBP = data.originalValues?.diaBP || data.diaBP;
    const BMI = data.originalValues?.BMI || data.BMI;
    const glucose = data.originalValues?.glucose || data.glucose;
    const totChol = data.originalValues?.totChol || data.totChol;
    const heartRate = data.originalValues?.heartRate || data.heartRate;

    if (riskLevel === "high") {
      recommendations.push(
        "Schedule an appointment with your doctor immediately"
      );
      recommendations.push("Monitor your blood pressure daily");
    }

    if (sysBP > 140 || diaBP > 90) {
      recommendations.push(
        "Your blood pressure is elevated. Reduce sodium intake and exercise regularly"
      );
    }

    if (BMI > 30) {
      recommendations.push(
        "Focus on maintaining a healthy weight through diet and exercise"
      );
    } else if (BMI > 25) {
      recommendations.push(
        "Consider gradual weight loss through balanced nutrition"
      );
    }

    if (glucose > 125) {
      recommendations.push(
        "Your glucose levels are concerning. Monitor blood sugar regularly"
      );
    }

    if (totChol > 240) {
      recommendations.push(
        "High cholesterol detected. Consider dietary changes and consult your doctor"
      );
    }

    if (data.currentSmoker === 1) {
      recommendations.push(
        "Quit smoking to significantly reduce cardiovascular risk"
      );
    }

    if (heartRate > 100) {
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 relative overflow-hidden">
      {/* Decorative Health Icons - Static Random Positions */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Health Icons scattered randomly */}
        <div className="absolute top-[4%] left-[2%] opacity-16">
          <HeartPulse className="w-20 h-20 text-red-200" />
        </div>
        
        <div className="absolute top-[18%] right-[11%] opacity-13">
          <Stethoscope className="w-18 h-18 text-emerald-200" />
        </div>
        
        <div className="absolute top-[51%] left-[7%] opacity-15">
          <Activity className="w-22 h-22 text-teal-200" />
        </div>
        
        <div className="absolute top-[89%] left-[3%] opacity-14">
          <Shield className="w-18 h-18 text-blue-200" />
        </div>

        <div className="absolute top-[37%] left-[1%] opacity-12">
          <HeartPulse className="w-16 h-16 text-red-100" />
        </div>

        <div className="absolute top-[72%] right-[4%] opacity-14">
          <Activity className="w-19 h-19 text-teal-200" />
        </div>

        <div className="absolute top-[96%] right-[8%] opacity-13">
          <Stethoscope className="w-20 h-20 text-emerald-200" />
        </div>

        <div className="absolute top-[28%] right-[2%] opacity-15">
          <Shield className="w-17 h-17 text-blue-200" />
        </div>

        <div className="absolute top-[61%] left-[12%] opacity-12">
          <HeartPulse className="w-15 h-15 text-red-200" />
        </div>

        <div className="absolute top-[9%] left-[18%] opacity-11">
          <Activity className="w-14 h-14 text-teal-100" />
        </div>

        <div className="absolute top-[44%] right-[19%] opacity-13">
          <Stethoscope className="w-16 h-16 text-emerald-100" />
        </div>

        <div className="absolute top-[81%] left-[24%] opacity-12">
          <Shield className="w-15 h-15 text-blue-100" />
        </div>

        {/* Plus Signs scattered randomly */}
        <div className="absolute top-[11%] right-[15%] opacity-11">
          <div className="relative w-13 h-13">
            <div className="absolute inset-x-0 top-1/2 h-4 bg-red-100 transform -translate-y-1/2 rounded-sm"></div>
            <div className="absolute inset-y-0 left-1/2 w-4 bg-red-100 transform -translate-x-1/2 rounded-sm"></div>
          </div>
        </div>
        
        <div className="absolute top-[93%] left-[16%] opacity-12">
          <div className="relative w-14 h-14">
            <div className="absolute inset-x-0 top-1/2 h-4 bg-emerald-200 transform -translate-y-1/2 rounded-sm"></div>
            <div className="absolute inset-y-0 left-1/2 w-4 bg-emerald-200 transform -translate-x-1/2 rounded-sm"></div>
          </div>
        </div>

        <div className="absolute top-[6%] left-[27%] opacity-10">
          <div className="relative w-11 h-11">
            <div className="absolute inset-x-0 top-1/2 h-3 bg-teal-100 transform -translate-y-1/2 rounded-sm"></div>
            <div className="absolute inset-y-0 left-1/2 w-3 bg-teal-100 transform -translate-x-1/2 rounded-sm"></div>
          </div>
        </div>

        <div className="absolute top-[68%] right-[21%] opacity-11">
          <div className="relative w-12 h-12">
            <div className="absolute inset-x-0 top-1/2 h-3 bg-blue-200 transform -translate-y-1/2 rounded-sm"></div>
            <div className="absolute inset-y-0 left-1/2 w-3 bg-blue-200 transform -translate-x-1/2 rounded-sm"></div>
          </div>
        </div>

        <div className="absolute top-[34%] left-[22%] opacity-9">
          <div className="relative w-10 h-10">
            <div className="absolute inset-x-0 top-1/2 h-3 bg-red-200 transform -translate-y-1/2 rounded-sm"></div>
            <div className="absolute inset-y-0 left-1/2 w-3 bg-red-200 transform -translate-x-1/2 rounded-sm"></div>
          </div>
        </div>

        <div className="absolute top-[74%] right-[26%] opacity-10">
          <div className="relative w-11 h-11">
            <div className="absolute inset-x-0 top-1/2 h-3 bg-emerald-100 transform -translate-y-1/2 rounded-sm"></div>
            <div className="absolute inset-y-0 left-1/2 w-3 bg-emerald-100 transform -translate-x-1/2 rounded-sm"></div>
          </div>
        </div>

        <div className="absolute top-[48%] right-[6%] opacity-11">
          <div className="relative w-10 h-10">
            <div className="absolute inset-x-0 top-1/2 h-3 bg-teal-200 transform -translate-y-1/2 rounded-sm"></div>
            <div className="absolute inset-y-0 left-1/2 w-3 bg-teal-200 transform -translate-x-1/2 rounded-sm"></div>
          </div>
        </div>

        <div className="absolute top-[23%] left-[9%] opacity-10">
          <div className="relative w-9 h-9">
            <div className="absolute inset-x-0 top-1/2 h-3 bg-blue-100 transform -translate-y-1/2 rounded-sm"></div>
            <div className="absolute inset-y-0 left-1/2 w-3 bg-blue-100 transform -translate-x-1/2 rounded-sm"></div>
          </div>
        </div>

        <div className="absolute top-[56%] left-[5%] opacity-12">
          <div className="relative w-12 h-12">
            <div className="absolute inset-x-0 top-1/2 h-3 bg-red-100 transform -translate-y-1/2 rounded-sm"></div>
            <div className="absolute inset-y-0 left-1/2 w-3 bg-red-100 transform -translate-x-1/2 rounded-sm"></div>
          </div>
        </div>

        <div className="absolute top-[15%] right-[24%] opacity-9">
          <div className="relative w-10 h-10">
            <div className="absolute inset-x-0 top-1/2 h-3 bg-emerald-200 transform -translate-y-1/2 rounded-sm"></div>
            <div className="absolute inset-y-0 left-1/2 w-3 bg-emerald-200 transform -translate-x-1/2 rounded-sm"></div>
          </div>
        </div>

        <div className="absolute top-[87%] right-[13%] opacity-11">
          <div className="relative w-11 h-11">
            <div className="absolute inset-x-0 top-1/2 h-3 bg-teal-100 transform -translate-y-1/2 rounded-sm"></div>
            <div className="absolute inset-y-0 left-1/2 w-3 bg-teal-100 transform -translate-x-1/2 rounded-sm"></div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
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
