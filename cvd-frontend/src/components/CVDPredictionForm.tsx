import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { motion } from "framer-motion";
import {
  Heart,
  Activity,
  User,
  BookOpen,
  Cigarette,
  Pill,
  Zap,
  TrendingUp,
  Droplets,
  Scale,
  Timer,
  TestTube,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Validation schema
const formSchema = yup.object({
  gender: yup.string().required("Gender is required"),
  age: yup
    .number()
    .required("Age is required")
    .positive("Age must be positive")
    .integer("Age must be a whole number")
    .min(1, "Age must be at least 1")
    .max(120, "Age must be less than 120"),
  education: yup.string().required("Education level is required"),
  currentSmoker: yup
    .string()
    .required("Please specify if you are a current smoker"),
  bpMeds: yup
    .string()
    .required("Please specify if you are on blood pressure medication"),
  prevalentStroke: yup
    .string()
    .required("Please specify if you have had a stroke"),
  prevalentHyp: yup
    .string()
    .required("Please specify if you have hypertension"),
  diabetes: yup.string().required("Please specify if you have diabetes"),
  totChol: yup
    .number()
    .required("Total cholesterol is required")
    .positive("Total cholesterol must be positive")
    .min(100, "Total cholesterol seems too low")
    .max(500, "Total cholesterol seems too high"),
  sysBP: yup
    .number()
    .required("Systolic blood pressure is required")
    .positive("Systolic BP must be positive")
    .min(70, "Systolic BP seems too low")
    .max(250, "Systolic BP seems too high"),
  diaBP: yup
    .number()
    .required("Diastolic blood pressure is required")
    .positive("Diastolic BP must be positive")
    .min(40, "Diastolic BP seems too low")
    .max(150, "Diastolic BP seems too high"),
  bmi: yup
    .number()
    .required("BMI is required")
    .positive("BMI must be positive")
    .min(10, "BMI seems too low")
    .max(60, "BMI seems too high"),
  heartRate: yup
    .number()
    .required("Heart rate is required")
    .positive("Heart rate must be positive")
    .min(40, "Heart rate seems too low")
    .max(200, "Heart rate seems too high"),
  glucose: yup
    .number()
    .required("Glucose level is required")
    .positive("Glucose level must be positive")
    .min(50, "Glucose level seems too low")
    .max(400, "Glucose level seems too high"),
});

type FormData = yup.InferType<typeof formSchema>;

interface CVDFormProps {
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

const educationOptions = [
  { value: "no_school", label: "No School" },
  { value: "primary", label: "Primary School" },
  { value: "secondary", label: "Secondary School" },
  { value: "higher", label: "Higher Education" },
];

export function CVDPredictionForm({
  onSubmit,
  isLoading = false,
}: CVDFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(formSchema),
    mode: "onChange",
  });

  const handleFormSubmit = async (data: FormData) => {
    try {
      // Convert string values to appropriate types for API
      const formattedData = {
        ...data,
        gender: data.gender === "male" ? 1 : data.gender === "female" ? 0 : 2,
        education: educationOptions.findIndex(
          (opt) => opt.value === data.education
        ),
        currentSmoker: data.currentSmoker === "yes" ? 1 : 0,
        bpMeds: data.bpMeds === "yes" ? 1 : 0,
        prevalentStroke: data.prevalentStroke === "yes" ? 1 : 0,
        prevalentHyp: data.prevalentHyp === "yes" ? 1 : 0,
        diabetes: data.diabetes === "yes" ? 1 : 0,
      };

      await onSubmit(formattedData);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const fieldVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-2xl mx-auto shadow-xl border-0 bg-gradient-to-br from-white to-blue-50">
        <CardHeader className="text-center pb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto mb-4"
          >
            <div className="relative">
              <Heart className="h-16 w-16 text-red-500 mx-auto heart-pulse" />
              <Activity className="h-8 w-8 text-blue-500 absolute -bottom-2 -right-2 animate-bounce" />
            </div>
          </motion.div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">
            User Recent Health Data
          </CardTitle>
          <p className="text-muted-foreground mt-2">
            Please provide accurate information for the best prediction results
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
            {/* Gender */}
            <motion.div
              variants={fieldVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.1 }}
              className="space-y-3"
            >
              <Label className="text-base font-semibold flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                What is your gender?
              </Label>
              <RadioGroup
                onValueChange={(value) => setValue("gender", value)}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female">Female</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other">Other</Label>
                </div>
              </RadioGroup>
              {errors.gender && (
                <p className="text-sm text-destructive">
                  {errors.gender.message}
                </p>
              )}
            </motion.div>

            {/* Age */}
            <motion.div
              variants={fieldVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
              className="space-y-3"
            >
              <Label
                htmlFor="age"
                className="text-base font-semibold flex items-center gap-2"
              >
                <Timer className="h-5 w-5 text-green-600" />
                What is your age?
              </Label>
              <Input
                id="age"
                type="number"
                placeholder="Enter your age"
                {...register("age", { valueAsNumber: true })}
                className="text-lg py-3"
              />
              {errors.age && (
                <p className="text-sm text-destructive">{errors.age.message}</p>
              )}
            </motion.div>

            {/* Education Level */}
            <motion.div
              variants={fieldVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.3 }}
              className="space-y-3"
            >
              <Label className="text-base font-semibold flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-purple-600" />
                Education Level
              </Label>
              <select
                {...register("education")}
                className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-lg ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Select education level</option>
                {educationOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.education && (
                <p className="text-sm text-destructive">
                  {errors.education.message}
                </p>
              )}
            </motion.div>

            {/* Health Status Questions */}
            {[
              {
                key: "currentSmoker",
                label: "Are you a current smoker?",
                icon: Cigarette,
                color: "text-orange-600",
              },
              {
                key: "bpMeds",
                label: "Are you on blood pressure medication?",
                icon: Pill,
                color: "text-blue-600",
              },
              {
                key: "prevalentStroke",
                label: "Have you ever had a stroke?",
                icon: Zap,
                color: "text-red-600",
              },
              {
                key: "prevalentHyp",
                label: "Do you have hypertension?",
                icon: TrendingUp,
                color: "text-yellow-600",
              },
              {
                key: "diabetes",
                label: "Do you have diabetes?",
                icon: TestTube,
                color: "text-indigo-600",
              },
            ].map((field, index) => (
              <motion.div
                key={field.key}
                variants={fieldVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.4 + index * 0.1 }}
                className="space-y-3"
              >
                <Label
                  className={`text-base font-semibold flex items-center gap-2`}
                >
                  <field.icon className={`h-5 w-5 ${field.color}`} />
                  {field.label}
                </Label>
                <RadioGroup
                  onValueChange={(value) =>
                    setValue(field.key as keyof FormData, value)
                  }
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id={`${field.key}-yes`} />
                    <Label htmlFor={`${field.key}-yes`}>Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id={`${field.key}-no`} />
                    <Label htmlFor={`${field.key}-no`}>No</Label>
                  </div>
                </RadioGroup>
                {errors[field.key as keyof FormData] && (
                  <p className="text-sm text-destructive">
                    {errors[field.key as keyof FormData]?.message}
                  </p>
                )}
              </motion.div>
            ))}

            {/* Numeric Health Metrics */}
            {[
              {
                key: "totChol",
                label: "What is your total cholesterol? (mg/dL)",
                icon: Droplets,
                color: "text-red-500",
              },
              {
                key: "sysBP",
                label: "What is your systolic BP? (mmHg)",
                icon: TrendingUp,
                color: "text-orange-500",
              },
              {
                key: "diaBP",
                label: "What is your diastolic BP? (mmHg)",
                icon: Activity,
                color: "text-blue-500",
              },
              {
                key: "bmi",
                label: "What is your BMI?",
                icon: Scale,
                color: "text-green-500",
              },
              {
                key: "heartRate",
                label: "What is your heart rate? (bpm)",
                icon: Heart,
                color: "text-red-500",
              },
              {
                key: "glucose",
                label: "What is your glucose level? (mg/dL)",
                icon: TestTube,
                color: "text-purple-500",
              },
            ].map((field, index) => (
              <motion.div
                key={field.key}
                variants={fieldVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.9 + index * 0.1 }}
                className="space-y-3"
              >
                <Label
                  htmlFor={field.key}
                  className={`text-base font-semibold flex items-center gap-2`}
                >
                  <field.icon className={`h-5 w-5 ${field.color}`} />
                  {field.label}
                </Label>
                <Input
                  id={field.key}
                  type="number"
                  step="0.1"
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                  {...register(field.key as keyof FormData, {
                    valueAsNumber: true,
                  })}
                  className="text-lg py-3"
                />
                {errors[field.key as keyof FormData] && (
                  <p className="text-sm text-destructive">
                    {errors[field.key as keyof FormData]?.message}
                  </p>
                )}
              </motion.div>
            ))}

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              className="pt-6"
            >
              <Button
                type="submit"
                disabled={isLoading || isSubmitting}
                className="w-full h-14 text-lg font-bold bg-gradient-to-r from-red-500 to-blue-600 hover:from-red-600 hover:to-blue-700 transform transition-all duration-200 hover:scale-105 disabled:transform-none"
              >
                {isLoading || isSubmitting ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="mr-2"
                  >
                    <Activity className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <Heart className="mr-2 h-5 w-5" />
                )}
                {isLoading || isSubmitting
                  ? "Analyzing..."
                  : "PREDICT CVD RISK"}
              </Button>
            </motion.div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
