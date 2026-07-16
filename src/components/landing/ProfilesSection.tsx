import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, Scale, Building, ArrowRight } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const profiles = [
  {
    icon: User,
    image: "/images/profiles/particular.webp",
    title: "Particular",
    description:
      "Si tienes un problema en tu vivienda y necesitas entender qué está pasando antes de llamar a un profesional.",
    tone: "Tono pedagógico, explicaciones claras sin tecnicismos innecesarios.",
    benefits: [
      "Entiende el problema paso a paso",
      "Aprende qué evidencias son útiles",
      "Recibe orientación clara y sin alarmismos",
    ],
    recommendation: "Análisis gratis para filtrar · Informe online (400 €) para la mayoría de casos · Informe pericial (950 €) para reclamaciones.",
  },
  {
    icon: Scale,
    image: "/images/profiles/abogado.webp",
    title: "Abogado",
    description:
      "Si necesitas documentación técnica para un procedimiento judicial o extrajudicial relacionado con vicios constructivos.",
    tone: "Tono formal/técnico orientado a procedimiento legal.",
    benefits: [
      "Informe con estructura profesional",
      "Terminología técnica apropiada",
      "Trazabilidad del expediente",
    ],
    recommendation: "Informe online (400 €) como base pre-procesal · Informe pericial (950 €) para peritaje de parte.",
  },
  {
    icon: Building,
    image: "/images/profiles/administrador.webp",
    title: "Administrador de fincas",
    description:
      "Si gestionas incidencias recurrentes en comunidades y necesitas documentar casos de forma eficiente.",
    tone: "Gestión de casos recurrentes con trazabilidad.",
    benefits: [
      "Gestión de múltiples casos",
      "Expedientes organizados",
      "Histórico de intervenciones",
    ],
    recommendation: "Informe online (400 €) para documentar en junta · Informe pericial (950 €) para litigios.",
  },
];

function ProfileCard({
  profile,
  index,
}: {
  profile: typeof profiles[0];
  index: number;
}) {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>({ threshold: 0.2 });

  return (
    <article
      ref={ref}
      className={`card-artistic group transition-all duration-600 ease-out ${
        isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      {/* Shine sweep effect */}
      <div className="card-artistic-shine" />

      {/* Avatar Section */}
      <div className="pt-6 md:pt-8 pb-2 flex justify-center">
        <div className="relative">
          {/* Animated ring glow */}
          <div className="absolute inset-[-8px] rounded-full bg-gradient-to-r from-primary/30 via-cyan-400/20 to-primary/30 blur-lg opacity-0 group-hover:opacity-100 transition-all duration-700 animate-spin-slow" />

          {/* Secondary glow */}
          <div className="absolute inset-[-4px] rounded-full bg-gradient-to-br from-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Avatar image */}
          <div className="relative h-20 w-20 md:h-28 md:w-28 rounded-full overflow-hidden ring-2 md:ring-3 ring-border/50 group-hover:ring-primary/50 transition-all duration-500 group-hover:scale-105">
            <img
              src={profile.image}
              alt={profile.title}
              width={400}
              height={400}
              className="h-full w-full object-cover transition-all duration-700 filter saturate-95 group-hover:saturate-110 group-hover:scale-110"
              loading="lazy"
            />
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>

          {/* Floating icon badge */}
          <div className="card-artistic-badge -bottom-1 -right-1 h-8 w-8 md:h-10 md:w-10 rounded-full !bg-gradient-to-br !from-primary !to-primary/80 group-hover:!scale-110 group-hover:rotate-12">
            <profile.icon className="h-4 w-4 md:h-5 md:w-5 text-primary-foreground" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="card-artistic-content text-center">
        <h3 className="card-artistic-title mb-2 md:mb-3 text-base md:text-lg">
          {profile.title}
        </h3>

        <p className="mb-3 md:mb-4 text-xs md:text-sm text-muted-foreground leading-relaxed">
          {profile.description}
        </p>

        {/* Tone badge */}
        <div className="mb-4 md:mb-5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/50 border border-primary/10 group-hover:border-primary/30 group-hover:bg-accent transition-all duration-300">
          <span className="h-1.5 w-1.5 rounded-full bg-primary/60 group-hover:bg-primary animate-pulse" />
          <span className="text-[10px] md:text-xs text-muted-foreground italic">
            {profile.tone}
          </span>
        </div>

        {/* Benefits list */}
        <div className="card-artistic-info">
          <ul className="space-y-2 md:space-y-2.5 text-left">
            {profile.benefits.map((benefit, i) => (
              <li
                key={i}
                className="card-artistic-info-item flex items-center gap-2.5 text-xs md:text-sm text-foreground/90 group-hover:text-foreground transition-colors duration-300"
                style={{ transitionDelay: `${i * 50}ms` }}
              >
                <span className="flex-shrink-0 h-5 w-5 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center group-hover:from-primary/30 group-hover:to-primary/20 transition-all duration-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary group-hover:scale-125 transition-transform duration-300" />
                </span>
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        {/* Recommended level for this profile */}
        {profile.recommendation && (
          <div className="mt-4 md:mt-5 rounded-lg bg-primary/5 border border-primary/15 px-3 py-2.5 text-left">
            <p className="text-[10px] md:text-[11px] font-semibold uppercase tracking-wide text-primary/80 mb-1">
              Nivel recomendado
            </p>
            <p className="text-[11px] md:text-xs text-muted-foreground leading-relaxed">
              {profile.recommendation}
            </p>
          </div>
        )}
      </div>
    </article>
  );
}

export function ProfilesSection() {
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation<HTMLDivElement>({
    threshold: 0.3,
  });
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollAnimation<HTMLDivElement>({
    threshold: 0.5,
  });

  return (
    <section id="para-quien" className="section">
      <div className="container">
        <div
          ref={headerRef}
          className={`section-header transition-all duration-600 ease-out ${
            headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="section-title">¿Para quién es cada nivel?</h2>
          <p className="section-subtitle">
            El asistente adapta su lenguaje y enfoque según tu perfil, y cada perfil
            tiene un nivel de informe recomendado. Seleccionarás tu perfil al inicio del proceso.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-4 md:gap-6 grid-cols-1 sm:grid-cols-3">
          {profiles.map((profile, index) => (
            <ProfileCard key={index} profile={profile} index={index} />
          ))}
        </div>

        <div
          ref={ctaRef}
          className={`mt-12 text-center transition-all duration-600 ease-out ${
            ctaVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <Button variant="cta" size="lg" className="w-full sm:w-auto btn-animated btn-arrow-slide" asChild>
            <Link to="/asistente">
              Analizar mi caso ahora
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <p className="mt-4 text-sm text-muted-foreground">
            Seleccionarás tu perfil al inicio del proceso
          </p>
        </div>
      </div>
    </section>
  );
}
