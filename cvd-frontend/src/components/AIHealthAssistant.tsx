import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Heart, Loader2, Crown, Lock } from "lucide-react";
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
  console.log(cvdResults, "cvdResults in AIHealthAssistant");
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
      const welcomeContent = `Hi welcome! 👋`;

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
        // Always use Random Forest as the best model (default choice)
        const randomForestModel =
          cvdResults.find((model) => model.name === "Random Forest") ||
          cvdResults[0];

        contextMessage = `CVD Risk: ${
          randomForestModel.prediction === 1 ? "High Risk" : "Low Risk"
        } (${(randomForestModel.probabilities[1] * 100).toFixed(1)}%)
Question: ${messageContent}`;
      }

      // Stream AI response
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3001/api/ai/chat", {
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
      <Card className='w-full h-96 bg-white border-2 border-amber-200 shadow-lg'>
        <CardContent className='h-full flex flex-col items-center justify-center p-8'>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className='text-center space-y-6'
          >
            <div className='relative'>
              <Bot className='h-16 w-16 text-amber-500 mx-auto' />
              <Crown className='h-6 w-6 text-yellow-500 absolute -top-1 -right-1' />
            </div>
            <div className='space-y-3'>
              <h3 className='text-xl font-bold text-amber-800 flex items-center justify-center gap-2'>
                <Lock className='h-5 w-5' />
                Premium AI Health Assistant
              </h3>
              <p className='text-amber-700 font-medium text-lg'>
                Premium AI powered chat assistant available to Logged in users
              </p>
              <p className='text-amber-600 max-w-sm text-sm'>
                Get personalized health insights, recommendations, and 24/7
                support from our advanced AI assistant.
              </p>
            </div>
            <div className='flex flex-col sm:flex-row gap-3 pt-4 justify-center'>
              <Link
                to='/signup'
                className='bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-amber-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-md'
              >
                Sign Up Now
              </Link>
              <Link
                to='/login'
                className='bg-white text-amber-700 border-2 border-amber-300 px-6 py-2 rounded-lg font-semibold hover:bg-amber-50 transition-all duration-300'
              >
                Log In
              </Link>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='w-full h-[500px] bg-gradient-to-br from-yellow-50 to-orange-50 border-0 shadow-lg flex flex-col'>
      <CardHeader className='pb-3 flex-shrink-0'>
        <CardTitle className='text-lg font-semibold flex items-center gap-2'>
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Bot className='h-6 w-6 text-orange-600' />
          </motion.div>
          AI Health Assistant
        </CardTitle>
      </CardHeader>

      <CardContent className='flex-1 flex flex-col p-4 relative overflow-hidden'>
        {/* Messages Container */}
        <div
          ref={messagesContainerRef}
          className='flex-1 overflow-y-auto space-y-3 mb-4 pr-2 scroll-smooth'
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
                      ? "bg-orange-600 text-white"
                      : "bg-white text-gray-800 shadow-sm"
                  }`}
                >
                  <div className='flex items-start gap-2'>
                    {message.type === "assistant" && (
                      <Heart className='h-4 w-4 text-red-500 mt-0.5 flex-shrink-0' />
                    )}
                    {message.type === "user" && (
                      <User className='h-4 w-4 text-white mt-0.5 flex-shrink-0' />
                    )}
                    <div className='text-sm leading-relaxed whitespace-pre-wrap word-break break-words min-w-0 flex-1'>
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
              className='flex justify-start'
            >
              <div className='bg-white p-3 rounded-lg shadow-sm max-w-[80%]'>
                <div className='flex items-center gap-2'>
                  <Loader2 className='h-4 w-4 text-blue-600 animate-spin' />
                  <div className='text-sm text-gray-600'>AI is thinking...</div>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Section */}
        <div className='flex gap-2 flex-shrink-0'>
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder='Ask me about your heart health...'
            className='flex-1'
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
            size='icon'
            className='bg-orange-600 hover:bg-orange-700'
          >
            <Send className='h-4 w-4' />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
