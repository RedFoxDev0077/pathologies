import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AuthCheckpoint } from '@/components/asistente/AuthCheckpoint';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Check, Clock, FileText, Shield, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { casaDiagAPI } from '@/services/api/casadiag-api';

export default function InformeCompleto() {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [showAuthCheckpoint, setShowAuthCheckpoint] = useState(false);
  const [caseData, setCaseData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Lock body scroll when modal is open to prevent double scrollbar
  useEffect(() => {
    if (showAuthCheckpoint) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [showAuthCheckpoint]);

  // Load case data
  useEffect(() => {
    const loadCase = async () => {
      if (!caseId) return;
      try {
        const response = await casaDiagAPI.get(`/cases/${caseId}`);
        setCaseData(response.data);
      } catch (error) {
        console.error('Error loading case:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCase();
  }, [caseId]);

  const handleSolicitarInforme = () => {
    // Always show AuthCheckpoint to collect case data (DNI, address, phone)
    // even for already-authenticated users — required for the informe
    setShowAuthCheckpoint(true);
  };

  const proceedToPayment = async () => {
    if (!caseId) return;

    try {
      setLoading(true);

      // Confirm case data
      await casaDiagAPI.post(`/cases/${caseId}/confirm-data`, {});

      // Create payment intent and get Stripe URL
      const response = await casaDiagAPI.createPaymentIntent(caseId, 'informe_preliminar_remoto');

      if (response.paymentUrl) {
        // Redirect to Stripe
        window.location.href = response.paymentUrl;
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      alert('Error al iniciar el pago. Por favor, inténtalo de nuevo.');
      setLoading(false);
    }
  };

  const handleAuthComplete = () => {
    setShowAuthCheckpoint(false);
    proceedToPayment();
  };

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Informe Técnico Completo
        </h1>
        <p className="text-muted-foreground">
          Revisado por profesional cualificado
        </p>
      </div>

      {/* S8 Analysis Status */}
      <Card className="mb-6 bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Check className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
            <div>
              <p className="font-semibold text-green-900 dark:text-green-100">
                ✅ Tu Análisis Gratuito S8 está listo
              </p>
              <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                Expediente: {caseData?.caseId || caseId}
                {caseData?.s8_analysis?.evaluacion_riesgo && (
                  <> • Riesgo: {caseData.s8_analysis.evaluacion_riesgo.nivel}</>
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Offer Card */}
      <Card className="mb-8 shadow-lg">
        <CardHeader className="bg-primary/5">
          <CardTitle className="text-2xl">Informe Preliminar Remoto</CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Revisión humana por técnico cualificado
          </p>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* What's Included */}
          <div>
            <h3 className="font-semibold mb-4 text-lg">¿Qué incluye?</h3>
            <div className="grid gap-3">
              {[
                'Revisión humana de tu análisis por técnico cualificado',
                'Informe técnico profesional en formato PDF',
                'Recomendaciones específicas para tu caso',
                'Valoración de urgencia y prioridades',
                'Orientación sobre siguientes pasos',
                'Entrega garantizada en 24-48 horas laborables',
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-6 border border-primary/20">
            <div className="flex justify-between mb-3 text-base">
              <span className="text-muted-foreground">Base</span>
              <span className="font-medium">90,00 €</span>
            </div>
            <div className="flex justify-between mb-4 pb-4 border-b border-primary/20">
              <span className="text-muted-foreground">IVA (21%)</span>
              <span className="font-medium">18,90 €</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xl font-semibold">TOTAL</span>
              <span className="text-4xl font-bold text-primary">108,90 €</span>
            </div>
          </div>

          {/* CTA Button */}
          <Button
            size="lg"
            className="w-full text-lg py-6"
            onClick={handleSolicitarInforme}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                Solicitar Informe Completo
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Pago seguro procesado por Stripe • Garantía de devolución
          </p>
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Preguntas Frecuentes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="border-l-4 border-primary pl-4">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              ¿Cuándo recibiré mi informe?
            </h4>
            <p className="text-sm text-muted-foreground">
              En 24-48 horas laborables. Lo recibirás por email y podrás descargarlo desde tu Dashboard en cualquier momento.
            </p>
          </div>

          <div className="border-l-4 border-primary pl-4">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              ¿Quién revisa mi caso?
            </h4>
            <p className="text-sm text-muted-foreground">
              Técnicos cualificados con experiencia en patologías constructivas y análisis de edificaciones.
            </p>
          </div>

          <div className="border-l-4 border-primary pl-4">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              ¿Puedo descargar el informe después?
            </h4>
            <p className="text-sm text-muted-foreground">
              Sí, el informe queda guardado permanentemente en tu Dashboard y puedes descargarlo cuantas veces quieras.
            </p>
          </div>

          <div className="border-l-4 border-primary pl-4">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              ¿Qué pasa después del pago?
            </h4>
            <p className="text-sm text-muted-foreground">
              1. Nuestro equipo técnico revisa tu caso en detalle<br />
              2. Generan un informe profesional personalizado<br />
              3. Lo envían a tu email y lo publican en tu Dashboard<br />
              4. Puedes descargarlo y consultarlo cuando quieras
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Important Note */}
      <Alert className="mb-6">
        <AlertDescription className="text-sm">
          ⚠️ <strong>Importante:</strong> Este informe es orientativo y no sustituye una inspección presencial ni un informe pericial oficial. Para casos que requieran valoración legal, recomendamos consultar con un perito certificado.
        </AlertDescription>
      </Alert>

      {/* Back Link */}
      <div className="mt-6 text-center">
        <Button
          variant="ghost"
          onClick={() => navigate(`/asistente-expediente/${caseId}`)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al análisis gratuito
        </Button>
      </div>

      {/* Auth Checkpoint — full-screen overlay so user sees it immediately */}
      {showAuthCheckpoint && (
        <div className="fixed inset-0 bg-black/60 z-50 overflow-y-auto">
          <div className="flex min-h-full items-start justify-center p-4 py-8">
            <div className="w-full max-w-lg">
              <AuthCheckpoint
                caseId={caseId || ''}
                userEmail={caseData?.email}
                onAuthComplete={handleAuthComplete}
                onCancel={() => setShowAuthCheckpoint(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
