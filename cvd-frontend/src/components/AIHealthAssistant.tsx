import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
}

interface CVDResult {
  name: string;
  prediction: number;
  probabilities: number[];
}

interface AIHealthAssistantProps {
  cvdResults?: CVDResult[];
}

export function AIHealthAssistant({ cvdResults }: AIHealthAssistantProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  };

  useEffect(() => {
    // Only scroll when not loading (after streaming is complete)
    if (!isLoading) {
      scrollToBottom();
    }
  }, [messages, isLoading]);

  // Welcome message with CVD context if available
  useEffect(() => {
    if (user && messages.length === 0) {
      const welcomeContent =
        "Welcome. I can help you understand your cardiovascular risk results and next steps.";

      const welcomeMessage: Message = {
        id: "welcome",
        type: "assistant",
        content: welcomeContent,
      };
      setMessages([welcomeMessage]);
    }
  }, [user, messages.length, cvdResults]);
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading || !user) return;

    const userMessage: Message = {
      id: `user-${messages.length}`,
      type: "user",
      content: inputValue.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const messageContent = inputValue.trim();
    setInputValue("");
    setIsLoading(true);

    // Create AI message with empty content for streaming
    const aiMessage: Message = {
      id: `ai-${messages.length}`,
      type: "assistant",
      content: "",
    };
    setMessages((prev) => [...prev, aiMessage]);
    const aiMessageId = aiMessage.id;

    try {
      // Prepare context with CVD results if available
      let contextMessage = messageContent;
      if (cvdResults && cvdResults.length > 0) {
        const primaryModel =
          cvdResults.find((model) => model.name === "Support Vector Machine") ||
          cvdResults[0];

        contextMessage = `CVD Risk: ${
          primaryModel.prediction === 1 ? "Risk detected" : "No immediate risk"
        } (${(primaryModel.probabilities[1] * 100).toFixed(1)}%)
Question: ${messageContent}`;
      }

      // Stream AI response
      const token = localStorage.getItem("token");
      const backendUrl = (
        import.meta.env.VITE_API_URL || "http://localhost:8000"
      ).replace(/\/$/, "");
      const response = await fetch(`${backendUrl}/api/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: contextMessage }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("No response stream");
      }

      let streamedContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        streamedContent += chunk;

        // Update the AI message content
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMessageId ? { ...msg, content: streamedContent } : msg
          )
        );
      }
    } catch (error) {
      console.error("Error getting AI response:", error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMessageId
            ? {
                ...msg,
                content:
                  "I apologize, but I'm having trouble processing your request right now. Please try again later.",
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <Card className="w-full h-96 bg-white border border-gray-200 shadow-sm">
        <CardContent className="h-full flex flex-col items-center justify-center p-8">
          <div className="text-center space-y-5">
            <div>
              <Bot className="h-12 w-12 text-gray-600 mx-auto" />
            </div>
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">
                Health Assistant
              </h3>
              <p className="text-gray-700 font-medium">
                Sign in to chat about your assessment results.
              </p>
              <p className="text-gray-500 max-w-sm text-sm">
                You will get concise explanations and follow-up guidance based on your latest report.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-4 justify-center">
              <Link
                to="/signup"
                className="bg-gray-900 text-white px-5 py-2 rounded-md font-medium hover:bg-gray-800 transition-colors"
              >
                Sign Up Now
              </Link>
              <Link
                to="/login"
                className="bg-white text-gray-700 border border-gray-300 px-5 py-2 rounded-md font-medium hover:bg-gray-50 transition-colors"
              >
                Log In
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full h-[500px] bg-white border border-gray-200 shadow-sm flex flex-col">
      <CardHeader className="pb-3 flex-shrink-0">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Bot className="h-5 w-5 text-gray-700" />
          AI Health Assistant
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-4 relative overflow-hidden">
        {/* Messages Container */}
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2 scroll-smooth"
        >
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
                  className={`max-w-[80%] p-3 rounded-lg break-words overflow-hidden ${
                    message.type === "user"
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {message.type === "assistant" && <Bot className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />}
                    {message.type === "user" && (
                      <User className="h-4 w-4 text-white mt-0.5 flex-shrink-0" />
                    )}
                    <div className="text-sm leading-relaxed whitespace-pre-wrap word-break break-words min-w-0 flex-1">
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
              <div className="bg-gray-100 p-3 rounded-lg max-w-[80%]">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 text-gray-600 animate-spin" />
                  <div className="text-sm text-gray-600">Generating response...</div>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Section */}
        <div className="flex gap-2 flex-shrink-0">
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
            className="bg-gray-900 hover:bg-gray-800"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
