import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PACKS, PackType } from '@/types/expediente';
import { CreditCard, Shield, AlertCircle, Loader2, Check } from 'lucide-react';
import { casaDiagAPI } from '@/services/api/casadiag-api';

interface PaymentModalProps {
  caseId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCompletePayment: (paymentIntentId: string) => Promise<void>;
}

export function PaymentModal({
  caseId,
  open,
  onOpenChange,
  onCompletePayment,
}: PaymentModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // NEW: Single pack only (informe_preliminar_remoto)
  const pack = PACKS[0]; // Only one pack available

  const handlePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      // Step 1: Confirm case data is ready for payment
      await casaDiagAPI.post(`/cases/${caseId}/confirm-data`, {});

      // Step 2: Get Stripe Payment Link from backend
      const response = await casaDiagAPI.createPaymentIntent(caseId, 'informe_preliminar_remoto');

      // Step 3: Redirect user to Stripe Payment Link
      // User will complete payment on Stripe's hosted page
      // Stripe webhook will notify backend when payment is complete
      if (response.paymentUrl) {
        window.location.href = response.paymentUrl;
      } else {
        throw new Error('No payment URL received from server');
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Error desconocido';
      console.error('Payment error:', e);
      setError('No se pudo iniciar el pago. Intenta de nuevo.');
      setLoading(false);
    }
    // Don't set loading to false here - we're redirecting
  };

  if (!pack) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Informe Preliminar Remoto</DialogTitle>
          <DialogDescription>
            Pre-informe técnico revisado por profesional cualificado
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Price Breakdown */}
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">Base</span>
              <span className="font-medium">90,00€</span>
            </div>
            <div className="flex justify-between mb-3 pb-3 border-b">
              <span className="text-sm text-muted-foreground">IVA (21%)</span>
              <span className="font-medium">18,90€</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-semibold">Total</span>
              <span className="text-2xl font-bold text-primary">108,90€</span>
            </div>
          </div>

          {/* What's Included */}
          <div className="space-y-2">
            <p className="text-sm font-semibold">Incluye:</p>
            <ul className="space-y-2">
              {pack.incluye.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Payment Info */}
          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3">
              <CreditCard className="mt-0.5 h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Pago directo seguro</p>
                <p className="text-sm text-muted-foreground">
                  Procesado mediante Stripe. Datos encriptados y seguros.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Shield className="mt-0.5 h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Revisión humana obligatoria</p>
                <p className="text-sm text-muted-foreground">
                  Un técnico cualificado revisará el pre-informe antes de enviarte el PDF final firmado
                </p>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Note */}
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:bg-blue-950 dark:border-blue-800">
            <p className="text-xs text-blue-800 dark:text-blue-200">
              💡 Después del pago podrás revisar y confirmar toda la información antes de que se genere el pre-informe.
            </p>
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button
            variant="cta"
            className="w-full"
            onClick={handlePayment}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Procesando pago...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                Pagar 108,90€
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
