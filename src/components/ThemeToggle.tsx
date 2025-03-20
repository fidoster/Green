import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full bg-transparent hover:bg-[#98C9A3]/20"
    >
      {theme === "light" ? (
        <Sun className="h-5 w-5 text-[#8BA888]" />
      ) : (
        <Moon className="h-5 w-5 text-[#8BA888]" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
