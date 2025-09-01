import { useState } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  Activity,
  Users,
  Shield,
  TrendingUp,
  Award,
} from "lucide-react";
import { CVDPredictionForm } from "@/components/CVDPredictionForm";
import { PredictionResult } from "@/components/PredictionResult";
import { AIHealthAssistant } from "@/components/AIHealthAssistant";

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
  const [predictionResults, setPredictionResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
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
            className="space-y-6"
          >
            {/* Prediction Results */}
            <PredictionResult
              results={predictionResults}
              isLoading={isLoading}
              error={error || undefined}
            />

            {/* AI Health Assistant */}
            <AIHealthAssistant
              predictionResults={predictionResults}
              isEnabled={!!predictionResults}
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
        </div>
      </motion.section>
    </div>
  );
}
