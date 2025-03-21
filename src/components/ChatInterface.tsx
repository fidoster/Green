import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import ChatArea from "./ChatArea";
import SettingsPanel from "./SettingsPanel";
import { PersonaType } from "./PersonaSelector";
import { useTheme } from "./ThemeProvider";
import { supabase } from "../lib/supabase";
import {
  createConversation,
  saveMessage,
  getConversationWithMessages,
  getConversations,
} from "../lib/chat-service";

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
  initialChatHistory = [],

  initialPersona = "greenbot",
}: ChatInterfaceProps) => {
  const { theme } = useTheme();
  const [currentPersona, setCurrentPersona] =
    useState<PersonaType>(initialPersona);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [chatHistory, setChatHistory] =
    useState<ChatHistoryItem[]>(initialChatHistory);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<
    string | null
  >(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Generate a title from the first user message
  const generateTitleFromContent = (content: string): string => {
    // Take the first 30 characters or the first sentence, whichever is shorter
    const firstSentence = content.split(/[.!?]\s/)[0];
    const shortTitle =
      firstSentence.length > 30
        ? firstSentence.substring(0, 30) + "..."
        : firstSentence;
    return shortTitle;
  };

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

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: `msg-${Date.now()}-user`,
      content,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Add loading message
    const loadingMessage: Message = {
      id: `loading-${Date.now()}`,
      content: "Thinking...",
      sender: "bot",
      timestamp: new Date(),
      persona: getPersonaDisplayName(currentPersona),
    };

    setMessages((prev) => [...prev, loadingMessage]);

    try {
      // Get API key from localStorage
      const apiKey = localStorage.getItem("deepseek-api-key");

      if (!apiKey) {
        // If no API key, show a message asking to set it up
        const errorMessage: Message = {
          id: `msg-${Date.now()}-bot`,
          content:
            "Please set up your DeepSeek API key in the settings panel to use the chat functionality.",
          sender: "bot",
          timestamp: new Date(),
          persona: getPersonaDisplayName(currentPersona),
        };

        // Remove loading message and add error message
        setMessages((prev) =>
          prev
            .filter((msg) => !msg.id.startsWith("loading-"))
            .concat(errorMessage),
        );
        return;
      }

      // Import the DeepSeek API functions
      const { callDeepseekAPI, getSystemPromptForPersona } = await import(
        "../lib/deepseek"
      );

      // Get the current persona display name
      const personaName = getPersonaDisplayName(currentPersona);

      // Create the system prompt based on the persona
      const systemPrompt = getSystemPromptForPersona(personaName);

      // Get the conversation history (last 10 messages)
      const conversationHistory = messages.slice(-10).map((msg) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.content,
      }));

      // Add the system prompt at the beginning
      const apiMessages = [
        { role: "system" as const, content: systemPrompt },
        ...conversationHistory,
        { role: "user" as const, content },
      ];

      // Call the DeepSeek API
      const response = await callDeepseekAPI(apiMessages, apiKey);

      // Clean up markdown formatting like ** signs
      const cleanedResponse = response.replace(/\*\*(.*?)\*\*/g, "$1");

      // Remove loading message and add the bot message with the response
      const botMessage: Message = {
        id: `msg-${Date.now()}-bot`,
        content: cleanedResponse,
        sender: "bot",
        timestamp: new Date(),
        persona: personaName,
      };

      // Save the conversation to Supabase and update chat title if it's a new conversation
      await saveConversationToSupabase(userMessage, botMessage, currentPersona);

      // Update chat title if this is the first message in a new conversation
      if (messages.length <= 2 && currentConversationId) {
        const title = generateTitleFromContent(content);
        await updateConversationTitle(currentConversationId, title);

        // Update the chat history with the new title
        setChatHistory((prev) =>
          prev.map((chat) =>
            chat.id === currentConversationId
              ? { ...chat, title, selected: true }
              : chat,
          ),
        );
      }

      // Replace loading message with the actual response
      setMessages((prev) =>
        prev.filter((msg) => !msg.id.startsWith("loading-")).concat(botMessage),
      );
    } catch (error) {
      console.error("Error sending message:", error);

      // Show error message
      const errorMessage: Message = {
        id: `msg-${Date.now()}-bot`,
        content: `Sorry, there was an error processing your request: ${error instanceof Error ? error.message : "Unknown error"}.`,
        sender: "bot",
        timestamp: new Date(),
        persona: getPersonaDisplayName(currentPersona),
      };

      // Remove loading message and add error message
      setMessages((prev) =>
        prev
          .filter((msg) => !msg.id.startsWith("loading-"))
          .concat(errorMessage),
      );
    }
  };

  // Function to save conversation to Supabase
  const saveConversationToSupabase = async (
    userMessage: Message,
    botMessage: Message,
    persona: PersonaType,
  ) => {
    try {
      // Check if user is authenticated
      if (!isAuthenticated) {
        console.log("User not authenticated, skipping save to Supabase");
        return;
      }

      // If no current conversation, create one
      if (!currentConversationId) {
        const newConversation = await createConversation(
          "New Conversation",
          persona,
        );
        setCurrentConversationId(newConversation.id);

        // Update chat history
        setChatHistory((prev) => [
          {
            id: newConversation.id,
            title: newConversation.title,
            date: "Just now",
            selected: true,
          },
          ...prev.map((chat) => ({ ...chat, selected: false })),
        ]);

        // Save both messages
        await saveMessage(newConversation.id, userMessage);
        await saveMessage(newConversation.id, botMessage);
      } else {
        // Save both messages to existing conversation
        await saveMessage(currentConversationId, userMessage);
        await saveMessage(currentConversationId, botMessage);
      }
    } catch (error) {
      console.error("Error saving conversation to Supabase:", error);
    }
  };

  const getPersonaDisplayName = (
    persona: PersonaType,
  ):
    | "GreenBot"
    | "EcoLife Guide"
    | "Waste Wizard"
    | "Nature Navigator"
    | "Power Sage"
    | "Climate Guardian" => {
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

  const handleNewChat = async () => {
    try {
      // Save current conversation to history if it has messages
      if (messages.length > 1) {
        // Find the current conversation in history
        const currentChat = chatHistory.find(
          (chat) => chat.id === currentConversationId,
        );

        // If there's a user message, use it to generate a title
        const userMessage = messages.find((msg) => msg.sender === "user");

        if (userMessage) {
          const title = generateTitleFromContent(userMessage.content);

          if (currentConversationId && currentChat) {
            // Update existing conversation title if needed
            if (currentChat.title === "New Conversation") {
              await updateConversationTitle(currentConversationId, title);
            }
          } else {
            // Create a local history item for non-authenticated users
            const newChatId = `local-chat-${Date.now()}`;
            setChatHistory((prev) => [
              ...prev.map((chat) => ({ ...chat, selected: false })),
              {
                id: newChatId,
                title: title,
                date: "Just now",
                selected: false,
              },
            ]);
          }
        }
      }

      // Check if user is authenticated
      if (!isAuthenticated) {
        // If not authenticated, just reset the UI without saving
        setCurrentConversationId(null);

        // Update chat history to unselect all and add new chat
        const newChatId = `local-chat-${Date.now()}`;
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

        return;
      }

      try {
        // Create a new conversation in Supabase
        const newConversation = await createConversation(
          "New Conversation",
          currentPersona,
        );

        setCurrentConversationId(newConversation.id);

        // Update chat history to unselect all and add new chat
        setChatHistory((prev) => [
          {
            id: newConversation.id,
            title: newConversation.title,
            date: "Just now",
            selected: true,
          },
          ...prev.map((chat) => ({ ...chat, selected: false })),
        ]);

        // Reset messages with just a welcome message
        const welcomeMessage = {
          id: `welcome-${Date.now()}`,
          content:
            "Hello! I'm GreenBot, your sustainable AI assistant. How can I help you with environmental topics today?",
          sender: "bot" as const,
          timestamp: new Date(),
          persona: getPersonaDisplayName(currentPersona),
        };

        setMessages([welcomeMessage]);

        // Save the welcome message
        await saveMessage(newConversation.id, welcomeMessage);
      } catch (createError) {
        console.error("Error creating conversation in Supabase:", createError);
        // Fallback to local chat if Supabase fails
        setCurrentConversationId(null);
        const newChatId = `local-chat-${Date.now()}`;
        setChatHistory((prev) => [
          {
            id: newChatId,
            title: "New Conversation",
            date: "Just now",
            selected: true,
          },
          ...prev.map((chat) => ({ ...chat, selected: false })),
        ]);

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
      }
    } catch (error) {
      console.error("Error creating new chat:", error);
    }
  };

  const handleSelectChat = async (id: string) => {
    try {
      // Update chat history UI first for responsiveness
      setChatHistory((prev) =>
        prev.map((chat) => ({
          ...chat,
          selected: chat.id === id,
        })),
      );

      // Check if this is a local chat (not saved in Supabase)
      if (id.startsWith("local-") || !isAuthenticated) {
        // For local chats, just use the demo behavior
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
        setCurrentConversationId(null);
        return;
      }

      // Set the current conversation ID
      setCurrentConversationId(id);

      try {
        // Fetch the conversation with messages from Supabase
        const conversation = await getConversationWithMessages(id);

        // If there are messages, set them
        if (
          conversation &&
          conversation.messages &&
          conversation.messages.length > 0
        ) {
          setMessages(conversation.messages);
        } else {
          // If no messages, show a welcome message
          setMessages([
            {
              id: `welcome-${Date.now()}`,
              content:
                "Hello! How can I help you with environmental topics today?",
              sender: "bot",
              timestamp: new Date(),
              persona: getPersonaDisplayName(currentPersona),
            },
          ]);
        }
      } catch (fetchError) {
        console.error("Error fetching conversation:", fetchError);
        // If there's an error fetching, use a fallback
        const selectedChat = chatHistory.find((chat) => chat.id === id);
        if (selectedChat) {
          setMessages([
            {
              id: `fallback-${id}-1`,
              content: `This is your conversation about "${selectedChat.title}". (Fallback mode)`,
              sender: "bot",
              timestamp: new Date(),
              persona: getPersonaDisplayName(currentPersona),
            },
          ]);
        }
      }
    } catch (error) {
      console.error("Error selecting chat:", error);
      // If there's an error, reset to a new chat
      setCurrentConversationId(null);
      setMessages([
        {
          id: `error-${Date.now()}`,
          content:
            "Sorry, there was an error loading this conversation. Please try again or start a new chat.",
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

    // If we have a current conversation, update its persona
    if (currentConversationId) {
      updateConversationPersona(currentConversationId, persona);
    }
  };

  const getPersonaWelcomeMessage = (persona: PersonaType): string => {
    switch (persona) {
      case "greenbot":
        return "I'm GreenBot, your general sustainability advisor. How can I help you with environmental topics today?";
      case "lifestyle":
        return "I'm your EcoLife Guide, specializing in sustainable lifestyle choices. How can I help you live more eco-consciously?";
      case "waste":
        return "I'm your Waste Wizard, focused on waste reduction and proper recycling practices. What would you like to know about managing waste more effectively?";
      case "nature":
        return "I'm your Nature Navigator, dedicated to biodiversity and conservation. How can I help you connect with and protect natural ecosystems?";
      case "energy":
        return "I'm your Power Sage, specializing in energy efficiency and renewable solutions. How can I help you optimize your energy usage?";
      case "climate":
        return "I'm your Climate Guardian, focused on climate action and resilience. How can I help you understand and address climate challenges?";
      default:
        return "How can I assist you with sustainability topics today?";
    }
  };

  // Filter out deleted chats from history
  const filterDeletedChats = (chats: ChatHistoryItem[]) => {
    const deletedChats = JSON.parse(
      localStorage.getItem("deletedChats") || "[]",
    );
    return chats.filter((chat) => !deletedChats.includes(chat.id));
  };

  // Effect to check authentication and load conversations
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        // Check if user is authenticated
        const { data } = await supabase.auth.getUser();
        const isAuthed = !!data.user;
        setIsAuthenticated(isAuthed);

        if (isAuthed) {
          try {
            // Load conversations from Supabase
            const conversations = await getConversations();

            if (conversations && conversations.length > 0) {
              // Map conversations to chat history items
              const chatHistoryItems = conversations.map((conv, index) => ({
                id: conv.id,
                title: conv.title || "Untitled Conversation",
                date: new Date(conv.updated_at).toLocaleDateString(),
                selected: index === 0, // Select the first conversation
              }));

              setChatHistory(filterDeletedChats(chatHistoryItems));

              // Load the first conversation
              if (chatHistoryItems.length > 0) {
                await handleSelectChat(chatHistoryItems[0].id);
              }
            } else {
              // If no conversations, create a new one
              await handleNewChat();
            }
          } catch (loadError) {
            console.error("Error loading conversations:", loadError);
            // Fallback to default chat history
            setChatHistory(initialChatHistory);
            setMessages(initialMessages);
          }
        } else {
          // If not authenticated, use the default chat history
          const defaultChats = [
            {
              id: "1",
              title: "Renewable Energy Sources",
              date: "2 hours ago",
            },
            {
              id: "2",
              title: "Carbon Footprint Reduction",
              date: "1 day ago",
              selected: true,
            },
            {
              id: "3",
              title: "Sustainable Gardening Tips",
              date: "3 days ago",
            },
            {
              id: "4",
              title: "Ocean Plastic Solutions",
              date: "1 week ago",
            },
          ];

          setChatHistory(
            filterDeletedChats(
              initialChatHistory.length > 0 ? initialChatHistory : defaultChats,
            ),
          );
          setMessages(initialMessages);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        // Fallback to default chat history on error
        const defaultChats = [
          { id: "1", title: "Renewable Energy Sources", date: "2 hours ago" },
          {
            id: "2",
            title: "Carbon Footprint Reduction",
            date: "1 day ago",
            selected: true,
          },
          { id: "3", title: "Sustainable Gardening Tips", date: "3 days ago" },
          { id: "4", title: "Ocean Plastic Solutions", date: "1 week ago" },
        ];
        setChatHistory(filterDeletedChats(defaultChats));
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event) => {
        if (event === "SIGNED_IN") {
          setIsAuthenticated(true);
          await checkAuth();
        } else if (event === "SIGNED_OUT") {
          setIsAuthenticated(false);
          setCurrentConversationId(null);
          // Reset to default chat history and messages
          const defaultChats = [
            { id: "1", title: "Renewable Energy Sources", date: "2 hours ago" },
            {
              id: "2",
              title: "Carbon Footprint Reduction",
              date: "1 day ago",
              selected: true,
            },
            {
              id: "3",
              title: "Sustainable Gardening Tips",
              date: "3 days ago",
            },
            { id: "4", title: "Ocean Plastic Solutions", date: "1 week ago" },
          ];
          setChatHistory(filterDeletedChats(defaultChats));
          setMessages(initialMessages);
        }
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

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
      <div className="flex-1 overflow-hidden">
        <ChatArea
          messages={messages}
          onSendMessage={handleSendMessage}
          currentPersona={getPersonaDisplayName(currentPersona)}
          chatTitle={chatHistory.find((chat) => chat.selected)?.title}
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
