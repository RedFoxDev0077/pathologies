import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { casaDiagAPI } from '@/services/api/casadiag-api';
import { ImageCropModal } from './ImageCropModal';
import {
  Save, ExternalLink, Image, Plus, Trash2, Globe, Layout,
  FileText, HelpCircle, Megaphone, ArrowRight, Loader2
} from 'lucide-react';

// ============================================================
// TYPES
// ============================================================
interface Step { title: string; desc: string; }
interface FAQ { q: string; a: string; }
interface ListItem { title: string; desc: string; }

interface HeroSection {
  badge: string; h1: string; subtitle: string;
  cta_text: string; subnote: string; image_url: string;
}
interface HowItWorks { section_title: string; steps: Step[]; }
interface FAQSection { section_title: string; faqs: FAQ[]; }
interface CTASection { h2: string; subtitle: string; btn_text: string; subnote: string; }
interface SEOMeta { title: string; description: string; og_title: string; og_description: string; og_image_url: string; }

// Page-specific content types
interface HumedadesContent {
  what_is_title: string; what_is_p1: string; what_is_p2: string; what_is_p3: string;
  when_title: string; when_items: ListItem[];
}
interface GrietasContent {
  types_title: string; types_intro: string;
  col_ok_title: string; col_ok_items: string[];
  col_bad_title: string; col_bad_items: string[];
  when_title: string; when_items: ListItem[];
}
interface DanosContent {
  why_title: string; why_p1: string; why_p2: string; why_checklist: string[];
  types_title: string; types_items: { icon: string; title: string; desc: string }[];
}
interface ComunidadContent {
  resp_title: string; resp_intro: string;
  col_vecino_title: string; col_vecino_items: string[];
  col_comunidad_title: string; col_comunidad_items: string[];
  claim_title: string; claim_steps: ListItem[];
}

interface PageContent {
  hero: HeroSection;
  specific: HumedadesContent | GrietasContent | DanosContent | ComunidadContent;
  how_it_works: HowItWorks;
  faq: FAQSection;
  cta: CTASection;
  seo: SEOMeta;
}

// ============================================================
// DEFAULT CONTENT FOR EACH PAGE
// ============================================================
const PAGES = [
  { key: 'landing_humedades', label: 'Informe Humedades', slug: '/informe-pericial-humedades' },
  { key: 'landing_grietas', label: 'Informe Grietas', slug: '/informe-grietas-estructurales' },
  { key: 'landing_danos', label: 'Informe Daños Seguro', slug: '/informe-danos-seguro-hogar' },
  { key: 'landing_comunidad', label: 'Informe Comunidad', slug: '/informe-comunidad-propietarios' },
];

const DEFAULT_CONTENT: Record<string, PageContent> = {
  landing_humedades: {
    hero: { badge: 'Mi Casa Verde · Informe Pericial', h1: 'Informe Pericial de Humedades', subtitle: '¿Tienes humedades en tu vivienda y necesitas un documento oficial para reclamar al seguro, al vecino de arriba o a la comunidad de propietarios? Obtén un informe pericial firmado por técnico cualificado en 24-48 horas, desde 90€.', cta_text: 'Solicitar informe gratis →', subnote: 'Primer análisis gratuito · Sin compromiso', image_url: '' },
    specific: {
      what_is_title: '¿Qué es un informe pericial de humedades?',
      what_is_p1: 'Un informe pericial de humedades es un documento técnico elaborado por un técnico cualificado (arquitecto o aparejador) que analiza el origen, las causas y el alcance de las humedades en una vivienda.',
      what_is_p2: 'Los tipos de humedad más habituales son: humedades por capilaridad (suben del suelo), humedades por filtración (entran desde el exterior o desde el vecino de arriba), y humedades por condensación (vapor de agua interior).',
      what_is_p3: 'En Mi Casa Verde ofrecemos un proceso ágil y accesible: subes fotos y vídeo del problema, nuestra IA realiza un primer análisis y un técnico cualificado revisa, completa y firma el informe definitivo.',
      when_title: '¿Cuándo necesitas un informe pericial de humedades?',
      when_items: [
        { title: 'Reclamar al seguro del hogar', desc: 'La aseguradora te pide documentación técnica para tramitar la cobertura por daños por agua.' },
        { title: 'Humedad del vecino de arriba', desc: 'Necesitas probar ante el vecino o la comunidad que el origen está en su vivienda.' },
        { title: 'Reclamar a la comunidad de propietarios', desc: 'La filtración proviene de una cubierta, bajante o elemento común y el presidente no actúa.' },
        { title: 'Vender o comprar una vivienda', desc: 'Quieres conocer el estado real del inmueble antes de firmar o necesitas justificar una bajada de precio.' },
        { title: 'Discrepancia con el promotor o constructor', desc: 'Las humedades son consecuencia de un defecto constructivo y quieres reclamar en garantía.' },
      ],
    } as HumedadesContent,
    how_it_works: { section_title: 'Cómo obtener tu informe en 3 pasos', steps: [{ title: 'Describe el problema', desc: 'Responde unas preguntas guiadas y sube fotos o vídeo de las humedades.' }, { title: 'Análisis técnico', desc: 'Nuestra IA analiza las evidencias y genera un pre-informe detallado.' }, { title: 'Informe firmado en 24-48h', desc: 'Un técnico cualificado revisa y firma el informe definitivo. Lo recibes por email.' }] },
    faq: { section_title: 'Preguntas frecuentes sobre el informe pericial de humedades', faqs: [{ q: '¿Quién puede hacer un informe pericial de humedades?', a: 'Debe ser elaborado por un técnico cualificado: arquitecto, aparejador o ingeniero de edificación.' }, { q: '¿Cuánto cuesta un informe pericial de humedades?', a: 'Un informe pericial presencial oscila entre 300€ y 800€. Nuestro informe pericial remoto cuesta desde 90€ + IVA.' }, { q: '¿Sirve para reclamar al seguro del hogar?', a: 'Sí. El informe identifica el origen de la humedad y sus causas, los datos que la aseguradora necesita.' }, { q: '¿Qué incluye el informe?', a: 'Tipo de humedad, causas probables, nivel de riesgo, recomendaciones y firma de técnico cualificado.' }, { q: '¿Qué hago si la humedad viene del vecino de arriba?', a: 'Con el informe pericial puedes reclamar al vecino, a su seguro o a la comunidad de propietarios.' }] },
    cta: { h2: '¿Tienes humedades y necesitas el informe?', subtitle: 'Empieza ahora gratis. Solo te pedimos fotos y una descripción del problema.', btn_text: 'Obtener informe pericial →', subnote: 'Análisis gratuito · Informe desde 90€ · Entrega 24-48h' },
    seo: { title: 'Informe Pericial de Humedades · Válido para Seguro y Comunidad | Mi Casa Verde', description: 'Informe pericial de humedades con revisión de técnico cualificado. Válido para reclamar al seguro del hogar o al vecino de arriba. Entrega en 24-48h. Desde 90€.', og_title: 'Informe Pericial de Humedades · Mi Casa Verde', og_description: 'Informe pericial de humedades con revisión humana. Válido para reclamar al seguro o al vecino. Desde 90€, entrega en 24-48h.', og_image_url: '' },
  },
  landing_grietas: {
    hero: { badge: 'Mi Casa Verde · Informe Técnico', h1: 'Informe Técnico de Grietas Estructurales', subtitle: '¿Tienes grietas en la pared y no sabes si son peligrosas? Obtén un informe técnico firmado por arquitecto o aparejador en 24-48 horas, desde 90€.', cta_text: 'Analizar mis grietas gratis →', subnote: 'Primer análisis gratuito · Sin compromiso', image_url: '' },
    specific: {
      types_title: '¿Todas las grietas son iguales de preocupantes?',
      types_intro: 'No. Existen diferencias importantes entre una fisura superficial (en el revestimiento o yeso) y una grieta estructural (en elementos portantes como muros de carga, pilares o forjados).',
      col_ok_title: 'Generalmente no preocupantes',
      col_ok_items: ['Fisuras finas verticales en yeso o pintura', 'Grietas en esquinas entre tabiques', 'Fisuras por retracción en obras recientes', 'Grietas superficiales en cerámica o azulejo'],
      col_bad_title: 'Pueden ser estructurales',
      col_bad_items: ['Grietas horizontales en muros portantes', 'Grietas diagonales en esquinas de ventanas', 'Grietas que crecen con el tiempo', 'Grietas que atraviesan la pared de lado a lado'],
      when_title: '¿Cuándo necesitas un informe de grietas?',
      when_items: [
        { title: 'Grietas que aparecen de repente o crecen', desc: 'Una grieta que evoluciona en el tiempo puede indicar un problema activo que requiere intervención urgente.' },
        { title: 'Antes de comprar una vivienda con grietas', desc: 'El informe técnico te permite negociar el precio o descartar la compra si el riesgo es real.' },
        { title: 'Reclamar al promotor por defectos constructivos', desc: 'Las grietas estructurales en edificios nuevos pueden ser reclamadas al promotor durante el período de garantía.' },
        { title: 'Reclamar al seguro del hogar', desc: 'Si las grietas son consecuencia de un siniestro, el informe técnico es imprescindible para que el seguro lo cubra.' },
        { title: 'Tranquilidad ante una grieta antigua', desc: 'Saber si una grieta lleva años estabilizada o si sigue activa te evita la incertidumbre y los gastos innecesarios.' },
      ],
    } as GrietasContent,
    how_it_works: { section_title: 'Cómo obtienes el informe', steps: [{ title: 'Describe y fotografía', desc: 'Responde preguntas sobre la grieta y sube fotos con escala de referencia.' }, { title: 'Análisis técnico con IA', desc: 'Clasificamos el tipo de grieta, analizamos su morfología y causas probables.' }, { title: 'Informe firmado', desc: 'Un técnico cualificado revisa y firma. Recibes el informe en 24-48h por email.' }] },
    faq: { section_title: 'Preguntas frecuentes sobre grietas en viviendas', faqs: [{ q: '¿Es grave una grieta en la pared?', a: 'No todas las grietas son peligrosas. Las fisuras finas en yeso son habitualmente superficiales. Las grietas horizontales en elementos portantes sí pueden indicar riesgo estructural.' }, { q: '¿Cómo saber si una grieta es estructural?', a: 'Una grieta puede ser estructural si supera 5 mm de anchura, es diagonal en esquinas de huecos, aparece en pilares o vigas, o si crece con el tiempo.' }, { q: '¿Qué hace el técnico al revisar una grieta?', a: 'Analiza la dirección, anchura y profundidad; la localización en el elemento constructivo; la causa probable y su evolución.' }, { q: '¿Cuánto cuesta el informe de grietas?', a: 'Un informe presencial cuesta entre 400€ y 1.000€. Nuestro informe remoto parte desde 90€ + IVA, con revisión de técnico cualificado.' }, { q: '¿Sirve para reclamar al seguro?', a: 'Sí. Si las grietas son consecuencia de un siniestro cubierto, el informe técnico acredita el daño y su origen.' }] },
    cta: { h2: '¿Tienes grietas y quieres saber si son peligrosas?', subtitle: 'Empieza con el análisis gratuito. Solo necesitas fotos de las grietas.', btn_text: 'Analizar mis grietas →', subnote: 'Análisis gratuito · Informe desde 90€ · Entrega 24-48h' },
    seo: { title: 'Informe Técnico de Grietas Estructurales · ¿Es peligrosa tu grieta? | Mi Casa Verde', description: '¿Tienes grietas en la pared y no sabes si son peligrosas? Informe técnico de grietas estructurales con revisión de técnico cualificado. Desde 90€, entrega en 24-48h.', og_title: 'Informe Técnico de Grietas Estructurales · Mi Casa Verde', og_description: '¿Es peligrosa tu grieta? Informe técnico con revisión de técnico cualificado. Desde 90€, entrega en 24-48h.', og_image_url: '' },
  },
  landing_danos: {
    hero: { badge: 'Mi Casa Verde · Informe para Seguros', h1: 'Informe de Daños para Reclamar al Seguro del Hogar', subtitle: '¿Tu aseguradora te pide un informe técnico de los daños? Obtén un informe pericial firmado por técnico cualificado, válido para humedades, grietas o filtraciones. En 24-48 horas, desde 90€.', cta_text: 'Solicitar informe gratis →', subnote: 'Primer análisis gratuito · Sin compromiso', image_url: '' },
    specific: {
      why_title: '¿Por qué necesitas un informe técnico para reclamar al seguro?',
      why_p1: 'Cuando sufres un daño en tu vivienda, la compañía de seguros envía a su propio perito para valorar los daños. Ese perito trabaja para la aseguradora, no para ti.',
      why_p2: 'Contar con tu propio informe técnico pericial independiente te permite contrastar la valoración del perito de la aseguradora con criterio técnico propio.',
      why_checklist: ['Contrastar la valoración del perito de la aseguradora con criterio técnico propio', 'Acreditar el origen exacto del daño y que está cubierto por la póliza', 'Impugnar el rechazo de la reclamación si la aseguradora no acepta', 'Documentar el daño antes de que se repare y se pierdan las evidencias', 'Tener base técnica para una reclamación judicial si es necesario'],
      types_title: 'Tipos de daños para los que elaboramos el informe',
      types_items: [
        { icon: '💧', title: 'Humedades por filtración', desc: 'Agua que entra desde el exterior, cubiertas, fachadas o vecino de arriba.' },
        { icon: '🔧', title: 'Rotura de tuberías', desc: 'Daños por fuga de agua en instalaciones de fontanería o calefacción.' },
        { icon: '⬆️', title: 'Filtraciones desde el vecino', desc: 'Agua que proviene de la vivienda del piso superior o colindante.' },
        { icon: '🏚️', title: 'Grietas por siniestro', desc: 'Grietas aparecidas tras un evento concreto (hundimiento, impacto, etc.).' },
        { icon: '🌧️', title: 'Daños por lluvia o viento', desc: 'Filtraciones en cubierta o carpinterías por fenómenos atmosféricos.' },
        { icon: '📋', title: 'Daños en elementos comunes', desc: 'Daños en zonas comunes del edificio con repercusión en tu vivienda.' },
      ],
    } as DanosContent,
    how_it_works: { section_title: 'Cómo obtienes el informe para tu seguro', steps: [{ title: 'Describe el daño', desc: 'Responde preguntas guiadas sobre el tipo de daño y sube fotos o vídeos.' }, { title: 'Análisis técnico', desc: 'Identificamos el origen del daño, su extensión y las causas probables.' }, { title: 'Informe para el seguro', desc: 'Técnico cualificado revisa y firma. Recibes el informe en 24-48h por email.' }] },
    faq: { section_title: 'Preguntas frecuentes sobre reclamaciones al seguro del hogar', faqs: [{ q: '¿Sirve un informe técnico para reclamar al seguro del hogar?', a: 'Sí. El informe acredita el origen y extensión del daño, información clave para que la aseguradora determine si el siniestro está cubierto.' }, { q: '¿Qué necesito para reclamar daños al seguro?', a: 'Comunicar el siniestro en plazo, aportar un informe técnico pericial del daño y documentación fotográfica.' }, { q: '¿Puede el seguro rechazar mi reclamación con informe?', a: 'Puede intentarlo, pero un informe técnico pericial independiente refuerza tu posición y permite impugnar el rechazo.' }, { q: '¿Cuánto tiempo tiene el seguro para resolver?', a: 'Según la Ley del Contrato de Seguro, la aseguradora tiene 40 días para comunicar su decisión desde que recibe la documentación completa.' }, { q: '¿Qué daños cubre el seguro del hogar?', a: 'Habitualmente: rotura de tuberías, filtraciones accidentales, fenómenos atmosféricos, incendios y responsabilidad civil.' }] },
    cta: { h2: '¿Necesitas el informe para reclamar al seguro?', subtitle: 'Empieza ahora. Solo necesitas fotos del daño y la descripción del problema.', btn_text: 'Solicitar informe para el seguro →', subnote: 'Análisis gratuito · Informe desde 90€ · Entrega 24-48h' },
    seo: { title: 'Informe de Daños para Reclamar al Seguro del Hogar | Mi Casa Verde', description: '¿El seguro te pide un informe de daños? Obtenlo en 24-48h desde 90€. Válido para reclamar humedades, grietas o filtraciones ante tu aseguradora. Revisado por técnico cualificado.', og_title: 'Informe de Daños para Reclamar al Seguro del Hogar · Mi Casa Verde', og_description: 'Informe técnico de daños válido para reclamar al seguro. Revisado por técnico cualificado. Desde 90€, entrega en 24-48h.', og_image_url: '' },
  },
  landing_comunidad: {
    hero: { badge: 'Mi Casa Verde · Informe para Comunidades', h1: 'Informe Técnico para Comunidad de Propietarios', subtitle: '¿Tienes humedades del vecino de arriba o de elementos comunes del edificio y la comunidad no actúa? Un informe técnico pericial es el documento que necesitas para reclamar con fundamento. En 24-48 horas, desde 90€.', cta_text: 'Solicitar informe gratis →', subnote: 'Primer análisis gratuito · Sin compromiso', image_url: '' },
    specific: {
      resp_title: '¿Quién es responsable de las humedades en un edificio?',
      resp_intro: 'Determinar quién paga la reparación de las humedades depende del origen de la filtración. Sin un informe técnico que lo establezca con claridad, vecinos y comunidades pueden negar su responsabilidad indefinidamente.',
      col_vecino_title: '🏠 Responsabilidad del vecino',
      col_vecino_items: ['Rotura de tubería en su vivienda', 'Fallo en su instalación de fontanería', 'Desbordamiento de bañera, lavabo o lavadora', 'Filtración desde su terraza o balcón privativo'],
      col_comunidad_title: '🏢 Responsabilidad de la comunidad',
      col_comunidad_items: ['Filtración desde la cubierta o azotea', 'Bajante o tubería en elementos comunes', 'Humedad por fachada o cerramiento común', 'Filtración desde garaje o local comunitario'],
      claim_title: 'Cómo reclamar con el informe técnico',
      claim_steps: [
        { title: 'Obtén el informe técnico', desc: 'El informe pericial identifica el origen de la filtración y al responsable.' },
        { title: 'Comunica la incidencia por escrito', desc: 'Envía al vecino o al presidente de la comunidad una comunicación fehaciente adjuntando el informe.' },
        { title: 'Reclamación a la aseguradora', desc: 'Si el responsable tiene seguro del hogar, puedes reclamar directamente a su aseguradora.' },
        { title: 'Junta de propietarios', desc: 'Si la comunidad no actúa, puedes solicitar la convocatoria de junta extraordinaria.' },
        { title: 'Vía judicial si es necesario', desc: 'El informe técnico pericial sirve como prueba en un procedimiento judicial.' },
      ],
    } as ComunidadContent,
    how_it_works: { section_title: 'Cómo obtienes el informe', steps: [{ title: 'Describe las humedades', desc: 'Cuéntanos dónde están, cuándo aparecieron y sube fotos o vídeo del problema.' }, { title: 'Análisis del origen', desc: 'Identificamos si la filtración viene del vecino, de elementos comunes o de otro origen.' }, { title: 'Informe para reclamar', desc: 'Técnico cualificado revisa y firma. Recibes el informe en 24-48h por email.' }] },
    faq: { section_title: 'Preguntas frecuentes sobre reclamaciones a la comunidad', faqs: [{ q: '¿Quién paga las humedades del vecino de arriba?', a: 'Si la filtración proviene de la vivienda del vecino, paga él o su seguro. Si proviene de elementos comunes (cubierta, bajantes), paga la comunidad.' }, { q: '¿Qué documento necesito para reclamar al vecino?', a: 'Un informe técnico pericial que acredite que el origen de la filtración está en su vivienda.' }, { q: '¿Puede la comunidad negarse a reparar las humedades?', a: 'La comunidad tiene obligación legal de mantener los elementos comunes. Si se niega, puedes reclamar formalmente con el informe técnico.' }, { q: '¿Cuánto cuesta un informe para la comunidad?', a: 'Un informe presencial puede costar entre 400€ y 1.200€. Nuestro informe remoto parte desde 90€ + IVA.' }, { q: '¿Qué hago si el presidente de la comunidad no actúa?', a: 'Envía un burofax formal con el informe técnico adjunto. Si no hay respuesta, convoca junta extraordinaria o acude al juzgado.' }] },
    cta: { h2: '¿Necesitas el informe para reclamar al vecino o a la comunidad?', subtitle: 'Empieza ahora. Solo necesitas fotos de las humedades y la descripción del problema.', btn_text: 'Obtener informe para reclamar →', subnote: 'Análisis gratuito · Informe desde 90€ · Entrega 24-48h' },
    seo: { title: 'Informe Técnico para Comunidad de Propietarios · Humedades y Filtraciones | Mi Casa Verde', description: '¿Humedades del vecino de arriba o de elementos comunes? Informe técnico para reclamar a la comunidad de propietarios o al vecino. Desde 90€, entrega en 24-48h.', og_title: 'Informe para Comunidad de Propietarios · Mi Casa Verde', og_description: 'Informe técnico para reclamar humedades al vecino o a la comunidad. Desde 90€, revisado por técnico cualificado, entrega en 24-48h.', og_image_url: '' },
  },
};

// ============================================================
// HELPER COMPONENTS
// ============================================================
function FieldRow({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">{label}</Label>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      {children}
    </div>
  );
}

function CharCount({ value, max }: { value: string; max: number }) {
  const len = value?.length || 0;
  return (
    <p className={`text-xs text-right mt-1 ${len > max ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>
      {len}/{max}
    </p>
  );
}

function SectionTitle({ icon: Icon, title }: { icon: any; title: string }) {
  return (
    <div className="flex items-center gap-2 pb-2 border-b mb-4">
      <Icon className="h-4 w-4 text-primary" />
      <h3 className="font-semibold text-sm text-foreground">{title}</h3>
    </div>
  );
}

// ============================================================
// MAIN EDITOR COMPONENT
// ============================================================
export function LandingPageEditor() {
  const [selectedPage, setSelectedPage] = useState(PAGES[0].key);
  const [content, setContent] = useState<PageContent>(DEFAULT_CONTENT[PAGES[0].key]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [cropModal, setCropModal] = useState<{ open: boolean; target: 'hero' | 'og'; aspect: number }>({ open: false, target: 'hero', aspect: 16 / 9 });

  const page = PAGES.find(p => p.key === selectedPage)!;

  useEffect(() => {
    loadContent(selectedPage);
  }, [selectedPage]);

  const loadContent = async (key: string) => {
    setLoading(true);
    try {
      const result = await casaDiagAPI.getLandingContent(key);
      if (result.value) {
        setContent(result.value);
      } else {
        setContent(DEFAULT_CONTENT[key]);
      }
    } catch {
      setContent(DEFAULT_CONTENT[key]);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await casaDiagAPI.saveLandingContent(selectedPage, content);
      toast({ title: 'Guardado', description: 'El contenido de la página se ha guardado correctamente.' });
    } catch (err: any) {
      toast({ title: 'Error al guardar', description: err.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const setHero = (field: keyof HeroSection, value: string) =>
    setContent(c => ({ ...c, hero: { ...c.hero, [field]: value } }));

  const setHIW = (field: keyof HowItWorks | string, value: any) =>
    setContent(c => ({ ...c, how_it_works: { ...c.how_it_works, [field]: value } }));

  const setFAQ = (field: keyof FAQSection | string, value: any) =>
    setContent(c => ({ ...c, faq: { ...c.faq, [field]: value } }));

  const setCTA = (field: keyof CTASection, value: string) =>
    setContent(c => ({ ...c, cta: { ...c.cta, [field]: value } }));

  const setSEO = (field: keyof SEOMeta, value: string) =>
    setContent(c => ({ ...c, seo: { ...c.seo, [field]: value } }));

  const setSpecific = (field: string, value: any) =>
    setContent(c => ({ ...c, specific: { ...c.specific, [field]: value } }));

  const sp = content.specific as any;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex-1 min-w-0">
          <Select value={selectedPage} onValueChange={setSelectedPage}>
            <SelectTrigger className="w-full sm:w-72">
              <SelectValue placeholder="Seleccionar página" />
            </SelectTrigger>
            <SelectContent>
              {PAGES.map(p => (
                <SelectItem key={p.key} value={p.key}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Button variant="outline" size="sm" onClick={() => window.open(`https://patologias.micasaverde.es${page.slug}`, '_blank')}>
            <ExternalLink className="h-4 w-4 mr-1.5" />
            Ver página
          </Button>
          <Button size="sm" onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <Save className="h-4 w-4 mr-1.5" />}
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="hero">
        <TabsList className="grid grid-cols-3 sm:grid-cols-6 h-auto gap-1">
          <TabsTrigger value="hero" className="text-xs"><Layout className="h-3 w-3 mr-1" />Hero</TabsTrigger>
          <TabsTrigger value="content" className="text-xs"><FileText className="h-3 w-3 mr-1" />Contenido</TabsTrigger>
          <TabsTrigger value="steps" className="text-xs"><ArrowRight className="h-3 w-3 mr-1" />Pasos</TabsTrigger>
          <TabsTrigger value="faq" className="text-xs"><HelpCircle className="h-3 w-3 mr-1" />FAQ</TabsTrigger>
          <TabsTrigger value="cta" className="text-xs"><Megaphone className="h-3 w-3 mr-1" />CTA</TabsTrigger>
          <TabsTrigger value="seo" className="text-xs"><Globe className="h-3 w-3 mr-1" />SEO</TabsTrigger>
        </TabsList>

        {/* ── HERO TAB ── */}
        <TabsContent value="hero">
          <Card>
            <CardHeader><CardTitle className="text-base">Sección Hero (cabecera)</CardTitle><CardDescription>La primera sección visible de la página</CardDescription></CardHeader>
            <CardContent className="space-y-5">
              <FieldRow label="Badge / etiqueta pequeña">
                <Input value={content.hero.badge} onChange={e => setHero('badge', e.target.value)} />
              </FieldRow>
              <FieldRow label="Título H1 principal">
                <Input value={content.hero.h1} onChange={e => setHero('h1', e.target.value)} className="font-semibold" />
              </FieldRow>
              <FieldRow label="Subtítulo / descripción">
                <Textarea value={content.hero.subtitle} onChange={e => setHero('subtitle', e.target.value)} rows={3} />
              </FieldRow>
              <FieldRow label="Texto del botón CTA">
                <Input value={content.hero.cta_text} onChange={e => setHero('cta_text', e.target.value)} />
              </FieldRow>
              <FieldRow label="Nota bajo el botón">
                <Input value={content.hero.subnote} onChange={e => setHero('subnote', e.target.value)} />
              </FieldRow>
              <FieldRow label="Imagen de fondo del hero" hint="Relación 16:9 recomendada. Se mostrará detrás del texto.">
                <div className="flex items-center gap-3">
                  {content.hero.image_url ? (
                    <img src={content.hero.image_url} alt="Hero" className="h-20 w-36 object-cover rounded-lg border" />
                  ) : (
                    <div className="h-20 w-36 bg-muted rounded-lg border flex items-center justify-center text-muted-foreground text-xs">Sin imagen</div>
                  )}
                  <Button variant="outline" size="sm" onClick={() => setCropModal({ open: true, target: 'hero', aspect: 16 / 9 })}>
                    <Image className="h-4 w-4 mr-1.5" />
                    {content.hero.image_url ? 'Cambiar imagen' : 'Subir imagen'}
                  </Button>
                  {content.hero.image_url && (
                    <Button variant="ghost" size="sm" onClick={() => setHero('image_url', '')}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {content.hero.image_url && (
                  <Input className="mt-2 text-xs" value={content.hero.image_url} onChange={e => setHero('image_url', e.target.value)} placeholder="URL de la imagen" />
                )}
              </FieldRow>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── CONTENT TAB (page-specific) ── */}
        <TabsContent value="content">
          <Card>
            <CardHeader><CardTitle className="text-base">Contenido específico de la página</CardTitle><CardDescription>Secciones únicas de {page.label}</CardDescription></CardHeader>
            <CardContent className="space-y-6">
              {selectedPage === 'landing_humedades' && (
                <>
                  <SectionTitle icon={FileText} title="Sección: ¿Qué es un informe pericial?" />
                  <FieldRow label="Título de la sección"><Input value={sp.what_is_title} onChange={e => setSpecific('what_is_title', e.target.value)} /></FieldRow>
                  <FieldRow label="Párrafo 1"><Textarea value={sp.what_is_p1} onChange={e => setSpecific('what_is_p1', e.target.value)} rows={3} /></FieldRow>
                  <FieldRow label="Párrafo 2"><Textarea value={sp.what_is_p2} onChange={e => setSpecific('what_is_p2', e.target.value)} rows={3} /></FieldRow>
                  <FieldRow label="Párrafo 3"><Textarea value={sp.what_is_p3} onChange={e => setSpecific('what_is_p3', e.target.value)} rows={3} /></FieldRow>

                  <SectionTitle icon={FileText} title="Sección: ¿Cuándo necesitas el informe?" />
                  <FieldRow label="Título de la sección"><Input value={sp.when_title} onChange={e => setSpecific('when_title', e.target.value)} /></FieldRow>
                  {(sp.when_items as ListItem[]).map((item, i) => (
                    <div key={i} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">Item {i + 1}</Badge>
                        <Button variant="ghost" size="sm" onClick={() => { const items = [...sp.when_items]; items.splice(i, 1); setSpecific('when_items', items); }}><Trash2 className="h-3 w-3" /></Button>
                      </div>
                      <Input placeholder="Título" value={item.title} onChange={e => { const items = [...sp.when_items]; items[i] = { ...items[i], title: e.target.value }; setSpecific('when_items', items); }} />
                      <Textarea placeholder="Descripción" value={item.desc} onChange={e => { const items = [...sp.when_items]; items[i] = { ...items[i], desc: e.target.value }; setSpecific('when_items', items); }} rows={2} />
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={() => setSpecific('when_items', [...sp.when_items, { title: '', desc: '' }])}><Plus className="h-3 w-3 mr-1" />Añadir item</Button>
                </>
              )}

              {selectedPage === 'landing_grietas' && (
                <>
                  <SectionTitle icon={FileText} title="Sección: Tipos de grietas (comparativa)" />
                  <FieldRow label="Título"><Input value={sp.types_title} onChange={e => setSpecific('types_title', e.target.value)} /></FieldRow>
                  <FieldRow label="Párrafo introductorio"><Textarea value={sp.types_intro} onChange={e => setSpecific('types_intro', e.target.value)} rows={2} /></FieldRow>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-green-700 dark:text-green-400 font-medium">Columna: No preocupantes</Label>
                      <Input value={sp.col_ok_title} onChange={e => setSpecific('col_ok_title', e.target.value)} className="border-green-200" />
                      {(sp.col_ok_items as string[]).map((item, i) => (
                        <div key={i} className="flex gap-2">
                          <Input value={item} onChange={e => { const arr = [...sp.col_ok_items]; arr[i] = e.target.value; setSpecific('col_ok_items', arr); }} />
                          <Button variant="ghost" size="icon" onClick={() => { const arr = [...sp.col_ok_items]; arr.splice(i, 1); setSpecific('col_ok_items', arr); }}><Trash2 className="h-3 w-3" /></Button>
                        </div>
                      ))}
                      <Button variant="outline" size="sm" onClick={() => setSpecific('col_ok_items', [...sp.col_ok_items, ''])}><Plus className="h-3 w-3 mr-1" />Añadir</Button>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-red-700 dark:text-red-400 font-medium">Columna: Pueden ser estructurales</Label>
                      <Input value={sp.col_bad_title} onChange={e => setSpecific('col_bad_title', e.target.value)} className="border-red-200" />
                      {(sp.col_bad_items as string[]).map((item, i) => (
                        <div key={i} className="flex gap-2">
                          <Input value={item} onChange={e => { const arr = [...sp.col_bad_items]; arr[i] = e.target.value; setSpecific('col_bad_items', arr); }} />
                          <Button variant="ghost" size="icon" onClick={() => { const arr = [...sp.col_bad_items]; arr.splice(i, 1); setSpecific('col_bad_items', arr); }}><Trash2 className="h-3 w-3" /></Button>
                        </div>
                      ))}
                      <Button variant="outline" size="sm" onClick={() => setSpecific('col_bad_items', [...sp.col_bad_items, ''])}><Plus className="h-3 w-3 mr-1" />Añadir</Button>
                    </div>
                  </div>

                  <SectionTitle icon={FileText} title="Sección: ¿Cuándo necesitas el informe?" />
                  <FieldRow label="Título"><Input value={sp.when_title} onChange={e => setSpecific('when_title', e.target.value)} /></FieldRow>
                  {(sp.when_items as ListItem[]).map((item, i) => (
                    <div key={i} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between"><Badge variant="outline">Item {i + 1}</Badge><Button variant="ghost" size="sm" onClick={() => { const items = [...sp.when_items]; items.splice(i, 1); setSpecific('when_items', items); }}><Trash2 className="h-3 w-3" /></Button></div>
                      <Input value={item.title} onChange={e => { const items = [...sp.when_items]; items[i] = { ...items[i], title: e.target.value }; setSpecific('when_items', items); }} />
                      <Textarea value={item.desc} onChange={e => { const items = [...sp.when_items]; items[i] = { ...items[i], desc: e.target.value }; setSpecific('when_items', items); }} rows={2} />
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={() => setSpecific('when_items', [...sp.when_items, { title: '', desc: '' }])}><Plus className="h-3 w-3 mr-1" />Añadir item</Button>
                </>
              )}

              {selectedPage === 'landing_danos' && (
                <>
                  <SectionTitle icon={FileText} title="Sección: ¿Por qué necesitas el informe?" />
                  <FieldRow label="Título"><Input value={sp.why_title} onChange={e => setSpecific('why_title', e.target.value)} /></FieldRow>
                  <FieldRow label="Párrafo 1"><Textarea value={sp.why_p1} onChange={e => setSpecific('why_p1', e.target.value)} rows={2} /></FieldRow>
                  <FieldRow label="Párrafo 2"><Textarea value={sp.why_p2} onChange={e => setSpecific('why_p2', e.target.value)} rows={2} /></FieldRow>
                  <FieldRow label="Lista de ventajas (checklist)" hint="Una ventaja por línea de texto">
                    {(sp.why_checklist as string[]).map((item, i) => (
                      <div key={i} className="flex gap-2 mt-1.5">
                        <Input value={item} onChange={e => { const arr = [...sp.why_checklist]; arr[i] = e.target.value; setSpecific('why_checklist', arr); }} />
                        <Button variant="ghost" size="icon" onClick={() => { const arr = [...sp.why_checklist]; arr.splice(i, 1); setSpecific('why_checklist', arr); }}><Trash2 className="h-3 w-3" /></Button>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" className="mt-2" onClick={() => setSpecific('why_checklist', [...sp.why_checklist, ''])}><Plus className="h-3 w-3 mr-1" />Añadir</Button>
                  </FieldRow>

                  <SectionTitle icon={FileText} title="Sección: Tipos de daños" />
                  <FieldRow label="Título"><Input value={sp.types_title} onChange={e => setSpecific('types_title', e.target.value)} /></FieldRow>
                  {(sp.types_items as {icon:string;title:string;desc:string}[]).map((item, i) => (
                    <div key={i} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between"><Badge variant="outline">Tipo {i + 1}</Badge><Button variant="ghost" size="sm" onClick={() => { const arr = [...sp.types_items]; arr.splice(i, 1); setSpecific('types_items', arr); }}><Trash2 className="h-3 w-3" /></Button></div>
                      <div className="grid grid-cols-5 gap-2">
                        <Input placeholder="Emoji" value={item.icon} onChange={e => { const arr = [...sp.types_items]; arr[i] = { ...arr[i], icon: e.target.value }; setSpecific('types_items', arr); }} className="col-span-1" />
                        <Input placeholder="Título" value={item.title} onChange={e => { const arr = [...sp.types_items]; arr[i] = { ...arr[i], title: e.target.value }; setSpecific('types_items', arr); }} className="col-span-4" />
                      </div>
                      <Textarea placeholder="Descripción" value={item.desc} onChange={e => { const arr = [...sp.types_items]; arr[i] = { ...arr[i], desc: e.target.value }; setSpecific('types_items', arr); }} rows={2} />
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={() => setSpecific('types_items', [...sp.types_items, { icon: '', title: '', desc: '' }])}><Plus className="h-3 w-3 mr-1" />Añadir tipo</Button>
                </>
              )}

              {selectedPage === 'landing_comunidad' && (
                <>
                  <SectionTitle icon={FileText} title="Sección: ¿Quién es responsable?" />
                  <FieldRow label="Título"><Input value={sp.resp_title} onChange={e => setSpecific('resp_title', e.target.value)} /></FieldRow>
                  <FieldRow label="Párrafo introductorio"><Textarea value={sp.resp_intro} onChange={e => setSpecific('resp_intro', e.target.value)} rows={2} /></FieldRow>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-blue-700 dark:text-blue-400 font-medium">Columna: Vecino</Label>
                      <Input value={sp.col_vecino_title} onChange={e => setSpecific('col_vecino_title', e.target.value)} />
                      {(sp.col_vecino_items as string[]).map((item, i) => (
                        <div key={i} className="flex gap-2"><Input value={item} onChange={e => { const arr = [...sp.col_vecino_items]; arr[i] = e.target.value; setSpecific('col_vecino_items', arr); }} /><Button variant="ghost" size="icon" onClick={() => { const arr = [...sp.col_vecino_items]; arr.splice(i, 1); setSpecific('col_vecino_items', arr); }}><Trash2 className="h-3 w-3" /></Button></div>
                      ))}
                      <Button variant="outline" size="sm" onClick={() => setSpecific('col_vecino_items', [...sp.col_vecino_items, ''])}><Plus className="h-3 w-3 mr-1" />Añadir</Button>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-amber-700 dark:text-amber-400 font-medium">Columna: Comunidad</Label>
                      <Input value={sp.col_comunidad_title} onChange={e => setSpecific('col_comunidad_title', e.target.value)} />
                      {(sp.col_comunidad_items as string[]).map((item, i) => (
                        <div key={i} className="flex gap-2"><Input value={item} onChange={e => { const arr = [...sp.col_comunidad_items]; arr[i] = e.target.value; setSpecific('col_comunidad_items', arr); }} /><Button variant="ghost" size="icon" onClick={() => { const arr = [...sp.col_comunidad_items]; arr.splice(i, 1); setSpecific('col_comunidad_items', arr); }}><Trash2 className="h-3 w-3" /></Button></div>
                      ))}
                      <Button variant="outline" size="sm" onClick={() => setSpecific('col_comunidad_items', [...sp.col_comunidad_items, ''])}><Plus className="h-3 w-3 mr-1" />Añadir</Button>
                    </div>
                  </div>

                  <SectionTitle icon={FileText} title="Sección: Cómo reclamar (pasos numerados)" />
                  <FieldRow label="Título"><Input value={sp.claim_title} onChange={e => setSpecific('claim_title', e.target.value)} /></FieldRow>
                  {(sp.claim_steps as ListItem[]).map((step, i) => (
                    <div key={i} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between"><Badge>Paso {i + 1}</Badge><Button variant="ghost" size="sm" onClick={() => { const arr = [...sp.claim_steps]; arr.splice(i, 1); setSpecific('claim_steps', arr); }}><Trash2 className="h-3 w-3" /></Button></div>
                      <Input value={step.title} onChange={e => { const arr = [...sp.claim_steps]; arr[i] = { ...arr[i], title: e.target.value }; setSpecific('claim_steps', arr); }} />
                      <Textarea value={step.desc} onChange={e => { const arr = [...sp.claim_steps]; arr[i] = { ...arr[i], desc: e.target.value }; setSpecific('claim_steps', arr); }} rows={2} />
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={() => setSpecific('claim_steps', [...sp.claim_steps, { title: '', desc: '' }])}><Plus className="h-3 w-3 mr-1" />Añadir paso</Button>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── HOW IT WORKS TAB ── */}
        <TabsContent value="steps">
          <Card>
            <CardHeader><CardTitle className="text-base">Sección: Cómo funciona (3 pasos)</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <FieldRow label="Título de la sección">
                <Input value={content.how_it_works.section_title} onChange={e => setHIW('section_title', e.target.value)} />
              </FieldRow>
              <div className="grid md:grid-cols-3 gap-4">
                {content.how_it_works.steps.map((step, i) => (
                  <div key={i} className="border rounded-xl p-4 space-y-3 bg-muted/20">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">{i + 1}</div>
                      <span className="text-xs text-muted-foreground font-medium">Paso {i + 1}</span>
                    </div>
                    <Input placeholder="Título del paso" value={step.title} onChange={e => { const steps = [...content.how_it_works.steps]; steps[i] = { ...steps[i], title: e.target.value }; setHIW('steps', steps); }} />
                    <Textarea placeholder="Descripción" value={step.desc} onChange={e => { const steps = [...content.how_it_works.steps]; steps[i] = { ...steps[i], desc: e.target.value }; setHIW('steps', steps); }} rows={3} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── FAQ TAB ── */}
        <TabsContent value="faq">
          <Card>
            <CardHeader><CardTitle className="text-base">Sección: Preguntas Frecuentes (FAQ)</CardTitle><CardDescription>Estas preguntas también se incluyen en el schema JSON-LD para SEO</CardDescription></CardHeader>
            <CardContent className="space-y-5">
              <FieldRow label="Título de la sección">
                <Input value={content.faq.section_title} onChange={e => setFAQ('section_title', e.target.value)} />
              </FieldRow>
              {content.faq.faqs.map((faq, i) => (
                <div key={i} className="border rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">Pregunta {i + 1}</Badge>
                    <Button variant="ghost" size="sm" onClick={() => { const faqs = [...content.faq.faqs]; faqs.splice(i, 1); setFAQ('faqs', faqs); }}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  <FieldRow label="Pregunta">
                    <Input value={faq.q} onChange={e => { const faqs = [...content.faq.faqs]; faqs[i] = { ...faqs[i], q: e.target.value }; setFAQ('faqs', faqs); }} />
                  </FieldRow>
                  <FieldRow label="Respuesta">
                    <Textarea value={faq.a} onChange={e => { const faqs = [...content.faq.faqs]; faqs[i] = { ...faqs[i], a: e.target.value }; setFAQ('faqs', faqs); }} rows={3} />
                  </FieldRow>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => setFAQ('faqs', [...content.faq.faqs, { q: '', a: '' }])}>
                <Plus className="h-4 w-4 mr-1.5" />
                Añadir pregunta
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── CTA TAB ── */}
        <TabsContent value="cta">
          <Card>
            <CardHeader><CardTitle className="text-base">Sección CTA final (llamada a la acción)</CardTitle><CardDescription>La sección al final de la página para motivar al usuario a actuar</CardDescription></CardHeader>
            <CardContent className="space-y-5">
              <FieldRow label="Título H2">
                <Input value={content.cta.h2} onChange={e => setCTA('h2', e.target.value)} />
              </FieldRow>
              <FieldRow label="Subtítulo">
                <Textarea value={content.cta.subtitle} onChange={e => setCTA('subtitle', e.target.value)} rows={2} />
              </FieldRow>
              <FieldRow label="Texto del botón">
                <Input value={content.cta.btn_text} onChange={e => setCTA('btn_text', e.target.value)} />
              </FieldRow>
              <FieldRow label="Nota bajo el botón">
                <Input value={content.cta.subnote} onChange={e => setCTA('subnote', e.target.value)} />
              </FieldRow>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── SEO TAB ── */}
        <TabsContent value="seo">
          <Card>
            <CardHeader><CardTitle className="text-base">Meta etiquetas SEO</CardTitle><CardDescription>Controla cómo aparece la página en Google y en redes sociales</CardDescription></CardHeader>
            <CardContent className="space-y-5">
              <FieldRow label="Meta título (title)" hint="Aparece en el tab del navegador y en resultados de Google. Máx. 60 caracteres.">
                <Input value={content.seo.title} onChange={e => setSEO('title', e.target.value)} />
                <CharCount value={content.seo.title} max={60} />
              </FieldRow>
              <FieldRow label="Meta descripción" hint="Aparece bajo el título en resultados de Google. Máx. 160 caracteres.">
                <Textarea value={content.seo.description} onChange={e => setSEO('description', e.target.value)} rows={3} />
                <CharCount value={content.seo.description} max={160} />
              </FieldRow>
              <div className="border-t pt-4">
                <p className="text-sm font-medium mb-3 text-muted-foreground">Open Graph (Facebook, LinkedIn, WhatsApp)</p>
                <div className="space-y-4">
                  <FieldRow label="OG Título">
                    <Input value={content.seo.og_title} onChange={e => setSEO('og_title', e.target.value)} />
                    <CharCount value={content.seo.og_title} max={70} />
                  </FieldRow>
                  <FieldRow label="OG Descripción">
                    <Textarea value={content.seo.og_description} onChange={e => setSEO('og_description', e.target.value)} rows={2} />
                    <CharCount value={content.seo.og_description} max={200} />
                  </FieldRow>
                  <FieldRow label="OG Imagen" hint="Imagen para compartir en redes. Tamaño ideal: 1200×630px.">
                    <div className="flex items-center gap-3">
                      {content.seo.og_image_url ? (
                        <img src={content.seo.og_image_url} alt="OG" className="h-16 w-28 object-cover rounded border" />
                      ) : (
                        <div className="h-16 w-28 bg-muted rounded border flex items-center justify-center text-muted-foreground text-xs">Sin imagen</div>
                      )}
                      <Button variant="outline" size="sm" onClick={() => setCropModal({ open: true, target: 'og', aspect: 1200 / 630 })}>
                        <Image className="h-4 w-4 mr-1.5" />
                        {content.seo.og_image_url ? 'Cambiar' : 'Subir imagen'}
                      </Button>
                      {content.seo.og_image_url && (
                        <Button variant="ghost" size="sm" onClick={() => setSEO('og_image_url', '')}><Trash2 className="h-4 w-4" /></Button>
                      )}
                    </div>
                  </FieldRow>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Bottom save bar */}
      <div className="sticky bottom-4 flex justify-end">
        <Button onClick={handleSave} disabled={saving} className="shadow-lg">
          {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          {saving ? 'Guardando...' : 'Guardar todos los cambios'}
        </Button>
      </div>

      {/* Image Crop Modal */}
      <ImageCropModal
        open={cropModal.open}
        aspect={cropModal.aspect}
        title={cropModal.target === 'hero' ? 'Subir imagen hero (16:9)' : 'Subir imagen Open Graph (1200×630)'}
        onClose={() => setCropModal(c => ({ ...c, open: false }))}
        onUploaded={(url) => {
          if (cropModal.target === 'hero') setHero('image_url', url);
          else setSEO('og_image_url', url);
          setCropModal(c => ({ ...c, open: false }));
        }}
      />
    </div>
  );
}
