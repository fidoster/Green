import React, { useState, useEffect } from "react";
import AuthForm from "./AuthForm";
import ChatInterface from "./ChatInterface";
import { supabase } from "../lib/supabase";
import { ThemeToggle } from "./ThemeToggle";
import { useTheme } from "./ThemeProvider";

interface HomeProps {
  initialAuthenticated?: boolean;
}

const Home = ({ initialAuthenticated = false }: HomeProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(initialAuthenticated);
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useTheme();

  // Check if user is authenticated with Supabase
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
      setIsLoading(false);
    };

    // Make sure the theme is applied to the HTML root
    const applySavedTheme = () => {
      const savedTheme = localStorage.getItem("greenbot-ui-theme") || "light";
      const root = window.document.documentElement;

      if (savedTheme === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    };

    applySavedTheme();
    checkAuth();

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setIsAuthenticated(!!session);
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5] dark:bg-[#2F3635]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8BA888]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] dark:bg-[#2F3635]">
      {!isAuthenticated ? (
        <div className="relative h-screen">
          <div className="absolute top-4 right-4 z-10">
            <ThemeToggle />
          </div>
          <AuthForm onAuthSuccess={handleAuthSuccess} />
        </div>
      ) : (
        <ChatInterface />
      )}
    </div>
  );
};

export default Home;
