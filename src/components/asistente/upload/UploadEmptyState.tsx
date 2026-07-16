import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Camera, Video } from 'lucide-react';

interface UploadEmptyStateProps {
  onUploadPhotos: () => void;
  onUploadVideo: () => void;
}

export function UploadEmptyState({
  onUploadPhotos,
  onUploadVideo,
}: UploadEmptyStateProps) {
  return (
    <Card className="p-8 text-center space-y-6 bg-gradient-to-br from-gray-50 to-white animate-fade-in">
      {/* Icon */}
      <div className="flex justify-center">
        <div className="rounded-full bg-blue-100 p-6">
          <Camera className="h-12 w-12 text-blue-600" />
        </div>
      </div>

      {/* Title */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Sube fotos del problema
        </h3>
        <p className="text-sm text-muted-foreground">
          Para realizar un buen análisis, necesitamos imágenes del daño
        </p>
      </div>

      {/* Guidelines */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-left space-y-2">
        <p className="text-sm font-medium text-blue-900 mb-3">
          📸 Consejos para mejores fotos:
        </p>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-0.5">•</span>
            <span>Una foto <strong>general</strong> del área afectada</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-0.5">•</span>
            <span>Una foto de <strong>detalle</strong> del daño</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-0.5">•</span>
            <span>Mejor con <strong>luz natural</strong></span>
          </li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          onClick={onUploadPhotos}
          className="w-full h-14 text-base font-semibold bg-blue-600 hover:bg-blue-700"
          size="lg"
        >
          <Camera className="h-5 w-5 mr-2" />
          📷 Subir fotos
        </Button>

        <Button
          onClick={onUploadVideo}
          variant="outline"
          className="w-full h-14 text-base font-semibold"
          size="lg"
        >
          <Video className="h-5 w-5 mr-2" />
          🎥 Subir vídeo (opcional)
        </Button>
      </div>

      {/* Requirements */}
      <div className="pt-4 border-t space-y-1">
        <p className="text-xs text-muted-foreground">
          <strong>Mínimo:</strong> 1 foto
        </p>
        <p className="text-xs text-muted-foreground">
          <strong>Recomendado:</strong> 3-6 fotos para mejor análisis
        </p>
      </div>
    </Card>
  );
}
