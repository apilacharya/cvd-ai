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
  accuracy: number;
  prediction: number;
  confidence: number;
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

  // Find the best performing model
  const bestModel = results.reduce((best, current) =>
    current.accuracy > best.accuracy ? current : best
  );

  const averagePrediction =
    results.reduce((sum, model) => sum + model.prediction, 0) / results.length;
  const riskInfo = getRiskLevel(averagePrediction);

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
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Risk Level Display */}
          <div className="text-center">
            <div className={`text-6xl font-bold ${riskInfo.color} mb-2`}>
              {(averagePrediction * 100).toFixed(1)}%
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
                  averagePrediction >= 0.8
                    ? "bg-red-500"
                    : averagePrediction >= 0.6
                    ? "bg-orange-500"
                    : averagePrediction >= 0.4
                    ? "bg-yellow-500"
                    : averagePrediction >= 0.2
                    ? "bg-blue-500"
                    : "bg-green-500"
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${averagePrediction * 100}%` }}
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

      {/* Best Model Highlight */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Award className="h-6 w-6 text-green-600" />
            Most Accurate Model: {bestModel.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {(bestModel.accuracy * 100).toFixed(1)}%
              </div>
              <p className="text-sm text-gray-600">Accuracy</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {(bestModel.confidence * 100).toFixed(1)}%
              </div>
              <p className="text-sm text-gray-600">Confidence</p>
            </div>
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
                  model.name === bestModel.name
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-lg flex items-center gap-2">
                      {model.name}
                      {model.name === bestModel.name && (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}
                    </h4>
                    <p className="text-sm text-gray-600">
                      Risk: {(model.prediction * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">
                      {(model.accuracy * 100).toFixed(1)}%
                    </div>
                    <p className="text-xs text-gray-500">Accuracy</p>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        model.prediction >= 0.8
                          ? "bg-red-500"
                          : model.prediction >= 0.6
                          ? "bg-orange-500"
                          : model.prediction >= 0.4
                          ? "bg-yellow-500"
                          : model.prediction >= 0.2
                          ? "bg-blue-500"
                          : "bg-green-500"
                      }`}
                      style={{ width: `${model.prediction * 100}%` }}
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
