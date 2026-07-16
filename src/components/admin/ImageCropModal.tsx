import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { casaDiagAPI } from '@/services/api/casadiag-api';
import { toast } from '@/hooks/use-toast';
import { Upload, ZoomIn } from 'lucide-react';

interface Area { x: number; y: number; width: number; height: number; }

interface ImageCropModalProps {
  open: boolean;
  onClose: () => void;
  onUploaded: (url: string) => void;
  aspect?: number; // 16/9 for hero, 1200/630 for og
  title?: string;
}

async function getCroppedImage(imageSrc: string, pixelCrop: Area): Promise<Blob> {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.addEventListener('load', () => resolve(img));
    img.addEventListener('error', reject);
    img.src = imageSrc;
  });

  const canvas = document.createElement('canvas');
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext('2d')!;

  ctx.drawImage(
    image,
    pixelCrop.x, pixelCrop.y,
    pixelCrop.width, pixelCrop.height,
    0, 0,
    pixelCrop.width, pixelCrop.height,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Canvas toBlob failed'));
    }, 'image/jpeg', 0.92);
  });
}

export function ImageCropModal({ open, onClose, onUploaded, aspect = 16 / 9, title = 'Recortar imagen' }: ImageCropModalProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    setUploading(true);
    try {
      const blob = await getCroppedImage(imageSrc, croppedAreaPixels);
      const file = new File([blob], `landing-image-${Date.now()}.jpg`, { type: 'image/jpeg' });
      const result = await casaDiagAPI.uploadLandingImage(file, setUploadProgress);
      onUploaded(result.url);
      toast({ title: 'Imagen subida', description: 'La imagen se ha subido correctamente.' });
      handleClose();
    } catch (err: any) {
      toast({ title: 'Error al subir imagen', description: err.message, variant: 'destructive' });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleClose = () => {
    setImageSrc(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {!imageSrc ? (
          <div className="border-2 border-dashed border-border rounded-xl p-12 text-center">
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="crop-file-input" />
            <label htmlFor="crop-file-input" className="cursor-pointer flex flex-col items-center gap-3">
              <Upload className="w-10 h-10 text-muted-foreground" />
              <p className="font-medium text-foreground">Haz clic para seleccionar una imagen</p>
              <p className="text-sm text-muted-foreground">JPG, PNG, WebP — máximo 10MB</p>
            </label>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative w-full bg-black rounded-xl overflow-hidden" style={{ height: 320 }}>
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={aspect}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <div className="flex items-center gap-4">
              <ZoomIn className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <Label className="flex-shrink-0 text-sm">Zoom</Label>
              <Slider
                min={1}
                max={3}
                step={0.05}
                value={[zoom]}
                onValueChange={([v]) => setZoom(v)}
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground w-10">{zoom.toFixed(1)}x</span>
            </div>
            {uploading && (
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${uploadProgress}%` }} />
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={uploading}>Cancelar</Button>
          {imageSrc && (
            <Button onClick={handleUpload} disabled={uploading || !croppedAreaPixels}>
              {uploading ? `Subiendo... ${uploadProgress}%` : 'Recortar y subir'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
