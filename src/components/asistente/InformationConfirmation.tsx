import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Expediente } from '@/types/expediente';
import { Upload, CheckCircle2, ArrowLeft } from 'lucide-react';

interface InformationConfirmationProps {
  expediente: Expediente;
  onConfirm: (confirmed: boolean, additionalPhotos?: string[], additionalNotes?: string) => void;
  onUploadPhoto: () => void;
}

export function InformationConfirmation({
  expediente,
  onConfirm,
  onUploadPhoto
}: InformationConfirmationProps) {
  const [additionalNotes, setAdditionalNotes] = useState('');

  const handleConfirm = () => {
    onConfirm(true, undefined, additionalNotes || undefined);
  };

  const handleGoBack = () => {
    onConfirm(false);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="text-center">
        <Badge variant="outline" className="mb-4 text-sm px-4 py-1">
          Expediente: {expediente.caseId}
        </Badge>
        <h2 className="text-2xl font-bold">Confirmación de información</h2>
        <p className="text-muted-foreground mt-2">
          Revisa la información proporcionada antes de generar el pre-informe
        </p>
      </div>

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Resumen de tu caso</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-3 text-sm">
            {expediente.resumen.s1_localizacion && (
              <div className="flex justify-between py-2 border-b">
                <dt className="font-medium text-muted-foreground">Localización:</dt>
                <dd className="font-semibold capitalize">{expediente.resumen.s1_localizacion}</dd>
              </div>
            )}

            {expediente.resumen.s2_tipo_dano && (
              <div className="flex justify-between py-2 border-b">
                <dt className="font-medium text-muted-foreground">Tipo de daño:</dt>
                <dd className="font-semibold capitalize">{expediente.resumen.s2_tipo_dano}</dd>
              </div>
            )}

            {expediente.resumen.s3_antiguedad && (
              <div className="flex justify-between py-2 border-b">
                <dt className="font-medium text-muted-foreground">Antigüedad:</dt>
                <dd className="font-semibold capitalize">{expediente.resumen.s3_antiguedad}</dd>
              </div>
            )}

            {expediente.resumen.s4_evolucion && (
              <div className="flex justify-between py-2 border-b">
                <dt className="font-medium text-muted-foreground">Evolución:</dt>
                <dd className="font-semibold capitalize">{expediente.resumen.s4_evolucion}</dd>
              </div>
            )}

            {expediente.resumen.s6_contexto && (
              <div className="py-2 border-b">
                <dt className="font-medium text-muted-foreground mb-1">Contexto:</dt>
                <dd className="text-sm">{expediente.resumen.s6_contexto}</dd>
              </div>
            )}

            {expediente.resumen.s7_descripcion && (
              <div className="py-2 border-b">
                <dt className="font-medium text-muted-foreground mb-1">Descripción:</dt>
                <dd className="text-sm">{expediente.resumen.s7_descripcion}</dd>
              </div>
            )}

            <div className="flex justify-between py-2">
              <dt className="font-medium text-muted-foreground">Fotos adjuntas:</dt>
              <dd className="font-semibold">
                {expediente.evidencias.filter(e => e.type === 'photo').length} 📸
              </dd>
            </div>

            {expediente.evidencias.filter(e => e.type === 'video').length > 0 && (
              <div className="flex justify-between py-2">
                <dt className="font-medium text-muted-foreground">Vídeos adjuntos:</dt>
                <dd className="font-semibold">
                  {expediente.evidencias.filter(e => e.type === 'video').length} 🎥
                </dd>
              </div>
            )}
          </dl>
        </CardContent>
      </Card>

      {/* Option to add more photos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">¿Deseas añadir más material?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Si tienes fotos o vídeos adicionales que puedan ayudar al técnico en su análisis, puedes subirlos ahora.
          </p>
          <Button variant="outline" onClick={onUploadPhoto} className="w-full">
            <Upload className="mr-2 h-4 w-4" />
            Subir fotos o vídeos adicionales
          </Button>
        </CardContent>
      </Card>

      {/* Additional notes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Notas adicionales (opcional)</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Agrega cualquier información adicional que creas relevante para el técnico..."
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            rows={4}
            className="resize-none"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Ej: Horarios en que se agrava el problema, olores detectados, ruidos, etc.
          </p>
        </CardContent>
      </Card>

      {/* Info box */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:bg-blue-950 dark:border-blue-800">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          💡 <strong>¿Qué sucede después?</strong> Al confirmar, se generará automáticamente un pre-informe técnico que será enviado a un profesional cualificado para su revisión. Recibirás el informe final firmado en PDF por email.
        </p>
      </div>

      {/* Confirmation buttons */}
      <div className="flex gap-4">
        <Button
          variant="outline"
          className="flex-1"
          onClick={handleGoBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Modificar información
        </Button>
        <Button
          variant="cta"
          className="flex-1"
          onClick={handleConfirm}
        >
          <CheckCircle2 className="mr-2 h-4 w-4" />
          Confirmar y generar
        </Button>
      </div>
    </div>
  );
}
