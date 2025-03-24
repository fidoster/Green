import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import {
  PlusCircle,
  Settings,
  MessageSquare,
  Trash2,
  Leaf,
} from "lucide-react";
import UserAvatar from "./UserAvatar";
import { cn } from "../lib/utils";
import PersonaSelector, { PersonaType } from "./PersonaSelector";
import { ThemeToggle } from "./ThemeToggle";

// Define consistent localStorage keys
const LOCAL_STORAGE_KEYS = {
  DELETED_CHATS: "deletedChats",
  UNAUTHENTICATED_CHATS: "unauthenticatedChats",
};

interface ChatHistoryItem {
  id: string;
  title: string;
  date: string;
  selected?: boolean;
}

interface SidebarProps {
  onNewChat?: () => void;
  onSelectChat?: (id: string) => void;
  onOpenSettings?: () => void;
  chatHistory?: ChatHistoryItem[];
  className?: string;
  initialPersona?: PersonaType;
  onSelectPersona?: (persona: PersonaType) => void;
}

const Sidebar = ({
  onNewChat = () => {},
  onSelectChat = () => {},
  onOpenSettings = () => {},
  chatHistory = [
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
  className,
  initialPersona = "greenbot",
  onSelectPersona = () => {},
}: SidebarProps) => {
  const [history, setHistory] = useState<ChatHistoryItem[]>(chatHistory);

  // Clean up deleted chats on component mount
  useEffect(() => {
    try {
      // Get deleted chat IDs
      const deletedChatIds = JSON.parse(
        localStorage.getItem(LOCAL_STORAGE_KEYS.DELETED_CHATS) || "[]",
      );

      // Filter out any deleted chats from the history
      if (deletedChatIds.length > 0) {
        const filteredHistory = chatHistory.filter(
          (chat) => !deletedChatIds.includes(chat.id),
        );
        setHistory(filteredHistory);
      }
    } catch (error) {
      console.error("Error cleaning up deleted chats:", error);
    }
  }, []);

  // Update local history when chatHistory prop changes, but filter out deleted chats
  useEffect(() => {
    try {
      const deletedChatIds = JSON.parse(
        localStorage.getItem(LOCAL_STORAGE_KEYS.DELETED_CHATS) || "[]",
      );

      const filteredHistory = chatHistory.filter(
        (chat) => !deletedChatIds.includes(chat.id),
      );

      setHistory(filteredHistory);
    } catch (error) {
      console.error("Error filtering chat history:", error);
      setHistory(chatHistory);
    }
  }, [chatHistory]);

  const [selectedPersona, setSelectedPersona] =
    useState<PersonaType>(initialPersona);

  const handleDeleteChat = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();

    // Update local state
    setHistory(history.filter((chat) => chat.id !== id));

    // Also update parent component's state through props
    if (onSelectChat && history.find((chat) => chat.id === id)?.selected) {
      // If the deleted chat was selected, select another chat
      const remainingChats = history.filter((chat) => chat.id !== id);
      if (remainingChats.length > 0) {
        onSelectChat(remainingChats[0].id);
      }
    }

    try {
      // Store deleted chat IDs in localStorage to persist across refreshes
      const deletedChats = JSON.parse(
        localStorage.getItem(LOCAL_STORAGE_KEYS.DELETED_CHATS) || "[]",
      );

      // Only add if not already in the list
      if (!deletedChats.includes(id)) {
        deletedChats.push(id);
        localStorage.setItem(
          LOCAL_STORAGE_KEYS.DELETED_CHATS,
          JSON.stringify(deletedChats),
        );
      }

      // Also remove from unauthenticated chats if present
      const unauthenticatedChats = JSON.parse(
        localStorage.getItem(LOCAL_STORAGE_KEYS.UNAUTHENTICATED_CHATS) || "[]",
      );

      const updatedChats = unauthenticatedChats.filter(
        (chat) => chat.id !== id,
      );

      localStorage.setItem(
        LOCAL_STORAGE_KEYS.UNAUTHENTICATED_CHATS,
        JSON.stringify(updatedChats),
      );
    } catch (error) {
      console.error("Error updating chat storage:", error);
    }
  };

  const handlePersonaChange = (persona: PersonaType) => {
    setSelectedPersona(persona);
    onSelectPersona(persona);
  };

  return (
    <div
      className={cn(
        "flex flex-col h-full w-[320px] bg-gray-50 dark:bg-[#2A3130] text-gray-800 dark:text-white p-4 border-r border-gray-200 dark:border-gray-700",
        className,
      )}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Leaf className="h-6 w-6 text-[#4B9460] dark:text-[#98C9A3]" />
          <h1 className="text-xl font-semibold">GreenBot</h1>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <UserAvatar className="h-8 w-8" />
        </div>
      </div>

      <Button
        onClick={onNewChat}
        className="bg-[#4B9460] hover:bg-[#3A7348] dark:bg-[#8BA888] dark:hover:bg-[#98C9A3] text-white dark:text-[#2F3635] mb-4 flex items-center gap-2"
      >
        <PlusCircle className="h-4 w-4" />
        New Chat
      </Button>

      <PersonaSelector
        selectedPersona={selectedPersona}
        onSelectPersona={handlePersonaChange}
        className="mb-4"
      />

      <div className="text-sm font-medium mb-2 text-gray-600 dark:text-gray-300">
        Chat History
      </div>

      <ScrollArea className="flex-1 -mx-4 px-4">
        <div className="space-y-2">
          {history.map((chat) => (
            <div
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className={cn(
                "flex items-center justify-between p-3 rounded-md cursor-pointer group",
                chat.selected
                  ? "bg-gray-200 dark:bg-[#2C4A3E]"
                  : "hover:bg-gray-100 dark:hover:bg-[#2C4A3E]/50",
              )}
            >
              <div className="flex flex-col overflow-hidden">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 flex-shrink-0 text-[#4B9460] dark:text-[#98C9A3]" />
                  <div className="truncate">{chat.title}</div>
                </div>
                <div className="ml-6 text-xs text-gray-500 dark:text-gray-400">
                  {chat.date}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-[#2C4A3E]"
                onClick={(e) => handleDeleteChat(chat.id, e)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>

      <Separator className="my-4 bg-gray-200 dark:bg-gray-700" />

      <Button
        variant="ghost"
        className="justify-start text-gray-600 hover:text-gray-800 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-[#2C4A3E]"
        onClick={onOpenSettings}
      >
        <Settings className="mr-2 h-4 w-4" />
        Settings
      </Button>

      <div className="mt-4 text-xs text-center text-gray-500 dark:text-gray-400">
        <p>Reducing carbon footprint</p>
        <p>one chat at a time</p>
      </div>
    </div>
  );
};

export default Sidebar;
