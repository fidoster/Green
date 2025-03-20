import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Droplet, Home, Leaf, Recycle, Send } from "lucide-react";
import MessageActions from "./MessageActions";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
  persona?:
    | "GreenBot"
    | "EcoLife Guide"
    | "Waste Wizard"
    | "Nature Navigator"
    | "Power Sage"
    | "Climate Guardian";
}

interface ChatAreaProps {
  messages?: Message[];
  onSendMessage?: (message: string) => void;
  currentPersona?:
    | "GreenBot"
    | "EcoLife Guide"
    | "Waste Wizard"
    | "Nature Navigator"
    | "Power Sage"
    | "Climate Guardian";
  chatTitle?: string;
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
  chatTitle = "New Conversation",
}: ChatAreaProps) => {
  const [inputValue, setInputValue] = useState("");

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue("");

      // Auto-scroll to bottom after sending message with multiple attempts
      const scrollToBottom = () => {
        const scrollableNode = document.querySelector(
          "[data-radix-scroll-area-viewport]",
        );
        if (scrollableNode) {
          scrollableNode.scrollTop = scrollableNode.scrollHeight;
        }
      };

      // Execute scroll immediately and then multiple times with increasing delays
      scrollToBottom();

      // Use more frequent intervals for more reliable scrolling
      for (let i = 1; i <= 15; i++) {
        setTimeout(scrollToBottom, i * 50);
      }
      setTimeout(scrollToBottom, 1000);
      setTimeout(scrollToBottom, 1500);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Auto-scroll to bottom when messages change
  React.useEffect(() => {
    const scrollToBottom = () => {
      const scrollableNode = document.querySelector(
        "[data-radix-scroll-area-viewport]",
      );
      if (scrollableNode) {
        scrollableNode.scrollTop = scrollableNode.scrollHeight;
      }
    };

    // Execute scroll immediately and then multiple times with increasing delays
    scrollToBottom();

    // Use more aggressive scrolling with more frequent intervals
    const timeoutIds = [];
    for (let i = 1; i <= 20; i++) {
      timeoutIds.push(setTimeout(scrollToBottom, i * 50));
    }
    // Add some longer timeouts to catch any delayed renders
    timeoutIds.push(setTimeout(scrollToBottom, 1500));
    timeoutIds.push(setTimeout(scrollToBottom, 2000));

    return () => {
      timeoutIds.forEach((id) => clearTimeout(id));
    };
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-[#F5F5F5] dark:bg-[#2F3635]">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between p-3 border-b border-[#E0E0E0] dark:border-[#3A4140] bg-white dark:bg-[#2F3635]">
        <div className="flex items-center space-x-2">
          {currentPersona === "GreenBot" && (
            <Leaf className="h-5 w-5 text-[#98C9A3]" />
          )}
          {currentPersona === "EcoLife Guide" && (
            <Home className="h-5 w-5 text-[#8BA888]" />
          )}
          {currentPersona === "Waste Wizard" && (
            <Recycle className="h-5 w-5 text-[#2C4A3E]" />
          )}
          {currentPersona === "Nature Navigator" && (
            <Droplet className="h-5 w-5 text-[#6AADCB]" />
          )}
          {currentPersona === "Power Sage" && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 text-[#F6C344]"
            >
              <path d="M18 3v4"></path>
              <path d="M14 7h8"></path>
              <path d="M18 11v4"></path>
              <path d="M14 15h8"></path>
              <path d="M18 19v2"></path>
              <path d="M12 3v2"></path>
              <path d="M8 5h8"></path>
              <path d="M12 7v12"></path>
              <path d="M8 19h8"></path>
            </svg>
          )}
          {currentPersona === "Climate Guardian" && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 text-[#5D93E1]"
            >
              <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path>
            </svg>
          )}
          <h2 className="font-medium text-[#2F3635] dark:text-[#F5F5F5]">
            {chatTitle || currentPersona}
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-[#8BA888] hover:text-[#2C4A3E] hover:bg-[#F5F5F5] dark:hover:bg-[#3A4140]"
            onClick={() => {
              const html = document.querySelector("html");
              if (html?.classList.contains("dark")) {
                html.classList.remove("dark");
                localStorage.setItem("theme", "light");
              } else {
                html?.classList.add("dark");
                localStorage.setItem("theme", "dark");
              }
            }}
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
      <ScrollArea
        className="flex-1 p-4"
        id="chat-messages-container"
        scrollable={true}
        type="always"
        style={{ scrollBehavior: "smooth" }}
      >
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
                      {message.persona === "EcoLife Guide" && (
                        <Home className="h-3 w-3" />
                      )}
                      {message.persona === "Waste Wizard" && (
                        <Recycle className="h-3 w-3" />
                      )}
                      {message.persona === "Nature Navigator" && (
                        <Droplet className="h-3 w-3" />
                      )}
                      {message.persona === "Power Sage" && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-3 w-3"
                        >
                          <path d="M18 3v4"></path>
                          <path d="M14 7h8"></path>
                          <path d="M18 11v4"></path>
                          <path d="M14 15h8"></path>
                          <path d="M18 19v2"></path>
                          <path d="M12 3v2"></path>
                          <path d="M8 5h8"></path>
                          <path d="M12 7v12"></path>
                          <path d="M8 19h8"></path>
                        </svg>
                      )}
                      {message.persona === "Climate Guardian" && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-3 w-3"
                        >
                          <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path>
                        </svg>
                      )}
                      <span>{message.persona}</span>
                    </Badge>
                  </div>
                )}
                <p className="whitespace-pre-wrap break-words">
                  {message.content}
                </p>
                <div className="flex justify-between items-center mt-2">
                  {message.sender === "bot" && (
                    <MessageActions
                      onLike={() => console.log("Liked message:", message.id)}
                      onDislike={() =>
                        console.log("Disliked message:", message.id)
                      }
                      onCopy={() => {
                        navigator.clipboard.writeText(message.content);
                        console.log("Copied message:", message.id);
                      }}
                      onRegenerate={() =>
                        console.log("Regenerate message:", message.id)
                      }
                    />
                  )}
                  <p
                    className={`text-xs opacity-70 ${message.sender === "bot" ? "ml-auto" : ""}`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
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
            {currentPersona === "EcoLife Guide" && (
              <Home className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#8BA888] opacity-70" />
            )}
            {currentPersona === "Waste Wizard" && (
              <Recycle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#2C4A3E] opacity-70" />
            )}
            {currentPersona === "Nature Navigator" && (
              <Droplet className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#6AADCB] opacity-70" />
            )}
            {currentPersona === "Power Sage" && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#F6C344] opacity-70"
              >
                <path d="M18 3v4"></path>
                <path d="M14 7h8"></path>
                <path d="M18 11v4"></path>
                <path d="M14 15h8"></path>
                <path d="M18 19v2"></path>
                <path d="M12 3v2"></path>
                <path d="M8 5h8"></path>
                <path d="M12 7v12"></path>
                <path d="M8 19h8"></path>
              </svg>
            )}
            {currentPersona === "Climate Guardian" && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#5D93E1] opacity-70"
              >
                <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path>
              </svg>
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
