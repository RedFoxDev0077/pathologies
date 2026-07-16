import { useState, useRef, useEffect } from 'react';
import { Message, ExpedienteState, Evidence } from '@/types/expediente';
import { ChatMessage } from './ChatMessage';
import { QuickReplies } from './QuickReplies';
import { AIThinkingSpinner } from './AIThinkingSpinner';
import { ChatFileUploadCard } from './ChatFileUploadCard';
import { UploadSummaryBadge } from './UploadSummaryBadge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Paperclip, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatPanelProps {
  messages: Message[];
  estado: ExpedienteState;
  perfil: 'particular' | 'abogado' | 'administrador';
  evidencias?: Evidence[]; // NEW: For upload progress display
  sending?: boolean; // NEW: Show AI thinking spinner
  welcomeMessage?: string; // NEW: Static S0 welcome message
  onSendMessage: (content: string) => void;
  onAttachFile: () => void;
  className?: string;
}

export function ChatPanel({
  messages,
  estado,
  perfil,
  evidencias = [],
  sending = false,
  welcomeMessage,
  onSendMessage,
  onAttachFile,
  className,
}: ChatPanelProps) {
  const [input, setInput] = useState('');
  const [dismissedUploads, setDismissedUploads] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, evidencias]);

  // Get active uploads to display (uploading, validating, or recently completed)
  const activeUploads = evidencias.filter(e =>
    !dismissedUploads.has(e.id) && (
      e.status === 'uploading' ||
      e.status === 'validating' ||
      (e.status === 'completed' && e.validated)
    )
  );

  const handleDismissUpload = (evidenceId: string) => {
    setDismissedUploads(prev => new Set(prev).add(evidenceId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleQuickReply = (reply: string) => {
    onSendMessage(reply);
  };

  return (
    <div className={cn('flex h-full flex-col', className)}>
      {/* Header */}
      <div className="border-b border-border bg-background px-4 py-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Asistente técnico</h2>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <AlertCircle className="h-3.5 w-3.5" />
            <span>Orientación preliminar</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {/* Static S0 Welcome - shown when messages array is empty */}
          {messages.length === 0 && welcomeMessage && (
            <div key="s0-welcome">
              <ChatMessage
                message={{
                  id: 's0-welcome',
                  role: 'assistant',
                  content: welcomeMessage,
                  timestamp: new Date()
                }}
              />
            </div>
          )}

          {messages.map((message, index) => {
            // Only show quick replies if:
            // 1. This is the last message in the conversation
            // 2. It's an assistant message
            // 3. The very last message in the entire conversation is NOT from the user
            const isLastMessage = index === messages.length - 1;
            const isAssistantMessage = message.role === 'assistant';
            const lastMessageInConvo = messages[messages.length - 1];
            const lastMessageIsFromUser = lastMessageInConvo?.role === 'user';

            const shouldShowQuickReplies =
              isLastMessage &&
              isAssistantMessage &&
              !lastMessageIsFromUser &&
              !sending &&
              messages.length > 1;

            return (
              <div key={message.id}>
                <ChatMessage message={message} />
                {shouldShowQuickReplies && (
                  <div className="mt-3 ml-12">
                    <QuickReplies estado={estado} perfil={perfil} onSelect={handleQuickReply} evidencias={evidencias} />
                  </div>
                )}
              </div>
            );
          })}

          {/* Upload Progress Cards */}
          {activeUploads.map(evidence => (
            <ChatFileUploadCard
              key={evidence.id}
              evidence={evidence}
              onDismiss={() => handleDismissUpload(evidence.id)}
            />
          ))}

          {/* AI Thinking Spinner */}
          {sending && <AIThinkingSpinner />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Upload Summary Badge (S5 only) */}
      {estado === ExpedienteState.S5_MATERIAL_GRAFICO && evidencias.length > 0 && (
        <div className="px-4 pb-2">
          <UploadSummaryBadge evidencias={evidencias} />
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="border-t border-border bg-background p-4">
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={onAttachFile}
            className="flex-shrink-0"
          >
            <Paperclip className="h-4 w-4" />
          </Button>

          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={sending ? "El asistente está pensando..." : "Escribe tu mensaje..."}
            disabled={sending}
            className="min-h-[44px] max-h-32 resize-none"
            rows={1}
          />

          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || sending}
            className="flex-shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        <p className="mt-2 text-xs text-muted-foreground">
          Pulsa Enter para enviar, Shift+Enter para salto de línea
        </p>
      </form>
    </div>
  );
}
