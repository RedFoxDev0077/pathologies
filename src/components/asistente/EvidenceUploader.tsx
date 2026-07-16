import { useState, useRef, useCallback, useEffect } from 'react';
import { Evidence } from '@/types/expediente';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { casaDiagAPI } from '@/services/api/casadiag-api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Upload,
  Image,
  Video,
  File,
  X,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface EvidenceUploaderProps {
  caseId: string;
  evidencias: Evidence[];
  onUpload: (file: File) => Promise<Evidence>;
  onDelete: (id: string) => void;
  className?: string;
}

const MAX_PHOTOS = 10;
const MAX_VIDEOS = 2;
const MAX_VIDEO_SIZE_MB = 200;
const ALLOWED_VIDEO_FORMATS = ['video/mp4', 'video/quicktime', 'video/mov'];
const ALLOWED_IMAGE_FORMATS = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];

export function EvidenceUploader({
  caseId,
  evidencias,
  onUpload,
  onDelete,
  className,
}: EvidenceUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewEvidence, setPreviewEvidence] = useState<Evidence | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [evidenceWithFreshUrls, setEvidenceWithFreshUrls] = useState<Evidence[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch fresh presigned URLs for thumbnails when component mounts or evidence changes
  useEffect(() => {
    const fetchFreshUrls = async () => {
      if (!caseId || evidencias.length === 0) {
        setEvidenceWithFreshUrls(evidencias);
        return;
      }

      try {
        console.log('🔄 Fetching fresh URLs for thumbnails...');
        const freshEvidence = await casaDiagAPI.getEvidence(caseId);

        if (!freshEvidence || freshEvidence.length === 0) {
          console.warn('⚠️ No fresh evidence returned, using current URLs');
          setEvidenceWithFreshUrls(evidencias);
          return;
        }

        // Map fresh URLs to current evidence
        const updatedEvidence = evidencias.map((currentEvidence) => {
          // Try to find matching evidence with fresh URL
          const freshMatch = freshEvidence.find(
            (fresh: any) =>
              fresh.id === currentEvidence.id ||
              fresh.filename === currentEvidence.name
          );

          if (freshMatch && freshMatch.storageUrl) {
            console.log('✅ Updated thumbnail URL for:', currentEvidence.name);
            return {
              ...currentEvidence,
              url: freshMatch.storageUrl,
            };
          }

          return currentEvidence;
        });

        setEvidenceWithFreshUrls(updatedEvidence);
      } catch (err) {
        console.error('❌ Failed to fetch fresh URLs for thumbnails:', err);
        setEvidenceWithFreshUrls(evidencias);
      }
    };

    fetchFreshUrls();
  }, [caseId, evidencias]);

  // Use evidence with fresh URLs for display
  const displayEvidence = evidenceWithFreshUrls.length > 0 ? evidenceWithFreshUrls : evidencias;

  const photosCount = displayEvidence.filter((e) => e.type === 'photo').length;
  const videosCount = displayEvidence.filter((e) => e.type === 'video').length;
  const totalVideoSize = displayEvidence
    .filter((e) => e.type === 'video')
    .reduce((acc, e) => acc + e.size, 0);

  const validateFile = useCallback((file: File): string | null => {
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    if (isImage) {
      if (photosCount >= MAX_PHOTOS) {
        return `Máximo ${MAX_PHOTOS} fotos permitidas`;
      }
      if (!ALLOWED_IMAGE_FORMATS.some((f) => file.type.includes(f.split('/')[1]))) {
        return 'Formato de imagen no soportado. Usa JPG, PNG o WebP';
      }
    }

    if (isVideo) {
      if (videosCount >= MAX_VIDEOS) {
        return `Máximo ${MAX_VIDEOS} vídeos permitidos`;
      }
      if (!ALLOWED_VIDEO_FORMATS.includes(file.type)) {
        return 'Formato de vídeo no soportado. Usa MP4 o MOV';
      }
      if ((totalVideoSize + file.size) / (1024 * 1024) > MAX_VIDEO_SIZE_MB) {
        return `Tamaño total de vídeos excede ${MAX_VIDEO_SIZE_MB}MB`;
      }
    }

    if (!isImage && !isVideo) {
      return 'Solo se permiten imágenes y vídeos';
    }

    return null;
  }, [photosCount, videosCount, totalVideoSize]);

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      setError(null);

      for (const file of Array.from(files)) {
        const validationError = validateFile(file);
        if (validationError) {
          setError(validationError);
          continue;
        }

        try {
          await onUpload(file);
        } catch (e) {
          const errorMessage = e instanceof Error ? e.message : 'Error desconocido';
          console.warn('File upload failed:', errorMessage);
          setError('Error al subir el archivo. Por favor, inténtalo de nuevo.');
        }
      }
    },
    [onUpload, validateFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handlePreview = useCallback(
    async (evidenceId: string) => {
      setIsLoadingPreview(true);
      setError(null);

      // Find the evidence in current list (use displayEvidence for fresh URLs)
      const currentEvidence = displayEvidence.find((e) => e.id === evidenceId);

      if (!currentEvidence) {
        setError('Evidencia no encontrada');
        setIsLoadingPreview(false);
        return;
      }

      console.log('🔍 Attempting to preview evidence:', {
        id: evidenceId,
        name: currentEvidence.name,
        currentUrl: currentEvidence.url
      });

      try {
        // Fetch all evidence with fresh presigned URLs from backend
        const freshEvidence = await casaDiagAPI.getEvidence(caseId);
        console.log('📋 Received evidence list from backend:', freshEvidence);

        // Check if backend returned any evidence
        if (!freshEvidence || freshEvidence.length === 0) {
          console.error('⚠️ Backend returned empty evidence list - this is a backend data issue');
          console.warn('⚠️ Evidence uploaded to R2 but not saved to database');
          console.log('⚠️ Falling back to current URL (may be expired)');

          // Show preview with current URL (may be expired, but let user see what happens)
          setPreviewEvidence(currentEvidence);
          setError('Advertencia: El enlace de la imagen puede haber expirado. Los datos no se guardaron correctamente en el servidor.');
          setIsLoadingPreview(false);
          return;
        }

        // Try multiple matching strategies to find the correct evidence
        let matchedEvidence = null;

        // Strategy 1: Match by exact ID
        matchedEvidence = freshEvidence.find((e: any) => e.id === evidenceId);
        if (matchedEvidence) {
          console.log('✅ Matched by ID:', matchedEvidence);
        }

        // Strategy 2: Match by filename (if ID didn't work)
        if (!matchedEvidence) {
          matchedEvidence = freshEvidence.find((e: any) => e.filename === currentEvidence.name);
          if (matchedEvidence) {
            console.log('✅ Matched by filename:', matchedEvidence);
          }
        }

        // Strategy 3: Match by URL path (extract filename from URL and match)
        if (!matchedEvidence && currentEvidence.url) {
          const urlFilename = currentEvidence.url.split('/').pop()?.split('?')[0];
          matchedEvidence = freshEvidence.find((e: any) => {
            const evidenceFilename = e.storageUrl?.split('/').pop()?.split('?')[0];
            return evidenceFilename === urlFilename;
          });
          if (matchedEvidence) {
            console.log('✅ Matched by URL filename:', matchedEvidence);
          }
        }

        if (matchedEvidence && matchedEvidence.storageUrl) {
          console.log('✅ Using fresh presigned URL:', matchedEvidence.storageUrl);
          setPreviewEvidence({
            id: currentEvidence.id,
            type: currentEvidence.type,
            name: currentEvidence.name,
            size: currentEvidence.size,
            url: matchedEvidence.storageUrl,
            status: 'completed',
            validated: true,
          });
        } else {
          console.error('❌ No matching evidence found with valid storageUrl');
          console.log('Available evidence:', freshEvidence.map((e: any) => ({
            id: e.id,
            filename: e.filename,
            hasUrl: !!e.storageUrl
          })));
          console.log('⚠️ Falling back to current URL (may be expired)');
          setPreviewEvidence(currentEvidence);
          setError('Advertencia: No se encontró la evidencia en el servidor. El enlace puede estar expirado.');
        }
      } catch (err) {
        console.error('❌ Failed to fetch fresh evidence:', err);
        console.log('⚠️ Falling back to current URL due to API error');
        setPreviewEvidence(currentEvidence);
        setError('Error al cargar desde el servidor. Mostrando versión en caché (puede estar expirada).');
      } finally {
        setIsLoadingPreview(false);
      }
    },
    [caseId, displayEvidence]
  );

  return (
    <div className={cn('space-y-4', className)}>
      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          'rounded-lg border-2 border-dashed p-6 text-center transition-colors',
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-muted-foreground/50'
        )}
      >
        <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
        <p className="mt-2 text-sm font-medium">
          Arrastra archivos aquí o{' '}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-primary underline-offset-2 hover:underline"
          >
            selecciona
          </button>
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Fotos (JPG, PNG) o vídeos (MP4, MOV)
        </p>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/mp4,video/quicktime"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="hidden"
        />
      </div>

      {/* Limits */}
      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Image className="h-3.5 w-3.5" />
          <span>
            Fotos: {photosCount}/{MAX_PHOTOS}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Video className="h-3.5 w-3.5" />
          <span>
            Vídeos: {videosCount}/{MAX_VIDEOS}
          </span>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Evidence list */}
      {displayEvidence.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Archivos subidos</h4>
          <div className="space-y-2">
            {displayEvidence.map((evidence) => (
              <EvidenceItem
                key={evidence.id}
                evidence={evidence}
                onDelete={() => onDelete(evidence.id)}
                onPreview={() => handlePreview(evidence.id)}
                isLoadingPreview={isLoadingPreview}
              />
            ))}
          </div>
        </div>
      )}

      {/* Note */}
      <p className="text-xs text-muted-foreground">
        Los enlaces de acceso son temporales (seguridad)
      </p>

      {/* Preview Dialog */}
      <Dialog open={!!previewEvidence} onOpenChange={(open) => !open && setPreviewEvidence(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          {previewEvidence && (
            <>
              <DialogHeader>
                <DialogTitle>{previewEvidence.name}</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                {previewEvidence.type === 'photo' && previewEvidence.url ? (
                  <div className="relative">
                    <img
                      src={previewEvidence.url}
                      alt={previewEvidence.name}
                      className="w-full h-auto rounded-lg"
                      onLoad={() => console.log('✅ Image loaded successfully')}
                      onError={(e) => {
                        console.error('❌ Image failed to load:', previewEvidence.url);
                        const imgElement = e.currentTarget;
                        imgElement.style.display = 'none';
                        const errorDiv = imgElement.nextElementSibling;
                        if (errorDiv && errorDiv.classList.contains('error-placeholder')) {
                          errorDiv.style.display = 'flex';
                        }
                      }}
                    />
                    <div
                      className="error-placeholder hidden w-full h-64 bg-destructive/10 rounded-lg flex items-center justify-center text-center p-4"
                      style={{ display: 'none' }}
                    >
                      <div>
                        <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-2" />
                        <p className="text-destructive font-medium">Error al cargar la imagen</p>
                        <p className="text-sm text-muted-foreground mt-1">El enlace puede haber expirado</p>
                      </div>
                    </div>
                  </div>
                ) : previewEvidence.type === 'photo' && !previewEvidence.url ? (
                  <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground">No hay URL disponible</p>
                  </div>
                ) : null}

                {previewEvidence.type === 'video' && previewEvidence.url && (
                  <video
                    src={previewEvidence.url}
                    controls
                    className="w-full h-auto rounded-lg"
                    onLoadedData={() => console.log('✅ Video loaded successfully')}
                    onError={(e) => {
                      console.error('❌ Video failed to load:', previewEvidence.url);
                    }}
                  />
                )}

                <div className="text-sm text-muted-foreground">
                  <p>Tamaño: {(previewEvidence.size / (1024 * 1024)).toFixed(2)} MB</p>
                  <p>Tipo: {previewEvidence.type === 'photo' ? 'Foto' : 'Vídeo'}</p>
                  {previewEvidence.url && (
                    <p className="text-xs break-all mt-2">URL: {previewEvidence.url}</p>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function EvidenceItem({
  evidence,
  onDelete,
  onPreview,
  isLoadingPreview,
}: {
  evidence: Evidence;
  onDelete: () => void;
  onPreview: () => void;
  isLoadingPreview?: boolean;
}) {
  const Icon = evidence.type === 'photo' ? Image : evidence.type === 'video' ? Video : File;

  return (
    <div className="rounded-lg border border-border bg-background p-3">
      <div className="flex items-start gap-3">
        {/* Thumbnail */}
        <div
          className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded bg-muted cursor-pointer hover:opacity-80 transition-opacity"
          onClick={onPreview}
        >
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
              <Icon className="h-5 w-5 text-muted-foreground" />
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

            {/* Status Icon & Delete Button */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {evidence.status === 'uploading' && (
                <div className="flex items-center gap-1.5 text-blue-600">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-xs font-medium">Subiendo...</span>
                </div>
              )}
              {evidence.status === 'validating' && (
                <div className="flex items-center gap-1.5 text-yellow-600">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-xs font-medium">Verificando...</span>
                </div>
              )}
              {evidence.status === 'completed' && evidence.validated && (
                <div className="flex items-center gap-1.5 text-green-600">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-xs font-medium">Verificado</span>
                </div>
              )}
              {evidence.status === 'error' && (
                <div className="flex items-center gap-1.5 text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-xs font-medium">Error</span>
                </div>
              )}

              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                onClick={onDelete}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Progress Bar (uploading only) */}
          {evidence.status === 'uploading' && evidence.uploadProgress !== undefined && (
            <div className="mt-2">
              <Progress value={evidence.uploadProgress} className="h-1.5" />
              <p className="mt-1 text-xs text-muted-foreground text-right">
                {evidence.uploadProgress}%
              </p>
            </div>
          )}

          {/* Validation Error */}
          {evidence.status === 'error' && evidence.validationError && (
            <div className="mt-2 flex items-start gap-1.5 rounded-md bg-destructive/10 px-2 py-1.5">
              <AlertCircle className="h-3.5 w-3.5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-xs text-destructive">{evidence.validationError}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
