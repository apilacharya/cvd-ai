import { motion } from "framer-motion";
import {
  Heart,
  Activity,
  BarChart3,
  Clock,
  Star,
  TrendingUp,
  Users,
  HeartPulse,
  Stethoscope,
  Shield,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function Dashboard() {
  const { user } = useAuth();

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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          {/* Heart Image */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-6"
          >
            <motion.img
              src="/heart.svg"
              alt="Heart"
              className="h-24 w-24 mx-auto"
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome back, {user?.firstName}!
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
          <div className="bg-emerald-50/60 rounded-xl shadow-md p-6 border-l-4 border-emerald-500">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-emerald-500 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Health Analysis
                </h3>
                <p className="text-gray-600">Get instant CVD risk assessment</p>
              </div>
            </div>
          </div>
          <div className="bg-green-50/60 rounded-xl shadow-md p-6 border-l-4 border-green-500">
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
          <div className="bg-teal-50/60 rounded-xl shadow-md p-6 border-l-4 border-teal-500">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-teal-500 mr-3" />
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
          <div className="bg-emerald-50/50 rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Activity className="h-6 w-6 text-emerald-500 mr-2" />
              CVD Risk Analysis
            </h3>
            <p className="text-gray-600 mb-6">
              Get an instant assessment of your cardiovascular disease risk
              using our advanced AI model with personalized insights.
            </p>
            <Link
              to="/analyze"
              className="w-full inline-block text-center bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 transform hover:scale-105"
            >
              Start Health Analysis
            </Link>
          </div>

          <div className="bg-green-50/50 rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Clock className="h-6 w-6 text-green-500 mr-2" />
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

        {/* Statistics Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl shadow-lg p-8"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Trusted by Healthcare Professionals
            </h2>
            <p className="text-xl text-emerald-100">
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
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="text-center"
              >
                <stat.icon className="h-12 w-12 mx-auto mb-4 text-green-100" />
                <div className="text-4xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-lg">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
