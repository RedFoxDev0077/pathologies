import { Expediente } from '@/types/expediente';
import { Card } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

interface S10PostPaymentConfirmationProps {
  expediente: Expediente;
}

export function S10PostPaymentConfirmation({
  expediente,
}: S10PostPaymentConfirmationProps) {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="p-8 text-center space-y-6">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="rounded-full bg-green-100 p-4">
            <CheckCircle className="h-16 w-16 text-green-600" />
          </div>
        </div>

        {/* Title */}
        <div>
          <h1 className="text-2xl font-bold text-green-600 mb-2">
            ✅ Solicitud recibida correctamente
          </h1>
        </div>

        {/* Main Message */}
        <div className="space-y-4 text-left">
          <p className="text-base leading-relaxed text-muted-foreground">
            Hemos recibido correctamente tu solicitud y el pago del informe técnico
            preliminar remoto.
          </p>

          <p className="text-base leading-relaxed text-muted-foreground">
            El informe se elaborará a partir de la información que nos has facilitado
            y se enviará por correo electrónico en un plazo máximo de 24 horas.
          </p>

          {/* Case Reference */}
          <div className="bg-gray-50 p-4 rounded-lg border">
            <p className="text-sm text-muted-foreground mb-1">
              Referencia de tu caso:
            </p>
            <p className="text-lg font-mono font-semibold text-gray-900">
              {expediente.caseId || expediente.id}
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="pt-6 border-t">
          <p className="text-sm text-muted-foreground">
            Si tienes alguna duda, guarda esta referencia para futuras consultas.
          </p>
        </div>
      </Card>
    </div>
  );
}
