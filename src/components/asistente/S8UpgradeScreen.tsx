import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { S8Analysis } from '@/types/expediente';
import { casaDiagAPI } from '@/services/api/casadiag-api';
import { trackEvent } from '@/lib/analytics';
import { Check, Download, Bookmark, ShieldCheck, Phone } from 'lucide-react';

interface S8UpgradeScreenProps {
  analysis: S8Analysis;
  /** Internal expediente id used for routing; falls back to the MCV case id. */
  expedienteId?: string;
  caseId: string;
}

type Severity = 'baja' | 'media_alta';

/**
 * Severity for the personalised copy (document 3.4).
 *
 * The AI does not return a severity field: production's S8 payload is the
 * block_1..block_5 shape, so the only signal is the prose in
 * block_3_risk_assessment (e.g. "El riesgo es alto debido a..."). We read that,
 * and default to media_alta when it is ambiguous — under-stating a structural
 * risk is the more harmful mistake.
 */
export function detectSeverity(analysis: S8Analysis): Severity {
  const text = (analysis?.block_3_risk_assessment?.content || '').toLowerCase();
  if (!text) return 'media_alta';

  if (/\b(alto|alta|elevad[oa]|grave|urgente|crític[oa])\b|🔴/.test(text)) {
    return 'media_alta';
  }
  if (/\b(medio|media|moderad[oa])\b|🟡/.test(text)) return 'media_alta';
  if (/\b(bajo|baja|leve|reducid[oa]|men[oa]r)\b|🟢/.test(text)) return 'baja';

  return 'media_alta';
}

const SEVERITY_COPY: Record<Severity, string> = {
  baja:
    'El pre-diagnóstico apunta a una patología probablemente leve. Un informe técnico te da la certeza y la estimación de coste.',
  media_alta:
    'El pre-diagnóstico indica que esta patología puede tener cierta entidad. Recomendamos informe técnico para descartar afección estructural y definir la actuación correcta antes de que empeore.',
};

const VALUE_ITEMS = [
  'Consulta telefónica con el arquitecto',
  'Informe técnico firmado por arquitecto colegiado',
  'Hipótesis y causas probables',
  'Propuesta de actuación por fases',
  'Estimación económica orientativa',
];

export function S8UpgradeScreen({ analysis, expedienteId, caseId }: S8UpgradeScreenProps) {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const severity = detectSeverity(analysis);

  const handleUpgrade = () => {
    trackEvent('click_upgrade_400', { case_id: caseId, severity });
    navigate(`/informe-completo/${expedienteId || caseId}`);
  };

  // No PDF dependency in this project; the browser's own "Save as PDF" is the
  // honest way to hand over an unsigned copy without shipping a signed-looking
  // document. The print stylesheet keeps only the analysis.
  const handleDownloadPdf = () => {
    window.print();
  };

  const handleSaveForLater = async () => {
    trackEvent('save_for_later', { case_id: caseId });

    // Tell the backend, so the 24h reminder (document 6.4) can fire. Best-effort:
    // never block the user's copy-link on this.
    try {
      await casaDiagAPI.saveCaseForLater(expedienteId || caseId);
    } catch {
      /* reminder is a nice-to-have; the link below still works */
    }

    const url = `${window.location.origin}/asistente/expediente/${expedienteId || caseId}`;
    try {
      await navigator.clipboard.writeText(url);
      setSaved(true);
      toast({
        title: 'Enlace copiado',
        description: 'Guarda este enlace para retomar tu caso cuando quieras (30 días).',
      });
      setTimeout(() => setSaved(false), 3000);
    } catch {
      toast({
        title: 'Guarda este enlace',
        description: url,
      });
    }
  };

  return (
    <div className="mt-6 space-y-5 print:hidden">
      {/* Header (doc 3.3) */}
      <div className="text-center">
        <h2 className="text-xl md:text-2xl font-bold">Tu pre-diagnóstico está listo</h2>
        <p className="mx-auto mt-2 max-w-xl text-xs md:text-sm text-muted-foreground leading-relaxed">
          Este pre-diagnóstico es <strong>orientativo y gratuito</strong>. Para tomar
          decisiones con seguridad —y para que tenga validez ante un seguro, una
          comunidad o un juzgado— necesitas un informe técnico firmado.
        </p>
      </div>

      {/* Severity-personalised message (doc 3.4) */}
      <div
        className={`rounded-lg border p-3 md:p-4 text-xs md:text-sm leading-relaxed ${
          severity === 'baja'
            ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-900 dark:text-emerald-200'
            : 'border-orange-500/30 bg-orange-500/5 text-orange-900 dark:text-orange-200'
        }`}
      >
        {SEVERITY_COPY[severity]}
      </div>

      {/* Value box (doc 3.3) */}
      <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-4 md:p-5">
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-base md:text-lg font-bold">Informe Técnico Online</h3>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-primary">400 €</span>
            <span className="text-xs font-medium text-muted-foreground">+ IVA</span>
          </div>
        </div>
        <ul className="space-y-2">
          {VALUE_ITEMS.map((item) => (
            <li key={item} className="flex items-start gap-2 text-xs md:text-sm">
              <span className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-primary/15">
                <Check className="h-2.5 w-2.5 text-primary" />
              </span>
              <span className="text-foreground/90">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Testimonial (doc 3.3) */}
      <figure className="rounded-lg border border-border bg-muted/30 p-4">
        <blockquote className="text-xs md:text-sm italic leading-relaxed text-foreground/90">
          “Hice el análisis gratis, subí las fotos, hablé con el arquitecto por teléfono
          y en 48 horas tenía el informe. Me ahorró una obra de 8.000 € que no
          necesitaba.”
        </blockquote>
        <figcaption className="mt-2 text-[11px] md:text-xs font-medium text-muted-foreground">
          — María G., propietaria en Valencia
        </figcaption>
      </figure>

      {/* CTAs (doc 3.3: principal / secundario / terciario) */}
      <div className="space-y-2.5">
        <Button
          variant="cta"
          size="lg"
          className="h-auto w-full py-3.5 text-sm md:text-base font-semibold"
          onClick={handleUpgrade}
        >
          Solicitar informe técnico (400 € + IVA)
        </Button>

        <Button
          variant="ghost"
          className="w-full text-xs md:text-sm"
          onClick={handleDownloadPdf}
        >
          <Download className="mr-1.5 h-4 w-4" />
          Descargar pre-diagnóstico gratuito en PDF
        </Button>
        <p className="-mt-1 text-center text-[10px] text-muted-foreground">
          Sin firma, sin validez ante terceros.
        </p>

        <button
          type="button"
          onClick={handleSaveForLater}
          className="mx-auto flex items-center gap-1.5 text-[11px] md:text-xs text-muted-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
        >
          <Bookmark className="h-3 w-3" />
          {saved ? 'Enlace copiado' : 'Guardar mi caso y volver en otro momento'}
        </button>
      </div>

      {/* Guarantee (doc 3.3) */}
      <div className="flex items-start gap-2 rounded-lg border border-border bg-muted/30 p-3">
        <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
        <p className="text-[11px] md:text-xs text-muted-foreground leading-relaxed">
          <strong className="text-foreground">Pago seguro.</strong> Solo se procesa
          cuando el informe ha sido revisado y entregado.
        </p>
      </div>

      {/* Phone fallback — mirrors the header/footer contact from doc 3.1 */}
      <p className="text-center text-[11px] text-muted-foreground">
        ¿Dudas antes de decidir?{' '}
        <a
          href="tel:+34634278435"
          className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
        >
          <Phone className="h-3 w-3" />
          634 278 435
        </a>
      </p>
    </div>
  );
}
