import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Heart,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Activity,
  Stethoscope,
  HeartPulse,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "../hooks/useAuth";

const signInSchema = yup.object({
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email"),
  password: yup.string().required("Password is required"),
  rememberMe: yup.boolean(),
});

export function SignInPage() {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(signInSchema),
    mode: "onChange",
  });

  const handleFormSubmit = async (data: any) => {
    try {
      await login(data);
      navigate("/dashboard");
    } catch (error) {
      console.error("Log in error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4 relative overflow-hidden">
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

        {/* Symbols near form top */}
        <div className="absolute top-[17%] left-[33%] opacity-11">
          <Activity className="w-14 h-14 text-teal-100" />
        </div>

        <div className="absolute top-[22%] right-[27%] opacity-12">
          <Shield className="w-13 h-13 text-blue-100" />
        </div>

        <div className="absolute top-[20%] left-[46%] opacity-10">
          <Stethoscope className="w-12 h-12 text-emerald-100" />
        </div>

        {/* Symbols near form bottom */}
        <div className="absolute top-[82%] left-[36%] opacity-12">
          <HeartPulse className="w-14 h-14 text-red-100" />
        </div>

        <div className="absolute top-[79%] right-[33%] opacity-11">
          <Activity className="w-13 h-13 text-teal-100" />
        </div>

        <div className="absolute top-[85%] left-[43%] opacity-13">
          <Shield className="w-12 h-12 text-blue-100" />
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

        {/* Plus signs near form */}
        <div className="absolute top-[19%] left-[37%] opacity-9">
          <div className="relative w-9 h-9">
            <div className="absolute inset-x-0 top-1/2 h-2 bg-blue-100 transform -translate-y-1/2 rounded-sm"></div>
            <div className="absolute inset-y-0 left-1/2 w-2 bg-blue-100 transform -translate-x-1/2 rounded-sm"></div>
          </div>
        </div>

        <div className="absolute top-[84%] right-[39%] opacity-8">
          <div className="relative w-8 h-8">
            <div className="absolute inset-x-0 top-1/2 h-2 bg-red-100 transform -translate-y-1/2 rounded-sm"></div>
            <div className="absolute inset-y-0 left-1/2 w-2 bg-red-100 transform -translate-x-1/2 rounded-sm"></div>
          </div>
        </div>

        <div className="absolute top-[24%] right-[44%] opacity-10">
          <div className="relative w-9 h-9">
            <div className="absolute inset-x-0 top-1/2 h-2 bg-teal-200 transform -translate-y-1/2 rounded-sm"></div>
            <div className="absolute inset-y-0 left-1/2 w-2 bg-teal-200 transform -translate-x-1/2 rounded-sm"></div>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="border-0 shadow-2xl bg-emerald-50/40 backdrop-blur-sm">
          <CardHeader className="text-center space-y-6 pb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto h-16 w-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center"
            >
              <Heart className="h-8 w-8 text-white" />
            </motion.div>
            <div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Welcome Back
              </CardTitle>
              <p className="text-gray-600 mt-2">
                Log in to access your CVD health insights
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <form
              onSubmit={handleSubmit(handleFormSubmit)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    className="pl-10 border-gray-200 focus:border-green-500 focus:ring-green-500"
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    className="pl-10 pr-10 border-gray-200 focus:border-green-500 focus:ring-green-500"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    id="rememberMe"
                    type="checkbox"
                    {...register("rememberMe")}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <Label htmlFor="rememberMe" className="text-sm text-gray-600">
                    Remember me
                  </Label>
                </div>
                <button
                  type="button"
                  className="text-sm text-green-600 hover:text-green-700 font-medium"
                >
                  Forgot password?
                </button>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading || isSubmitting}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
              >
                {loading || isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Logging In...
                  </div>
                ) : (
                  "Log In"
                )}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  Create one now
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
