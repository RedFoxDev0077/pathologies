import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { casaDiagAPI } from '@/services/api/casadiag-api';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

const fireGoogleAdsConversion = (transactionId: string) => {
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', 'conversion', {
    send_to: import.meta.env.VITE_GOOGLE_ADS_CONVERSION || '',
    value: 108.90,
    currency: 'EUR',
    transaction_id: transactionId,
  });
};

/**
 * Payment Success Page
 *
 * Shown after successful Stripe payment redirect.
 * Stripe redirects to: /asistente/pago-exitoso?session_id={CHECKOUT_SESSION_ID}
 *
 * This page:
 * 1. Waits a moment for webhook to process
 * 2. Attempts to find the case that was just paid
 * 3. Redirects to the case's S10 confirmation screen
 */
export default function PagoExitoso() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [caseId, setCaseId] = useState<string | null>(null);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const findCase = async () => {
      try {
        // Wait 2 seconds for webhook to process
        await new Promise(resolve => setTimeout(resolve, 2000));

        if (!sessionId) {
          setStatus('error');
          return;
        }

        // Try to verify the session and get case details
        // The webhook should have already updated the case to S10
        try {
          const response = await casaDiagAPI.get(`/payments/verify-session/${sessionId}`);

          if (response.caseId) {
            setCaseId(response.caseId);
            setStatus('success');
            fireGoogleAdsConversion(sessionId);

            // Redirect to case page after 2 seconds
            setTimeout(() => {
              navigate(`/asistente/expediente/${response.caseId}?payment_success=true`);
            }, 2000);
          } else {
            setStatus('error');
          }
        } catch (error) {
          // If verify endpoint doesn't exist or fails, just show success
          // User can navigate to their cases manually
          setStatus('success');
          fireGoogleAdsConversion(sessionId);
        }
      } catch (error) {
        console.error('Error finding case:', error);
        setStatus('error');
      }
    };

    findCase();
  }, [sessionId, navigate]);

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Card className="max-w-md p-8 text-center space-y-6">
          <div className="flex justify-center">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-2">Procesando pago...</h1>
            <p className="text-muted-foreground">
              Estamos confirmando tu pago. Por favor espera un momento.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Card className="max-w-md p-8 text-center space-y-6">
          <div className="flex justify-center">
            <div className="rounded-full bg-green-100 p-4">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-green-600 mb-2">
              ¡Pago completado!
            </h1>
            <p className="text-muted-foreground">
              Tu pago ha sido procesado correctamente.
            </p>
            {caseId && (
              <p className="text-sm text-muted-foreground mt-2">
                Redirigiendo a tu expediente...
              </p>
            )}
          </div>
          <div className="space-y-2">
            {caseId ? (
              <Button asChild className="w-full">
                <Link to={`/asistente/expediente/${caseId}?payment_success=true`}>
                  Ver detalles del informe
                </Link>
              </Button>
            ) : (
              <Button asChild className="w-full">
                <Link to="/asistente">
                  Ir a mis casos
                </Link>
              </Button>
            )}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="max-w-md p-8 text-center space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-yellow-100 p-4">
            <AlertCircle className="h-16 w-16 text-yellow-600" />
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-bold mb-2">Pago recibido</h1>
          <p className="text-muted-foreground">
            Hemos recibido tu pago. Puedes acceder a tu expediente desde la lista de casos.
          </p>
        </div>
        <Button asChild className="w-full">
          <Link to="/asistente">
            Ir a mis casos
          </Link>
        </Button>
      </Card>
    </div>
  );
}
