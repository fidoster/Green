import React from "react";
import { Button } from "./ui/button";
import { LightbulbIcon } from "lucide-react";
import { PersonaType } from "./PersonaSelector";

interface QuizButtonProps {
  currentPersona: string;
  onStartQuiz: () => void;
  className?: string;
}

const QuizButton: React.FC<QuizButtonProps> = ({
  currentPersona,
  onStartQuiz,
  className = "",
}) => {
  return (
    <Button
      variant="outline"
      size="sm"
      className={`flex items-center gap-2 bg-green-50 hover:bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:hover:bg-green-900/30 dark:text-green-400 dark:border-green-800 ${className}`}
      onClick={onStartQuiz}
    >
      <LightbulbIcon className="h-4 w-4" />
      <span>Take a Quiz</span>
    </Button>
  );
};

export default QuizButton;
