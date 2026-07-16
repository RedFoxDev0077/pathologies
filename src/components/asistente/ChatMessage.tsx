import { Message } from '@/types/expediente';
import { cn } from '@/lib/utils';
import { User, Bot } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div
      className={cn(
        'flex gap-3',
        isUser && 'flex-row-reverse'
      )}
    >
      <div
        className={cn(
          'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full',
          isUser ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      <div
        className={cn(
          'flex max-w-[80%] flex-col gap-1',
          isUser && 'items-end'
        )}
      >
        <div
          className={cn(
            'rounded-lg px-4 py-2.5',
            isUser
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-foreground'
          )}
        >
          <p className="whitespace-pre-wrap text-sm leading-relaxed">
            {message.content}
          </p>
        </div>

        <span className="text-xs text-muted-foreground">
          {format(new Date(message.timestamp), 'HH:mm', { locale: es })}
        </span>
      </div>
    </div>
  );
}
