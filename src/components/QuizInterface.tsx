import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Progress } from "./ui/progress";
import { supabase } from "../lib/supabase";
import { saveQuizResponse, saveQuizSession } from "../lib/quiz-service";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface QuizQuestion {
  id: string;
  persona: string;
  question: string;
  options: Record<string, string>;
  correct_answer: string;
  explanation: string;
}

interface QuizInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  persona: string;
  isAuthenticated: boolean;
}

const QuizInterface: React.FC<QuizInterfaceProps> = ({
  isOpen,
  onClose,
  persona,
  isAuthenticated,
}) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userResponses, setUserResponses] = useState<
    Array<{
      questionId: string;
      selectedAnswer: string;
      isCorrect: boolean;
    }>
  >([]);

  useEffect(() => {
    if (isOpen) {
      fetchQuizQuestions();
    } else {
      // Reset quiz state when dialog is closed
      setCurrentQuestionIndex(0);
      setSelectedAnswer("");
      setIsAnswerSubmitted(false);
      setScore(0);
      setIsQuizCompleted(false);
      setUserResponses([]);
    }
  }, [isOpen, persona]);

  const fetchQuizQuestions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("quiz_questions")
        .select("*")
        .eq("persona", persona);

      if (error) throw error;

      if (data && data.length > 0) {
        // Shuffle questions and take 5 (or fewer if less are available)
        const shuffled = [...data].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, Math.min(5, shuffled.length));
        setQuestions(selected);
      } else {
        setError("No quiz questions available for this persona.");
      }
    } catch (err) {
      console.error("Error fetching quiz questions:", err);
      setError("Failed to load quiz questions. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (value: string) => {
    if (!isAnswerSubmitted) {
      setSelectedAnswer(value);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!selectedAnswer || isAnswerSubmitted) return;

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correct_answer;

    // Update score
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    // Record user response
    const response = {
      questionId: currentQuestion.id,
      selectedAnswer,
      isCorrect,
    };

    setUserResponses((prev) => [...prev, response]);
    setIsAnswerSubmitted(true);

    // Save response to database if user is authenticated
    if (isAuthenticated) {
      try {
        await saveQuizResponse({
          question_id: currentQuestion.id,
          selected_answer: selectedAnswer,
          is_correct: isCorrect,
        });
      } catch (error) {
        console.error("Error saving quiz response:", error);
      }
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer("");
      setIsAnswerSubmitted(false);
    } else {
      // Quiz completed
      setIsQuizCompleted(true);

      // Save quiz session to database if user is authenticated
      if (isAuthenticated) {
        try {
          saveQuizSession({
            persona,
            score,
            total_questions: questions.length,
          });
        } catch (error) {
          console.error("Error saving quiz session:", error);
        }
      }
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress =
    questions.length > 0
      ? ((currentQuestionIndex + 1) / questions.length) * 100
      : 0;

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Loading Quiz...</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 dark:border-green-500"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (error) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600 dark:text-red-400">
              Error
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-center">{error}</p>
          </div>
          <DialogFooter>
            <Button onClick={onClose}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  if (isQuizCompleted) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Quiz Completed!</DialogTitle>
            <DialogDescription>
              You scored {score} out of {questions.length}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Progress
              value={(score / questions.length) * 100}
              className="h-2"
            />
            <p className="mt-4 text-center font-medium">
              {score === questions.length
                ? "Perfect score! You're an expert!"
                : score >= questions.length * 0.8
                  ? "Great job! You know your stuff!"
                  : score >= questions.length * 0.6
                    ? "Good effort! Keep learning!"
                    : "Keep learning about environmental topics!"}
            </p>
          </div>
          <DialogFooter>
            <Button onClick={onClose}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{persona} Quiz</DialogTitle>
          <DialogDescription>
            Question {currentQuestionIndex + 1} of {questions.length}
          </DialogDescription>
        </DialogHeader>

        <Progress value={progress} className="h-2" />

        <div className="py-4">
          <h3 className="font-medium text-lg mb-4">
            {currentQuestion?.question}
          </h3>

          <RadioGroup value={selectedAnswer} onValueChange={handleAnswerSelect}>
            {currentQuestion &&
              Object.entries(currentQuestion.options).map(([key, value]) => (
                <div
                  key={key}
                  className={`flex items-center space-x-2 p-3 rounded-md mb-2 ${
                    isAnswerSubmitted
                      ? key === currentQuestion.correct_answer
                        ? "bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700"
                        : selectedAnswer === key
                          ? "bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700"
                          : ""
                      : "hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <RadioGroupItem
                    value={key}
                    id={`option-${key}`}
                    disabled={isAnswerSubmitted}
                  />
                  <Label
                    htmlFor={`option-${key}`}
                    className="flex-1 cursor-pointer"
                  >
                    <span className="font-medium mr-2">{key}:</span> {value}
                  </Label>
                  {isAnswerSubmitted &&
                    key === currentQuestion.correct_answer && (
                      <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                    )}
                  {isAnswerSubmitted &&
                    selectedAnswer === key &&
                    key !== currentQuestion.correct_answer && (
                      <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    )}
                </div>
              ))}
          </RadioGroup>

          {isAnswerSubmitted && currentQuestion && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800">
              <p className="text-blue-800 dark:text-blue-300 font-medium">
                Explanation:
              </p>
              <p className="text-blue-700 dark:text-blue-400">
                {currentQuestion.explanation}
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          {!isAnswerSubmitted ? (
            <Button
              onClick={handleSubmitAnswer}
              disabled={!selectedAnswer}
              className="w-full sm:w-auto"
            >
              Submit Answer
            </Button>
          ) : (
            <Button
              onClick={handleNextQuestion}
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
            >
              {currentQuestionIndex < questions.length - 1
                ? "Next Question"
                : "See Results"}
            </Button>
          )}
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QuizInterface;
