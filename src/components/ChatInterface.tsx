import React, { useState } from "react";
import Sidebar from "./Sidebar";
import ChatArea from "./ChatArea";
import SettingsPanel from "./SettingsPanel";
import { PersonaType } from "./PersonaSelector";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
  persona?: "GreenBot" | "Home Advisor" | "Recycling Expert" | "Water Guardian";
}

interface ChatHistoryItem {
  id: string;
  title: string;
  date: string;
  selected?: boolean;
}

interface ChatInterfaceProps {
  initialMessages?: Message[];
  initialChatHistory?: ChatHistoryItem[];
  initialPersona?: PersonaType;
}

const ChatInterface = ({
  initialMessages = [
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
  initialChatHistory = [
    { id: "1", title: "Renewable Energy Sources", date: "2 hours ago" },
    {
      id: "2",
      title: "Carbon Footprint Reduction",
      date: "1 day ago",
      selected: true,
    },
    { id: "3", title: "Sustainable Gardening Tips", date: "3 days ago" },
    { id: "4", title: "Ocean Plastic Solutions", date: "1 week ago" },
  ],
  initialPersona = "greenbot",
}: ChatInterfaceProps) => {
  const [currentPersona, setCurrentPersona] =
    useState<PersonaType>(initialPersona);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [chatHistory, setChatHistory] =
    useState<ChatHistoryItem[]>(initialChatHistory);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleSendMessage = (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: `msg-${Date.now()}-user`,
      content,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Simulate bot response after a short delay
    setTimeout(() => {
      const botMessage: Message = {
        id: `msg-${Date.now()}-bot`,
        content: `Thank you for your interest in sustainable topics! This is a simulated response to your message: "${content}". In a real implementation, this would connect to an AI service.`,
        sender: "bot",
        timestamp: new Date(),
        persona: getPersonaDisplayName(currentPersona),
      };

      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };

  const getPersonaDisplayName = (
    persona: PersonaType,
  ): "GreenBot" | "Home Advisor" | "Recycling Expert" | "Water Guardian" => {
    switch (persona) {
      case "greenbot":
        return "GreenBot";
      case "homeadvisor":
        return "Home Advisor";
      case "recyclingexpert":
        return "Recycling Expert";
      case "waterconservation":
        return "Water Guardian";
      default:
        return "GreenBot";
    }
  };

  const handleNewChat = () => {
    // Create a new chat and reset messages
    const newChatId = `chat-${Date.now()}`;

    // Update chat history to unselect all and add new chat
    setChatHistory((prev) => [
      {
        id: newChatId,
        title: "New Conversation",
        date: "Just now",
        selected: true,
      },
      ...prev.map((chat) => ({ ...chat, selected: false })),
    ]);

    // Reset messages with just a welcome message
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        content:
          "Hello! I'm GreenBot, your sustainable AI assistant. How can I help you with environmental topics today?",
        sender: "bot",
        timestamp: new Date(),
        persona: getPersonaDisplayName(currentPersona),
      },
    ]);
  };

  const handleSelectChat = (id: string) => {
    // In a real app, this would load the selected chat's messages from a database
    setChatHistory((prev) =>
      prev.map((chat) => ({
        ...chat,
        selected: chat.id === id,
      })),
    );

    // For demo purposes, just show a different set of messages based on the chat ID
    // In a real app, you would fetch the actual messages for this chat
    const selectedChat = chatHistory.find((chat) => chat.id === id);
    if (selectedChat) {
      setMessages([
        {
          id: `demo-${id}-1`,
          content: `This is the beginning of your conversation about "${selectedChat.title}".`,
          sender: "bot",
          timestamp: new Date(Date.now() - 120000),
          persona: getPersonaDisplayName(currentPersona),
        },
        {
          id: `demo-${id}-2`,
          content: `Tell me more about ${selectedChat.title.toLowerCase()}.`,
          sender: "user",
          timestamp: new Date(Date.now() - 60000),
        },
        {
          id: `demo-${id}-3`,
          content: `I'd be happy to discuss ${selectedChat.title.toLowerCase()} with you! This is a placeholder response that would contain relevant information about this topic in a real implementation.`,
          sender: "bot",
          timestamp: new Date(),
          persona: getPersonaDisplayName(currentPersona),
        },
      ]);
    }
  };

  const handlePersonaChange = (persona: PersonaType) => {
    setCurrentPersona(persona);

    // Add a system message indicating the persona change
    const botMessage: Message = {
      id: `msg-${Date.now()}-bot`,
      content: getPersonaWelcomeMessage(persona),
      sender: "bot",
      timestamp: new Date(),
      persona: getPersonaDisplayName(persona),
    };

    setMessages((prev) => [...prev, botMessage]);
  };

  const getPersonaWelcomeMessage = (persona: PersonaType): string => {
    switch (persona) {
      case "greenbot":
        return "I'm GreenBot, your general sustainability advisor. How can I help you with environmental topics today?";
      case "homeadvisor":
        return "I'm your Home Advisor, specializing in eco-friendly home solutions. How can I help make your living space more sustainable?";
      case "recyclingexpert":
        return "I'm your Recycling Expert, focused on waste reduction and proper recycling practices. What would you like to know about reducing waste?";
      case "waterconservation":
        return "I'm your Water Guardian, dedicated to water conservation strategies. How can I help you save water and protect this precious resource?";
      default:
        return "How can I assist you with sustainability topics today?";
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#F5F5F5] dark:bg-[#2F3635]">
      {/* Sidebar */}
      <Sidebar
        chatHistory={chatHistory}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onOpenSettings={() => setIsSettingsOpen(true)}
        initialPersona={currentPersona}
      />

      {/* Chat Area */}
      <div className="flex-1 overflow-hidden">
        <ChatArea
          messages={messages}
          onSendMessage={handleSendMessage}
          currentPersona={getPersonaDisplayName(currentPersona)}
        />
      </div>

      {/* Settings Panel (conditionally rendered) */}
      {isSettingsOpen && (
        <SettingsPanel
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}
    </div>
  );
};

export default ChatInterface;
