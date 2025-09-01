import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Heart, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface AIHealthAssistantProps {
  predictionResults?: any;
  isEnabled?: boolean;
}

export function AIHealthAssistant({
  predictionResults,
  isEnabled = false,
}: AIHealthAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (predictionResults && messages.length === 0) {
      // Add welcome message when prediction results are available
      const welcomeMessage: Message = {
        id: "welcome",
        type: "assistant",
        content: `Hello! I'm your AI Health Assistant. I've analyzed your cardiovascular risk assessment results. I'm here to help you understand your results and provide health guidance. Feel free to ask me any questions about your cardiovascular health!`,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [predictionResults, messages.length]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading || !isEnabled) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Simulate AI response (replace with actual Gemini API call)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: generateAIResponse(userMessage.content, predictionResults),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content:
          "I apologize, but I'm having trouble processing your request right now. Please try again later.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateAIResponse = (userInput: string, results: any): string => {
    const lowerInput = userInput.toLowerCase();

    if (lowerInput.includes("risk") || lowerInput.includes("result")) {
      if (!results)
        return "I don't have your prediction results yet. Please complete the health assessment first.";

      return `Based on your assessment, your cardiovascular risk level appears to be in a specific range. This assessment considers multiple factors including your age, lifestyle, blood pressure, cholesterol levels, and other health indicators. Remember, this is a prediction tool and should not replace professional medical advice.`;
    }

    if (
      lowerInput.includes("diet") ||
      lowerInput.includes("food") ||
      lowerInput.includes("eat")
    ) {
      return `For heart health, I recommend following a Mediterranean-style diet rich in fruits, vegetables, whole grains, lean proteins, and healthy fats like olive oil. Limit processed foods, excess sodium, and saturated fats. Consider foods like salmon, nuts, berries, and leafy greens.`;
    }

    if (
      lowerInput.includes("exercise") ||
      lowerInput.includes("workout") ||
      lowerInput.includes("activity")
    ) {
      return `Regular physical activity is crucial for cardiovascular health. Aim for at least 150 minutes of moderate-intensity aerobic exercise per week, or 75 minutes of vigorous exercise. Include strength training twice a week. Start gradually and consult your doctor before beginning any new exercise program.`;
    }

    if (
      lowerInput.includes("medication") ||
      lowerInput.includes("medicine") ||
      lowerInput.includes("drug")
    ) {
      return `If you're taking medications for blood pressure, cholesterol, or diabetes, it's important to take them as prescribed by your doctor. Never stop or change medications without consulting your healthcare provider. These medications play a crucial role in managing cardiovascular risk factors.`;
    }

    if (
      lowerInput.includes("stress") ||
      lowerInput.includes("anxiety") ||
      lowerInput.includes("mental")
    ) {
      return `Stress management is vital for heart health. Chronic stress can contribute to cardiovascular problems. Try relaxation techniques like deep breathing, meditation, yoga, or regular exercise. Ensure adequate sleep and consider talking to a counselor if stress becomes overwhelming.`;
    }

    if (lowerInput.includes("smoking") || lowerInput.includes("tobacco")) {
      return `Smoking is one of the most significant risk factors for cardiovascular disease. If you smoke, quitting is the single most important thing you can do for your heart health. There are many resources available to help you quit, including medications, counseling, and support groups.`;
    }

    if (
      lowerInput.includes("doctor") ||
      lowerInput.includes("physician") ||
      lowerInput.includes("medical")
    ) {
      return `It's important to have regular check-ups with your healthcare provider, especially if you have elevated cardiovascular risk factors. They can monitor your blood pressure, cholesterol, blood sugar, and other important markers. Don't hesitate to discuss any concerns about your heart health.`;
    }

    // Default response
    return `That's a great question about cardiovascular health! While I can provide general health information, it's always best to consult with your healthcare provider for personalized medical advice. I'm here to help you understand general heart health principles and lifestyle recommendations. Is there a specific aspect of cardiovascular health you'd like to know more about?`;
  };

  if (!isEnabled) {
    return (
      <Card className="w-full h-96 bg-gradient-to-br from-gray-50 to-slate-100 border-0 shadow-lg">
        <CardContent className="h-full flex flex-col items-center justify-center p-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-4"
          >
            <Bot className="h-16 w-16 text-gray-400 mx-auto" />
            <h3 className="text-xl font-semibold text-gray-600">
              AI Health Assistant
            </h3>
            <p className="text-gray-500 max-w-sm">
              Complete your health assessment to unlock personalized AI-powered
              health guidance and insights.
            </p>
          </motion.div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full h-96 bg-gradient-to-br from-blue-50 to-indigo-100 border-0 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Bot className="h-6 w-6 text-blue-600" />
          </motion.div>
          AI Health Assistant
        </CardTitle>
      </CardHeader>

      <CardContent className="h-full flex flex-col p-4">
        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.type === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-800 shadow-sm"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {message.type === "assistant" && (
                      <Heart className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                    )}
                    {message.type === "user" && (
                      <User className="h-4 w-4 text-white mt-0.5 flex-shrink-0" />
                    )}
                    <div className="text-sm leading-relaxed">
                      {message.content}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-white p-3 rounded-lg shadow-sm max-w-[80%]">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
                  <div className="text-sm text-gray-600">AI is thinking...</div>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Section */}
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask me about your heart health..."
            className="flex-1"
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
            size="icon"
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
