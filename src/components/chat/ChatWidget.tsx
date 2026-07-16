import { useState, useRef, useEffect, useCallback } from "react";
import { X, Send, Loader2, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  findFAQMatch,
  isComplexQuestion,
  welcomeMessage,
  complexQuestionResponse,
  fallbackResponse,
  complexKeywords,
} from "@/services/chat/faqData";
import { getAIResponse } from "@/services/chat/openaiService";
import { sendWebhookNotification } from "@/services/chat/emailService";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

interface ChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChatWidget({ isOpen, onClose }: ChatWidgetProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: welcomeMessage,
      role: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Preload Spanish voices for better TTS quality
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis?.getVoices();
      if (voices && voices.length > 0) {
        const spanishVoices = voices.filter((v) => v.lang.startsWith("es"));
        console.log("Available Spanish voices:", spanishVoices.map((v) => `${v.name} (${v.lang})`));
      }
    };

    loadVoices();

    if (window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Text-to-speech using browser TTS
  const speakResponse = useCallback((text: string) => {
    if (isMuted || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "es-ES";
    utterance.rate = 0.9;
    utterance.pitch = 1.1;

    const voices = window.speechSynthesis.getVoices();

    const femaleSpanishVoices = [
      "Microsoft Helena Online (Natural) - Spanish (Spain)",
      "Microsoft Helena - Spanish (Spain)",
      "Microsoft Laura Online (Natural) - Spanish (Spain)",
      "Microsoft Laura - Spanish (Spain)",
      "Helena Online",
      "Helena",
      "Laura Online",
      "Laura",
      "Google español",
      "Google español de España",
      "Mónica",
      "Monica",
      "Elvira Online",
      "Elvira",
      "Paulina",
      "Conchita",
      "Lucia",
      "Penélope",
      "Lola",
    ];

    let selectedVoice = null;

    for (const femaleName of femaleSpanishVoices) {
      selectedVoice = voices.find(
        (v) =>
          v.name.toLowerCase().includes(femaleName.toLowerCase()) &&
          v.lang.startsWith("es") &&
          !v.name.toLowerCase().includes("jorge") &&
          !v.name.toLowerCase().includes("pablo") &&
          !v.name.toLowerCase().includes("diego") &&
          !v.name.toLowerCase().includes("andrés") &&
          !v.name.toLowerCase().includes("enrique")
      );
      if (selectedVoice) break;
    }

    if (!selectedVoice) {
      selectedVoice = voices.find((v) => v.lang.startsWith("es"));
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [isMuted]);

  // Process user message
  const processMessage = async (userMessage: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      content: userMessage,
      role: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    let responseText: string;

    try {
      if (isComplexQuestion(userMessage)) {
        responseText = complexQuestionResponse;

        const detectedKeywords = complexKeywords.filter((kw) =>
          userMessage.toLowerCase().includes(kw.toLowerCase())
        );
        await sendWebhookNotification({
          userQuestion: userMessage,
          detectedKeywords,
          timestamp: new Date().toISOString(),
        });
      } else {
        const faqMatch = findFAQMatch(userMessage);

        if (faqMatch) {
          responseText = faqMatch.answer;
        } else {
          try {
            responseText = await getAIResponse(userMessage);
          } catch {
            responseText = fallbackResponse;
          }
        }
      }
    } catch {
      responseText = fallbackResponse;
    }

    const assistantMsg: Message = {
      id: (Date.now() + 1).toString(),
      content: responseText,
      role: "assistant",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, assistantMsg]);
    setIsLoading(false);

    speakResponse(responseText);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = inputValue.trim();

    if (message && !isLoading) {
      setInputValue("");
      processMessage(message);
    }
  };

  const toggleMute = () => {
    if (!isMuted) {
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
    }
    setIsMuted(!isMuted);
  };

  const handleClose = () => {
    window.speechSynthesis?.cancel();
    onClose();
  };

  const getStatusText = () => {
    if (isSpeaking) return "Hablando...";
    if (isLoading) return "Escribiendo...";
    return "En línea";
  };

  return (
    <div
      className={cn(
        "fixed bottom-28 right-6 z-50",
        "w-[380px] max-w-[calc(100vw-3rem)]",
        "bg-card rounded-2xl shadow-2xl border border-border",
        "flex flex-col overflow-hidden",
        "transition-all duration-300 ease-out",
        isOpen
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-4 scale-95 pointer-events-none"
      )}
      style={{ height: "500px", maxHeight: "calc(100vh - 10rem)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 rounded-full bg-primary-foreground/20 flex items-center justify-center overflow-hidden">
            <span className="text-lg font-bold">CD</span>
            <span
              className={cn(
                "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-primary",
                isSpeaking ? "bg-yellow-400 animate-pulse" : "bg-green-400"
              )}
            />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Asistente CasaDiag</h3>
            <p className="text-xs text-primary-foreground/80">
              {getStatusText()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={toggleMute}
            className="p-2 rounded-full hover:bg-primary-foreground/10 transition-colors"
            aria-label={isMuted ? "Activar sonido" : "Silenciar"}
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </button>

          <button
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-primary-foreground/10 transition-colors"
            aria-label="Cerrar chat"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex",
              message.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm",
                message.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : "bg-muted text-foreground rounded-bl-md"
              )}
            >
              <p className="leading-relaxed">{message.content}</p>
              <p
                className={cn(
                  "text-[10px] mt-1",
                  message.role === "user"
                    ? "text-primary-foreground/60"
                    : "text-muted-foreground"
                )}
              >
                {message.timestamp.toLocaleTimeString("es-ES", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-border bg-card">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Escribe tu pregunta..."
            disabled={isLoading}
            className={cn(
              "flex-1 px-4 py-2.5 rounded-full",
              "bg-muted border border-border",
              "text-sm text-foreground placeholder:text-muted-foreground",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "transition-all duration-200"
            )}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!inputValue.trim() || isLoading}
            className="h-10 w-10 rounded-full bg-primary hover:bg-primary/90 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          {["¿Cuánto cuesta?", "¿Cómo funciona?", "Tengo un problema"].map((question) => (
            <button
              key={question}
              type="button"
              onClick={() => {
                setInputValue(question);
                inputRef.current?.focus();
              }}
              disabled={isLoading}
              className="px-3 py-1 text-xs bg-muted hover:bg-muted/80 text-muted-foreground rounded-full transition-colors disabled:opacity-50"
            >
              {question}
            </button>
          ))}
        </div>
      </form>
    </div>
  );
}
