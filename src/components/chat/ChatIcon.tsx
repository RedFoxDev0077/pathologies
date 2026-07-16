import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatIconProps {
  onClick: () => void;
  isOpen: boolean;
}

export function ChatIcon({ onClick, isOpen }: ChatIconProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "fixed bottom-28 right-6 z-50",
        "h-14 w-14 rounded-full",
        "bg-gradient-to-br from-primary to-primary/80",
        "shadow-lg shadow-primary/30",
        "flex items-center justify-center",
        "transition-all duration-300 ease-out",
        "hover:scale-110 hover:shadow-xl hover:shadow-primary/40",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        "group",
        isOpen && "scale-0 opacity-0 pointer-events-none"
      )}
      aria-label="Abrir asistente virtual"
    >
      {/* Pulse animation ring */}
      <span className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />

      {/* Icon */}
      <MessageCircle className="h-6 w-6 text-primary-foreground relative z-10 transition-transform duration-300 group-hover:scale-110" />

      {/* Tooltip */}
      <span className="absolute right-full mr-3 px-3 py-1.5 rounded-lg bg-card border border-border shadow-lg text-sm font-medium text-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        Asistente Virtual
      </span>
    </button>
  );
}
