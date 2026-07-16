import { Expediente, ExpedienteState, UserProfile, Message, Evidence } from '@/types/expediente';

const STORAGE_KEY = 'diagnostico_expedientes';
const CURRENT_EXPEDIENTE_KEY = 'diagnostico_current_expediente';

export const generateId = (): string => {
  return `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const generateMessageId = (): string => {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const generateEvidenceId = (): string => {
  return `ev_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const createExpediente = (perfil: UserProfile): Expediente => {
  const expediente: Expediente = {
    id: generateId(),
    perfil,
    estado: ExpedienteState.S1_CONTEXTO,
    messages: [],
    evidencias: [],
    resumen: {},
    consentimientoRGPD: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Add initial assistant message based on profile
  const welcomeMessage = getWelcomeMessage(perfil);
  expediente.messages.push({
    id: generateMessageId(),
    role: 'assistant',
    content: welcomeMessage,
    timestamp: new Date(),
  });

  saveExpediente(expediente);
  setCurrentExpedienteId(expediente.id);

  return expediente;
};

const getWelcomeMessage = (perfil: UserProfile): string => {
  const messages: Record<UserProfile, string> = {
    particular: `Bienvenido al asistente de diagnóstico técnico. Voy a guiarte paso a paso para entender el problema en tu vivienda.

Empecemos por lo básico: ¿Podrías describir brevemente qué está ocurriendo? Por ejemplo: dónde está el problema, qué síntomas observas (manchas, humedad, grietas...) y desde cuándo lo notas.

No te preocupes si no tienes todos los detalles técnicos, iremos resolviendo las dudas juntos.`,

    abogado: `Bienvenido al sistema de diagnóstico técnico. Este asistente le ayudará a recopilar la documentación técnica necesaria para su procedimiento.

Para iniciar el expediente, necesito que describa la patología objeto de análisis: ubicación, síntomas observados, antigüedad aproximada y cualquier antecedente relevante para el caso.

La información recopilada seguirá una estructura orientada a su uso en procedimientos legales.`,

    administrador: `Bienvenido al asistente de diagnóstico técnico para administradores de fincas. Le ayudaremos a documentar la incidencia de forma estructurada.

Para comenzar, indique: la ubicación del problema dentro de la comunidad, los síntomas reportados, desde cuándo se tiene constancia y si hay antecedentes similares en la finca.

El expediente quedará registrado para su trazabilidad y gestión.`,
  };

  return messages[perfil];
};

export const saveExpediente = (expediente: Expediente): boolean => {
  const expedientes = getAllExpedientes();
  const index = expedientes.findIndex((e) => e.id === expediente.id);

  expediente.updatedAt = new Date();

  if (index >= 0) {
    expedientes[index] = expediente;
  } else {
    expedientes.push(expediente);
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expedientes));
    return true;
  } catch (error) {
    // Handle localStorage quota exceeded or private browsing mode
    if (error instanceof DOMException && (
      error.code === 22 || // Quota exceeded
      error.code === 1014 || // Firefox quota exceeded
      error.name === 'QuotaExceededError' ||
      error.name === 'NS_ERROR_DOM_QUOTA_REACHED'
    )) {
      console.warn('localStorage quota exceeded. Data may not be persisted.');
    }
    return false;
  }
};

export const getExpediente = (id: string): Expediente | null => {
  const expedientes = getAllExpedientes();
  const expediente = expedientes.find((e) => e.id === id);

  if (expediente) {
    // Parse dates
    return {
      ...expediente,
      createdAt: new Date(expediente.createdAt),
      updatedAt: new Date(expediente.updatedAt),
      messages: (expediente.messages || []).map((m) => ({
        ...m,
        timestamp: new Date(m.timestamp),
      })),
      evidencias: (expediente.evidencias || []).map((e) => ({
        ...e,
        uploadedAt: new Date(e.uploadedAt),
      })),
    };
  }

  return null;
};

export const getAllExpedientes = (): Expediente[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const setCurrentExpedienteId = (id: string): boolean => {
  try {
    localStorage.setItem(CURRENT_EXPEDIENTE_KEY, id);
    return true;
  } catch (error) {
    console.warn('Failed to set current expediente ID in localStorage');
    return false;
  }
};

export const getCurrentExpedienteId = (): string | null => {
  return localStorage.getItem(CURRENT_EXPEDIENTE_KEY);
};

export const addMessage = (expedienteId: string, message: Omit<Message, 'id' | 'timestamp'>): Message => {
  const expediente = getExpediente(expedienteId);
  if (!expediente) throw new Error('Expediente not found');

  const newMessage: Message = {
    ...message,
    id: generateMessageId(),
    timestamp: new Date(),
  };

  expediente.messages.push(newMessage);
  saveExpediente(expediente);

  return newMessage;
};

export const addEvidence = (expedienteId: string, evidence: Omit<Evidence, 'id' | 'uploadedAt'>): Evidence => {
  const expediente = getExpediente(expedienteId);
  if (!expediente) throw new Error('Expediente not found');

  const newEvidence: Evidence = {
    ...evidence,
    id: generateEvidenceId(),
    uploadedAt: new Date(),
  };

  expediente.evidencias.push(newEvidence);
  saveExpediente(expediente);

  return newEvidence;
};

export const updateEvidenceStatus = (
  expedienteId: string,
  evidenceId: string,
  status: Evidence['status'],
  url?: string
): void => {
  const expediente = getExpediente(expedienteId);
  if (!expediente) throw new Error('Expediente not found');

  const evidence = expediente.evidencias.find((e) => e.id === evidenceId);
  if (evidence) {
    evidence.status = status;
    if (url) evidence.url = url;
    saveExpediente(expediente);
  }
};

export const removeEvidence = (expedienteId: string, evidenceId: string): void => {
  const expediente = getExpediente(expedienteId);
  if (!expediente) throw new Error('Expediente not found');

  expediente.evidencias = expediente.evidencias.filter((e) => e.id !== evidenceId);
  saveExpediente(expediente);
};

export const updateExpedienteState = (expedienteId: string, estado: ExpedienteState): void => {
  const expediente = getExpediente(expedienteId);
  if (!expediente) throw new Error('Expediente not found');

  expediente.estado = estado;
  saveExpediente(expediente);
};

export const updateExpedienteResumen = (
  expedienteId: string,
  resumen: Partial<Expediente['resumen']>
): void => {
  const expediente = getExpediente(expedienteId);
  if (!expediente) throw new Error('Expediente not found');

  expediente.resumen = { ...expediente.resumen, ...resumen };
  saveExpediente(expediente);
};
