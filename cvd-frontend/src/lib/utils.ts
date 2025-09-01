import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatApiUrl(endpoint: string): string {
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
  return `${baseUrl}${endpoint}`;
}

export function calculateAge(birthDate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
}

export function getRiskLevel(probability: number): {
  level: string;
  color: string;
  description: string;
} {
  if (probability >= 0.8) {
    return {
      level: "Very High",
      color: "text-red-600",
      description: "Immediate medical attention recommended",
    };
  } else if (probability >= 0.6) {
    return {
      level: "High",
      color: "text-orange-600",
      description: "Consult with a healthcare professional soon",
    };
  } else if (probability >= 0.4) {
    return {
      level: "Moderate",
      color: "text-yellow-600",
      description: "Monitor regularly and maintain healthy lifestyle",
    };
  } else if (probability >= 0.2) {
    return {
      level: "Low",
      color: "text-blue-600",
      description: "Continue current healthy practices",
    };
  } else {
    return {
      level: "Very Low",
      color: "text-green-600",
      description: "Excellent cardiovascular health",
    };
  }
}
