/**
 * AI Health Agent Service
 *
 * This service provides personalized cardiovascular health guidance using OpenAI's GPT model.
 * It requires a CVD risk percentage as context before providing health recommendations.
 *
 * Key Features:
 * - Requires CVD risk assessment before providing advice
 * - CVD-focused health guidance including lifestyle factors (alcohol, diet, exercise)
 * - Privacy-focused approach with minimal personal data
 * - Streaming responses for real-time user experience
 * - Handles lifestyle questions relevant to heart health (alcohol, smoking, etc.)
 *
 * Usage:
 * - Without risk context: Prompts user to complete CVD assessment
 * - With risk context: streamAIHealthResponse(message, { riskPercentage: 25 })
 * - Context validation: validateHealthContext({ riskPercentage: 25 })
 */

import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import "dotenv/config";
import type { CVDReport, User } from "../types/index.js";

export interface HealthContext {
  riskPercentage?: number; // CVD risk percentage (0-100)
  skipAutoContext?: boolean; // Flag to skip automatic context gathering
}

// Enhanced streaming AI response for health questions with dynamic context
export async function streamAIHealthResponse(
  userMessage: string,
  context?: HealthContext
) {
  try {
    // Check if API key is configured
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key not configured");
    }

    const model = openai("gpt-4o-mini");

    // Build dynamic system prompt based on context
    let systemPrompt = `You are a specialized AI Assistant focused ONLY on cardiovascular disease (CVD) and heart health.

STRICT GUIDELINES:
- ONLY respond to questions about cardiovascular health, heart disease, blood pressure, cholesterol, heart attacks, strokes, and related CVD topics
- This includes lifestyle questions that affect heart health: alcohol consumption, smoking, diet, exercise, stress management
- If asked about completely unrelated topics (like general medicine, other diseases, technology, etc.), politely redirect: "I specialize in cardiovascular health. Please ask me about heart health, blood pressure, cholesterol, or heart disease prevention."
- Always remind users that your advice is for informational purposes only
- Encourage consulting healthcare professionals for medical decisions
- Keep responses concise (max 300 words) and encouraging
- Use heart emojis when appropriate ❤️

FOCUS AREAS INCLUDE:
- Heart disease prevention and risk factors
- Blood pressure management
- Cholesterol and lipid management  
- Heart-healthy diet and exercise
- Cardiovascular symptoms and warning signs
- Heart attack and stroke prevention
- Lifestyle factors affecting heart health (alcohol, smoking, stress, sleep)
- Foods and drinks that impact cardiovascular health`;

    // Add personalized context if available
    if (context && context.riskPercentage !== undefined) {
      systemPrompt += `\n\nPERSONALIZED CONTEXT FOR THIS USER:`;
      systemPrompt += `\n- Current CVD Risk Score: ${context.riskPercentage}% risk of developing heart disease`;

      // Provide risk level interpretation
      let riskLevel = "low";
      if (context.riskPercentage > 30) {
        riskLevel = "high";
      } else if (context.riskPercentage > 15) {
        riskLevel = "medium";
      }

      systemPrompt += `\n- Risk Level: ${riskLevel.toUpperCase()}`;
      systemPrompt += `\n\nUSE THIS RISK INFORMATION to provide more relevant and personalized advice. Reference their specific risk percentage when appropriate, but always emphasize that this is educational information only and they should consult healthcare professionals for medical decisions.`;
    } else {
      // If no risk percentage is provided, require it before giving advice
      systemPrompt += `\n\nIMPORTANT: No CVD risk assessment has been provided for this user. You should respond with: "To provide you with personalized cardiovascular health guidance, I need your CVD risk assessment first. Please complete our heart disease risk analysis form, and then I'll be able to give you tailored advice based on your specific risk level. ❤️"`;
    }

    const result = await streamText({
      model,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
      temperature: 0.7,
    });

    return result;
  } catch (error) {
    console.error("AI streaming error:", error);
    throw new Error("Failed to generate health guidance. Please try again.");
  }
}

// Utility function to validate and sanitize health context
export function validateHealthContext(context: any): HealthContext {
  const validatedContext: HealthContext = {};

  if (
    typeof context.riskPercentage === "number" &&
    context.riskPercentage >= 0 &&
    context.riskPercentage <= 100
  ) {
    validatedContext.riskPercentage = context.riskPercentage;
  }

  if (typeof context.skipAutoContext === "boolean") {
    validatedContext.skipAutoContext = context.skipAutoContext;
  }

  return validatedContext;
}
