import { Evidence } from '@/types/expediente';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle2, Loader2, XCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UploadSummaryBannerProps {
  evidences: Evidence[];
  onContinue: () => void;
  disabled?: boolean;
}

export function UploadSummaryBanner({
  evidences,
  onContinue,
  disabled,
}: UploadSummaryBannerProps) {
  const photoEvidences = evidences.filter((e) => e.type === 'photo');
  const videoEvidences = evidences.filter((e) => e.type === 'video');

  const completed = evidences.filter((e) => e.status === 'completed' && e.validated);
  const uploading = evidences.filter((e) => e.status === 'uploading');
  const validating = evidences.filter((e) => e.status === 'validating');
  const failed = evidences.filter((e) => e.status === 'error');

  const photosCompleted = photoEvidences.filter(
    (e) => e.status === 'completed' && e.validated
  ).length;

  const hasMinimumPhotos = photosCompleted >= 1;
  const hasActiveUploads = uploading.length > 0 || validating.length > 0;
  const canContinue = hasMinimumPhotos && !hasActiveUploads && !disabled;

  // Determine banner style based on state
  const getBannerStyle = () => {
    if (canContinue) {
      return {
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        icon: <CheckCircle2 className="h-6 w-6 text-green-600" />,
        title: 'Material listo para análisis',
        titleColor: 'text-green-900',
      };
    }
    if (hasActiveUploads) {
      return {
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        icon: <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />,
        title: 'Subiendo archivos...',
        titleColor: 'text-blue-900',
      };
    }
    if (failed.length > 0 && completed.length === 0) {
      return {
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        icon: <XCircle className="h-6 w-6 text-red-600" />,
        title: 'Error al subir archivos',
        titleColor: 'text-red-900',
      };
    }
    return {
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      icon: <AlertCircle className="h-6 w-6 text-gray-600" />,
      title: 'Material Gráfico',
      titleColor: 'text-gray-900',
    };
  };

  const style = getBannerStyle();

  return (
    <Card
      className={cn(
        'p-4 sticky top-0 z-10 border-2',
        style.bgColor,
        style.borderColor,
        'animate-fade-in'
      )}
    >
      {/* Title with Icon */}
      <div className="flex items-center gap-2 mb-3">
        {style.icon}
        <h3 className={cn('font-semibold text-lg', style.titleColor)}>
          {style.title}
        </h3>
      </div>

      {/* Status Counts */}
      <div className="space-y-2 mb-4">
        {completed.length > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <span className="text-green-700 font-medium">
              {photosCompleted} {photosCompleted === 1 ? 'foto verificada' : 'fotos verificadas'}
              {videoEvidences.some((e) => e.status === 'completed') && ' + video'}
            </span>
          </div>
        )}

        {uploading.length > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
            <span className="text-blue-700">
              {uploading.length} {uploading.length === 1 ? 'archivo' : 'archivos'} subiendo
            </span>
          </div>
        )}

        {validating.length > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <Loader2 className="h-4 w-4 text-yellow-600 animate-spin" />
            <span className="text-yellow-700">
              {validating.length} {validating.length === 1 ? 'archivo' : 'archivos'} verificando
            </span>
          </div>
        )}

        {failed.length > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <XCircle className="h-4 w-4 text-red-600" />
            <span className="text-red-700">
              {failed.length} {failed.length === 1 ? 'archivo con error' : 'archivos con error'}
            </span>
          </div>
        )}
      </div>

      {/* Minimum Requirement Warning */}
      {!hasMinimumPhotos && evidences.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-amber-800">
              Debes subir al menos <strong>1 foto verificada</strong> para continuar
            </p>
          </div>
        </div>
      )}

      {/* Continue Button */}
      <Button
        onClick={onContinue}
        disabled={!canContinue}
        className={cn(
          'w-full h-14 text-base font-semibold upload-button-transition',
          canContinue && 'bg-green-600 hover:bg-green-700 animate-scale-up'
        )}
        size="lg"
      >
        {hasActiveUploads
          ? 'Esperando subidas...'
          : canContinue
          ? 'Continuar con el análisis'
          : 'Sube al menos 1 foto para continuar'}
      </Button>
    </Card>
  );
}
