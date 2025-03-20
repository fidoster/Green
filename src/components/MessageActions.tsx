import React from "react";
import { Button } from "./ui/button";
import { ThumbsUp, ThumbsDown, Copy, RefreshCw } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface MessageActionsProps {
  onLike?: () => void;
  onDislike?: () => void;
  onCopy?: () => void;
  onRegenerate?: () => void;
  className?: string;
}

const MessageActions = ({
  onLike = () => {},
  onDislike = () => {},
  onCopy = () => {},
  onRegenerate = () => {},
  className = "",
}: MessageActionsProps) => {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onLike}
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-full hover:bg-green-100 hover:text-green-600 dark:hover:bg-green-900/30 dark:hover:text-green-400"
            >
              <ThumbsUp className="h-3.5 w-3.5" />
              <span className="sr-only">Like</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Like</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onDislike}
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-full hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
            >
              <ThumbsDown className="h-3.5 w-3.5" />
              <span className="sr-only">Dislike</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Dislike</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onCopy}
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-full hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-400"
            >
              <Copy className="h-3.5 w-3.5" />
              <span className="sr-only">Copy</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Copy to clipboard</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onRegenerate}
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-full hover:bg-purple-100 hover:text-purple-600 dark:hover:bg-purple-900/30 dark:hover:text-purple-400"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span className="sr-only">Regenerate</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Regenerate response</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default MessageActions;
