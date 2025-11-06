import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Heart, Mail, Lock, Eye, EyeOff } from "lucide-react";
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
    <div className='min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='w-full max-w-md'
      >
        <Card className='border-0 shadow-2xl bg-emerald-50/40 backdrop-blur-sm'>
          <CardHeader className='text-center space-y-6 pb-8'>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className='mx-auto h-16 w-16 bg-gradient-to-r from-green-800 to-green-900 rounded-full flex items-center justify-center'
            >
              <Heart className='h-8 w-8 text-white' />
            </motion.div>
            <div>
              <CardTitle className='text-2xl font-bold bg-gradient-to-r from-green-800 to-green-900 bg-clip-text text-transparent'>
                Welcome Back
              </CardTitle>
              <p className='text-gray-600 mt-2'>
                Log in to access your CVD health insights
              </p>
            </div>
          </CardHeader>

          <CardContent className='space-y-6'>
            <form
              onSubmit={handleSubmit(handleFormSubmit)}
              className='space-y-4'
            >
              <div className='space-y-2'>
                <Label
                  htmlFor='email'
                  className='text-sm font-medium text-gray-700'
                >
                  Email Address
                </Label>
                <div className='relative'>
                  <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
                  <Input
                    id='email'
                    type='email'
                    {...register("email")}
                    className='pl-10 border-gray-200 focus:border-green-500 focus:ring-green-500'
                    placeholder='Enter your email'
                  />
                </div>
                {errors.email && (
                  <p className='text-sm text-red-600'>{errors.email.message}</p>
                )}
              </div>

              <div className='space-y-2'>
                <Label
                  htmlFor='password'
                  className='text-sm font-medium text-gray-700'
                >
                  Password
                </Label>
                <div className='relative'>
                  <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
                  <Input
                    id='password'
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    className='pl-10 pr-10 border-gray-200 focus:border-green-500 focus:ring-green-500'
                    placeholder='Enter your password'
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
                  >
                    {showPassword ? (
                      <EyeOff className='h-4 w-4' />
                    ) : (
                      <Eye className='h-4 w-4' />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className='text-sm text-red-600'>
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-2'>
                  <input
                    id='rememberMe'
                    type='checkbox'
                    {...register("rememberMe")}
                    className='rounded border-gray-300 text-green-600 focus:ring-green-500'
                  />
                  <Label htmlFor='rememberMe' className='text-sm text-gray-600'>
                    Remember me
                  </Label>
                </div>
                <button
                  type='button'
                  className='text-sm text-green-600 hover:text-green-700 font-medium'
                >
                  Forgot password?
                </button>
              </div>

              {error && (
                <div className='p-3 bg-red-50 border border-red-200 rounded-lg'>
                  <p className='text-sm text-red-600'>{error}</p>
                </div>
              )}

              <Button
                type='submit'
                disabled={loading || isSubmitting}
                className='w-full bg-gradient-to-r from-green-800 to-green-900 hover:from-emerald-600 hover:to-teal-700 text-white font-medium py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02]'
              >
                {loading || isSubmitting ? (
                  <div className='flex items-center justify-center'>
                    <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
                    Logging In...
                  </div>
                ) : (
                  "Log In"
                )}
              </Button>
            </form>

            <div className='text-center'>
              <p className='text-sm text-gray-600'>
                Don't have an account?{" "}
                <Link
                  to='/signup'
                  className='text-green-600 hover:text-green-700 font-medium'
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
