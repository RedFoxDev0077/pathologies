import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const credentials = [
  "Más de 30 años de experiencia en edificación y rehabilitación.",
  "Especialista en patologías constructivas en viviendas.",
  "Informes técnicos, periciales y diagnósticos reales (No genéricos).",
  "Ejercicio profesional independiente.",
  "Colegiado: 12.279 COACV y 3.353 COIAT Valencia",
];

export function HumanReviewSection() {
  const { ref: sectionRef, isVisible: sectionVisible } = useScrollAnimation<HTMLElement>({
    threshold: 0.2,
  });

  return (
    <section ref={sectionRef} className="section bg-background">
      <div className="container">
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <div
            className={`text-center mb-10 transition-all duration-600 ease-out ${
              sectionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
              Un criterio técnico real,
            </h2>
            <h3 className="text-xl md:text-2xl font-semibold text-muted-foreground mb-6">
              con nombre y apellido
            </h3>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Detrás de este servicio hay un profesional colegiado que asume la responsabilidad técnica de cada diagnóstico.
              <br />
              <span className="underline font-medium text-foreground">Cada informe se revisa personalmente antes de entregarse</span>
            </p>
          </div>

          {/* Profile Section */}
          <div
            className={`grid gap-8 lg:grid-cols-2 items-center mb-10 transition-all duration-700 ease-out ${
              sectionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            {/* Photo */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="w-64 h-64 md:w-80 md:h-80 rounded-lg overflow-hidden shadow-xl">
                  <img
                    src="/images/human-review/professional-photo.webp"
                    alt="José Francisco Castillo Miras - Arquitecto e Ingeniero"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to placeholder if image doesn't exist
                      e.currentTarget.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face";
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Credentials */}
            <div className="bg-muted/30 rounded-xl p-6 md:p-8 border border-border">
              <h4 className="text-xl md:text-2xl font-bold mb-1">
                José Francisco Castillo Miras
              </h4>
              <p className="text-muted-foreground mb-6">
                Arquitecto · Ingeniero de la Edificación
                <br />
                <span className="font-medium text-primary">Técnico colegiado</span>
              </p>

              <ul className="space-y-3">
                {credentials.map((credential, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-sm"
                  >
                    <span className="flex-shrink-0 mt-0.5 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check className="h-3 w-3 text-primary" />
                    </span>
                    <span className="text-foreground/90">
                      {credential.includes("30 años") ? (
                        <>Más de <strong>30 años de experiencia</strong> en edificación y rehabilitación.</>
                      ) : credential.includes("patologías") ? (
                        <>Especialista en <strong>patologías constructivas en viviendas.</strong></>
                      ) : (
                        credential
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Quote */}
          <div
            className={`text-center mb-8 transition-all duration-600 ease-out ${
              sectionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <blockquote className="text-lg md:text-xl italic text-muted-foreground max-w-3xl mx-auto">
              "Mi trabajo no es decir qué obra hacer, sino ayudarte a entender qué está pasando en tu vivienda"
            </blockquote>
          </div>

          {/* Professional Badges */}
          <div
            className={`mb-8 transition-all duration-600 ease-out ${
              sectionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "400ms" }}
          >
            {/* Professional Association Badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 mb-6">
              {/* CAATIE Badge */}
              <div className="flex items-center gap-2">
                <img
                  src="/images/human-review/caatie-badge.webp"
                  alt="CAATIE Valencia - Colegio Oficial de Aparejadores"
                  className="h-16 w-auto object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>

              {/* COACV Badge */}
              <div className="flex items-center gap-2">
                <img
                  src="/images/human-review/coacv-badge.webp"
                  alt="COACV - Colegio de Arquitectos de la Comunitat Valenciana"
                  className="h-16 w-auto object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>

              {/* Quality Seal */}
              <div className="flex items-center gap-2">
                <img
                  src="/images/human-review/quality-seal.webp"
                  alt="Garantía de Calidad 100%"
                  className="h-16 w-auto object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            </div>

            {/* Trust Message */}
            <div className="mx-auto max-w-md bg-primary/10 border border-primary/20 rounded-lg px-6 py-4 text-center">
              <p className="text-sm text-foreground">
                <span className="font-medium">Informes bajo responsabilidad profesional</span>
                <br />
                <span className="font-semibold text-primary">Revisión humana obligatoria.</span>
              </p>
            </div>
          </div>

          {/* CTA */}
          <div
            className={`text-center transition-all duration-600 ease-out ${
              sectionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "500ms" }}
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                variant="cta"
                size="lg"
                className="h-auto py-3 px-8 shadow-lg"
                asChild
              >
                <Link to="/asistente">
                  Analiza tu caso Ahora
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>

              {/* INARA Logo */}
              <div className="flex items-center gap-2 text-muted-foreground">
                <img
                  src="/images/brand/inara-logo.webp"
                  alt="INARA proyectos y gestión"
                  className="h-10 w-auto"
                  onError={(e) => {
                    // Hide if logo doesn't exist
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
