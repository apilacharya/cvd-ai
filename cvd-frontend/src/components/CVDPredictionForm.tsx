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
  cigsPerDay: yup
    .number()
    .nullable()
    .default(0)
    .when("currentSmoker", {
      is: "yes",
      then: (schema) =>
        schema
          .required("Cigarettes per day is required for smokers")
          .min(0, "Cigarettes per day cannot be negative")
          .max(100, "Cigarettes per day seems too high"),
      otherwise: (schema) => schema.transform(() => 0),
    }),
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

export interface ModelPredictionInput {
  male: number;
  age: number;
  education: number;
  currentSmoker: number;
  cigsPerDay: number;
  BPMeds: number;
  prevalentStroke: number;
  prevalentHyp: number;
  diabetes: number;
  totChol: number;
  sysBP: number;
  diaBP: number;
  BMI: number;
  heartRate: number;
  glucose: number;
}

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

// Normalization ranges for min-max scaling to [-1, 1]
// These values should match the expected input ranges from the training data
const featureRanges = {
  age: { min: 1, max: 120 },
  cigsPerDay: { min: 0, max: 100 },
  totChol: { min: 100, max: 500 },
  sysBP: { min: 70, max: 250 },
  diaBP: { min: 40, max: 150 },
  bmi: { min: 10, max: 60 },
  heartRate: { min: 40, max: 200 },
  glucose: { min: 50, max: 400 },
};

// Function to normalize a value to [-1, 1] range
const normalizeToRange = (value: number, min: number, max: number): number => {
  // Min-max normalization to [0, 1] then scale to [-1, 1]
  const normalized = (value - min) / (max - min); // [0, 1]
  return normalized * 2 - 1; // [-1, 1]
};

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
      // Get education index (0-3)
      const educationIndex = educationOptions.findIndex(
        (opt) => opt.value === data.education
      );

      // Normalize education to [-1, 1] range
      // 0 (no school) -> -1, 1 (primary) -> -0.33, 2 (secondary) -> 0.33, 3 (higher) -> 1
      const normalizedEducation =
        educationIndex === 0
          ? -1
          : educationIndex === 1
          ? -0.33
          : educationIndex === 2
          ? 0.33
          : 1;

      // Convert form data to API schema format with normalization
      const formattedData = {
        male: data.gender === "male" ? 1 : 0, // Binary: 0 or 1
        age: normalizeToRange(
          data.age,
          featureRanges.age.min,
          featureRanges.age.max
        ),
        education: normalizedEducation,
        currentSmoker: data.currentSmoker === "yes" ? 1 : 0, // Binary: 0 or 1
        cigsPerDay: normalizeToRange(
          data.cigsPerDay || 0,
          featureRanges.cigsPerDay.min,
          featureRanges.cigsPerDay.max
        ),
        BPMeds: data.bpMeds === "yes" ? 1 : 0, // Binary: 0 or 1
        prevalentStroke: data.prevalentStroke === "yes" ? 1 : 0, // Binary: 0 or 1
        prevalentHyp: data.prevalentHyp === "yes" ? 1 : 0, // Binary: 0 or 1
        diabetes: data.diabetes === "yes" ? 1 : 0, // Binary: 0 or 1
        totChol: normalizeToRange(
          data.totChol,
          featureRanges.totChol.min,
          featureRanges.totChol.max
        ),
        sysBP: normalizeToRange(
          data.sysBP,
          featureRanges.sysBP.min,
          featureRanges.sysBP.max
        ),
        diaBP: normalizeToRange(
          data.diaBP,
          featureRanges.diaBP.min,
          featureRanges.diaBP.max
        ),
        BMI: normalizeToRange(
          data.bmi,
          featureRanges.bmi.min,
          featureRanges.bmi.max
        ),
        heartRate: normalizeToRange(
          data.heartRate,
          featureRanges.heartRate.min,
          featureRanges.heartRate.max
        ),
        glucose: normalizeToRange(
          data.glucose,
          featureRanges.glucose.min,
          featureRanges.glucose.max
        ),
      };

      console.log("Original form data:", data);
      console.log("Normalized data (range: -1 to 1):", formattedData);

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
      <Card className="w-full max-w-2xl mx-auto shadow-xl border-0 bg-gradient-to-br from-emerald-50/40 via-green-50/30 to-teal-50/40">
        <CardHeader className="text-center pb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto mb-4"
          >
            <div className="relative">
              <Heart className="h-16 w-16 text-emerald-500 mx-auto heart-pulse" />
              <Activity className="h-8 w-8 text-green-500 absolute -bottom-2 -right-2 animate-bounce" />
            </div>
          </motion.div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            User Recent Health Data
          </CardTitle>
          <p className="text-muted-foreground mt-2">
            Please provide accurate information for the best prediction results
          </p>
        </CardHeader>

        <CardContent className="p-8 pt-10">
          <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="space-y-10"
          >
            {/* Row 1: Gender (Radio) and Age (Input) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <motion.div
                variants={fieldVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.1 }}
                className="space-y-4"
              >
                <Label className="text-lg font-semibold flex items-center gap-3 text-gray-700">
                  <User className="h-6 w-6 text-blue-600" />
                  What is your gender?
                </Label>
                <RadioGroup
                  onValueChange={(value) => setValue("gender", value)}
                  className="flex gap-6 pt-2"
                >
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem
                      value="male"
                      id="male"
                      className="h-5 w-5 border-2"
                    />
                    <Label
                      htmlFor="male"
                      className="text-base font-medium text-gray-600 cursor-pointer"
                    >
                      Male
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem
                      value="female"
                      id="female"
                      className="h-5 w-5 border-2"
                    />
                    <Label
                      htmlFor="female"
                      className="text-base font-medium text-gray-600 cursor-pointer"
                    >
                      Female
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem
                      value="other"
                      id="other"
                      className="h-5 w-5 border-2"
                    />
                    <Label
                      htmlFor="other"
                      className="text-base font-medium text-gray-600 cursor-pointer"
                    >
                      Other
                    </Label>
                  </div>
                </RadioGroup>
                {errors.gender && (
                  <p className="text-sm text-destructive">
                    {errors.gender.message}
                  </p>
                )}
              </motion.div>

              <motion.div
                variants={fieldVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.2 }}
                className="space-y-4"
              >
                <Label
                  htmlFor="age"
                  className="text-lg font-semibold flex items-center gap-3 text-gray-700"
                >
                  <Timer className="h-6 w-6 text-green-600" />
                  What is your age?
                </Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Enter your age"
                  {...register("age", { valueAsNumber: true })}
                  className="text-lg py-3 h-12 border-2 border-gray-300 focus:border-green-500 focus:ring-4 focus:ring-green-200 rounded-lg font-medium bg-white"
                />
                {errors.age && (
                  <p className="text-sm text-destructive">
                    {errors.age.message}
                  </p>
                )}
              </motion.div>
            </div>

            {/* Row 2: Education (Select) and Cholesterol (Input) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <motion.div
                variants={fieldVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
                <Label className="text-lg font-semibold flex items-center gap-3 text-gray-700">
                  <BookOpen className="h-6 w-6 text-purple-600" />
                  What is your education level?
                </Label>
                <select
                  {...register("education")}
                  className="h-12 w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-lg font-medium focus:border-green-500 focus:ring-4 focus:ring-green-200 focus:outline-none"
                >
                  <option value="">Select your education level</option>
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

              <motion.div
                variants={fieldVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.4 }}
                className="space-y-4"
              >
                <Label
                  htmlFor="totChol"
                  className="text-lg font-semibold flex items-center gap-3 text-gray-700"
                >
                  <Droplets className="h-6 w-6 text-red-500" />
                  Total cholesterol (mg/dL)
                </Label>
                <Input
                  id="totChol"
                  type="number"
                  step="0.1"
                  placeholder="Enter total cholesterol"
                  {...register("totChol", { valueAsNumber: true })}
                  className="text-lg py-3 h-12 border-2 border-gray-300 focus:border-green-500 focus:ring-4 focus:ring-green-200 rounded-lg font-medium bg-white"
                />
                {errors.totChol && (
                  <p className="text-sm text-destructive">
                    {errors.totChol.message}
                  </p>
                )}
              </motion.div>
            </div>

            {/* Row 3: Current Smoker (Radio) and Cigarettes Per Day (Input) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <motion.div
                variants={fieldVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.5 }}
                className="space-y-4"
              >
                <Label className="text-lg font-semibold flex items-center gap-3 text-gray-700">
                  <Cigarette className="h-6 w-6 text-orange-600" />
                  Are you a current smoker?
                </Label>
                <RadioGroup
                  onValueChange={(value) => setValue("currentSmoker", value)}
                  className="flex gap-8 pt-2"
                >
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem
                      value="yes"
                      id="currentSmoker-yes"
                      className="h-5 w-5 border-2"
                    />
                    <Label
                      htmlFor="currentSmoker-yes"
                      className="text-base font-medium text-gray-600 cursor-pointer"
                    >
                      Yes
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem
                      value="no"
                      id="currentSmoker-no"
                      className="h-5 w-5 border-2"
                    />
                    <Label
                      htmlFor="currentSmoker-no"
                      className="text-base font-medium text-gray-600 cursor-pointer"
                    >
                      No
                    </Label>
                  </div>
                </RadioGroup>
                {errors.currentSmoker && (
                  <p className="text-sm text-destructive">
                    {errors.currentSmoker.message}
                  </p>
                )}
              </motion.div>

              <motion.div
                variants={fieldVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.6 }}
                className="space-y-4"
              >
                <Label
                  htmlFor="cigsPerDay"
                  className="text-lg font-semibold flex items-center gap-3 text-gray-700"
                >
                  <Cigarette className="h-6 w-6 text-red-600" />
                  Cigarettes per day
                </Label>
                <Input
                  id="cigsPerDay"
                  type="number"
                  placeholder="Enter cigarettes per day (0 if non-smoker)"
                  {...register("cigsPerDay", { valueAsNumber: true })}
                  className="text-lg py-3 h-12 border-2 border-gray-300 focus:border-green-500 focus:ring-4 focus:ring-green-200 rounded-lg font-medium bg-white"
                />
                {errors.cigsPerDay && (
                  <p className="text-sm text-destructive">
                    {errors.cigsPerDay.message}
                  </p>
                )}
              </motion.div>
            </div>

            {/* Row 4: Systolic BP (Input) and BP Medication (Radio) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <motion.div
                variants={fieldVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.7 }}
                className="space-y-4"
              >
                <Label
                  htmlFor="sysBP"
                  className="text-lg font-semibold flex items-center gap-3 text-gray-700"
                >
                  <TrendingUp className="h-6 w-6 text-orange-500" />
                  Systolic BP (mmHg)
                </Label>
                <Input
                  id="sysBP"
                  type="number"
                  step="0.1"
                  placeholder="Enter systolic BP"
                  {...register("sysBP", { valueAsNumber: true })}
                  className="text-lg py-3 h-12 border-2 border-gray-300 focus:border-green-500 focus:ring-4 focus:ring-green-200 rounded-lg font-medium bg-white"
                />
                {errors.sysBP && (
                  <p className="text-sm text-destructive">
                    {errors.sysBP.message}
                  </p>
                )}
              </motion.div>

              <motion.div
                variants={fieldVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.8 }}
                className="space-y-4"
              >
                <Label className="text-lg font-semibold flex items-center gap-3 text-gray-700">
                  <Pill className="h-6 w-6 text-blue-600" />
                  Are you on BP medication?
                </Label>
                <RadioGroup
                  onValueChange={(value) => setValue("bpMeds", value)}
                  className="flex gap-8 pt-2"
                >
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem
                      value="yes"
                      id="bpMeds-yes"
                      className="h-5 w-5 border-2"
                    />
                    <Label
                      htmlFor="bpMeds-yes"
                      className="text-base font-medium text-gray-600 cursor-pointer"
                    >
                      Yes
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem
                      value="no"
                      id="bpMeds-no"
                      className="h-5 w-5 border-2"
                    />
                    <Label
                      htmlFor="bpMeds-no"
                      className="text-base font-medium text-gray-600 cursor-pointer"
                    >
                      No
                    </Label>
                  </div>
                </RadioGroup>
                {errors.bpMeds && (
                  <p className="text-sm text-destructive">
                    {errors.bpMeds.message}
                  </p>
                )}
              </motion.div>
            </div>

            {/* Row 5: Diastolic BP (Input) and Stroke History (Radio) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <motion.div
                variants={fieldVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.9 }}
                className="space-y-4"
              >
                <Label
                  htmlFor="diaBP"
                  className="text-lg font-semibold flex items-center gap-3 text-gray-700"
                >
                  <Activity className="h-6 w-6 text-blue-500" />
                  Diastolic BP (mmHg)
                </Label>
                <Input
                  id="diaBP"
                  type="number"
                  step="0.1"
                  placeholder="Enter diastolic BP"
                  {...register("diaBP", { valueAsNumber: true })}
                  className="text-lg py-3 h-12 border-2 border-gray-300 focus:border-green-500 focus:ring-4 focus:ring-green-200 rounded-lg font-medium bg-white"
                />
                {errors.diaBP && (
                  <p className="text-sm text-destructive">
                    {errors.diaBP.message}
                  </p>
                )}
              </motion.div>

              <motion.div
                variants={fieldVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 1.0 }}
                className="space-y-4"
              >
                <Label className="text-lg font-semibold flex items-center gap-3 text-gray-700">
                  <Zap className="h-6 w-6 text-red-600" />
                  Have you ever had a stroke?
                </Label>
                <RadioGroup
                  onValueChange={(value) => setValue("prevalentStroke", value)}
                  className="flex gap-8 pt-2"
                >
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem
                      value="yes"
                      id="prevalentStroke-yes"
                      className="h-5 w-5 border-2"
                    />
                    <Label
                      htmlFor="prevalentStroke-yes"
                      className="text-base font-medium text-gray-600 cursor-pointer"
                    >
                      Yes
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem
                      value="no"
                      id="prevalentStroke-no"
                      className="h-5 w-5 border-2"
                    />
                    <Label
                      htmlFor="prevalentStroke-no"
                      className="text-base font-medium text-gray-600 cursor-pointer"
                    >
                      No
                    </Label>
                  </div>
                </RadioGroup>
                {errors.prevalentStroke && (
                  <p className="text-sm text-destructive">
                    {errors.prevalentStroke.message}
                  </p>
                )}
              </motion.div>
            </div>

            {/* Row 6: BMI (Input) and Hypertension (Radio) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <motion.div
                variants={fieldVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 1.1 }}
                className="space-y-4"
              >
                <Label
                  htmlFor="bmi"
                  className="text-lg font-semibold flex items-center gap-3 text-gray-700"
                >
                  <Scale className="h-6 w-6 text-green-500" />
                  BMI
                </Label>
                <Input
                  id="bmi"
                  type="number"
                  step="0.1"
                  placeholder="Enter BMI"
                  {...register("bmi", { valueAsNumber: true })}
                  className="text-lg py-3 h-12 border-2 border-gray-300 focus:border-green-500 focus:ring-4 focus:ring-green-200 rounded-lg font-medium bg-white"
                />
                {errors.bmi && (
                  <p className="text-sm text-destructive">
                    {errors.bmi.message}
                  </p>
                )}
              </motion.div>

              <motion.div
                variants={fieldVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 1.2 }}
                className="space-y-4"
              >
                <Label className="text-lg font-semibold flex items-center gap-3 text-gray-700">
                  <TrendingUp className="h-6 w-6 text-yellow-600" />
                  Do you have hypertension?
                </Label>
                <RadioGroup
                  onValueChange={(value) => setValue("prevalentHyp", value)}
                  className="flex gap-8 pt-2"
                >
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem
                      value="yes"
                      id="prevalentHyp-yes"
                      className="h-5 w-5 border-2"
                    />
                    <Label
                      htmlFor="prevalentHyp-yes"
                      className="text-base font-medium text-gray-600 cursor-pointer"
                    >
                      Yes
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem
                      value="no"
                      id="prevalentHyp-no"
                      className="h-5 w-5 border-2"
                    />
                    <Label
                      htmlFor="prevalentHyp-no"
                      className="text-base font-medium text-gray-600 cursor-pointer"
                    >
                      No
                    </Label>
                  </div>
                </RadioGroup>
                {errors.prevalentHyp && (
                  <p className="text-sm text-destructive">
                    {errors.prevalentHyp.message}
                  </p>
                )}
              </motion.div>
            </div>

            {/* Row 7: Heart Rate (Input) and Diabetes (Radio) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <motion.div
                variants={fieldVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 1.3 }}
                className="space-y-4"
              >
                <Label
                  htmlFor="heartRate"
                  className="text-lg font-semibold flex items-center gap-3 text-gray-700"
                >
                  <Heart className="h-6 w-6 text-red-500" />
                  Heart Rate (bpm)
                </Label>
                <Input
                  id="heartRate"
                  type="number"
                  step="0.1"
                  placeholder="Enter heart rate"
                  {...register("heartRate", { valueAsNumber: true })}
                  className="text-lg py-3 h-12 border-2 border-gray-300 focus:border-green-500 focus:ring-4 focus:ring-green-200 rounded-lg font-medium bg-white"
                />
                {errors.heartRate && (
                  <p className="text-sm text-destructive">
                    {errors.heartRate.message}
                  </p>
                )}
              </motion.div>

              <motion.div
                variants={fieldVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 1.4 }}
                className="space-y-4"
              >
                <Label className="text-lg font-semibold flex items-center gap-3 text-gray-700">
                  <TestTube className="h-6 w-6 text-indigo-600" />
                  Do you have diabetes?
                </Label>
                <RadioGroup
                  onValueChange={(value) => setValue("diabetes", value)}
                  className="flex gap-8 pt-2"
                >
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem
                      value="yes"
                      id="diabetes-yes"
                      className="h-5 w-5 border-2"
                    />
                    <Label
                      htmlFor="diabetes-yes"
                      className="text-base font-medium text-gray-600 cursor-pointer"
                    >
                      Yes
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem
                      value="no"
                      id="diabetes-no"
                      className="h-5 w-5 border-2"
                    />
                    <Label
                      htmlFor="diabetes-no"
                      className="text-base font-medium text-gray-600 cursor-pointer"
                    >
                      No
                    </Label>
                  </div>
                </RadioGroup>
                {errors.diabetes && (
                  <p className="text-sm text-destructive">
                    {errors.diabetes.message}
                  </p>
                )}
              </motion.div>
            </div>

            {/* Row 8: Glucose (Input) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <motion.div
                variants={fieldVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 1.5 }}
                className="space-y-4"
              >
                <Label
                  htmlFor="glucose"
                  className="text-lg font-semibold flex items-center gap-3 text-gray-700"
                >
                  <TestTube className="h-6 w-6 text-purple-500" />
                  Glucose level (mg/dL)
                </Label>
                <Input
                  id="glucose"
                  type="number"
                  step="0.1"
                  placeholder="Enter glucose level"
                  {...register("glucose", { valueAsNumber: true })}
                  className="text-lg py-3 h-12 border-2 border-gray-300 focus:border-green-500 focus:ring-4 focus:ring-green-200 rounded-lg font-medium bg-white"
                />
                {errors.glucose && (
                  <p className="text-sm text-destructive">
                    {errors.glucose.message}
                  </p>
                )}
              </motion.div>
            </div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6 }}
              className="pt-6"
            >
              <Button
                type="submit"
                disabled={isLoading || isSubmitting}
                className="w-full h-14 text-lg font-bold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 transform transition-all duration-200 hover:scale-105 disabled:transform-none"
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
