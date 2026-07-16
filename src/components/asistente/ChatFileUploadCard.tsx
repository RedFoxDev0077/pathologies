import { useState, useEffect } from 'react';
import { Evidence } from '@/types/expediente';
import { Progress } from '@/components/ui/progress';
import {
  Image,
  Video,
  File,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatFileUploadCardProps {
  evidence: Evidence;
  onDismiss?: () => void;
}

export function ChatFileUploadCard({ evidence, onDismiss }: ChatFileUploadCardProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);

  const Icon = evidence.type === 'photo' ? Image : evidence.type === 'video' ? Video : File;

  // Auto-dismiss after verification completes
  useEffect(() => {
    if (evidence.status === 'completed' && evidence.validated) {
      // Show "Verificado" for longer for videos (5s) vs photos (3s)
      const displayTime = evidence.type === 'video' ? 5000 : 3000;

      const fadeTimer = setTimeout(() => {
        setIsVisible(false);
        // Wait for fade animation to complete before unmounting
        const unmountTimer = setTimeout(() => {
          setShouldRender(false);
          onDismiss?.();
        }, 300);
        return () => clearTimeout(unmountTimer);
      }, displayTime);

      return () => clearTimeout(fadeTimer);
    }
  }, [evidence.status, evidence.validated, evidence.type, onDismiss]);

  if (!shouldRender) {
    return null;
  }

  // Status-based styling
  const getStatusStyles = () => {
    switch (evidence.status) {
      case 'uploading':
        return {
          border: 'border-blue-200 dark:border-blue-800',
          bg: 'bg-blue-50 dark:bg-blue-900/10',
          iconColor: 'text-blue-600',
        };
      case 'validating':
        return {
          border: 'border-yellow-200 dark:border-yellow-800',
          bg: 'bg-yellow-50 dark:bg-yellow-900/10',
          iconColor: 'text-yellow-600',
        };
      case 'completed':
        return {
          border: 'border-green-200 dark:border-green-800',
          bg: 'bg-green-50 dark:bg-green-900/10',
          iconColor: 'text-green-600',
        };
      case 'error':
        return {
          border: 'border-red-200 dark:border-red-800',
          bg: 'bg-red-50 dark:bg-red-900/10',
          iconColor: 'text-red-600',
        };
      default:
        return {
          border: 'border-border',
          bg: 'bg-background',
          iconColor: 'text-muted-foreground',
        };
    }
  };

  const styles = getStatusStyles();

  return (
    <div
      className={cn(
        'my-2 rounded-lg border-2 p-3 transition-all duration-300',
        styles.border,
        styles.bg,
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      )}
    >
      <div className="flex items-start gap-3">
        {/* Thumbnail */}
        <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded bg-muted">
          {evidence.url && evidence.type === 'photo' ? (
            <img
              src={evidence.url}
              alt={evidence.name}
              className="h-full w-full object-cover"
            />
          ) : evidence.url && evidence.type === 'video' ? (
            <video
              src={evidence.url}
              className="h-full w-full object-cover"
              muted
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Info & Status */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{evidence.name}</p>
              <p className="text-xs text-muted-foreground">
                {(evidence.size / (1024 * 1024)).toFixed(1)} MB
              </p>
            </div>

            {/* Status Icon */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {evidence.status === 'uploading' && (
                <>
                  <Loader2 className={cn('h-4 w-4 animate-spin', styles.iconColor)} />
                  <span className={cn('text-xs font-medium', styles.iconColor)}>
                    Subiendo...
                  </span>
                </>
              )}
              {evidence.status === 'validating' && (
                <>
                  <Loader2 className={cn('h-4 w-4 animate-spin', styles.iconColor)} />
                  <span className={cn('text-xs font-medium', styles.iconColor)}>
                    Verificando...
                  </span>
                </>
              )}
              {evidence.status === 'completed' && evidence.validated && (
                <>
                  <CheckCircle2 className={cn('h-4 w-4', styles.iconColor)} />
                  <span className={cn('text-xs font-medium', styles.iconColor)}>
                    Verificado
                  </span>
                </>
              )}
              {evidence.status === 'error' && (
                <>
                  <AlertCircle className={cn('h-4 w-4', styles.iconColor)} />
                  <span className={cn('text-xs font-medium', styles.iconColor)}>
                    Error
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Progress Bar (uploading only) */}
          {evidence.status === 'uploading' && evidence.uploadProgress !== undefined && (
            <div className="mt-2">
              <Progress
                value={evidence.uploadProgress}
                className="h-2"
              />
              <p className="mt-1 text-xs text-muted-foreground text-right">
                {evidence.uploadProgress}%
              </p>
            </div>
          )}

          {/* Validation Error */}
          {evidence.status === 'error' && evidence.validationError && (
            <div className="mt-2">
              <p className="text-xs text-destructive">{evidence.validationError}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
