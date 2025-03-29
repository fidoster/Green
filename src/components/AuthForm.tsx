import { useState, useEffect } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "../lib/supabase";
import { Leaf, Wind, Sun, Cloud, Droplets } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { motion } from "framer-motion";

interface AuthFormProps {
  onAuthSuccess?: () => void;
}

const AuthForm = ({ onAuthSuccess }: AuthFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();

  // Ensure the root element has the dark class when in dark mode
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  // Environmental background elements
  const environmentalElements = [
    { icon: Leaf, delay: 0, duration: 20, size: 24, opacity: 0.4 },
    { icon: Wind, delay: 2, duration: 18, size: 28, opacity: 0.3 },
    { icon: Sun, delay: 4, duration: 25, size: 30, opacity: 0.2 },
    { icon: Cloud, delay: 6, duration: 22, size: 26, opacity: 0.25 },
    { icon: Droplets, delay: 8, duration: 15, size: 22, opacity: 0.35 },
  ];

  // Listen for authentication state changes
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" && onAuthSuccess) {
        onAuthSuccess();
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [onAuthSuccess]);

  // Generate custom theme based on current app theme
  const getCustomTheme = () => {
    const isDark = theme === "dark";

    return {
      default: {
        colors: {
          brand: "#2C4A3E",
          brandAccent: "#8BA888",
          brandButtonText: "white",
          inputLabelText: isDark ? "#E1E1E1" : "#333333",
          inputPlaceholder: isDark ? "#909090" : "#666666",
          inputText: isDark ? "#FFFFFF" : "#333333",
          inputBorder: isDark ? "#3A4140" : "#E0E0E0",
          inputBackground: isDark ? "#343C3B" : "#FFFFFF",
          messageText: isDark ? "#E1E1E1" : "#333333",
          messageTextDanger: "#ff4b4b",
          anchorTextColor: isDark ? "#98C9A3" : "#2C4A3E",
          dividerBackground: isDark ? "#3A4140" : "#E0E0E0",
          // Background colors for card components
          defaultButtonBackground: isDark ? "#2C4A3E" : "#2C4A3E",
          defaultButtonBackgroundHover: isDark ? "#8BA888" : "#8BA888",
          authButtonsShadow: "none",
          container: isDark ? "#2A3130" : "#FFFFFF",
          baseBackgroundColor: isDark ? "#2A3130" : "#FFFFFF",
          inputErrorText: isDark ? "#ff4b4b" : "#ff4b4b",
          inputErrorBorder: isDark ? "#ff4b4b" : "#ff4b4b",
        },
      },
    };
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F5F5F5] dark:bg-[#2F3635] p-6 relative overflow-hidden">
      {/* Animated environmental elements in background */}
      {environmentalElements.map((Element, index) =>
        Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={`${index}-${i}`}
            className="absolute opacity-0 pointer-events-none"
            initial={{
              opacity: 0,
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              opacity: Element.opacity,
              x: [
                Math.random() * window.innerWidth,
                Math.random() * window.innerWidth,
                Math.random() * window.innerWidth,
              ],
              y: [
                Math.random() * window.innerHeight,
                Math.random() * window.innerHeight,
                Math.random() * window.innerHeight,
              ],
            }}
            transition={{
              duration: Element.duration,
              repeat: Infinity,
              delay: Element.delay + i * 2,
              ease: "linear",
            }}
          >
            <Element.icon
              size={Element.size}
              className="text-[#8BA888] dark:text-[#98C9A3]"
            />
          </motion.div>
        )),
      )}

      {/* Login card with motion effects */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-[#2A3130] rounded-lg shadow-lg relative z-10"
      >
        <div className="flex flex-col items-center text-center">
          <motion.div
            className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-[#8BA888]"
            animate={{
              rotate: [0, 10, 0, -10, 0],
              scale: [1, 1.05, 1, 1.05, 1],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Leaf className="w-8 h-8 text-white" />
          </motion.div>

          <h1 className="text-2xl font-bold text-[#2C4A3E] dark:text-white">
            Welcome to GreenBot
          </h1>

          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Your sustainable AI assistant for environmental topics
          </p>
        </div>

        <div className="space-y-4 relative">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: getCustomTheme(),
              className: {
                button: "bg-[#2C4A3E] hover:bg-[#8BA888] text-white",
                anchor:
                  "text-[#2C4A3E] dark:text-[#98C9A3] hover:text-[#8BA888] dark:hover:text-[#A4D5AF]",
                input:
                  "dark:bg-[#343C3B] dark:border-[#4A5654] dark:text-white",
                label: "dark:text-gray-300",
                message: "dark:text-gray-300",
                container: "dark:bg-[#2A3130]",
                divider: "dark:bg-[#3A4140]",
                ellipsis: "dark:text-white",
              },
              extend: {
                container: (theme) => ({
                  backgroundColor: theme === "dark" ? "#2A3130" : "#FFFFFF",
                }),
              },
            }}
            providers={[]}
            redirectTo={window.location.origin}
          />
        </div>

        <div className="pt-4 mt-6 text-xs text-center text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
          <p>
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
          <motion.p
            className="mt-2"
            animate={{
              opacity: [0.7, 1, 0.7],
              y: [0, -2, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <span className="inline-flex items-center text-[#8BA888] dark:text-[#98C9A3]">
              <Leaf className="w-3 h-3 mr-1" /> Powered by sustainable
              technology
            </span>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthForm;
