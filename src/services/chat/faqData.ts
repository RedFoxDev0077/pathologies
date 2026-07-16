// FAQ Database for common questions
export interface FAQItem {
  id: string;
  keywords: string[];
  answer: string;
  category: string;
  requiresFollowUp?: boolean;
}

export const faqData: FAQItem[] = [
  {
    id: "pricing",
    keywords: ["precio", "coste", "cuánto", "cuesta", "tarifa", "vale"],
    answer: "El análisis preliminar es completamente gratuito. Si necesitas un informe técnico firmado, el precio es de 90 euros más IVA. Para casos que requieren un informe pericial completo, el coste es de 850 euros más IVA.",
    category: "pricing",
  },
  {
    id: "free",
    keywords: ["gratis", "gratuito", "sin pagar", "sin coste", "free"],
    answer: "Sí, puedes empezar completamente gratis y sin compromiso. El análisis preliminar te permite entender tu problema antes de decidir si necesitas un informe técnico.",
    category: "pricing",
  },
  {
    id: "humidity",
    keywords: ["humedad", "humedades", "mojado", "agua", "filtración", "goteras"],
    answer: "Analizamos todo tipo de humedades: filtraciones, condensación, capilaridad y humedades accidentales. Nuestro sistema te guiará para identificar el origen del problema y las posibles soluciones.",
    category: "pathology",
  },
  {
    id: "cracks",
    keywords: ["grieta", "grietas", "fisura", "rajadura", "rotura"],
    answer: "Las grietas pueden tener diferentes causas: asentamiento del terreno, dilatación térmica o problemas estructurales. Con nuestro análisis podremos orientarte sobre la gravedad y las posibles soluciones.",
    category: "pathology",
  },
  {
    id: "mold",
    keywords: ["moho", "hongos", "manchas negras", "verdín"],
    answer: "El moho suele aparecer por exceso de humedad y mala ventilación. Analizamos el origen del problema para darte recomendaciones efectivas y evitar que vuelva a aparecer.",
    category: "pathology",
  },
  {
    id: "time",
    keywords: ["tiempo", "cuánto tarda", "plazo", "demora", "cuando", "rápido"],
    answer: "El análisis preliminar es inmediato. Si solicitas un informe técnico, lo recibirás en un plazo de 24 a 48 horas laborables tras completar el proceso y realizar el pago.",
    category: "process",
  },
  {
    id: "process",
    keywords: ["cómo funciona", "proceso", "pasos", "empezar", "comenzar"],
    answer: "Es muy sencillo. Primero, respondes unas preguntas sobre tu problema. Luego, subes fotos de la patología. Nuestro sistema analiza la información y un técnico colegiado revisa cada caso antes de emitir el informe.",
    category: "process",
  },
  {
    id: "professional",
    keywords: ["quién", "técnico", "profesional", "arquitecto", "ingeniero", "experto"],
    answer: "Todos los informes son revisados por José Francisco Castillo Miras, arquitecto e ingeniero de la edificación con más de 30 años de experiencia, colegiado en COACV y COIAT Valencia.",
    category: "trust",
  },
  {
    id: "report",
    keywords: ["informe", "documento", "pdf", "certificado"],
    answer: "El informe técnico incluye diagnóstico detallado, identificación de causas probables, recomendaciones de actuación y está firmado por un técnico colegiado. Se entrega en formato PDF.",
    category: "service",
  },
  {
    id: "payment",
    keywords: ["pago", "tarjeta", "pagar", "cobro", "factura"],
    answer: "El pago se autoriza al solicitar el informe, pero solo se cobra cuando el informe ha sido revisado y está listo para entregar. Aceptamos tarjeta de crédito y débito.",
    category: "payment",
  },
  {
    id: "location",
    keywords: ["zona", "dónde", "ciudad", "provincia", "lugar", "área"],
    answer: "Atendemos toda España de forma online. Solo necesitas subir las fotos y descripciones desde cualquier lugar, y recibirás tu informe por email.",
    category: "service",
  },
  {
    id: "guarantee",
    keywords: ["garantía", "seguro", "fiable", "confianza"],
    answer: "Todos los informes tienen revisión humana obligatoria por un técnico colegiado. Emitimos informes bajo responsabilidad profesional, lo que garantiza la calidad y seriedad del diagnóstico.",
    category: "trust",
  },
  {
    id: "contact",
    keywords: ["contacto", "teléfono", "email", "hablar", "llamar", "persona"],
    answer: "Puedo ayudarte a conectar con nuestro equipo técnico. Por favor, indícame tu nombre y email para que podamos contactarte.",
    category: "contact",
    requiresFollowUp: true,
  },
];

// Complex question keywords that should be forwarded to the client
export const complexKeywords = [
  // Legal
  "juicio", "demanda", "abogado", "pericial", "judicial", "denuncia", "tribunal", "juzgado",
  // Urgency
  "urgente", "emergencia", "inmediato", "ya", "ahora mismo", "cuanto antes",
  // Technical projects
  "proyecto", "obra", "dirección técnica", "presupuesto detallado", "reforma",
  // Multiple properties
  "comunidad", "edificio", "varios pisos", "bloque", "urbanización",
  // Personal contact
  "reunión", "visita", "ir a ver", "presencial",
];

// Check if message matches FAQ
export function findFAQMatch(message: string): FAQItem | null {
  const normalizedMessage = message.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  for (const faq of faqData) {
    for (const keyword of faq.keywords) {
      const normalizedKeyword = keyword.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      if (normalizedMessage.includes(normalizedKeyword)) {
        return faq;
      }
    }
  }

  return null;
}

// Check if question is complex and needs human attention
export function isComplexQuestion(message: string): boolean {
  const normalizedMessage = message.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  for (const keyword of complexKeywords) {
    const normalizedKeyword = keyword.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (normalizedMessage.includes(normalizedKeyword)) {
      return true;
    }
  }

  return false;
}

// Welcome message from the assistant
export const welcomeMessage = "¡Hola! Soy el Asistente virtual de Mi Casa Verde. Estoy aquí para ayudarte con cualquier duda sobre diagnóstico de patologías en viviendas. ¿En qué puedo ayudarte?";

// Complex question response
export const complexQuestionResponse = "Entiendo que tu caso necesita atención personalizada. He enviado tu consulta a nuestro equipo técnico y te contactarán pronto. ¿Podrías indicarme tu nombre y email para que puedan responderte?";

// Fallback response when no FAQ matches and AI fails
export const fallbackResponse = "Gracias por tu pregunta. Para darte la mejor respuesta, te recomiendo usar nuestro asistente de diagnóstico gratuito o contactar directamente con nuestro equipo técnico.";
