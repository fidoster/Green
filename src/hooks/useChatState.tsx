import { useState, useEffect } from "react";
import { PersonaType } from "../components/PersonaSelector";
import { supabase } from "../lib/supabase";
import {
  createConversation,
  saveMessage,
  getConversationWithMessages,
  getConversations,
} from "../lib/chat-service";
import {
  getPersonaDisplayName,
  getPersonaWelcomeMessage,
} from "../utils/personaUtils";
import {
  filterDeletedChats,
  generateTitleFromContent,
  updateUnauthenticatedChats,
} from "../utils/storageUtils";

// Types
export interface Message {
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

export interface ChatHistoryItem {
  id: string;
  title: string;
  date: string;
  selected?: boolean;
}

// Custom hook for managing chat state
export function useChatState(initialPersona: PersonaType = "greenbot") {
  // State definitions
  const [currentPersona, setCurrentPersona] =
    useState<PersonaType>(initialPersona);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm GreenBot, your sustainable AI assistant. How can I help you with environmental topics today?",
      sender: "bot",
      timestamp: new Date(Date.now() - 60000),
      persona: "GreenBot",
    },
  ]);
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<
    string | null
  >(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  // Authentication and initial data loading
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        // Check if user is authenticated
        const { data } = await supabase.auth.getSession();
        const isAuthed = !!data.session;
        setIsAuthenticated(isAuthed);

        // Load conversations or initialize new user
        // This functionality is moved to a separate function in the full implementation
      } catch (error) {
        console.error("Error in authentication check:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Auth state listener setup
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event) => {
        // Handle sign in/out events
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Update conversation title in Supabase
  const updateConversationTitle = async (
    conversationId: string,
    title: string,
  ) => {
    try {
      await supabase
        .from("conversations")
        .update({ title })
        .eq("id", conversationId);
    } catch (error) {
      console.error("Error updating conversation title:", error);
    }
  };

  // Update conversation persona in Supabase
  const updateConversationPersona = async (
    conversationId: string,
    persona: PersonaType,
  ) => {
    try {
      await supabase
        .from("conversations")
        .update({ persona: getPersonaDisplayName(persona) })
        .eq("id", conversationId);
    } catch (error) {
      console.error("Error updating conversation persona:", error);
    }
  };

  // Send a message
  const handleSendMessage = async (content: string) => {
    // Implementation simplified - see full version for details

    // Add user message
    const userMessage: Message = {
      id: `msg-${Date.now()}-user`,
      content,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Add bot response placeholder
    const loadingMessage: Message = {
      id: `loading-${Date.now()}`,
      content: "Thinking...",
      sender: "bot",
      timestamp: new Date(),
      persona: getPersonaDisplayName(currentPersona),
    };

    setMessages((prev) => [...prev, loadingMessage]);

    // The actual API call and response handling is omitted for brevity
  };

  // Create a new chat
  const handleNewChat = async () => {
    // Implementation simplified - see full version for details
  };

  // Select a chat from history
  const handleSelectChat = async (id: string) => {
    // Implementation simplified - see full version for details
  };

  // Change the current persona
  const handlePersonaChange = (persona: PersonaType) => {
    setCurrentPersona(persona);

    // Replace the last bot message with a persona welcome message
    const botMessage: Message = {
      id: `persona-change-${Date.now()}`,
      content: getPersonaWelcomeMessage(persona),
      sender: "bot",
      timestamp: new Date(),
      persona: getPersonaDisplayName(persona),
    };

    setMessages((prev) => {
      const lastBotMessageIndex = [...prev]
        .reverse()
        .findIndex((msg) => msg.sender === "bot");

      if (lastBotMessageIndex >= 0) {
        // Replace the last bot message
        const newMessages = [...prev];
        newMessages[prev.length - 1 - lastBotMessageIndex] = botMessage;
        return newMessages;
      } else {
        // No bot message found, just add a new one
        return [...prev, botMessage];
      }
    });

    // Update conversation persona in database if needed
    if (currentConversationId) {
      updateConversationPersona(currentConversationId, persona);
    }
  };

  // Quiz related functions
  const handleStartQuiz = () => {
    setIsQuizOpen(true);
  };

  const handleQuizComplete = (score: number, total: number) => {
    setIsQuizOpen(false);

    // Add a message about the quiz results to the chat
    const botMessage: Message = {
      id: `quiz-result-${Date.now()}`,
      content: `You've completed the quiz with a score of ${score}/${total}! ${
        score >= total * 0.7
          ? "Great job! You have a solid understanding of this topic."
          : "Keep learning! There's always more to discover about sustainability."
      }`,
      sender: "bot",
      timestamp: new Date(),
      persona: getPersonaDisplayName(currentPersona),
    };

    setMessages((prev) => [...prev, botMessage]);
  };

  // Return the state and functions
  return {
    currentPersona,
    messages,
    chatHistory,
    isAuthenticated,
    isLoading,
    isQuizOpen,
    currentConversationId,
    setIsQuizOpen,
    handleSendMessage,
    handleNewChat,
    handleSelectChat,
    handlePersonaChange,
    handleStartQuiz,
    handleQuizComplete,
    getPersonaDisplayName,
  };
}
