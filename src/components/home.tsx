import React, { useState, useEffect } from "react";
import OnboardingScreen from "./OnboardingScreen";
import ChatInterface from "./ChatInterface";

interface HomeProps {
  initialAuthenticated?: boolean;
}

const Home = ({ initialAuthenticated = false }: HomeProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(initialAuthenticated);
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Check if user has a saved API key in localStorage
  useEffect(() => {
    const savedApiKey = localStorage.getItem("greenbot-api-key");
    if (savedApiKey) {
      setIsAuthenticated(true);
    }
  }, []);

  // Apply theme class to document
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const handleConnect = async (apiKey: string): Promise<boolean> => {
    setIsLoading(true);

    try {
      // Simulate API validation
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // In a real app, you would validate the API key with your backend
      const isValid = apiKey.length > 8; // Simple validation for demo

      if (isValid) {
        // Save API key to localStorage
        localStorage.setItem("greenbot-api-key", apiKey);
        setIsAuthenticated(true);
      }

      return isValid;
    } catch (error) {
      console.error("Authentication error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] dark:bg-[#2F3635]">
      {!isAuthenticated ? (
        <OnboardingScreen onConnect={handleConnect} isLoading={isLoading} />
      ) : (
        <ChatInterface />
      )}
    </div>
  );
};

export default Home;
