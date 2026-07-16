import { Evidence } from '@/types/expediente';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, CheckCircle2, XCircle, Clock, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadCardProps {
  evidence: Evidence;
  onRetry?: (evidenceId: string) => void;
  onDelete?: (evidenceId: string) => void;
}

export function FileUploadCard({ evidence, onRetry, onDelete }: FileUploadCardProps) {
  const getStatusConfig = () => {
    switch (evidence.status) {
      case 'uploading':
        return {
          icon: <Loader2 className="h-5 w-5 animate-spin text-orange-500" />,
          text: 'Subiendo...',
          textColor: 'text-orange-700',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          showProgress: true,
        };
      case 'validating':
        return {
          icon: <Clock className="h-5 w-5 animate-pulse text-yellow-500" />,
          text: 'Verificando archivo...',
          textColor: 'text-yellow-700',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          showProgress: false,
        };
      case 'completed':
        return {
          icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
          text: 'Verificado y listo para análisis',
          textColor: 'text-green-700',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          showProgress: false,
        };
      case 'error':
        return {
          icon: <XCircle className="h-5 w-5 text-red-500" />,
          text: evidence.validationError || 'Error al subir archivo',
          textColor: 'text-red-700',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          showProgress: false,
        };
    }
  };

  const config = getStatusConfig();
  const fileIcon = evidence.type === 'video' ? '🎥' : '📸';
  const fileSizeMB = (evidence.size / (1024 * 1024)).toFixed(1);
  const progress = evidence.uploadProgress || 0;

  return (
    <Card
      className={cn(
        'p-4 transition-all duration-300',
        config.bgColor,
        config.borderColor,
        'border-2',
        evidence.status === 'error' && 'animate-shake'
      )}
    >
      {/* Header: Icon, Name, Delete */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className="text-2xl flex-shrink-0">{fileIcon}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{evidence.name}</p>
            <p className="text-xs text-muted-foreground">{fileSizeMB} MB</p>
          </div>
        </div>
        {onDelete && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(evidence.id)}
            className="h-8 w-8 flex-shrink-0"
            aria-label="Eliminar archivo"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Progress Bar (only for uploading) */}
      {config.showProgress && (
        <div className="mb-3">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1 text-right">
            {progress}%
          </p>
        </div>
      )}

      {/* Status Message */}
      <div className={cn('flex items-center gap-2', config.textColor)}>
        {config.icon}
        <span className="text-sm font-medium">{config.text}</span>
      </div>

      {/* Action Buttons (for error state) */}
      {evidence.status === 'error' && onRetry && (
        <div className="mt-3 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onRetry(evidence.id)}
            className="flex-1 h-11"
          >
            Reintentar
          </Button>
        </div>
      )}

      {/* Completed Info */}
      {evidence.status === 'completed' && (
        <p className="text-xs text-muted-foreground mt-2">
          Subido hace {getTimeAgo(evidence.uploadedAt)}
        </p>
      )}
    </Card>
  );
}

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);

  if (seconds < 60) return 'unos segundos';
  if (seconds < 120) return '1 minuto';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutos`;
  if (seconds < 7200) return '1 hora';
  return `${Math.floor(seconds / 3600)} horas`;
}
