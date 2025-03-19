import React from "react";
import { Leaf, Home, Recycle, Droplets } from "lucide-react";
import { cn } from "../lib/utils";

export type PersonaType =
  | "greenbot"
  | "homeadvisor"
  | "recyclingexpert"
  | "waterconservation";

export interface Persona {
  id: PersonaType;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

interface PersonaSelectorProps {
  selectedPersona: PersonaType;
  onSelectPersona: (persona: PersonaType) => void;
  className?: string;
}

const PersonaSelector = ({
  selectedPersona,
  onSelectPersona,
  className,
}: PersonaSelectorProps) => {
  const personas: Persona[] = [
    {
      id: "greenbot",
      name: "GreenBot",
      description: "General sustainability advisor",
      icon: <Leaf className="h-5 w-5" />,
      color: "#98C9A3",
    },
    {
      id: "homeadvisor",
      name: "Home Advisor",
      description: "Eco-friendly home solutions",
      icon: <Home className="h-5 w-5" />,
      color: "#8BA888",
    },
    {
      id: "recyclingexpert",
      name: "Recycling Expert",
      description: "Waste reduction specialist",
      icon: <Recycle className="h-5 w-5" />,
      color: "#2C4A3E",
    },
    {
      id: "waterconservation",
      name: "Water Guardian",
      description: "Water conservation advisor",
      icon: <Droplets className="h-5 w-5" />,
      color: "#6AADCB",
    },
  ];

  return (
    <div className={cn("space-y-2", className)}>
      <div className="text-sm font-medium mb-2 text-gray-300">
        Choose Advisor
      </div>

      <div className="grid grid-cols-2 gap-3">
        {personas.map((persona) => (
          <button
            key={persona.id}
            onClick={() => onSelectPersona(persona.id)}
            className={cn(
              "flex flex-col items-center p-3 rounded-md transition-all shadow-lg transform hover:scale-105",
              selectedPersona === persona.id
                ? `bg-opacity-20 border border-[${persona.color}]`
                : "bg-[#2C4A3E]/30 hover:bg-[#2C4A3E]/50",
            )}
            style={{
              backgroundColor:
                selectedPersona === persona.id ? `${persona.color}20` : "",
              borderColor:
                selectedPersona === persona.id ? persona.color : "transparent",
              boxShadow:
                selectedPersona === persona.id
                  ? `0 4px 12px ${persona.color}40, inset 0 -2px 5px rgba(0,0,0,0.1)`
                  : "0 4px 6px rgba(0,0,0,0.2), inset 0 -2px 5px rgba(0,0,0,0.1)",
              transform: `translateY(${selectedPersona === persona.id ? "0" : "2px"})`,
            }}
          >
            <div
              className={"p-2 rounded-full mb-2"}
              style={{
                color:
                  selectedPersona === persona.id ? persona.color : "#CBD5E1",
                background:
                  selectedPersona === persona.id
                    ? `linear-gradient(135deg, ${persona.color}30, transparent)`
                    : "linear-gradient(135deg, rgba(255,255,255,0.1), transparent)",
                boxShadow:
                  selectedPersona === persona.id
                    ? `0 2px 8px ${persona.color}30`
                    : "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              {persona.icon}
            </div>
            <span
              className="text-xs font-medium"
              style={{
                textShadow:
                  selectedPersona === persona.id
                    ? `0 0 8px ${persona.color}60`
                    : "none",
              }}
            >
              {persona.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PersonaSelector;
