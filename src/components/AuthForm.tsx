import { useState } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "../lib/supabase";
import { Leaf } from "lucide-react";

interface AuthFormProps {
  onAuthSuccess?: () => void;
}

const AuthForm = ({ onAuthSuccess }: AuthFormProps) => {
  const [isLoading, setIsLoading] = useState(false);

  // Listen for authentication state changes
  supabase.auth.onAuthStateChange((event) => {
    if (event === "SIGNED_IN" && onAuthSuccess) {
      onAuthSuccess();
    }
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F5F5F5] dark:bg-[#2F3635] p-6">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-[#3A4140] rounded-lg shadow-md">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-[#8BA888]">
            <Leaf className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#2C4A3E] dark:text-white">
            Welcome to GreenBot
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Your sustainable AI assistant for environmental topics
          </p>
        </div>

        <div className="space-y-4">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: "#2C4A3E",
                    brandAccent: "#8BA888",
                    inputText: "var(--foreground)",
                    inputLabelText: "var(--foreground)",
                    inputPlaceholder: "var(--muted-foreground)",
                  },
                },
              },
              className: {
                button: "bg-[#2C4A3E] hover:bg-[#8BA888] text-white",
                anchor:
                  "text-[#2C4A3E] hover:text-[#8BA888] dark:text-[#8BA888] dark:hover:text-[#98C9A3]",
                label: "text-[#2C4A3E] dark:text-white",
                input:
                  "bg-white dark:bg-[#343C3B] text-[#2F3635] dark:text-white border-[#E0E0E0] dark:border-[#4A5250]",
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
          <p className="mt-2">
            <span className="inline-flex items-center text-[#8BA888]">
              <Leaf className="w-3 h-3 mr-1" /> Powered by sustainable
              technology
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
