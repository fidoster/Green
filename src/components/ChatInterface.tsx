import React, { useRef, useState } from "react";
import Sidebar from "./Sidebar";
import ChatArea from "./ChatArea";
import SettingsPanel from "./SettingsPanel";
import QuizButton from "./QuizButton";
import QuizInterface from "./QuizInterface";
import { PersonaType } from "./PersonaSelector";
import { useTheme } from "./ThemeProvider";
import { useChatState } from "../hooks/useChatState";

interface ChatInterfaceProps {
  initialPersona?: PersonaType;
}

const ChatInterface = ({ initialPersona = "greenbot" }: ChatInterfaceProps) => {
  const { theme } = useTheme();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Use our custom hook to manage chat state
  const {
    currentPersona,
    messages,
    chatHistory,
    isQuizOpen,
    isLoading,
    handleSendMessage,
    handleNewChat,
    handleSelectChat,
    handlePersonaChange,
    handleStartQuiz,
    handleQuizComplete,
    getPersonaDisplayName,
    setIsQuizOpen,
  } = useChatState(initialPersona);

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
