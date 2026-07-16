// Estados del expediente (NEW S0-S9 workflow)
export enum ExpedienteState {
  S0_INTRODUCCION = 'S0_INTRODUCCION',
  S1_LOCALIZACION = 'S1_LOCALIZACION',
  S2_TIPO_DANO = 'S2_TIPO_DANO',
  S3_ANTIGUEDAD = 'S3_ANTIGUEDAD',
  S4_EVOLUCION = 'S4_EVOLUCION',
  S5_MATERIAL_GRAFICO = 'S5_MATERIAL_GRAFICO',
  S6_CONTEXTO = 'S6_CONTEXTO',
  S7_DESCRIPCION_LIBRE = 'S7_DESCRIPCION_LIBRE',
  S7B_PREGUNTAS_TECNICAS = 'S7B_PREGUNTAS_TECNICAS',
  S8_ANALISIS_GRATUITO = 'S8_ANALISIS_GRATUITO',
  S9_CONFIRMACION_PAGO = 'S9_CONFIRMACION_PAGO',
  S10_PAGO_COMPLETADO = 'S10_PAGO_COMPLETADO',
  PAYMENT_PENDING = 'PAYMENT_PENDING',
  PAYMENT_COMPLETED = 'PAYMENT_COMPLETED',
  INFO_CONFIRMATION = 'INFO_CONFIRMATION',
  S9_GENERACION_PREINFORME = 'S9_GENERACION_PREINFORME',
  DRAFT_SENT_TO_TECHNICIAN = 'DRAFT_SENT_TO_TECHNICIAN',
  FINAL_SENT = 'FINAL_SENT',
}

export const STATE_LABELS: Record<ExpedienteState, string> = {
  [ExpedienteState.S0_INTRODUCCION]: 'Introducción',
  [ExpedienteState.S1_LOCALIZACION]: 'Localización',
  [ExpedienteState.S2_TIPO_DANO]: 'Tipo de daño',
  [ExpedienteState.S3_ANTIGUEDAD]: 'Antigüedad',
  [ExpedienteState.S4_EVOLUCION]: 'Evolución',
  [ExpedienteState.S5_MATERIAL_GRAFICO]: 'Material gráfico',
  [ExpedienteState.S6_CONTEXTO]: 'Contexto',
  [ExpedienteState.S7_DESCRIPCION_LIBRE]: 'Descripción libre',
  [ExpedienteState.S7B_PREGUNTAS_TECNICAS]: 'Preguntas técnicas',
  [ExpedienteState.S8_ANALISIS_GRATUITO]: 'Análisis gratuito',
  [ExpedienteState.S9_CONFIRMACION_PAGO]: 'Confirmación y pago',
  [ExpedienteState.S10_PAGO_COMPLETADO]: 'Pago completado',
  [ExpedienteState.PAYMENT_PENDING]: 'Pago pendiente',
  [ExpedienteState.PAYMENT_COMPLETED]: 'Pago completado',
  [ExpedienteState.INFO_CONFIRMATION]: 'Confirmación',
  [ExpedienteState.S9_GENERACION_PREINFORME]: 'Generando preinforme',
  [ExpedienteState.DRAFT_SENT_TO_TECHNICIAN]: 'En revisión técnica',
  [ExpedienteState.FINAL_SENT]: 'Informe enviado',
};

export type UserProfile = 'particular' | 'abogado' | 'administrador';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  attachments?: string[];
}

export interface Evidence {
  id: string;
  type: 'photo' | 'video' | 'audio' | 'document';
  name: string;
  size: number;
  mimeType: string;
  url?: string;
  thumbnailUrl?: string;
  status: 'uploading' | 'validating' | 'completed' | 'error';
  uploadProgress?: number; // 0-100
  uploadedAt: Date;
  validated?: boolean;
  validationError?: string;
  visionAnalysis?: any;
}

// NEW: S8 Analysis structure (5 blocks per functional document)
export interface S8AnalysisBlock {
  title: string;
  content: string;
}

export interface S8Analysis {
  case_id: string;
  block_1_identified_damage: S8AnalysisBlock;
  block_2_probable_causes: S8AnalysisBlock;
  block_3_risk_assessment: S8AnalysisBlock;
  block_4_technical_questions: S8AnalysisBlock;
  block_5_recommendations: S8AnalysisBlock;
  overall_confidence: number;
}

export interface Prediagnostico {
  hipotesis: string[];
  posiblesCausas: string[];
  proximosPasos: string[];
  evidenciaAdicionalSugerida?: string;
  riesgoPercibido: 'bajo' | 'medio' | 'alto';
}

export interface ResumenExpediente {
  tipoPatologia?: string;
  ubicacion?: string;
  antiguedad?: string;
  sintomasObservados?: string[];
  descripcionUsuario?: string;
  // NEW: S1-S7 structured data
  s1_localizacion?: string;
  s2_tipo_dano?: string;
  s3_antiguedad?: string;
  s4_evolucion?: string;
  s5_fotos?: boolean;
  s5_video?: boolean;
  s6_contexto?: string;
  s7_descripcion?: string;
}

// NEW: Single pack type (informe_preliminar_remoto)
export type PackType = 'informe_preliminar_remoto';

export interface Pack {
  id: PackType;
  nombre: string;
  descripcion: string;
  precio: string;
  precioBase: number;
  iva: number;
  precioTotal: number;
  incluye: string[];
  destacado?: boolean;
}

export interface Payment {
  id: string;
  expedienteId: string;
  packId: PackType;
  status: 'pending' | 'completed' | 'cancelled';
  baseAmount: number;
  vatRate: number;
  totalAmount: number;
  completedAt?: Date;
}

export interface Expediente {
  id: string;
  caseId?: string;
  perfil: UserProfile;
  estado: ExpedienteState;
  messages: Message[];
  evidencias: Evidence[];
  resumen: ResumenExpediente;
  prediagnostico?: Prediagnostico;
  s8_analysis?: S8Analysis;
  packSeleccionado?: PackType;
  payment?: Payment;
  infoConfirmed?: boolean;
  additionalPhotos?: string[];
  additionalNotes?: string;
  consentimientoRGPD: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
  required: boolean;
}

// NEW: Single pack option per José's requirements
export const PACKS: Pack[] = [
  {
    id: 'informe_preliminar_remoto',
    nombre: 'Informe Preliminar Remoto',
    descripcion: 'Análisis gratuito + Pre-informe técnico revisado por profesional',
    precio: '108,90€',
    precioBase: 9000,
    iva: 21,
    precioTotal: 10890,
    incluye: [
      'Chat guiado S0-S7 con asistente IA',
      'Análisis gratuito preliminar (S8) con 5 bloques',
      'Pre-informe técnico en formato Word',
      'Revisión humana obligatoria por técnico cualificado',
      'Informe final firmado en PDF',
      'Envío por email',
    ],
    destacado: true,
  },
];

// Validaciones por estado (NEW workflow)
export const getStateChecklist = (
  estado: ExpedienteState,
  expediente: Expediente
): ChecklistItem[] => {
  const baseChecklist: Partial<Record<ExpedienteState, ChecklistItem[]>> = {
    [ExpedienteState.S0_INTRODUCCION]: [
      {
        id: 'perfil',
        label: 'Perfil seleccionado',
        completed: !!expediente.perfil,
        required: true,
      },
      {
        id: 'consentimiento',
        label: 'Consentimiento RGPD aceptado',
        completed: expediente.consentimientoRGPD,
        required: true,
      },
    ],
    [ExpedienteState.S1_LOCALIZACION]: [
      {
        id: 'localizacion',
        label: 'Localización del problema indicada',
        completed: !!expediente.resumen.s1_localizacion,
        required: true,
      },
    ],
    [ExpedienteState.S5_MATERIAL_GRAFICO]: [
      {
        id: 'fotos_min',
        label: 'Mínimo 1 foto subida',
        completed: expediente.evidencias.filter((e) => e.type === 'photo' && e.status === 'completed').length >= 1,
        required: true,
      },
      {
        id: 'fotos_ideal',
        label: 'Fotos ideales (3-6)',
        completed: expediente.evidencias.filter((e) => e.type === 'photo' && e.status === 'completed').length >= 3,
        required: false,
      },
    ],
    [ExpedienteState.S8_ANALISIS_GRATUITO]: [
      {
        id: 's8_analysis',
        label: 'Análisis gratuito generado',
        completed: !!expediente.s8_analysis,
        required: true,
      },
    ],
    [ExpedienteState.PAYMENT_PENDING]: [
      {
        id: 'pack',
        label: 'Pack seleccionado',
        completed: !!expediente.packSeleccionado,
        required: true,
      },
    ],
    [ExpedienteState.PAYMENT_COMPLETED]: [
      {
        id: 'payment',
        label: 'Pago completado',
        completed: expediente.payment?.status === 'completed',
        required: true,
      },
    ],
    [ExpedienteState.INFO_CONFIRMATION]: [
      {
        id: 'info_confirmed',
        label: 'Información confirmada',
        completed: !!expediente.infoConfirmed,
        required: true,
      },
    ],
  };

  return baseChecklist[estado] || [];
};

export const canAdvanceToState = (
  currentState: ExpedienteState,
  targetState: ExpedienteState,
  expediente: Expediente
): boolean => {
  const stateOrder = Object.values(ExpedienteState);
  const currentIndex = stateOrder.indexOf(currentState);
  const targetIndex = stateOrder.indexOf(targetState);

  if (targetIndex <= currentIndex) return true;
  if (targetIndex > currentIndex + 1) return false;

  const checklist = getStateChecklist(currentState, expediente);
  const requiredItems = checklist.filter((item) => item.required);
  return requiredItems.every((item) => item.completed);
};
