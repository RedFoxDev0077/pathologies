import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useExpediente } from '@/hooks/useExpediente';
import { useAuth } from '@/contexts/AuthContext';
import { ChatPanel } from '@/components/asistente/ChatPanel';
import { ExpedientePanel } from '@/components/asistente/ExpedientePanel';
import { S8AnalysisDisplay } from '@/components/asistente/S8AnalysisDisplay';
import { MobileTabBar, MobileTab } from '@/components/asistente/MobileTabBar';
import { S9ConfirmationPayment } from '@/components/asistente/S9ConfirmationPayment';
import { S10PostPaymentConfirmation } from '@/components/asistente/S10PostPaymentConfirmation';
import { AuthCheckpoint } from '@/components/asistente/AuthCheckpoint';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { ExpedienteState } from '@/types/expediente';
import { getPaymentLink, confirmCaseData } from '@/services/stripe';

// Static S0 Welcome Messages (not stored in database)
// These are displayed as UI elements based on user profile
const S0_WELCOME_MESSAGES = {
  particular: `Hola, soy tu asistente de análisis de patologías en viviendas.

Voy a ayudarte a entender qué puede estar pasando en tu casa a partir de unas preguntas sencillas y, si puedes, algunas fotos o un vídeo.

No necesitas conocimientos técnicos. Si alguna pregunta no la sabes responder, no pasa nada.

Empezamos cuando quieras.`,

  abogado: `Hola, soy el asistente técnico para el análisis preliminar de patologías constructivas.

Te ayudaré a recopilar y estructurar información técnica objetiva para una primera valoración del caso.

El análisis es orientativo y no sustituye un informe pericial.

Cuando quieras, comenzamos.`,

  administrador: `Hola, soy el asistente técnico para el análisis preliminar de patologías en edificios y comunidades.

Te ayudaré a identificar el tipo de daño, su posible origen y el nivel de urgencia para facilitar la gestión del inmueble.

El análisis es orientativo y se basa en la información que facilites.

Empezamos cuando quieras.`
};

export default function AsistenteExpediente() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [mobileTab, setMobileTab] = useState<MobileTab>('chat');
  const [hasSeenAnalysis, setHasSeenAnalysis] = useState(false);
  const [authCompleted, setAuthCompleted] = useState(false);

  const { isAuthenticated } = useAuth();

  // If Stripe redirected here with a session ID instead of a case ID,
  // forward to the proper payment-success page
  useEffect(() => {
    if (id && id.startsWith('cs_')) {
      navigate(`/asistente/pago-exitoso?session_id=${id}`, { replace: true });
    }
  }, [id, navigate]);

  const {
    expediente,
    loading,
    sending,
    error,
    sendMessage,
    uploadEvidence,
    deleteEvidence,
    generatePrediagnostico,
    selectPack,
    authorizePayment,
    advanceState,
    // NEW: S0-S9 workflow methods
    completePayment,
    confirmInformation,
    generatePreReport,
  } = useExpediente(id);

  // Handle payment success from Stripe redirect
  const paymentSuccess = searchParams.get('payment_success');

  // Auto-switch to analysis tab when S8 analysis is generated (mobile only)
  useEffect(() => {
    if (expediente?.estado === ExpedienteState.S8_ANALISIS_GRATUITO && expediente?.s8_analysis && !hasSeenAnalysis) {
      setMobileTab('analysis');
      setHasSeenAnalysis(true);
    }
  }, [expediente?.estado, expediente?.s8_analysis, hasSeenAnalysis]);

  const handleAuthorizePayment = async () => {
    try {
      await authorizePayment();
      navigate('/asistente/confirmacion');
    } catch (error) {
      toast.error('Error al autorizar el pago. Por favor, inténtalo de nuevo.');
    }
  };

  const handleProceedToPayment = async () => {
    if (!expediente || !id) return;

    try {
      setPaymentLoading(true);

      // Confirm case data first
      await confirmCaseData(id);

      // Get Stripe Payment Link (simpler than Checkout Session)
      const paymentLink = await getPaymentLink(id);

      // Redirect directly to Stripe Payment Link
      // The link includes client_reference_id with the caseId
      // Stripe will redirect back to success/cancel URLs configured in the Dashboard
      window.location.href = paymentLink.url;
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('No se pudo iniciar el proceso de pago. Por favor, inténtalo de nuevo.');
      setPaymentLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !expediente) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <p className="text-muted-foreground">{error || 'Expediente no encontrado'}</p>
        <Button variant="outline" className="mt-4" asChild>
          <Link to="/asistente">Volver al inicio</Link>
        </Button>
      </div>
    );
  }

  // Show S10 confirmation if payment succeeded or state is S10
  const showS10 = paymentSuccess === 'true' || expediente.estado === ExpedienteState.S10_PAGO_COMPLETADO;

  // Show S9 if user clicked "Solicitar informe completo" button
  const showS9 = expediente.estado === ExpedienteState.S9_CONFIRMACION_PAGO;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background">
        <div className="container flex h-14 items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
              <span className="text-xs font-bold text-primary-foreground">DT</span>
            </div>
            <span className="font-semibold text-sm">Diagnóstico Técnico</span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex flex-1 overflow-hidden">
        {showS10 ? (
          /* S10: Post-payment confirmation */
          <div className="flex-1 overflow-y-auto">
            <S10PostPaymentConfirmation expediente={expediente} />
          </div>
        ) : showS9 ? (
          /* S9: Confirmation and payment — requires authentication first */
          <div className="flex-1 overflow-y-auto">
            {!isAuthenticated && !authCompleted ? (
              <AuthCheckpoint
                caseId={id!}
                onAuthComplete={() => setAuthCompleted(true)}
              />
            ) : (
              <S9ConfirmationPayment
                expediente={expediente}
                onProceedToPayment={handleProceedToPayment}
                loading={paymentLoading}
              />
            )}
          </div>
        ) : (
          <>
            {/* Desktop layout: Side by side */}
            <div className="hidden lg:flex lg:w-full">
              {/* Chat - Left side on desktop */}
              <div className="flex flex-1 flex-col lg:w-1/2 lg:border-r lg:border-border">
                <ChatPanel
                  messages={expediente.messages}
                  estado={expediente.estado}
                  perfil={expediente.perfil}
                  evidencias={expediente.evidencias}
                  sending={sending}
                  welcomeMessage={S0_WELCOME_MESSAGES[expediente.perfil]}
                  onSendMessage={sendMessage}
                  onAttachFile={() => fileInputRef.current?.click()}
                  className="h-full"
                />
              </div>

              {/* Expediente Panel - Right side on desktop */}
              <div className="flex lg:w-1/2 lg:flex-col">
                <ExpedientePanel
                  expediente={expediente}
                  onUploadEvidence={uploadEvidence}
                  onDeleteEvidence={deleteEvidence}
                  onGeneratePrediagnostico={generatePrediagnostico}
                  onSelectPack={selectPack}
                  onAuthorizePayment={handleAuthorizePayment}
                  onAdvanceState={advanceState}
                  // NEW: S0-S9 workflow handlers
                  onCompletePayment={completePayment}
                  onConfirmInformation={confirmInformation}
                  onGeneratePreReport={generatePreReport}
                  className="h-full"
                />
              </div>
            </div>

            {/* Mobile layout: Tabs */}
            <div className="flex lg:hidden flex-col w-full">
              {/* Mobile Tab Bar */}
              <MobileTabBar
                activeTab={mobileTab}
                onTabChange={setMobileTab}
                showAnalysisTab={expediente.estado === ExpedienteState.S8_ANALISIS_GRATUITO && !!expediente.s8_analysis}
                hasNewAnalysis={!hasSeenAnalysis && expediente.estado === ExpedienteState.S8_ANALISIS_GRATUITO && !!expediente.s8_analysis}
              />

              {/* Mobile Tab Content */}
              <div className="flex-1 overflow-hidden">
                {mobileTab === 'chat' && (
                  <ChatPanel
                    messages={expediente.messages}
                    estado={expediente.estado}
                    perfil={expediente.perfil}
                    evidencias={expediente.evidencias}
                    sending={sending}
                    welcomeMessage={S0_WELCOME_MESSAGES[expediente.perfil]}
                    onSendMessage={sendMessage}
                    onAttachFile={() => fileInputRef.current?.click()}
                    className="h-full"
                  />
                )}

                {mobileTab === 'evidence' && (
                  <ExpedientePanel
                    expediente={expediente}
                    onUploadEvidence={uploadEvidence}
                    onDeleteEvidence={deleteEvidence}
                    onGeneratePrediagnostico={generatePrediagnostico}
                    onSelectPack={selectPack}
                    onAuthorizePayment={handleAuthorizePayment}
                    onAdvanceState={advanceState}
                    onCompletePayment={completePayment}
                    onConfirmInformation={confirmInformation}
                    onGeneratePreReport={generatePreReport}
                    className="h-full"
                  />
                )}

                {mobileTab === 'analysis' && expediente.s8_analysis && (
                  <div className="h-full overflow-y-auto">
                    <S8AnalysisDisplay
                      analysis={expediente.s8_analysis}
                      caseId={expediente.caseId || 'SIN-ID'}
                      expedienteId={id}
                    />
                    <div className="p-4 space-y-2">
                      <Button
                        onClick={() => {
                          // Navigate to pricing/info page
                          navigate(`/informe-completo/${id}`);
                        }}
                        variant="cta"
                        size="lg"
                        className="w-full"
                      >
                        📋 Ver opciones de informe completo
                      </Button>
                      <p className="text-center text-sm font-medium text-foreground">
                        90€ + IVA (108,90€ total)
                      </p>
                      <p className="text-center text-xs text-muted-foreground">
                        Pre-informe técnico revisado por profesional
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>

      {/* Hidden file input */}
      {!showS9 && !showS10 && (
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/mp4,video/quicktime"
          onChange={async (e) => {
            if (e.target.files) {
              const files = Array.from(e.target.files);
              for (const file of files) {
                try {
                  await uploadEvidence(file);
                } catch (err) {
                  console.error('Failed to upload file:', err);
                }
              }
              // Reset input so the same file can be uploaded again if needed
              e.target.value = '';
            }
          }}
          className="hidden"
        />
      )}
    </div>
  );
}
