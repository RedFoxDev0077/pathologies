import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, X, ArrowRight, Lock } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const packs = [
  {
    name: "Análisis Técnico Orientativo",
    price: "Gratis",
    priceNote: null,
    description: "Orientación técnica inicial para entender si existe una patología y si requiere estudio técnico. Sin PDF, sin firma.",
    features: [
      "Asistente IA guiado paso a paso",
      "Recopilación de fotos y vídeos",
      "Pre-diagnóstico orientativo en pantalla",
      "Identificación inicial del tipo de patología",
      "Recomendación sobre si es necesario un informe técnico",
    ],
    notIncluded: ["No incluye informe firmado"],
    cta: "Analizar gratis",
    highlight: false,
    badge: null,
  },
  {
    name: "Informe Técnico Online",
    price: "400 €",
    priceNote: "+ IVA",
    description: "Análisis completo por fotos/vídeos + consulta telefónica. Informe PDF firmado por arquitecto colegiado.",
    features: [
      "Todo lo del análisis gratuito",
      "Análisis completo de fotos y vídeos",
      "Consulta telefónica con el arquitecto",
      "Informe PDF firmado (8-15 páginas)",
      "Hipótesis, causas y actuación por fases",
      "Estimación económica orientativa",
    ],
    notIncluded: [],
    cta: "Solicitar informe técnico",
    highlight: true,
    badge: "Más solicitado",
    note: "En la mayoría de los casos, este nivel es suficiente para tomar decisiones con claridad.",
  },
  {
    name: "Informe Pericial Presencial",
    price: "950 €",
    priceNote: "+ IVA",
    description: "Inspección in situ obligatoria. Documentación pericial completa, válida para reclamaciones y litigios.",
    features: [
      "Todo lo del informe técnico online",
      "Inspección presencial in situ",
      "Análisis patológico detallado",
      "Valoración técnica de daños",
      "Documentación pericial completa",
      "Válido para procedimientos legales",
    ],
    notIncluded: [],
    cta: "Necesito un informe pericial",
    highlight: false,
    badge: null,
  },
  {
    name: "Proyecto de Intervención",
    price: "Desde 2.000 €",
    priceNote: "+ IVA",
    description: "Proyecto técnico completo para la reparación definitiva de la patología.",
    features: [
      "Diagnóstico completo previo",
      "Proyecto de reparación",
      "Mediciones y presupuesto",
      "Dirección facultativa de obra",
      "Seguimiento de obra",
    ],
    notIncluded: [],
    cta: "Hablar sobre mi caso",
    highlight: false,
    badge: null,
  },
];

const comparisonFeatures = [
  { name: "Asistente IA guiado", free: true, basic: true, pericial: true, project: true },
  { name: "Pre-diagnóstico en pantalla", free: true, basic: true, pericial: true, project: true },
  { name: "Análisis completo de fotos/vídeos", free: false, basic: true, pericial: true, project: true },
  { name: "Consulta telefónica", free: false, basic: true, pericial: true, project: true },
  { name: "Informe firmado (PDF)", free: false, basic: true, pericial: true, project: true },
  { name: "Estimación económica", free: false, basic: true, pericial: true, project: true },
  { name: "Inspección presencial in situ", free: false, basic: false, pericial: true, project: true },
  { name: "Documentación pericial completa", free: false, basic: false, pericial: true, project: true },
  { name: "Válido para litigios", free: false, basic: false, pericial: true, project: true },
  { name: "Proyecto de reparación", free: false, basic: false, pericial: false, project: true },
  { name: "Dirección facultativa", free: false, basic: false, pericial: false, project: true },
];

function PackCard({ pack, index }: { pack: typeof packs[0]; index: number }) {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>({ threshold: 0.2 });

  return (
    <div
      ref={ref}
      className={`group relative transition-all duration-600 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      } ${pack.badge ? "mt-4" : ""}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Badge */}
      {pack.badge && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20 transition-transform duration-300 group-hover:scale-105 group-hover:-translate-y-0.5">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-cyan-500 rounded-full blur-md opacity-60 animate-pulse group-hover:opacity-90 group-hover:blur-lg transition-all duration-300" />
          <div className="relative rounded-full bg-gradient-to-r from-primary to-primary/90 px-3 lg:px-4 py-1.5 lg:py-2 text-[10px] lg:text-xs font-medium text-primary-foreground shadow-lg shadow-primary/30 whitespace-nowrap border border-primary-foreground/10 group-hover:shadow-xl group-hover:shadow-primary/40 transition-shadow duration-300">
            <span className="relative flex items-center gap-1.5">
              <span className="absolute -left-0.5 h-1.5 w-1.5 lg:h-2 lg:w-2 rounded-full bg-primary-foreground/80 animate-ping" />
              <span className="relative h-1.5 w-1.5 lg:h-2 lg:w-2 rounded-full bg-primary-foreground" />
              {pack.badge}
            </span>
          </div>
        </div>
      )}

      <article
        className={`relative flex flex-col h-full bg-card rounded-xl border transition-all duration-300 ${
          pack.highlight
            ? "ring-2 ring-primary/30 shadow-lg shadow-primary/10 border-primary/30"
            : "border-border hover:border-primary/30 hover:shadow-md"
        }`}
      >
        {/* Highlight glow */}
        {pack.highlight && (
          <div className="absolute -inset-[2px] bg-gradient-to-r from-primary/40 via-cyan-400/30 to-primary/40 rounded-[0.85rem] blur-sm opacity-60 -z-10 group-hover:opacity-80 transition-opacity duration-500" />
        )}

        <div className="flex flex-col h-full p-4 lg:p-5">
          {/* Header */}
          <div className="mb-3 lg:mb-4">
            <h3 className="text-sm lg:text-base font-bold mb-1.5 leading-tight">
              {pack.name}
            </h3>
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-xl lg:text-2xl font-bold text-primary whitespace-nowrap">
                {pack.price}
              </span>
              {pack.priceNote && (
                <span className="text-[10px] lg:text-xs text-muted-foreground font-medium">
                  {pack.priceNote}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="mb-4 lg:mb-5 text-xs text-muted-foreground leading-relaxed">
            {pack.description}
          </p>

          {/* Separator */}
          <div className="mb-4 h-px bg-gradient-to-r from-transparent via-border to-transparent group-hover:via-primary/30 transition-colors duration-500" />

          {/* Features list */}
          <div className="mb-4 lg:mb-5 flex-1">
            <ul className="space-y-2 lg:space-y-2.5">
              {pack.features.map((feature, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-xs"
                >
                  <span className="flex-shrink-0 mt-0.5 h-4 w-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <Check className="h-2.5 w-2.5 text-primary" />
                  </span>
                  <span className="leading-tight text-foreground/90">
                    {feature}
                  </span>
                </li>
              ))}
              {pack.notIncluded.map((feature, i) => (
                <li
                  key={`not-${i}`}
                  className="flex items-start gap-2 text-xs text-muted-foreground/70"
                >
                  <span className="flex-shrink-0 mt-0.5 h-4 w-4 rounded-full bg-muted/50 flex items-center justify-center">
                    <X className="h-2.5 w-2.5 text-muted-foreground/50" />
                  </span>
                  <span className="leading-tight">{feature}</span>
                </li>
              ))}
            </ul>

            {/* Note for highlighted pack */}
            {"note" in pack && pack.note && (
              <p className="mt-3 text-[11px] text-primary/80 bg-primary/5 rounded-md px-2 py-1.5 leading-relaxed">
                {pack.note}
              </p>
            )}
          </div>

          {/* CTA Button */}
          <Button
            variant={pack.highlight ? "cta" : "outline-primary"}
            size="sm"
            className={`w-full min-h-[38px] lg:min-h-[42px] text-[11px] lg:text-xs font-medium ${
              pack.highlight
                ? "shadow-md shadow-primary/20"
                : "hover:bg-primary/5"
            }`}
            asChild
          >
            <Link to="/asistente">
              <span>{pack.cta}</span>
              <ArrowRight className="h-3 w-3 lg:h-3.5 lg:w-3.5 flex-shrink-0 ml-1" />
            </Link>
          </Button>
        </div>
      </article>
    </div>
  );
}

export function PacksSection() {
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation<HTMLDivElement>({
    threshold: 0.3,
  });
  const { ref: noteRef, isVisible: noteVisible } = useScrollAnimation<HTMLDivElement>({
    threshold: 0.3,
  });
  const { ref: tableRef, isVisible: tableVisible } = useScrollAnimation<HTMLDivElement>({
    threshold: 0.2,
  });

  return (
    <section id="packs" className="section">
      <div className="container">
        {/* Header */}
        <div
          ref={headerRef}
          className={`section-header transition-all duration-600 ease-out ${
            headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="section-title">Empieza gratis y avanza solo si lo necesitas</h2>
          <p className="section-subtitle">
            Un proceso guiado, claro y sin compromiso. Analiza tu caso paso a paso
            y decide hasta dónde llegar según tu situación real.
          </p>
        </div>

        {/* Important note */}
        <div
          ref={noteRef}
          className={`mx-auto max-w-3xl mb-12 transition-all duration-500 ease-out ${
            noteVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="flex items-start gap-3 p-4 rounded-lg bg-accent/50 border border-border/50">
            <Lock className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <strong className="text-foreground">El sistema te guía, no te presiona.</strong>{" "}
              Cada paso es opcional. Puedes quedarte en el análisis gratuito
              o solicitar un informe solo si lo necesitas. El pago se autoriza al solicitarlo,
              pero <strong>solo se captura cuando el informe ha sido revisado y entregado.</strong>
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="mx-auto mb-16 grid max-w-6xl gap-4 lg:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {packs.map((pack, index) => (
            <PackCard key={index} pack={pack} index={index} />
          ))}
        </div>

        {/* Comparison Table */}
        <div
          ref={tableRef}
          className={`mx-auto max-w-5xl transition-all duration-700 ease-out ${
            tableVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Table Header */}
          <div className="text-center mb-6">
            <h3 className="text-lg font-bold mb-2">
              ¿Qué incluye cada opción?
            </h3>
            <p className="text-sm text-muted-foreground">
              Comparativa técnica detallada para que elijas con total transparencia.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-2 text-left font-medium">Característica</th>
                  <th className="py-2 text-center font-medium">Gratis</th>
                  <th className="py-2 text-center font-medium">400 €</th>
                  <th className="py-2 text-center font-medium">950 €</th>
                  <th className="py-2 text-center font-medium">Desde 2.000 €</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((feature, index) => (
                  <tr
                    key={index}
                    className={`border-b border-border/50 transition-all duration-300 ${
                      tableVisible ? "opacity-100" : "opacity-0"
                    }`}
                    style={{ transitionDelay: tableVisible ? `${index * 50}ms` : "0ms" }}
                  >
                    <td className="py-2 text-xs">{feature.name}</td>
                    <td className="py-2 text-center">
                      {feature.free ? (
                        <Check className="mx-auto h-4 w-4 text-primary" />
                      ) : (
                        <X className="mx-auto h-4 w-4 text-muted-foreground/40" />
                      )}
                    </td>
                    <td className="py-2 text-center">
                      {feature.basic ? (
                        <Check className="mx-auto h-4 w-4 text-primary" />
                      ) : (
                        <X className="mx-auto h-4 w-4 text-muted-foreground/40" />
                      )}
                    </td>
                    <td className="py-2 text-center">
                      {feature.pericial ? (
                        <Check className="mx-auto h-4 w-4 text-primary" />
                      ) : (
                        <X className="mx-auto h-4 w-4 text-muted-foreground/40" />
                      )}
                    </td>
                    <td className="py-2 text-center">
                      {feature.project ? (
                        <Check className="mx-auto h-4 w-4 text-primary" />
                      ) : (
                        <X className="mx-auto h-4 w-4 text-muted-foreground/40" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer note */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              <span className="text-destructive font-medium">*</span>{" "}
              Todos los informes se emiten bajo responsabilidad profesional de{" "}
              <strong className="text-foreground">José Francisco Castillo Miras</strong>, Arquitecto
              Colegiado nº 12.279 COACV / 3.353 COIAT Valencia, con revisión humana obligatoria.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
