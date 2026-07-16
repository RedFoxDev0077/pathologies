import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Expediente,
  ExpedienteState,
  PackType,
  Evidence,
  getStateChecklist,
} from '@/types/expediente';
import { Stepper } from './Stepper';
import { EvidenceUploader } from './EvidenceUploader';
import { PrediagnosticoBlock } from './PrediagnosticoBlock';
import { PacksSection } from './PacksSection';
import { PaymentModal } from './PaymentModal';
import { ResumenExpediente } from './ResumenExpediente';
import { S8AnalysisDisplay } from './S8AnalysisDisplay';
import { InformationConfirmation } from './InformationConfirmation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  CheckCircle2,
  Circle,
  ArrowRight,
  FileText,
  CreditCard,
  Clock,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExpedientePanelProps {
  expediente: Expediente;
  onUploadEvidence: (file: File) => Promise<Evidence>;
  onDeleteEvidence: (id: string) => void;
  onGeneratePrediagnostico?: () => void; // DEPRECATED - kept for compatibility
  onSelectPack: (packId: PackType) => void;
  onAuthorizePayment?: () => Promise<void>; // DEPRECATED
  onAdvanceState: () => void;
  // NEW: S0-S9 workflow handlers
  onCompletePayment: (paymentIntentId: string) => Promise<void>;
  onConfirmInformation: (confirmed: boolean, photos?: string[], notes?: string) => void;
  onGeneratePreReport?: () => Promise<void>;
  className?: string;
}

export function ExpedientePanel({
  expediente,
  onUploadEvidence,
  onDeleteEvidence,
  onGeneratePrediagnostico,
  onSelectPack,
  onAuthorizePayment,
  onAdvanceState,
  onCompletePayment,
  onConfirmInformation,
  onGeneratePreReport,
  className,
}: ExpedientePanelProps) {
  const navigate = useNavigate();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [activeTab, setActiveTab] = useState('estado');

  const { estado, evidencias, prediagnostico, packSeleccionado, resumen, s8_analysis, caseId } = expediente;
  const checklist = getStateChecklist(estado, expediente);

  // OLD workflow compatibility
  const canGeneratePrediagnostico =
    estado === ExpedienteState.S5_MATERIAL_GRAFICO &&
    evidencias.filter((e) => e.type === 'photo' && e.status === 'completed').length >= 1;

  // Check if S8 analysis is available to show Analysis tab
  const showAnalysisTab = estado === ExpedienteState.S8_ANALISIS_GRATUITO && !!s8_analysis;

  // Auto-switch to Analysis tab when S8 analysis becomes available
  useEffect(() => {
    if (showAnalysisTab && activeTab !== 'analisis') {
      setActiveTab('analisis');
    }
  }, [showAnalysisTab]);

  // NEW: PAYMENT_PENDING - Show waiting for payment
  if (estado === ExpedienteState.PAYMENT_PENDING) {
    return (
      <div className={cn('flex h-full flex-col items-center justify-center p-6', className)}>
        <div className="text-center max-w-md space-y-4">
          <CreditCard className="h-16 w-16 mx-auto text-primary" />
          <h3 className="text-xl font-bold">Pago pendiente</h3>
          <p className="text-muted-foreground">
            Completa el pago para continuar con el proceso y recibir tu informe técnico.
          </p>
          {caseId && (
            <Badge variant="outline" className="text-sm px-4 py-1">
              Expediente: {caseId}
            </Badge>
          )}
          <Button
            onClick={() => setShowPaymentModal(true)}
            className="mt-6"
            variant="cta"
            size="lg"
          >
            Completar pago (108,90€)
          </Button>
        </div>

        <PaymentModal
          caseId={expediente.id}
          open={showPaymentModal}
          onOpenChange={setShowPaymentModal}
          onCompletePayment={async (paymentIntentId) => {
            await onCompletePayment(paymentIntentId);
            setShowPaymentModal(false);
          }}
        />
      </div>
    );
  }

  // NEW: PAYMENT_COMPLETED - Show information confirmation
  if (estado === ExpedienteState.PAYMENT_COMPLETED) {
    return (
      <div className={cn('flex h-full flex-col overflow-y-auto', className)}>
        <InformationConfirmation
          expediente={expediente}
          onConfirm={onConfirmInformation}
          onUploadPhoto={() => {
            setActiveTab('evidencias');
          }}
        />
      </div>
    );
  }

  // NEW: INFO_CONFIRMATION / S9 - Show generating
  if (
    estado === ExpedienteState.INFO_CONFIRMATION ||
    estado === ExpedienteState.S9_GENERACION_PREINFORME
  ) {
    return (
      <div className={cn('flex h-full flex-col items-center justify-center p-6', className)}>
        <div className="text-center max-w-md space-y-4">
          <Loader2 className="h-16 w-16 animate-spin mx-auto text-primary" />
          <h3 className="text-xl font-bold">Pre-informe en proceso</h3>
          <p className="text-muted-foreground">
            Estamos generando tu pre-informe técnico. Será enviado al técnico para revisión.
          </p>
          {caseId && (
            <Badge variant="outline" className="text-base px-4 py-2">
              📋 Expediente: {caseId}
            </Badge>
          )}
          <div className="mt-6 flex items-center justify-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '150ms' }} />
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    );
  }

  // NEW: DRAFT_SENT_TO_TECHNICIAN - Waiting for technician review
  if (estado === ExpedienteState.DRAFT_SENT_TO_TECHNICIAN) {
    return (
      <div className={cn('flex h-full flex-col items-center justify-center p-6', className)}>
        <div className="text-center max-w-md space-y-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/30 to-orange-400/20 rounded-full blur-xl opacity-60 animate-pulse" />
            <Clock className="h-16 w-16 mx-auto text-amber-600 dark:text-amber-400 relative" />
          </div>
          <h3 className="text-xl font-bold">En revisión técnica</h3>
          <p className="text-muted-foreground leading-relaxed">
            Tu pre-informe ha sido enviado al técnico para revisión.
            Recibirás el informe final firmado en PDF por email próximamente.
          </p>
          {caseId && (
            <Badge variant="outline" className="text-base px-4 py-2">
              📋 Expediente: {caseId}
            </Badge>
          )}
          <div className="mt-6 p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground">
            El técnico revisará, completará y firmará el informe. Te notificaremos cuando esté listo.
          </div>
        </div>
      </div>
    );
  }

  // NEW: FINAL_SENT - Completed
  if (estado === ExpedienteState.FINAL_SENT) {
    return (
      <div className={cn('flex h-full flex-col items-center justify-center p-6', className)}>
        <div className="text-center max-w-md space-y-4">
          <div className="text-6xl mb-4">✅</div>
          <h3 className="text-2xl font-bold">Informe enviado</h3>
          <p className="text-muted-foreground leading-relaxed">
            Tu informe técnico final ha sido enviado por email.
            También puedes descargarlo desde tu panel de cliente.
          </p>
          {caseId && (
            <Badge variant="outline" className="text-base px-4 py-2">
              📋 Expediente: {caseId}
            </Badge>
          )}
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg dark:bg-green-950 dark:border-green-800">
            <p className="text-sm text-green-800 dark:text-green-200">
              <strong>✓ Proceso completado</strong><br />
              Revisa tu email para acceder al informe técnico final firmado.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // DEFAULT: Show existing UI for S0-S7 and old workflow states
  return (
    <div className={cn('flex h-full flex-col', className)}>
      {/* Header */}
      <div className="border-b border-border bg-background px-4 py-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Expediente</h2>
          {caseId ? (
            <Badge variant="outline" className="text-xs">
              {caseId}
            </Badge>
          ) : (
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
              {expediente.id.slice(0, 12)}...
            </span>
          )}
        </div>
        <Stepper currentState={estado} compact className="mt-3" />
      </div>

      {/* Content with tabs */}
      <div className="flex-1 overflow-hidden">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex h-full flex-col"
        >
          <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent px-4">
            <TabsTrigger value="estado" className="text-xs">
              Estado
            </TabsTrigger>
            <TabsTrigger value="evidencias" className="text-xs">
              Evidencias
            </TabsTrigger>
            <TabsTrigger value="resumen" className="text-xs">
              Resumen
            </TabsTrigger>
            {showAnalysisTab && (
              <TabsTrigger value="analisis" className="text-xs">
                Análisis
              </TabsTrigger>
            )}
          </TabsList>

          <div className="flex-1 overflow-y-auto">
            <TabsContent value="estado" className="m-0 h-full p-4">
              <div className="space-y-6">
                {/* Checklist */}
                <div>
                  <h4 className="mb-3 text-sm font-medium">Checklist actual</h4>
                  <div className="space-y-2">
                    {checklist.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-2 text-sm"
                      >
                        {item.completed ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        ) : (
                          <Circle className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span
                          className={cn(
                            item.completed
                              ? 'text-foreground'
                              : 'text-muted-foreground'
                          )}
                        >
                          {item.label}
                          {item.required && !item.completed && (
                            <span className="ml-1 text-destructive">*</span>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* OLD: Prediagnostico (for backward compatibility) */}
                {prediagnostico && (
                  <PrediagnosticoBlock prediagnostico={prediagnostico} />
                )}

                {/* OLD: Generate prediagnostico button (for backward compatibility) */}
                {canGeneratePrediagnostico && !prediagnostico && onGeneratePrediagnostico && (
                  <Button
                    variant="cta"
                    className="w-full"
                    onClick={onGeneratePrediagnostico}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Generar prediagnóstico
                  </Button>
                )}

                {/* Stepper full */}
                <div>
                  <h4 className="mb-3 text-sm font-medium">Progreso completo</h4>
                  <Stepper currentState={estado} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="evidencias" className="m-0 h-full p-4">
              <EvidenceUploader
                caseId={expediente.id}
                evidencias={evidencias}
                onUpload={onUploadEvidence}
                onDelete={onDeleteEvidence}
              />
            </TabsContent>

            <TabsContent value="resumen" className="m-0 h-full p-4">
              <ResumenExpediente resumen={resumen} />
            </TabsContent>

            {showAnalysisTab && s8_analysis && (
              <TabsContent value="analisis" className="m-0 h-full p-0">
                <div className="h-full overflow-y-auto">
                  <S8AnalysisDisplay
                    analysis={s8_analysis}
                    caseId={caseId || 'SIN-ID'}
                  />
                  <div className="p-6 pt-0">
                    <Button
                      onClick={() => navigate(`/informe-completo/${expediente.id}`)}
                      className="w-full"
                      variant="cta"
                      size="lg"
                    >
                      📋 Ver opciones de informe completo
                    </Button>
                    <p className="text-center text-sm font-medium text-foreground mt-2">
                      90€ + IVA (108,90€ total)
                    </p>
                    <p className="text-center text-xs text-muted-foreground mt-1">
                      Pre-informe técnico revisado por profesional
                    </p>
                  </div>
                </div>
              </TabsContent>
            )}
          </div>
        </Tabs>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        caseId={expediente.id}
        open={showPaymentModal}
        onOpenChange={setShowPaymentModal}
        onCompletePayment={async (paymentIntentId) => {
          await onCompletePayment(paymentIntentId);
          setShowPaymentModal(false);
        }}
      />

      {/* Disclaimer footer */}
      <div className="border-t border-border bg-muted/30 px-4 py-2">
        <p className="text-center text-xs text-muted-foreground">
          Revisión humana obligatoria antes del envío
        </p>
      </div>
    </div>
  );
}
