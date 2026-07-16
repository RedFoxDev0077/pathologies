import { useState } from 'react';
import { Expediente } from '@/types/expediente';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface S9ConfirmationPaymentProps {
  expediente: Expediente;
  onProceedToPayment: () => void;
  loading?: boolean;
}

export function S9ConfirmationPayment({
  expediente,
  onProceedToPayment,
  loading = false,
}: S9ConfirmationPaymentProps) {
  const [confirmed, setConfirmed] = useState(false);

  // Count photos and check for video
  const photoCount = expediente.evidencias.filter(
    (e) => e.type === 'photo' && e.status === 'completed'
  ).length;
  const hasVideo = expediente.evidencias.some(
    (e) => e.type === 'video' && e.status === 'completed'
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-6">
      {/* BLOQUE 1 — Resumen del caso (solo lectura) */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Resumen del caso analizado</h2>
        <div className="space-y-3 text-sm">
          <div className="flex">
            <span className="font-medium w-48">Elemento afectado:</span>
            <span className="text-muted-foreground">
              {expediente.resumen.s1_localizacion || 'No especificado'}
            </span>
          </div>
          <div className="flex">
            <span className="font-medium w-48">Tipo de daño:</span>
            <span className="text-muted-foreground">
              {expediente.resumen.s2_tipo_dano || 'No especificado'}
            </span>
          </div>
          <div className="flex">
            <span className="font-medium w-48">Antigüedad aproximada:</span>
            <span className="text-muted-foreground">
              {expediente.resumen.s3_antiguedad || 'No especificado'}
            </span>
          </div>
          <div className="flex">
            <span className="font-medium w-48">Evolución:</span>
            <span className="text-muted-foreground">
              {expediente.resumen.s4_evolucion || 'No especificado'}
            </span>
          </div>
          <div className="flex">
            <span className="font-medium w-48">Material aportado:</span>
            <span className="text-muted-foreground">
              {photoCount} {photoCount === 1 ? 'foto' : 'fotos'}
              {hasVideo && ' + vídeo'}
            </span>
          </div>
        </div>
      </Card>

      {/* BLOQUE 2 — Confirmación expresa del usuario (OBLIGATORIO) */}
      <Card className="p-6 border-2 border-orange-200 bg-orange-50/50">
        <div className="flex items-start gap-3">
          <Checkbox
            id="confirm-data"
            checked={confirmed}
            onCheckedChange={(checked) => setConfirmed(checked as boolean)}
            className="mt-1"
          />
          <label
            htmlFor="confirm-data"
            className="text-sm leading-relaxed cursor-pointer select-none"
          >
            Confirmo que la información, imágenes y vídeos aportados representan
            fielmente el estado actual del daño y autorizo su uso para la elaboración
            de un informe técnico preliminar remoto.
          </label>
        </div>
      </Card>

      {/* BLOQUE 3 — Qué incluye el informe (claridad total) */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">
          ¿Qué incluye el informe técnico preliminar remoto?
        </h2>

        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">
              El informe técnico preliminar remoto incluye:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Análisis técnico orientativo del daño descrito</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Formulación de hipótesis técnicas</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Valoración de riesgos y nivel de urgencia</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Recomendaciones técnicas orientativas</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Conclusiones claras y paso técnico recomendado</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t space-y-2 text-sm">
            <p className="font-medium">El informe:</p>
            <ul className="space-y-1 text-muted-foreground ml-4">
              <li className="flex items-start gap-2">
                <span className="text-orange-600">•</span>
                <span>Se realiza sin visita presencial</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600">•</span>
                <span>No tiene carácter pericial</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600">•</span>
                <span>Está revisado y firmado por un técnico competente</span>
              </li>
            </ul>
          </div>

          <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-lg mt-4">
            <Clock className="h-5 w-5 text-blue-600 flex-shrink-0" />
            <p className="text-sm font-medium text-blue-900">
              Plazo de entrega: máximo 24 horas desde la confirmación del pago y de la información.
            </p>
          </div>
        </div>
      </Card>

      {/* BLOQUE 4 — Precio y pago (Stripe) */}
      <Card className="p-6 bg-gradient-to-br from-orange-50 to-white border-2 border-orange-200">
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Precio del informe:</p>
            <p className="text-3xl font-bold text-orange-600">90 € + IVA</p>
            <p className="text-xs text-muted-foreground mt-1">
              (El IVA se gestiona automáticamente según configuración)
            </p>
          </div>

          <Button
            onClick={onProceedToPayment}
            disabled={!confirmed || loading}
            className="w-full h-12 text-base font-semibold"
            size="lg"
          >
            {loading ? 'Procesando...' : 'Solicitar informe técnico preliminar'}
          </Button>

          {!confirmed && (
            <div className="flex items-start gap-2 text-sm text-orange-600">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <p>Debes confirmar la información antes de proceder al pago</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
