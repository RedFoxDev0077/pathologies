import { Evidence } from '@/types/expediente';
import { CheckCircle2, Loader2, AlertCircle, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UploadSummaryBadgeProps {
  evidencias: Evidence[];
  className?: string;
}

export function UploadSummaryBadge({ evidencias, className }: UploadSummaryBadgeProps) {
  const photos = evidencias.filter(e => e.type === 'photo');
  const uploadingCount = photos.filter(e => e.status === 'uploading').length;
  const validatingCount = photos.filter(e => e.status === 'validating').length;
  const validatedCount = photos.filter(e => e.status === 'completed' && e.validated).length;
  const errorCount = photos.filter(e => e.status === 'error').length;

  // Don't show if no files
  if (photos.length === 0) {
    return null;
  }

  // Determine overall status
  const getStatus = () => {
    if (uploadingCount > 0) {
      return {
        icon: Loader2,
        iconClass: 'text-blue-600 animate-spin',
        bgClass: 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800',
        textClass: 'text-blue-700 dark:text-blue-300',
        message: `📤 Subiendo ${uploadingCount} ${uploadingCount === 1 ? 'foto' : 'fotos'}...`,
      };
    }
    if (validatingCount > 0) {
      return {
        icon: Loader2,
        iconClass: 'text-yellow-600 animate-spin',
        bgClass: 'bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800',
        textClass: 'text-yellow-700 dark:text-yellow-300',
        message: `⏳ Verificando ${validatingCount} ${validatingCount === 1 ? 'foto' : 'fotos'}...`,
      };
    }
    if (errorCount > 0) {
      return {
        icon: AlertCircle,
        iconClass: 'text-red-600',
        bgClass: 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800',
        textClass: 'text-red-700 dark:text-red-300',
        message: `⚠️ Error en ${errorCount} ${errorCount === 1 ? 'archivo' : 'archivos'}`,
      };
    }
    if (validatedCount > 0) {
      return {
        icon: CheckCircle2,
        iconClass: 'text-green-600',
        bgClass: 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800',
        textClass: 'text-green-700 dark:text-green-300',
        message: `📎 ${validatedCount} ${validatedCount === 1 ? 'foto verificada' : 'fotos verificadas'} ✓`,
        subtitle: validatedCount >= 1 ? 'Listo para continuar' : undefined,
      };
    }
    return null;
  };

  const status = getStatus();

  if (!status) {
    return null;
  }

  const StatusIcon = status.icon;

  return (
    <div
      className={cn(
        'border-2 rounded-lg p-3 transition-all duration-300',
        status.bgClass,
        className
      )}
    >
      <div className="flex items-center gap-2">
        <StatusIcon className={cn('h-4 w-4 flex-shrink-0', status.iconClass)} />
        <div className="flex-1 min-w-0">
          <p className={cn('text-sm font-medium', status.textClass)}>
            {status.message}
          </p>
          {status.subtitle && (
            <p className={cn('text-xs mt-0.5', status.textClass)}>
              {status.subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
