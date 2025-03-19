import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Droplet, Home, Leaf, Recycle, Send } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
  persona?: "GreenBot" | "Home Advisor" | "Recycling Expert" | "Water Guardian";
}

interface ChatAreaProps {
  messages?: Message[];
  onSendMessage?: (message: string) => void;
  currentPersona?:
    | "GreenBot"
    | "Home Advisor"
    | "Recycling Expert"
    | "Water Guardian";
}

const ChatArea = ({
  messages = [
    {
      id: "1",
      content:
        "Hello! I'm GreenBot, your sustainable AI assistant. How can I help you with environmental topics today?",
      sender: "bot",
      timestamp: new Date(Date.now() - 60000),
      persona: "GreenBot",
    },
    {
      id: "2",
      content: "I'd like to learn about renewable energy options for my home.",
      sender: "user",
      timestamp: new Date(Date.now() - 30000),
    },
    {
      id: "3",
      content:
        "Great choice! Renewable energy for homes typically includes solar panels, small wind turbines, geothermal heat pumps, and biomass systems. Solar is the most common option, with decreasing installation costs and potential tax incentives. Would you like me to explain more about any specific renewable energy source?",
      sender: "bot",
      timestamp: new Date(),
      persona: "GreenBot",
    },
  ],
  onSendMessage = (message) => console.log("Message sent:", message),
  currentPersona = "GreenBot",
}: ChatAreaProps) => {
  const [inputValue, setInputValue] = useState("");

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#F5F5F5] dark:bg-[#2F3635]">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between p-3 border-b border-[#E0E0E0] dark:border-[#3A4140] bg-white dark:bg-[#2F3635]">
        <div className="flex items-center space-x-2">
          {currentPersona === "GreenBot" && (
            <Leaf className="h-5 w-5 text-[#8BA888]" />
          )}
          {currentPersona === "Home Advisor" && (
            <Home className="h-5 w-5 text-[#8BA888]" />
          )}
          {currentPersona === "Recycling Expert" && (
            <Recycle className="h-5 w-5 text-[#8BA888]" />
          )}
          {currentPersona === "Water Guardian" && (
            <Droplet className="h-5 w-5 text-[#8BA888]" />
          )}
          <h2 className="font-medium text-[#2F3635] dark:text-[#F5F5F5]">
            {currentPersona}
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-[#8BA888] hover:text-[#2C4A3E] hover:bg-[#F5F5F5] dark:hover:bg-[#3A4140]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-moon"
            >
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            </svg>
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>

      {/* Chat messages area */}
      <ScrollArea className="flex-1 p-4">
        <div className="flex flex-col space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${
                  message.sender === "user"
                    ? "bg-white dark:bg-[#3A4140] text-[#2F3635] dark:text-[#F5F5F5] border border-[#E0E0E0] dark:border-[#3A4140]"
                    : "bg-[#8BA888] dark:bg-[#2C4A3E] text-[#2F3635] dark:text-[#F5F5F5]"
                }`}
              >
                {message.sender === "bot" && message.persona && (
                  <div className="flex items-center mb-2">
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-white/20 text-[#2F3635] dark:text-[#F5F5F5] border-[#2F3635]/10 dark:border-[#F5F5F5]/10"
                    >
                      {message.persona === "GreenBot" && (
                        <Leaf className="h-3 w-3" />
                      )}
                      {message.persona === "Home Advisor" && (
                        <Home className="h-3 w-3" />
                      )}
                      {message.persona === "Recycling Expert" && (
                        <Recycle className="h-3 w-3" />
                      )}
                      {message.persona === "Water Guardian" && (
                        <Droplet className="h-3 w-3" />
                      )}
                      <span>{message.persona}</span>
                    </Badge>
                  </div>
                )}
                <p className="whitespace-pre-wrap break-words">
                  {message.content}
                </p>
                <p className="text-xs opacity-70 mt-2 text-right">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Message input area */}
      <div className="border-t border-[#E0E0E0] dark:border-[#3A4140] p-4 bg-white dark:bg-[#2F3635]">
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Recycle your thoughts here..."
              className="pr-10 bg-[#F5F5F5] dark:bg-[#3A4140] border-[#E0E0E0] dark:border-[#3A4140] rounded-xl"
            />
            {currentPersona === "GreenBot" && (
              <Leaf className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#98C9A3] opacity-70" />
            )}
            {currentPersona === "Home Advisor" && (
              <Home className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#98C9A3] opacity-70" />
            )}
            {currentPersona === "Recycling Expert" && (
              <Recycle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#98C9A3] opacity-70" />
            )}
            {currentPersona === "Water Guardian" && (
              <Droplet className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#98C9A3] opacity-70" />
            )}
          </div>
          <Button
            onClick={handleSendMessage}
            className="bg-[#8BA888] hover:bg-[#2C4A3E] text-white rounded-xl shadow-sm transition-all duration-200 hover:shadow-md"
            disabled={!inputValue.trim()}
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
        <div className="text-xs text-center mt-2 text-[#8BA888] dark:text-[#98C9A3]">
          <span>💚 This chat saved 0.02kg CO₂ compared to traditional AI</span>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
