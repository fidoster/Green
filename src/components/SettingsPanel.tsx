import React, { useState } from "react";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";
import { Moon, Sun, Leaf, Info } from "lucide-react";

interface SettingsPanelProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const SettingsPanel = ({
  isOpen = true,
  onClose = () => {},
}: SettingsPanelProps) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showMetrics, setShowMetrics] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoSave, setAutoSave] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-[#F5F5F5] p-6 shadow-lg dark:bg-[#2F3635]">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[#2C4A3E]">Settings</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-[#2C4A3E] hover:bg-[#98C9A3]/20"
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
              <span className="text-sm font-medium text-[#2C4A3E]">
                {isDarkMode ? "Dark Mode" : "Light Mode"}
              </span>
            </div>
            <Switch
              checked={isDarkMode}
              onCheckedChange={setIsDarkMode}
              className="data-[state=checked]:bg-[#8BA888] data-[state=unchecked]:bg-gray-300"
            />
          </div>

          {/* Environmental Impact Metrics */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-[#8BA888]" />
              <span className="text-sm font-medium text-[#2C4A3E]">
                Show Environmental Impact
              </span>
            </div>
            <Switch
              checked={showMetrics}
              onCheckedChange={setShowMetrics}
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
              <span className="text-sm font-medium text-[#2C4A3E]">
                Notifications
              </span>
            </div>
            <Switch
              checked={notificationsEnabled}
              onCheckedChange={setNotificationsEnabled}
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
              <span className="text-sm font-medium text-[#2C4A3E]">
                Auto-save Conversations
              </span>
            </div>
            <Switch
              checked={autoSave}
              onCheckedChange={setAutoSave}
              className="data-[state=checked]:bg-[#8BA888] data-[state=unchecked]:bg-gray-300"
            />
          </div>
        </div>

        <Separator className="my-4 bg-[#8BA888]/30" />

        {/* Environmental Impact Stats */}
        {showMetrics && (
          <div className="rounded-md bg-[#98C9A3]/20 p-3">
            <div className="mb-2 flex items-center gap-2">
              <Info className="h-4 w-4 text-[#2C4A3E]" />
              <h3 className="text-sm font-medium text-[#2C4A3E]">
                Your Environmental Impact
              </h3>
            </div>
            <div className="space-y-1 text-xs text-[#2C4A3E]/80">
              <p>• Carbon saved: 0.8kg (vs. traditional search)</p>
              <p>• Energy efficiency: 92% better than average</p>
              <p>• Trees equivalent: 0.04 trees preserved</p>
            </div>
          </div>
        )}

        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-md bg-[#8BA888] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#8BA888]/90"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
