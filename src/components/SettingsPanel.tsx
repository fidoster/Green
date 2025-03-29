import React, { useState, useEffect } from "react";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";
import { Moon, Sun, Leaf, Info, Key, LogOut } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { supabase } from "../lib/supabase";
import { useTheme } from "./ThemeProvider";
import { useToast } from "./ui/use-toast";

interface SettingsPanelProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const SettingsPanel = ({
  isOpen = true,
  onClose = () => {},
}: SettingsPanelProps) => {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const isDarkMode = theme === "dark";
  const [showMetrics, setShowMetrics] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [apiKey, setApiKey] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isTestingApi, setIsTestingApi] = useState(false);
  const [apiTestResult, setApiTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  useEffect(() => {
    // Load API key from localStorage if available
    const savedApiKey = localStorage.getItem("deepseek-api-key") || "";
    setApiKey(savedApiKey);

    // Get current user email
    const getUserEmail = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUserEmail(data.user.email || "");
      }
    };

    getUserEmail();

    // Load user preferences from localStorage
    const savedShowMetrics = localStorage.getItem("showMetrics");
    const savedNotifications = localStorage.getItem("notificationsEnabled");
    const savedAutoSave = localStorage.getItem("autoSave");

    if (savedShowMetrics !== null) setShowMetrics(savedShowMetrics === "true");
    if (savedNotifications !== null)
      setNotificationsEnabled(savedNotifications === "true");
    if (savedAutoSave !== null) setAutoSave(savedAutoSave === "true");
  }, []);

  const handleSignOut = async () => {
    try {
      // Explicitly save current theme before sign-out
      const currentTheme = theme;
      localStorage.setItem("greenbot-ui-theme", currentTheme);

      // Force apply theme to root HTML element to ensure it persists through sign-out
      const root = window.document.documentElement;
      if (currentTheme === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }

      await supabase.auth.signOut();

      toast({
        title: "Successfully signed out",
        description: "You have been signed out of your account",
        duration: 3000,
      });

      onClose();
      // Let the auth state listener handle the UI update
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Sign out failed",
        description: "There was an error signing out. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const savePreference = (key: string, value: boolean) => {
    localStorage.setItem(key, value.toString());
  };

  const handleShowMetricsChange = (checked: boolean) => {
    setShowMetrics(checked);
    savePreference("showMetrics", checked);
  };

  const handleNotificationsChange = (checked: boolean) => {
    setNotificationsEnabled(checked);
    savePreference("notificationsEnabled", checked);
  };

  const handleAutoSaveChange = (checked: boolean) => {
    setAutoSave(checked);
    savePreference("autoSave", checked);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-[#F5F5F5] p-6 shadow-lg dark:bg-[#2A3130] dark:text-white">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[#2C4A3E] dark:text-[#98C9A3]">
            Settings
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-[#2C4A3E] hover:bg-[#98C9A3]/20 dark:text-[#98C9A3]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        <Separator className="mb-4 bg-[#8BA888]/30" />

        <div className="space-y-4">
          {/* Theme Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isDarkMode ? (
                <Moon className="h-5 w-5 text-[#8BA888]" />
              ) : (
                <Sun className="h-5 w-5 text-[#8BA888]" />
              )}
              <span className="text-sm font-medium text-[#2C4A3E] dark:text-[#E1E1E1]">
                {isDarkMode ? "Dark Mode" : "Light Mode"}
              </span>
            </div>
            <Switch
              checked={isDarkMode}
              onCheckedChange={(checked) => {
                setTheme(checked ? "dark" : "light");
              }}
              className="data-[state=checked]:bg-[#8BA888] data-[state=unchecked]:bg-gray-300"
            />
          </div>

          {/* Environmental Impact Metrics */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-[#8BA888]" />
              <span className="text-sm font-medium text-[#2C4A3E] dark:text-[#E1E1E1]">
                Show Environmental Impact
              </span>
            </div>
            <Switch
              checked={showMetrics}
              onCheckedChange={handleShowMetricsChange}
              className="data-[state=checked]:bg-[#8BA888] data-[state=unchecked]:bg-gray-300"
            />
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[#8BA888]"
              >
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
              </svg>
              <span className="text-sm font-medium text-[#2C4A3E] dark:text-[#E1E1E1]">
                Notifications
              </span>
            </div>
            <Switch
              checked={notificationsEnabled}
              onCheckedChange={handleNotificationsChange}
              className="data-[state=checked]:bg-[#8BA888] data-[state=unchecked]:bg-gray-300"
            />
          </div>

          {/* Auto-save */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[#8BA888]"
              >
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>
              <span className="text-sm font-medium text-[#2C4A3E] dark:text-[#E1E1E1]">
                Auto-save Conversations
              </span>
            </div>
            <Switch
              checked={autoSave}
              onCheckedChange={handleAutoSaveChange}
              className="data-[state=checked]:bg-[#8BA888] data-[state=unchecked]:bg-gray-300"
            />
          </div>
        </div>

        <Separator className="my-4 bg-[#8BA888]/30" />

        {/* Environmental Impact Stats */}
        {showMetrics && (
          <div className="rounded-md bg-[#98C9A3]/20 p-3">
            <div className="mb-2 flex items-center gap-2">
              <Info className="h-4 w-4 text-[#2C4A3E] dark:text-[#98C9A3]" />
              <h3 className="text-sm font-medium text-[#2C4A3E] dark:text-[#E1E1E1]">
                Your Environmental Impact
              </h3>
            </div>
            <div className="space-y-1 text-xs text-[#2C4A3E]/80 dark:text-[#E1E1E1]/80">
              <p>• Carbon saved: 0.8kg (vs. traditional search)</p>
              <p>• Energy efficiency: 92% better than average</p>
              <p>• Trees equivalent: 0.04 trees preserved</p>
            </div>
          </div>
        )}

        {/* API Key Section */}
        <div className="mt-4 rounded-md bg-[#F5F5F5] p-4 dark:bg-[#343C3B]">
          <div className="mb-3 flex items-center gap-2">
            <Key className="h-4 w-4 text-[#8BA888]" />
            <h3 className="text-sm font-medium text-[#2F3635] dark:text-white">
              DeepSeek API Key Settings
            </h3>
          </div>

          <div className="mb-2 text-xs text-[#2C4A3E]/80 dark:text-white/80">
            <p>Current user: {userEmail || "Not signed in"}</p>
          </div>

          <div className="space-y-3">
            <div>
              <Input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your API key"
                className="bg-white dark:bg-[#343C3B] dark:text-white border-[#E0E0E0] dark:border-[#4A5250]"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setIsSaving(true);
                  // Save API key to localStorage
                  localStorage.setItem("deepseek-api-key", apiKey);
                  setTimeout(() => {
                    setSaveMessage("API key saved successfully");
                    setIsSaving(false);
                    setTimeout(() => setSaveMessage(""), 3000);
                  }, 500);
                }}
                className="flex-1 bg-[#8BA888] hover:bg-[#8BA888]/90 text-white"
                disabled={isSaving || isTestingApi}
              >
                {isSaving ? "Saving..." : "Save API Key"}
              </Button>

              <Button
                onClick={async () => {
                  if (!apiKey.trim()) {
                    setApiTestResult({
                      success: false,
                      message: "Please enter an API key first",
                    });
                    return;
                  }

                  setIsTestingApi(true);
                  setApiTestResult(null);

                  try {
                    // Import dynamically to avoid circular dependencies
                    const { callDeepseekAPI } = await import("../lib/deepseek");
                    await callDeepseekAPI(
                      [
                        {
                          role: "system",
                          content: "You are a helpful assistant.",
                        },
                        { role: "user", content: "Test connection" },
                      ],
                      apiKey,
                    );

                    setApiTestResult({
                      success: true,
                      message: "API connection successful!",
                    });
                  } catch (error) {
                    setApiTestResult({
                      success: false,
                      message:
                        error instanceof Error
                          ? error.message
                          : "Unknown error",
                    });
                  } finally {
                    setIsTestingApi(false);
                  }
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white"
                disabled={isSaving || isTestingApi}
              >
                {isTestingApi ? "Testing..." : "Test API"}
              </Button>
            </div>
            {saveMessage && (
              <p className="text-xs text-green-600 text-center">
                {saveMessage}
              </p>
            )}
            {apiTestResult && (
              <p
                className={`text-xs ${apiTestResult.success ? "text-green-600" : "text-red-600"} text-center mt-2`}
              >
                {apiTestResult.message}
              </p>
            )}
          </div>
        </div>

        <div className="mt-4 flex justify-between">
          <Button
            onClick={handleSignOut}
            className="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600 flex items-center gap-2"
          >
            <LogOut size={16} />
            Sign Out
          </Button>
          <Button
            onClick={onClose}
            className="rounded-md bg-[#8BA888] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#8BA888]/90"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
