import React, { useRef, useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import ChatArea from "./ChatArea";
import SettingsPanel from "./SettingsPanel";
import QuizButton from "./QuizButton";
import QuizInterface from "./QuizInterface";
import { PersonaType } from "./PersonaSelector";
import { useTheme } from "./ThemeProvider";
import { supabase } from "../lib/supabase";
import { v4 as uuidv4 } from "uuid";

// If you don't have uuid installed, you can use this simple implementation
// const uuidv4 = () => Math.random().toString(36).substring(2) + Date.now().toString(36);

interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
  persona?: string;
}

interface ChatHistoryItem {
  id: string;
  title: string;
  date: string;
  selected?: boolean;
}

interface ChatInterfaceProps {
  initialPersona?: PersonaType;
}

const ChatInterface = ({ initialPersona = "greenbot" }: ChatInterfaceProps) => {
  const { theme } = useTheme();
  const [currentPersona, setCurrentPersona] =
    useState<PersonaType>(initialPersona);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      content:
        "Hello! I'm GreenBot, your sustainable AI assistant. How can I help you with environmental topics today?",
      sender: "bot",
      timestamp: new Date(Date.now() - 60000),
      persona: "GreenBot",
    },
  ]);
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([
    {
      id: "default",
      title: "New Conversation",
      date: new Date().toLocaleDateString(),
      selected: true,
    },
  ]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load conversations from local storage or database when component mounts
  useEffect(() => {
    const loadConversations = async () => {
      setIsLoading(true);
      try {
        // Check if user is authenticated with Supabase
        const { data } = await supabase.auth.getSession();
        const isAuthenticated = !!data.session;

        if (isAuthenticated) {
          // Load conversations from Supabase
          const { data: conversations, error } = await supabase
            .from("conversations")
            .select("*")
            .order("updated_at", { ascending: false });

          if (error) throw error;

          if (conversations && conversations.length > 0) {
            const formattedHistory = conversations.map((conv) => ({
              id: conv.id,
              title: conv.title,
              date: new Date(conv.updated_at).toLocaleDateString(),
              selected: false,
            }));

            // Set the first conversation as selected
            if (formattedHistory.length > 0) {
              formattedHistory[0].selected = true;

              // Load messages for the selected conversation
              const { data: messagesData, error: messagesError } =
                await supabase
                  .from("messages")
                  .select("*")
                  .eq("conversation_id", formattedHistory[0].id)
                  .order("created_at", { ascending: true });

              if (!messagesError && messagesData) {
                const formattedMessages = messagesData.map((msg) => ({
                  id: msg.id,
                  content: msg.content,
                  sender: msg.sender,
                  timestamp: new Date(msg.created_at),
                  persona: msg.persona,
                }));

                setMessages(formattedMessages);
              }
            }

            setChatHistory(formattedHistory);
          }
        } else {
          // Load conversations from localStorage for unauthenticated users
          const storedChats = localStorage.getItem("unauthenticatedChats");
          if (storedChats) {
            const parsedChats = JSON.parse(storedChats);
            if (parsedChats.length > 0) {
              // Format the stored chats
              const formattedHistory = parsedChats.map((chat: any) => ({
                id: chat.id,
                title: chat.title,
                date: new Date(chat.date).toLocaleDateString(),
                selected: false,
              }));

              // Set the first chat as selected
              if (formattedHistory.length > 0) {
                formattedHistory[0].selected = true;

                // If this chat has messages, load them
                if (parsedChats[0].messages) {
                  setMessages(parsedChats[0].messages);
                }
              }

              setChatHistory(formattedHistory);
            }
          }
        }
      } catch (error) {
        console.error("Error loading conversations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadConversations();
  }, []);

  const handleNewChat = () => {
    // Create a new chat ID
    const newChatId = uuidv4();

    // Create a new chat history item
    const newChat = {
      id: newChatId,
      title: "New Conversation",
      date: new Date().toLocaleDateString(),
      selected: true,
    };

    // Update history by deselecting all existing chats and adding the new one
    const updatedHistory = chatHistory.map((chat) => ({
      ...chat,
      selected: false,
    }));

    setChatHistory([newChat, ...updatedHistory]);

    // Reset messages with a default welcome message
    const welcomeMessage = {
      id: uuidv4(),
      content: `Hello! I'm ${getPersonaDisplayName(currentPersona)}, your sustainable AI assistant. How can I help you with environmental topics today?`,
      sender: "bot",
      timestamp: new Date(),
      persona: getPersonaDisplayName(currentPersona),
    };

    setMessages([welcomeMessage]);

    // Save to local storage for unauthenticated users
    saveToLocalStorage(newChatId, "New Conversation", [welcomeMessage]);
  };

  const handleSelectChat = async (id: string) => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      // Update chat history to reflect the selected chat
      const updatedHistory = chatHistory.map((chat) => ({
        ...chat,
        selected: chat.id === id,
      }));

      setChatHistory(updatedHistory);

      // Get the selected chat
      const selectedChat = updatedHistory.find((chat) => chat.id === id);

      if (!selectedChat) {
        throw new Error("Selected chat not found");
      }

      // Check if user is authenticated
      const { data } = await supabase.auth.getSession();
      const isAuthenticated = !!data.session;

      if (isAuthenticated) {
        // Load messages from Supabase for this conversation
        const { data: messagesData, error } = await supabase
          .from("messages")
          .select("*")
          .eq("conversation_id", id)
          .order("created_at", { ascending: true });

        if (error) throw error;

        if (messagesData) {
          const formattedMessages = messagesData.map((msg) => ({
            id: msg.id,
            content: msg.content,
            sender: msg.sender,
            timestamp: new Date(msg.created_at),
            persona: msg.persona,
          }));

          setMessages(formattedMessages);
        }
      } else {
        // Load messages from localStorage for unauthenticated users
        const storedChats = localStorage.getItem("unauthenticatedChats");
        if (storedChats) {
          const parsedChats = JSON.parse(storedChats);
          const selectedStoredChat = parsedChats.find(
            (chat: any) => chat.id === id,
          );

          if (selectedStoredChat && selectedStoredChat.messages) {
            setMessages(selectedStoredChat.messages);
          } else {
            // If no messages found, reset to a welcome message
            const welcomeMessage = {
              id: uuidv4(),
              content: `Hello! I'm ${getPersonaDisplayName(currentPersona)}, your sustainable AI assistant. How can I help you with environmental topics today?`,
              sender: "bot",
              timestamp: new Date(),
              persona: getPersonaDisplayName(currentPersona),
            };

            setMessages([welcomeMessage]);
          }
        }
      }
    } catch (error) {
      console.error("Error selecting chat:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveToLocalStorage = (
    chatId: string,
    title: string,
    chatMessages: ChatMessage[],
  ) => {
    try {
      const storedChats = localStorage.getItem("unauthenticatedChats");
      let parsedChats = storedChats ? JSON.parse(storedChats) : [];

      // Check if this chat already exists
      const existingChatIndex = parsedChats.findIndex(
        (chat: any) => chat.id === chatId,
      );

      if (existingChatIndex >= 0) {
        // Update existing chat
        parsedChats[existingChatIndex] = {
          ...parsedChats[existingChatIndex],
          title,
          messages: chatMessages,
          date: new Date().toISOString(),
        };
      } else {
        // Add new chat
        parsedChats.unshift({
          id: chatId,
          title,
          messages: chatMessages,
          date: new Date().toISOString(),
        });
      }

      // Store back to localStorage
      localStorage.setItem("unauthenticatedChats", JSON.stringify(parsedChats));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    // Get the current selected chat
    const selectedChat = chatHistory.find((chat) => chat.selected);
    if (!selectedChat) return;

    // Create the user message
    const userMessage: ChatMessage = {
      id: uuidv4(),
      content,
      sender: "user",
      timestamp: new Date(),
    };

    // Add user message to the conversation
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    // Create a dummy bot response (in a real app, you'd call your API here)
    const botMessage: ChatMessage = {
      id: uuidv4(),
      content: `As ${getPersonaDisplayName(currentPersona)}, I'm analyzing your question about "${content}". In a real implementation, this would call an AI API to generate a proper response.`,
      sender: "bot",
      timestamp: new Date(),
      persona: getPersonaDisplayName(currentPersona),
    };

    // Add bot response after a short delay to simulate processing
    setTimeout(() => {
      setMessages((prevMessages) => [...prevMessages, botMessage]);

      // If this is the first user message, update the chat title
      if (selectedChat.title === "New Conversation" && content.length > 0) {
        const newTitle =
          content.length > 30 ? content.substring(0, 30) + "..." : content;

        // Update the chat history with the new title
        const updatedHistory = chatHistory.map((chat) =>
          chat.id === selectedChat.id ? { ...chat, title: newTitle } : chat,
        );

        setChatHistory(updatedHistory);

        // Save the updated conversation
        const updatedMessages = [...messages, userMessage, botMessage];
        saveToLocalStorage(selectedChat.id, newTitle, updatedMessages);
      } else {
        // Just save the updated messages
        const updatedMessages = [...messages, userMessage, botMessage];
        saveToLocalStorage(
          selectedChat.id,
          selectedChat.title,
          updatedMessages,
        );
      }
    }, 1000);
  };

  const handlePersonaChange = (persona: PersonaType) => {
    setCurrentPersona(persona);

    // Add a message from the new persona
    const botMessage: ChatMessage = {
      id: uuidv4(),
      content: `I'm now your ${getPersonaDisplayName(persona)}. How can I help you with ${getPersonaSpecialty(persona)}?`,
      sender: "bot",
      timestamp: new Date(),
      persona: getPersonaDisplayName(persona),
    };

    setMessages((prevMessages) => [...prevMessages, botMessage]);

    // Get the current selected chat
    const selectedChat = chatHistory.find((chat) => chat.selected);
    if (selectedChat) {
      // Save the updated conversation with the new persona message
      const updatedMessages = [...messages, botMessage];
      saveToLocalStorage(selectedChat.id, selectedChat.title, updatedMessages);
    }
  };

  const getPersonaDisplayName = (persona: PersonaType): string => {
    switch (persona) {
      case "greenbot":
        return "GreenBot";
      case "lifestyle":
        return "EcoLife Guide";
      case "waste":
        return "Waste Wizard";
      case "nature":
        return "Nature Navigator";
      case "energy":
        return "Power Sage";
      case "climate":
        return "Climate Guardian";
      default:
        return "GreenBot";
    }
  };

  const getPersonaSpecialty = (persona: PersonaType): string => {
    switch (persona) {
      case "greenbot":
        return "general sustainability topics";
      case "lifestyle":
        return "sustainable lifestyle choices";
      case "waste":
        return "waste reduction and recycling";
      case "nature":
        return "biodiversity and conservation";
      case "energy":
        return "energy efficiency and renewable energy";
      case "climate":
        return "climate action and resilience";
      default:
        return "environmental topics";
    }
  };

  const handleStartQuiz = () => {
    setIsQuizOpen(true);
  };

  const handleQuizComplete = (score: number, total: number) => {
    setIsQuizOpen(false);

    // Add a message about the quiz results
    const botMessage: ChatMessage = {
      id: uuidv4(),
      content: `You've completed the quiz! You got ${score} out of ${total} questions correct. ${
        score / total >= 0.7
          ? "Great job! You have a good understanding of this topic."
          : "Keep learning! There's more to discover about sustainability."
      }`,
      sender: "bot",
      timestamp: new Date(),
      persona: getPersonaDisplayName(currentPersona),
    };

    setMessages((prevMessages) => [...prevMessages, botMessage]);

    // Save the updated conversation with the quiz result
    const selectedChat = chatHistory.find((chat) => chat.selected);
    if (selectedChat) {
      const updatedMessages = [...messages, botMessage];
      saveToLocalStorage(selectedChat.id, selectedChat.title, updatedMessages);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5] dark:bg-[#2F3635]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8BA888]"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-[#F5F5F5] dark:bg-[#2A3130]">
      {/* Sidebar */}
      <Sidebar
        chatHistory={chatHistory}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onOpenSettings={() => setIsSettingsOpen(true)}
        initialPersona={currentPersona}
        onSelectPersona={handlePersonaChange}
      />

      {/* Chat Area */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Quiz Button at the top */}
        <div className="flex justify-between items-center p-2 bg-white dark:bg-[#2A3130] border-b border-[#E0E0E0] dark:border-[#3A4140]">
          <QuizButton
            onStartQuiz={handleStartQuiz}
            currentPersona={currentPersona}
            className="ml-auto"
          />
        </div>

        <div className="flex-1 overflow-hidden">
          <ChatArea
            messages={messages}
            onSendMessage={handleSendMessage}
            currentPersona={getPersonaDisplayName(currentPersona)}
            chatTitle={chatHistory.find((chat) => chat.selected)?.title}
            messagesEndRef={messagesEndRef}
          />
        </div>
      </div>

      {/* Settings Panel (conditionally rendered) */}
      {isSettingsOpen && (
        <SettingsPanel
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}

      {/* Quiz Interface (conditionally rendered) */}
      {isQuizOpen && (
        <QuizInterface
          currentPersona={currentPersona}
          onClose={() => setIsQuizOpen(false)}
          onComplete={handleQuizComplete}
        />
      )}
    </div>
  );
};

export default ChatInterface;
