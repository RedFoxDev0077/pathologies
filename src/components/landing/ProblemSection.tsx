import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Users, PhoneCall, AlertTriangle, Award, FileSignature, FolderCheck } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

// Three balanced cards with equal copy lengths for visual balance
const problems = [
  {
    icon: Users,
    title: "No sé qué pasa",
    description: "¿Es solo estético o un problema estructural?",
  },
  {
    icon: PhoneCall,
    title: "No sé si es grave",
    description: "Necesito saber qué pasa antes de gastar",
  },
  {
    icon: AlertTriangle,
    title: "No sé qué hacer ahora",
    description: "El tiempo puede jugar a favor... o en contra",
  },
];

// Credentials, one small icon per line (client request p.2)
const credentials = [
  { icon: Award, text: "Arquitecto e Ingeniero con más de 30 años de experiencia" },
  { icon: FileSignature, text: "Informes técnicos firmados" },
  { icon: FolderCheck, text: "Casos reales" },
];

export function ProblemSection() {
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation<HTMLDivElement>({
    threshold: 0.3,
  });
  const { ref: cardsRef, isVisible: cardsVisible } = useScrollAnimation<HTMLDivElement>({
    threshold: 0.2,
  });
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollAnimation<HTMLDivElement>({
    threshold: 0.3,
  });

  return (
    <section id="que-resolvemos" className="section">
      <div className="container">
        {/* Quote Banner */}
        <div
          ref={headerRef}
          className={`mx-auto max-w-4xl mb-10 transition-all duration-600 ease-out ${
            headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="bg-accent/50 border border-border rounded-lg px-6 py-4 text-center">
            <p className="text-base md:text-lg text-foreground font-medium">
              Antes de gastar dinero en una reparación, descubre cuál es el verdadero problema.
            </p>
          </div>
        </div>

        {/* Main Header */}
        <div
          className={`text-center mb-12 transition-all duration-600 ease-out ${
            headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "100ms" }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3">
            ¡DESCUBRE QUÉ LE PASA REALMENTE A TU VIVIENDA!
          </h2>
          <h3 className="text-xl md:text-2xl font-semibold text-foreground/90 mb-4">
            Antes de que tomes una decisión
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Un arquitecto colegiado analiza tu caso antes de que tomes una decisión
          </p>
          <p className="text-foreground font-medium mt-2">
            ¡El PROCESO TE GUÍA!,{" "}
            <span className="font-bold">no te presiona</span>
          </p>
        </div>

        {/* Three Problem Cards - Using card-artistic theme */}
        <div
          ref={cardsRef}
          className="mx-auto max-w-4xl mb-12 grid gap-6 md:grid-cols-3"
        >
          {problems.map((problem, index) => (
            <div
              key={index}
              className={`card-artistic group p-6 text-center transition-all duration-500 ease-out ${
                cardsVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: cardsVisible ? `${index * 100}ms` : "0ms" }}
            >
              {/* Shine sweep effect */}
              <div className="card-artistic-shine" />

              {/* Icon with themed styling */}
              <div className="mb-5 flex justify-center">
                <div className="relative">
                  {/* Glow effect */}
                  <div className="absolute inset-[-8px] rounded-full bg-gradient-to-br from-primary/20 to-primary/5 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/20 flex items-center justify-center group-hover:from-primary/25 group-hover:to-primary/10 transition-all duration-300">
                    <problem.icon className="h-7 w-7 text-primary transition-transform duration-300 group-hover:scale-110" />
                  </div>
                </div>
              </div>

              {/* Title */}
              <h4 className="card-artistic-title text-lg font-bold mb-3">
                {problem.title}
              </h4>

              {/* Description */}
              <p className="text-sm text-muted-foreground leading-relaxed">
                {problem.description}
              </p>
            </div>
          ))}
        </div>

        {/* Authority Text & CTA */}
        <div
          ref={ctaRef}
          className={`text-center transition-all duration-600 ease-out ${
            ctaVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Credentials — one small icon per line (client request p.2) */}
          <div className="mb-6 inline-flex flex-col items-start gap-2.5 rounded-xl border border-border bg-card px-5 py-4 text-left mx-auto">
            {credentials.map((c, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <c.icon className="h-4 w-4 text-primary" />
                </span>
                <span className="text-sm font-medium text-foreground">{c.text}</span>
              </div>
            ))}
          </div>
          <p className="mb-6 text-sm text-foreground font-medium">
            Informes técnicos reales <strong className="text-primary">NO genéricos</strong>
          </p>

          {/* CTA Button - Two Lines */}
          <Button
            variant="cta"
            size="lg"
            className="h-auto py-3 px-8 flex-col gap-0.5 shadow-lg shadow-primary/20 btn-animated"
            asChild
          >
            <Link to="/asistente">
              <span className="text-base font-semibold">Analiza TU CASO ahora</span>
              <span className="text-sm font-bold">¡ES GRATIS!</span>
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
