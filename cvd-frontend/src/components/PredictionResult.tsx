import { motion } from "framer-motion";
import {
  Heart,
  Activity,
  Target,
  Award,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getRiskLevel } from "@/lib/utils";

interface ModelResult {
  name: string;
  prediction: number;
  probabilities: number[];
}

interface PredictionResultProps {
  results?: ModelResult[];
  isLoading?: boolean;
  error?: string;
}

export function PredictionResult({
  results,
  isLoading = false,
  error,
}: PredictionResultProps) {
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full"
      >
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-0 shadow-lg">
          <CardContent className="p-8">
            <div className="flex flex-col items-center justify-center space-y-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Activity className="h-12 w-12 text-blue-600" />
              </motion.div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Analyzing Your Health Data
                </h3>
                <p className="text-gray-600">
                  Our AI models are processing your information...
                </p>
              </div>
              <div className="w-full max-w-md">
                <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full"
      >
        <Card className="bg-gradient-to-br from-red-50 to-pink-100 border-0 shadow-lg">
          <CardContent className="p-8">
            <div className="flex flex-col items-center justify-center space-y-4">
              <AlertTriangle className="h-12 w-12 text-red-600" />
              <div className="text-center">
                <h3 className="text-xl font-semibold text-red-800 mb-2">
                  Analysis Error
                </h3>
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full"
      >
        <Card className="bg-gradient-to-br from-gray-50 to-slate-100 border-0 shadow-lg">
          <CardContent className="p-8">
            <div className="flex flex-col items-center justify-center space-y-4">
              <Heart className="h-16 w-16 text-gray-400 floating" />
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No Results Yet
                </h3>
                <p className="text-gray-500">
                  Please fill out the form to get your cardiovascular risk
                  prediction
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Use Random Forest as the primary model for risk calculation (best model by default)
  const randomForestModel =
    results.find((model) => model.name === "Random Forest") || results[0];
  const primaryRiskProbability = randomForestModel.probabilities[1];
  const riskInfo = getRiskLevel(primaryRiskProbability);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full space-y-6"
    >
      {/* Main Result Card */}
      <Card className="bg-gradient-to-br from-white to-blue-50 border-0 shadow-xl">
        <CardHeader className="text-center pb-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <Heart
              className={`h-16 w-16 mx-auto mb-4 heart-pulse ${riskInfo.color}`}
            />
          </motion.div>
          <CardTitle className="text-2xl font-bold">
            Cardiovascular Risk Assessment
          </CardTitle>
          <p className="text-sm text-gray-600">
            Based on Random Forest (Best Model)
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Risk Level Display */}
          <div className="text-center">
            <div className={`text-6xl font-bold ${riskInfo.color} mb-2`}>
              {(primaryRiskProbability * 100).toFixed(1)}%
            </div>
            <div className={`text-2xl font-semibold ${riskInfo.color} mb-2`}>
              {riskInfo.level} Risk
            </div>
            <p className="text-gray-600 text-lg">{riskInfo.description}</p>
          </div>

          {/* Risk Meter */}
          <div className="relative">
            <div className="w-full bg-gray-200 rounded-full h-4">
              <motion.div
                className={`h-4 rounded-full ${
                  primaryRiskProbability >= 0.8
                    ? "bg-red-500"
                    : primaryRiskProbability >= 0.6
                    ? "bg-orange-500"
                    : primaryRiskProbability >= 0.4
                    ? "bg-yellow-500"
                    : primaryRiskProbability >= 0.2
                    ? "bg-blue-500"
                    : "bg-green-500"
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${primaryRiskProbability * 100}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Low Risk</span>
              <span>High Risk</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Random Forest - Best Model Highlight */}
      {(() => {
        const randomForestResult = results.find(
          (model) => model.name === "Random Forest"
        );
        if (!randomForestResult) return null;

        return (
          <Card className="bg-gradient-to-br from-emerald-50 to-green-100 border-2 border-emerald-300 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Award className="h-6 w-6 text-emerald-600" />
                Best Model Recommendation: Random Forest
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div
                    className={`text-3xl font-bold ${
                      randomForestResult.prediction === 1
                        ? "text-red-600"
                        : "text-green-600"
                    } mb-2`}
                  >
                    {randomForestResult.prediction === 1
                      ? "CVD Risk Detected"
                      : "No CVD Risk"}
                  </div>
                  <div className="text-lg text-gray-700">
                    Risk Probability:{" "}
                    <span className="font-semibold">
                      {(randomForestResult.probabilities[1] * 100).toFixed(1)}%
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Random Forest achieved the highest accuracy in our testing
                    and is our most trusted model for CVD prediction.
                  </p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${
                      randomForestResult.probabilities[1] >= 0.8
                        ? "bg-red-500"
                        : randomForestResult.probabilities[1] >= 0.6
                        ? "bg-orange-500"
                        : randomForestResult.probabilities[1] >= 0.4
                        ? "bg-yellow-500"
                        : randomForestResult.probabilities[1] >= 0.2
                        ? "bg-blue-500"
                        : "bg-green-500"
                    }`}
                    style={{
                      width: `${randomForestResult.probabilities[1] * 100}%`,
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })()}

      {/* Model Consensus */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Target className="h-6 w-6 text-blue-600" />
            Model Consensus
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {results.filter((model) => model.prediction === 1).length} /{" "}
              {results.length}
            </div>
            <p className="text-sm text-gray-600">Models predict CVD risk</p>
          </div>
        </CardContent>
      </Card>

      {/* All Models Results */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-blue-600" />
            All Model Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results.map((model, index) => (
              <motion.div
                key={model.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border-2 ${
                  model.name === "Random Forest"
                    ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-200"
                    : model.prediction === 1
                    ? "border-red-500 bg-red-50"
                    : "border-green-500 bg-green-50"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-lg flex items-center gap-2">
                      {model.name}
                      {model.name === "Random Forest" && (
                        <Award className="h-5 w-5 text-emerald-600" />
                      )}
                      {model.prediction === 0 ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                      )}
                    </h4>
                    <p className="text-sm text-gray-600">
                      Prediction:{" "}
                      {model.prediction === 1 ? "CVD Risk" : "No CVD Risk"}
                      {model.name === "Random Forest" && (
                        <span className="ml-2 text-emerald-600 font-medium">
                          (Best Model)
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">
                      {(model.probabilities[1] * 100).toFixed(1)}%
                    </div>
                    <p className="text-xs text-gray-500">Risk Probability</p>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        model.probabilities[1] >= 0.8
                          ? "bg-red-500"
                          : model.probabilities[1] >= 0.6
                          ? "bg-orange-500"
                          : model.probabilities[1] >= 0.4
                          ? "bg-yellow-500"
                          : model.probabilities[1] >= 0.2
                          ? "bg-blue-500"
                          : "bg-green-500"
                      }`}
                      style={{ width: `${model.probabilities[1] * 100}%` }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
