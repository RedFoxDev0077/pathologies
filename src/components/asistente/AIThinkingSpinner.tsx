import { cn } from '@/lib/utils';

interface AIThinkingSpinnerProps {
  className?: string;
}

export function AIThinkingSpinner({ className }: AIThinkingSpinnerProps) {
  return (
    <div className={cn('flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2', className)}>
      {/* Avatar */}
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
        <svg
          className="h-4 w-4 text-primary-foreground"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>

      {/* Thinking bubble */}
      <div className="flex flex-col gap-2">
        <div className="rounded-2xl rounded-tl-none bg-muted px-4 py-3 shadow-sm">
          <div className="flex items-center gap-2">
            {/* Animated thinking dots */}
            <div className="flex gap-1">
              <div
                className="h-2 w-2 rounded-full bg-primary/60 animate-bounce"
                style={{ animationDelay: '0ms', animationDuration: '1.4s' }}
              />
              <div
                className="h-2 w-2 rounded-full bg-primary/60 animate-bounce"
                style={{ animationDelay: '200ms', animationDuration: '1.4s' }}
              />
              <div
                className="h-2 w-2 rounded-full bg-primary/60 animate-bounce"
                style={{ animationDelay: '400ms', animationDuration: '1.4s' }}
              />
            </div>
            <span className="text-sm text-muted-foreground animate-pulse">
              Analizando...
            </span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground px-1">
          El asistente está procesando tu información
        </p>
      </div>
    </div>
  );
}
