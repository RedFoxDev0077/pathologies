import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Expediente,
  ExpedienteState,
  UserProfile,
  Message,
  Evidence,
  Prediagnostico,
  PackType,
  canAdvanceToState,
} from '@/types/expediente';
import { casaDiagAPI } from '@/services/api/casadiag-api';
import { toast } from '@/hooks/use-toast';
import {
  createExpediente,
  getExpediente,
  saveExpediente,
  addMessage,
  addEvidence,
  updateEvidenceStatus,
  removeEvidence,
  generateMessageId,
} from '@/lib/expediente-storage';

// Track blob URLs for cleanup to prevent memory leaks
const blobUrlRegistry = new Map<string, string>();

// Revoke a blob URL and remove it from registry
const revokeBlobUrl = (evidenceId: string): void => {
  const url = blobUrlRegistry.get(evidenceId);
  if (url) {
    URL.revokeObjectURL(url);
    blobUrlRegistry.delete(evidenceId);
  }
};

// Register a blob URL for later cleanup
const registerBlobUrl = (evidenceId: string, url: string): void => {
  blobUrlRegistry.set(evidenceId, url);
};

interface UseExpedienteReturn {
  expediente: Expediente | null;
  loading: boolean;
  sending: boolean; // NEW: AI is thinking/processing
  error: string | null;
  // Actions
  initExpediente: (perfil: UserProfile) => Promise<Expediente>;
  loadExpediente: (id: string) => void;
  sendMessage: (content: string, attachments?: string[]) => Promise<void>;
  uploadEvidence: (file: File) => Promise<Evidence>;
  deleteEvidence: (evidenceId: string) => void;
  updateResumen: (resumen: Partial<Expediente['resumen']>) => void;
  advanceState: () => boolean;
  selectPack: (packId: PackType) => void;
  // NEW: Updated payment flow
  completePayment: (paymentIntentId: string) => Promise<void>;
  // NEW: Information confirmation
  confirmInformation: (confirmed: boolean, additional_photos?: string[], additional_notes?: string) => Promise<void>;
  // NEW: Generate pre-report
  generatePreReport: () => Promise<void>;
  // DEPRECATED: Old methods (keep for compatibility)
  authorizePayment?: () => Promise<void>;
  generatePrediagnostico?: () => Promise<void>;
}

// Helper to map backend Case state to frontend ExpedienteState (NEW S0-S9 workflow)
const mapBackendState = (backendState: string): ExpedienteState => {
  const stateMapping: Record<string, ExpedienteState> = {
    'S0_INTRODUCCION': ExpedienteState.S0_INTRODUCCION,
    'S1_LOCALIZACION': ExpedienteState.S1_LOCALIZACION,
    'S2_TIPO_DANO': ExpedienteState.S2_TIPO_DANO,
    'S3_ANTIGUEDAD': ExpedienteState.S3_ANTIGUEDAD,
    'S4_EVOLUCION': ExpedienteState.S4_EVOLUCION,
    'S5_MATERIAL_GRAFICO': ExpedienteState.S5_MATERIAL_GRAFICO,
    'S6_CONTEXTO': ExpedienteState.S6_CONTEXTO,
    'S7_DESCRIPCION_LIBRE': ExpedienteState.S7_DESCRIPCION_LIBRE,
    'S7B_PREGUNTAS_TECNICAS': ExpedienteState.S7B_PREGUNTAS_TECNICAS,
    'S8_ANALISIS_GRATUITO': ExpedienteState.S8_ANALISIS_GRATUITO,
    'PAYMENT_PENDING': ExpedienteState.PAYMENT_PENDING,
    'PAYMENT_COMPLETED': ExpedienteState.PAYMENT_COMPLETED,
    'INFO_CONFIRMATION': ExpedienteState.INFO_CONFIRMATION,
    'S9_GENERACION_PREINFORME': ExpedienteState.S9_GENERACION_PREINFORME,
    'DRAFT_SENT_TO_TECHNICIAN': ExpedienteState.DRAFT_SENT_TO_TECHNICIAN,
    'FINAL_SENT': ExpedienteState.FINAL_SENT,
  };
  return stateMapping[backendState] || ExpedienteState.S0_INTRODUCCION;
};

// Helper to sync backend case data to frontend Expediente (NEW S0-S9 workflow)
const syncBackendToFrontend = (backendCase: any, currentExpediente?: Expediente): Expediente => {
  const base: Expediente = currentExpediente || {
    id: backendCase.id,
    caseId: backendCase.caseId, // NEW: MCV-2026-000001
    perfil: backendCase.userProfile as UserProfile,
    estado: mapBackendState(backendCase.currentState),
    messages: [],
    evidencias: [],
    resumen: {
      descripcionUsuario: backendCase.fullName || '',
      ubicacion: backendCase.propertyAddress || '',
      tipoPatologia: '',
      antiguedad: '',
      // NEW: S1-S7 structured data
      s1_localizacion: backendCase.s1_localizacion,
      s2_tipo_dano: backendCase.s2_tipo_dano,
      s3_antiguedad: backendCase.s3_antiguedad,
      s4_evolucion: backendCase.s4_evolucion,
      s5_fotos: backendCase.s5_fotos,
      s5_video: backendCase.s5_video,
      s6_contexto: backendCase.s6_contexto,
      s7_descripcion: backendCase.s7_descripcion,
    },
    consentimientoRGPD: true,
    createdAt: new Date(backendCase.createdAt),
    updatedAt: new Date(backendCase.updatedAt || backendCase.createdAt),
  };

  // Update resumen from backend data
  if (backendCase.fullName) {
    base.resumen.descripcionUsuario = backendCase.fullName;
  }
  if (backendCase.propertyAddress) {
    base.resumen.ubicacion = backendCase.propertyAddress;
  }

  // Map S8 analysis if available (NEW)
  console.log('[syncBackendToFrontend] Backend case state:', backendCase.currentState);
  console.log('[syncBackendToFrontend] Backend s8_analisis exists:', !!backendCase.s8_analisis);
  if (backendCase.s8_analisis) {
    console.log('[syncBackendToFrontend] Mapping s8_analisis to frontend');
    base.s8_analysis = backendCase.s8_analisis;
  } else {
    console.warn('[syncBackendToFrontend] s8_analisis is MISSING from backend response!');
  }

  // Map OLD diagnosis format for backward compatibility
  if (backendCase.diagnosisJson) {
    const diag = backendCase.diagnosisJson;
    base.prediagnostico = {
      hipotesis: diag.hipotesisPrincipales?.map((h: any) => h.descripcion) || [],
      posiblesCausas: diag.hipotesisPrincipales?.[0]?.causasProbables || [],
      proximosPasos: diag.siguientesPasos || [],
      riesgoPercibido: diag.nivelRiesgo || 'bajo',
    };
  }

  // Map payment data (NEW)
  if (backendCase.payment) {
    base.payment = {
      id: backendCase.payment.id,
      expedienteId: backendCase.id,
      packId: backendCase.payment.packId,
      status: backendCase.payment.status,
      baseAmount: backendCase.payment.baseAmount,
      vatRate: backendCase.payment.vatRate,
      totalAmount: backendCase.payment.totalAmount,
      completedAt: backendCase.payment.capturedAt ? new Date(backendCase.payment.capturedAt) : undefined,
    };
  }

  // Map info confirmation fields (NEW)
  base.infoConfirmed = backendCase.info_confirmed;
  base.additionalPhotos = backendCase.additional_photos;
  base.additionalNotes = backendCase.additional_notes;

  return base;
};

export const useExpediente = (expedienteId?: string): UseExpedienteReturn => {
  const [expediente, setExpediente] = useState<Expediente | null>(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadExpediente = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      // ALWAYS load from backend to get latest messages
      // localStorage is only used for offline fallback
      const backendCase = await casaDiagAPI.getCase(id);

      const exp = syncBackendToFrontend(backendCase);

      // Add messages from backendCase.messages with deduplication
      // Filter out S0_WELCOME messages (handled as static UI element)
      const messageMap = new Map<string, any>();

      (backendCase.messages || []).forEach((msg: any) => {
        // Skip S0 welcome messages - they're shown as static UI
        if (msg.openaiMessageId === 'S0_WELCOME') {
          console.log('[loadExpediente] Skipping S0 welcome message from backend');
          return;
        }

        // Deduplicate by message ID
        if (msg.id && !messageMap.has(msg.id)) {
          messageMap.set(msg.id, {
            id: msg.id,
            role: msg.role,
            content: msg.content,
            timestamp: new Date(msg.createdAt),
            attachments: msg.attachments || [],
          });
        }
      });

      // Convert to array and sort by timestamp
      exp.messages = Array.from(messageMap.values())
        .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

      // Add evidence from backendCase.evidence
      exp.evidencias = (backendCase.evidence || []).map((ev: any) => ({
        id: ev.id,
        type: ev.type,
        name: ev.filename,
        size: ev.sizeBytes,
        mimeType: ev.mimeType,
        url: ev.storageUrl,
        status: 'completed' as const,
        uploadedAt: new Date(ev.uploadedAt),
        visionAnalysis: ev.visionAnalysis,
      }));

      // Save to localStorage for future use
      saveExpediente(exp);
      setExpediente(exp);
    } catch (e) {
      console.error('Error loading expediente:', e);
      // Try localStorage as fallback if backend fails
      const localExp = getExpediente(id);
      if (localExp) {
        console.log('Using localStorage fallback');
        setExpediente(localExp);
      } else {
        setError('Expediente no encontrado');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Load expediente on mount or when ID changes
  useEffect(() => {
    if (expedienteId) {
      loadExpediente(expedienteId);
    }
  }, [expedienteId, loadExpediente]);

  const initExpediente = useCallback(async (perfil: UserProfile): Promise<Expediente> => {
    setLoading(true);
    setError(null);

    try {
      // Call backend API to create case
      const backendCase = await casaDiagAPI.createCase(perfil);

      // Sync to frontend format
      const exp = syncBackendToFrontend(backendCase);

      // Save to localStorage for offline support
      saveExpediente(exp);
      setExpediente(exp);

      return exp;
    } catch (err: any) {
      console.error('Failed to create case:', err);
      const errorMsg = err.message || 'Error al crear el expediente';
      setError(errorMsg);

      toast({
        title: "Modo sin conexión",
        description: "No se pudo conectar al servidor. Trabajando en modo local.",
        variant: "default",
      });

      // Fallback to local-only mode
      const localExp = createExpediente(perfil);
      setExpediente(localExp);
      return localExp;
    } finally {
      setLoading(false);
    }
  }, []);

  const sendMessage = useCallback(async (content: string, attachments?: string[]) => {
    if (!expediente) return;

    // Special handling for "Solicitar informe completo" button
    if (content === 'Solicitar informe completo') {
      const updatedExp = getExpediente(expediente.id);
      if (updatedExp) {
        updatedExp.estado = ExpedienteState.S9_CONFIRMACION_PAGO;
        saveExpediente(updatedExp);
        setExpediente(updatedExp);
      }
      return;
    }

    // CRITICAL: Phase 4 guard - Block progression from S5 without validated photos
    if (expediente.estado === ExpedienteState.S5_MATERIAL_GRAFICO) {
      try {
        const readyCheck = await casaDiagAPI.checkEvidenceReady(expediente.id);

        if (!readyCheck.minRequirementMet) {
          toast({
            title: "Fotos requeridas",
            description: "Debes subir al menos 1 foto verificada antes de continuar",
            variant: "destructive",
          });
          return; // Block the message from being sent
        }
      } catch (err) {
        console.error('Failed to check evidence ready:', err);

        // Fallback: check local state
        const validatedPhotos = expediente.evidencias.filter(
          e => e.type === 'photo' && e.status === 'completed' && e.validated
        );

        if (validatedPhotos.length === 0) {
          toast({
            title: "Fotos requeridas",
            description: "Debes subir al menos 1 foto verificada antes de continuar",
            variant: "destructive",
          });
          return;
        }
      }
    }

    // Add user message locally first
    const userMsg = addMessage(expediente.id, {
      role: 'user',
      content,
      attachments,
    });

    setExpediente(getExpediente(expediente.id));
    setSending(true); // Show AI thinking spinner

    try {
      // Send to backend API
      const response = await casaDiagAPI.sendMessage(expediente.id, content);

      // Backend returns { userMessage, assistantMessage }
      // Add assistant response to local storage
      if (response.assistantMessage) {
        addMessage(expediente.id, {
          role: 'assistant',
          content: response.assistantMessage.content,
        });
      }

      // Update state from backend if provided
      if (response.currentState) {
        console.log('[useExpediente] Backend returned currentState:', response.currentState);
        const updatedExp = getExpediente(expediente.id);
        if (updatedExp) {
          const mappedState = mapBackendState(response.currentState);
          console.log('[useExpediente] Mapped estado:', mappedState);
          updatedExp.estado = mappedState;

          // Update S8 analysis if available in response
          if (response.stateData?.s8_analisis) {
            updatedExp.s8_analysis = response.stateData.s8_analisis;
          }

          // Update S1-S7 values in resumen from stateData
          if (response.stateData) {
            if (response.stateData.s1_localizacion !== undefined) {
              updatedExp.resumen.s1_localizacion = response.stateData.s1_localizacion;
            }
            if (response.stateData.s2_tipo_dano !== undefined) {
              updatedExp.resumen.s2_tipo_dano = response.stateData.s2_tipo_dano;
            }
            if (response.stateData.s3_antiguedad !== undefined) {
              updatedExp.resumen.s3_antiguedad = response.stateData.s3_antiguedad;
            }
            if (response.stateData.s4_evolucion !== undefined) {
              updatedExp.resumen.s4_evolucion = response.stateData.s4_evolucion;
            }
            if (response.stateData.s6_contexto !== undefined) {
              updatedExp.resumen.s6_contexto = response.stateData.s6_contexto;
            }
            if (response.stateData.s7_descripcion !== undefined) {
              updatedExp.resumen.s7_descripcion = response.stateData.s7_descripcion;
            }
            console.log('[useExpediente] Updated resumen with S1-S7 values from backend');
          }

          saveExpediente(updatedExp);
          console.log('[useExpediente] Saved expediente with estado:', updatedExp.estado);
        }
      } else {
        console.warn('[useExpediente] No currentState in response!');
      }

      // CRITICAL: Always fetch LATEST expediente and update React state
      const finalExp = getExpediente(expediente.id);
      if (finalExp) {
        console.log('[useExpediente] Setting React state with estado:', finalExp.estado);
        setExpediente(finalExp);
      }

      // OPTIMIZED: If we just moved to S8 state, merge S8 data from response
      // Only reload if S8 data is missing from the response
      if (response.currentState === 'S8_ANALISIS_GRATUITO') {
        console.log('[useExpediente] Detected S8 transition, merging S8 data...');

        const updatedExp = getExpediente(expediente.id);
        if (updatedExp && response.stateData?.s8_analisis) {
          // Merge S8 analysis data without full reload
          updatedExp.s8_analysis = response.stateData.s8_analisis;
          updatedExp.estado = ExpedienteState.S8_ANALISIS_GRATUITO;
          updatedExp.caseId = response.stateData.caseId || updatedExp.caseId;

          saveExpediente(updatedExp);
          setExpediente(updatedExp);

          console.log('[useExpediente] S8 data merged successfully without reload');
        } else {
          // Fallback: only reload if S8 data is missing from response
          console.warn('[useExpediente] S8 data missing from response, falling back to reload...');
          try {
            await loadExpediente(expediente.id);
            console.log('[useExpediente] Case reloaded successfully after S8 transition');
          } catch (reloadError) {
            console.error('[useExpediente] Failed to reload case after S8 transition:', reloadError);
            // Fallback: try to use response data
            setExpediente(getExpediente(expediente.id));
          }
        }
      }
      // Note: setExpediente is now called immediately after estado update (line 367)
      // No need to call it again here
    } catch (err: any) {
      console.error('Failed to send message to backend:', err);
      const errorMsg = err.message || 'Error al enviar el mensaje';
      setError(errorMsg);

      // Check if it's a 404 error (case doesn't exist in backend)
      const is404 = err.response?.status === 404 || err.message?.includes('404');

      if (is404) {
        toast({
          title: "Modo local",
          description: "Este caso fue creado antes de la integración. Solo funciona en modo local sin IA.",
          variant: "default",
        });

        // Add a mock response for local-only cases
        addMessage(expediente.id, {
          role: 'assistant',
          content: 'Este expediente fue creado en modo local. Para usar el asistente con IA, por favor crea un nuevo expediente desde la página principal.',
        });
      } else {
        toast({
          title: "Error al enviar mensaje",
          description: "No se pudo enviar el mensaje. Por favor, verifica tu conexión.",
          variant: "destructive",
        });

        // Remove user message on failure for non-404 errors
        const exp = getExpediente(expediente.id);
        if (exp) {
          exp.messages = exp.messages.filter(m => m.id !== userMsg.id);
          saveExpediente(exp);
        }
      }

      setExpediente(getExpediente(expediente.id));
    } finally {
      setSending(false); // Hide AI thinking spinner
    }
  }, [expediente]);

  const uploadEvidence = useCallback(async (file: File): Promise<Evidence> => {
    if (!expediente) throw new Error('No expediente loaded');

    const type: Evidence['type'] = file.type.startsWith('image/')
      ? 'photo'
      : file.type.startsWith('video/')
        ? 'video'
        : file.type.startsWith('audio/')
          ? 'audio'
          : 'document';

    const evidence = addEvidence(expediente.id, {
      type,
      name: file.name,
      size: file.size,
      mimeType: file.type,
      status: 'uploading',
      uploadProgress: 0,
    });

    setExpediente(getExpediente(expediente.id));

    try {
      // Upload to backend API with progress tracking (Phase 3)
      const backendEvidence = await casaDiagAPI.uploadEvidence(
        expediente.id,
        file,
        type,
        (progress) => {
          // Update upload progress in real-time
          const exp = getExpediente(expediente.id);
          if (exp) {
            const evidenceIndex = exp.evidencias.findIndex(e => e.id === evidence.id);
            if (evidenceIndex !== -1) {
              exp.evidencias[evidenceIndex].uploadProgress = progress;
              saveExpediente(exp);
              setExpediente(getExpediente(expediente.id));
            }
          }
        }
      );

      // Update to validating state (Phase 3)
      const exp = getExpediente(expediente.id);
      if (exp) {
        const evidenceIndex = exp.evidencias.findIndex(e => e.id === evidence.id);
        if (evidenceIndex !== -1) {
          exp.evidencias[evidenceIndex].status = 'validating';
          exp.evidencias[evidenceIndex].uploadProgress = 100;
          exp.evidencias[evidenceIndex].url = backendEvidence.storageUrl;
          if (backendEvidence.visionAnalysis) {
            exp.evidencias[evidenceIndex].visionAnalysis = backendEvidence.visionAnalysis;
          }
          saveExpediente(exp);
          setExpediente(getExpediente(expediente.id));
        }
      }

      // Show validating toast (type-specific)
      const validatingMessages = {
        photo: { title: "Verificando foto...", description: "Comprobando que la foto sea accesible" },
        video: { title: "Verificando vídeo...", description: "Comprobando que el vídeo sea accesible" },
        audio: { title: "Verificando audio...", description: "Comprobando que el audio sea accesible" },
        document: { title: "Verificando documento...", description: "Comprobando que el documento sea accesible" },
      };

      const validatingMessage = validatingMessages[type] || validatingMessages.document;

      toast({
        title: validatingMessage.title,
        description: validatingMessage.description,
        variant: "default",
      });

      // Call validation endpoint (Phase 3)
      try {
        const validationResult = await casaDiagAPI.validateEvidence(
          expediente.id,
          backendEvidence.id
        );

        const updatedExp = getExpediente(expediente.id);
        if (updatedExp) {
          const evidenceIndex = updatedExp.evidencias.findIndex(e => e.id === evidence.id);
          if (evidenceIndex !== -1) {
            if (validationResult.validated) {
              // Validation succeeded
              updatedExp.evidencias[evidenceIndex].status = 'completed';
              updatedExp.evidencias[evidenceIndex].validated = true;
              updatedExp.evidencias[evidenceIndex].validationError = undefined;

              // Type-specific success messages
              const successMessages = {
                photo: {
                  title: "✅ Foto subida correctamente",
                  description: "La foto ha sido verificada y está lista para el análisis.",
                },
                video: {
                  title: "✅ Vídeo subido correctamente",
                  description: "El vídeo ha sido verificado y está listo para el análisis.",
                },
                audio: {
                  title: "✅ Audio subido correctamente",
                  description: "El audio ha sido verificado y está listo para el análisis.",
                },
                document: {
                  title: "✅ Documento subido correctamente",
                  description: "El documento ha sido verificado y está listo para el análisis.",
                },
              };

              const message = successMessages[type] || successMessages.document;

              toast({
                title: message.title,
                description: message.description,
                variant: "default",
              });
            } else {
              // Validation failed
              updatedExp.evidencias[evidenceIndex].status = 'error';
              updatedExp.evidencias[evidenceIndex].validated = false;
              updatedExp.evidencias[evidenceIndex].validationError =
                validationResult.error || 'Error al verificar el archivo';

              toast({
                title: "Error al verificar archivo",
                description: validationResult.error || 'No se pudo verificar que el archivo sea accesible',
                variant: "destructive",
              });
            }
            saveExpediente(updatedExp);
            setExpediente(getExpediente(expediente.id));
          }
        }

        return {
          ...evidence,
          status: validationResult.validated ? 'completed' : 'error',
          url: backendEvidence.storageUrl,
          validated: validationResult.validated,
        };
      } catch (validationErr) {
        console.error('Validation failed:', validationErr);

        // Mark as error if validation endpoint fails
        const updatedExp = getExpediente(expediente.id);
        if (updatedExp) {
          const evidenceIndex = updatedExp.evidencias.findIndex(e => e.id === evidence.id);
          if (evidenceIndex !== -1) {
            updatedExp.evidencias[evidenceIndex].status = 'error';
            updatedExp.evidencias[evidenceIndex].validated = false;
            updatedExp.evidencias[evidenceIndex].validationError = 'Error al validar el archivo';
            saveExpediente(updatedExp);
            setExpediente(getExpediente(expediente.id));
          }
        }

        toast({
          title: "Error en la validación",
          description: "No se pudo verificar el archivo. Intenta subirlo de nuevo.",
          variant: "destructive",
        });

        return { ...evidence, status: 'error', url: backendEvidence.storageUrl };
      }
    } catch (err: any) {
      console.error('Failed to upload evidence:', err);

      // Update to error state
      const exp = getExpediente(expediente.id);
      if (exp) {
        const evidenceIndex = exp.evidencias.findIndex(e => e.id === evidence.id);
        if (evidenceIndex !== -1) {
          exp.evidencias[evidenceIndex].status = 'error';
          exp.evidencias[evidenceIndex].validationError = err.message || 'Error al subir archivo';
          saveExpediente(exp);
          setExpediente(getExpediente(expediente.id));
        }
      }

      toast({
        title: "Error al subir archivo",
        description: err.message || "No se pudo subir el archivo. Intenta de nuevo.",
        variant: "destructive",
      });

      // Fallback to local blob URL (no validation)
      const url = URL.createObjectURL(file);
      registerBlobUrl(evidence.id, url);

      return { ...evidence, status: 'error', url };
    }
  }, [expediente]);

  const deleteEvidence = useCallback((evidenceId: string) => {
    if (!expediente) return;
    // Revoke blob URL to prevent memory leak
    revokeBlobUrl(evidenceId);
    removeEvidence(expediente.id, evidenceId);
    setExpediente(getExpediente(expediente.id));
  }, [expediente]);

  const updateResumen = useCallback((resumen: Partial<Expediente['resumen']>) => {
    if (!expediente) return;
    expediente.resumen = { ...expediente.resumen, ...resumen };
    saveExpediente(expediente);
    setExpediente(getExpediente(expediente.id));
  }, [expediente]);

  const generatePrediagnostico = useCallback(async () => {
    if (!expediente) return;

    setLoading(true);
    setError(null);

    try {
      // Call backend API to generate diagnosis
      const response = await casaDiagAPI.generateDiagnosis(expediente.id);

      // Map backend diagnosis to frontend format
      if (response.diagnosisJson) {
        const diag = response.diagnosisJson;
        const prediagnostico: Prediagnostico = {
          hipotesis: diag.hipotesisPrincipales?.map((h: any) => h.descripcion) || [],
          posiblesCausas: diag.hipotesisPrincipales?.[0]?.causasProbables || [],
          proximosPasos: diag.siguientesPasos || [],
          riesgoPercibido: diag.nivelRiesgo || 'bajo',
        };

        const exp = getExpediente(expediente.id);
        if (exp) {
          exp.prediagnostico = prediagnostico;
          exp.estado = ExpedienteState.S3_PREDIAGNOSTICO;
          saveExpediente(exp);

          // Add assistant message
          addMessage(exp.id, {
            role: 'assistant',
            content: `He generado el prediagnóstico preliminar basándome en la información y evidencias proporcionadas. Puedes verlo en el panel de la derecha.

Recuerda que esta es una orientación preliminar que no sustituye una inspección presencial cuando sea necesaria.

Si deseas un informe técnico revisado por un profesional, puedes seleccionar uno de los packs disponibles en el siguiente paso.`,
          });

          setExpediente(getExpediente(exp.id));

          toast({
            title: "Diagnóstico generado",
            description: "El análisis técnico se ha completado con éxito.",
            variant: "default",
          });
        }
      }
    } catch (err: any) {
      console.error('Failed to generate diagnosis:', err);
      const errorMsg = err.message || 'Error al generar el prediagnóstico';
      setError(errorMsg);

      toast({
        title: "Error al generar diagnóstico",
        description: "No se pudo completar el análisis. Intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [expediente]);

  const advanceState = useCallback((): boolean => {
    if (!expediente) return false;

    const states = Object.values(ExpedienteState);
    const currentIndex = states.indexOf(expediente.estado);
    const nextState = states[currentIndex + 1];

    if (!nextState) return false;

    if (canAdvanceToState(expediente.estado, nextState, expediente)) {
      expediente.estado = nextState;
      saveExpediente(expediente);
      setExpediente(getExpediente(expediente.id));
      return true;
    }

    return false;
  }, [expediente]);

  const selectPack = useCallback((packId: PackType) => {
    if (!expediente) return;

    expediente.packSeleccionado = packId;

    if (packId === 'orientacion') {
      // Free pack - stay at S4
      addMessage(expediente.id, {
        role: 'assistant',
        content: 'Has seleccionado la orientación preliminar gratuita. Ya dispones del prediagnóstico en pantalla con las hipótesis, posibles causas y próximos pasos recomendados.',
      });
    } else {
      // Paid pack - advance to S5
      expediente.estado = ExpedienteState.S5_PAGO_AUTORIZACION;
      addMessage(expediente.id, {
        role: 'assistant',
        content: `Has seleccionado el pack "${packId === 'informe' ? 'Informe técnico revisado' : 'Prioridad / Segunda opinión'}". 

Para continuar, necesitamos autorizar el pago. Recuerda: se autoriza ahora, pero el cargo solo se realiza cuando el informe haya sido revisado y enviado.`,
      });
    }

    saveExpediente(expediente);
    setExpediente(getExpediente(expediente.id));
  }, [expediente]);

  // NEW: Complete payment (replaces authorizePayment)
  const completePayment = useCallback(async (paymentIntentId: string) => {
    if (!expediente) return;

    setLoading(true);
    setError(null);

    try {
      const response = await casaDiagAPI.confirmPayment(expediente.id, paymentIntentId);

      const exp = getExpediente(expediente.id);
      if (exp && exp.payment) {
        exp.payment.status = 'completed';
        exp.payment.completedAt = new Date();
        exp.estado = ExpedienteState.PAYMENT_COMPLETED;
        saveExpediente(exp);
        setExpediente(exp);
      }

      toast({
        title: "Pago completado",
        description: "Ahora puedes confirmar la información de tu caso.",
        variant: "default",
      });
    } catch (err: any) {
      console.error('Failed to complete payment:', err);
      setError(err.message || 'Error al completar el pago');

      toast({
        title: "Error en el pago",
        description: "No se pudo completar el pago. Intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [expediente]);

  // NEW: Confirm information after payment
  const confirmInformation = useCallback(async (
    confirmed: boolean,
    additional_photos?: string[],
    additional_notes?: string
  ) => {
    if (!expediente) return;

    setLoading(true);
    setError(null);

    try {
      const response = await casaDiagAPI.confirmInformation(
        expediente.id,
        confirmed,
        additional_photos,
        additional_notes
      );

      const exp = getExpediente(expediente.id);
      if (exp) {
        exp.estado = mapBackendState(response.currentState);
        exp.infoConfirmed = confirmed;
        if (additional_photos) exp.additionalPhotos = additional_photos;
        if (additional_notes) exp.additionalNotes = additional_notes;
        saveExpediente(exp);
        setExpediente(exp);
      }

      if (confirmed) {
        toast({
          title: "Información confirmada",
          description: "Generando pre-informe...",
          variant: "default",
        });

        // Automatically trigger pre-report generation
        try {
          const prereportResponse = await casaDiagAPI.generatePreReport(expediente.id);

          const expUpdated = getExpediente(expediente.id);
          if (expUpdated) {
            expUpdated.estado = mapBackendState(prereportResponse.currentState);
            saveExpediente(expUpdated);
            setExpediente(expUpdated);
          }

          toast({
            title: "Pre-informe enviado",
            description: "El técnico revisará tu caso y te enviará el informe final en un máximo de 24 horas.",
            variant: "default",
          });
        } catch (prereportErr: any) {
          console.error('Failed to generate pre-report:', prereportErr);
          toast({
            title: "Error al generar pre-informe",
            description: "El pre-informe no se pudo generar automáticamente. Por favor, contacta con soporte.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Puedes modificar la información",
          description: "Vuelve atrás para editar tus respuestas.",
          variant: "default",
        });
      }
    } catch (err: any) {
      console.error('Failed to confirm information:', err);
      setError(err.message || 'Error al confirmar información');

      toast({
        title: "Error",
        description: "No se pudo confirmar la información.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [expediente]);

  // NEW: Generate pre-report
  const generatePreReport = useCallback(async () => {
    if (!expediente) return;

    setLoading(true);
    setError(null);

    try {
      const response = await casaDiagAPI.generatePreReport(expediente.id);

      const exp = getExpediente(expediente.id);
      if (exp) {
        exp.estado = mapBackendState(response.currentState);
        saveExpediente(exp);
        setExpediente(exp);
      }

      toast({
        title: "Pre-informe enviado",
        description: "El técnico revisará tu caso y te enviará el informe final.",
        variant: "default",
      });
    } catch (err: any) {
      console.error('Failed to generate pre-report:', err);
      setError(err.message || 'Error al generar pre-informe');

      toast({
        title: "Error",
        description: "No se pudo generar el pre-informe.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [expediente]);

  // DEPRECATED: Old authorize payment method (kept for backward compatibility)
  const authorizePayment = useCallback(async () => {
    if (!expediente || !expediente.packSeleccionado) return;

    setLoading(true);
    setError(null);

    try {
      const paymentIntent = await casaDiagAPI.createPaymentIntent(
        expediente.id,
        expediente.packSeleccionado
      );

      // This is deprecated - new flow uses completePayment instead
      const exp = getExpediente(expediente.id);
      if (exp) {
        exp.payment = {
          id: paymentIntent.paymentId,
          expedienteId: expediente.id,
          packId: expediente.packSeleccionado,
          status: 'pending',
          baseAmount: paymentIntent.baseAmount,
          vatRate: paymentIntent.vatRate,
          totalAmount: paymentIntent.totalAmount,
        };
        exp.estado = ExpedienteState.PAYMENT_PENDING;

        saveExpediente(exp);
        setExpediente(exp);

        toast({
          title: "Pago pendiente",
          description: "Completa el pago para continuar.",
          variant: "default",
        });
      }
    } catch (err: any) {
      console.error('Failed to authorize payment:', err);
      setError(err.message || 'Error al procesar el pago');

      toast({
        title: "Error al procesar el pago",
        description: "No se pudo crear la intención de pago.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [expediente]);

  return {
    expediente,
    loading,
    sending,
    error,
    initExpediente,
    loadExpediente,
    sendMessage,
    uploadEvidence,
    deleteEvidence,
    updateResumen,
    advanceState,
    selectPack,
    // NEW methods
    completePayment,
    confirmInformation,
    generatePreReport,
    // DEPRECATED (kept for backward compatibility)
    authorizePayment,
    generatePrediagnostico,
  };
};
