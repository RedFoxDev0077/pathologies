import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Camera, Cog, UserCheck, FileText, CircleHelp } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export function HowItWorksSection() {
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation<HTMLDivElement>({
    threshold: 0.3,
  });
  const { ref: stepsRef, isVisible: stepsVisible } = useScrollAnimation<HTMLDivElement>({
    threshold: 0.2,
  });
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollAnimation<HTMLDivElement>({
    threshold: 0.5,
  });

  return (
    <section id="como-funciona" className="section">
      <div className="container">
        {/* Header */}
        <div
          ref={headerRef}
          className={`section-header transition-all duration-600 ease-out ${
            headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="section-title">¿Cómo funciona el diagnóstico?</h2>
          <p className="section-subtitle">
            Un proceso guiado, sencillo y sin compromiso.
            <br />
            <span className="font-medium text-foreground">Tú decides hasta dónde llegar</span>
          </p>
        </div>

        {/* Steps Layout - Step 3 More Prominent */}
        <div
          ref={stepsRef}
          className="mx-auto max-w-5xl"
        >
          <div className="grid gap-6 lg:grid-cols-12 lg:gap-6">
            {/* Left Column - Steps 1 & 2 + No Pressure Message */}
            <div className="lg:col-span-7 flex flex-col gap-5">
              {/* Step 1 - Light Teal/Accent Theme */}
              <div
                className={`card-artistic group relative overflow-hidden transition-all duration-600 ease-out ${
                  stepsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              >
                {/* Accent background overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent to-accent/50 rounded-[inherit]" />

                <div className="relative p-5 md:p-6">
                  {/* Icons row: Person with ? | Number | Camera */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center">
                        <CircleHelp className="h-5 w-5 text-primary" />
                      </div>
                      <span className="text-3xl font-bold text-primary/60">1</span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center">
                      <Camera className="h-5 w-5 text-primary" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-primary mb-2">
                    Subes fotos o vídeos
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Cuéntanos qué ocurre en tu vivienda.
                    <br />
                    <span className="font-medium text-foreground">El sistema te guía paso a paso</span>
                  </p>
                </div>
              </div>

              {/* No Pressure Message - Clear Visual Separation */}
              <div
                className={`bg-background border-2 border-destructive/30 rounded-xl p-4 text-center transition-all duration-600 ease-out ${
                  stepsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: "100ms" }}
              >
                <p className="text-destructive font-semibold text-sm leading-relaxed">
                  Sin llamadas comerciales · Sin obras innecesarias · <span className="font-bold">Tú decides</span>
                </p>
              </div>

              {/* Step 2 - Muted/Neutral Theme */}
              <div
                className={`card-artistic group relative overflow-hidden transition-all duration-600 ease-out ${
                  stepsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: "150ms" }}
              >
                {/* Muted background overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted/70 rounded-[inherit]" />

                <div className="relative p-5 md:p-6">
                  {/* Icons row: Number | Cog */}
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <span className="text-3xl font-bold text-muted-foreground/60">2</span>
                    <div className="w-10 h-10 rounded-full bg-foreground/10 border border-border flex items-center justify-center">
                      <Cog className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-foreground mb-2 text-center italic">
                    Analizamos tu caso
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed text-center">
                    Identificamos qué ocurre, por qué ocurre y si es algo leve o importante.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Step 3 (Primary Teal - MORE PROMINENT) */}
            <div
              className={`lg:col-span-5 transition-all duration-600 ease-out ${
                stepsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: "200ms" }}
            >
              <div className="relative h-full bg-gradient-to-br from-primary to-primary/90 rounded-2xl p-6 md:p-8 text-primary-foreground shadow-xl shadow-primary/30 ring-2 ring-primary/20 overflow-hidden group">
                {/* Subtle pattern overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1)_0%,transparent_50%)]" />

                <div className="relative">
                  {/* Icons row: Document | Number | Person */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-full bg-primary-foreground/15 border border-primary-foreground/20 flex items-center justify-center">
                      <FileText className="h-6 w-6 text-primary-foreground/90" />
                    </div>
                    <span className="text-4xl font-bold text-primary-foreground/20">3</span>
                    <div className="w-12 h-12 rounded-full bg-primary-foreground/15 border border-primary-foreground/20 flex items-center justify-center">
                      <UserCheck className="h-6 w-6 text-primary-foreground/90" />
                    </div>
                  </div>

                  {/* Content - Larger for prominence */}
                  <h3 className="text-xl md:text-2xl font-bold mb-4 italic">
                    Revisión por técnico colegiado
                  </h3>
                  <p className="text-primary-foreground/90 text-base leading-relaxed mb-6">
                    Un arquitecto o ingeniero valida tu informe antes de entregarlo
                  </p>

                  {/* Trust Badge */}
                  <div className="bg-primary-foreground/10 rounded-lg px-4 py-3 border border-primary-foreground/20">
                    <p className="text-primary-foreground/90 text-sm font-medium text-center">
                      Validación humana garantizada
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section - Good Breathing Room */}
        <div
          ref={ctaRef}
          className={`mt-14 text-center transition-all duration-600 ease-out ${
            ctaVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* CTA Button - Two Lines */}
          <Button
            variant="cta"
            size="lg"
            className="h-auto py-3 px-8 flex-col gap-0.5 shadow-lg shadow-primary/20 btn-animated"
            asChild
          >
            <Link to="/asistente">
              <span className="text-base font-semibold">Analiza tu caso Ahora</span>
              <span className="text-sm font-bold">¡ES GRATIS!</span>
            </Link>
          </Button>

          {/* Microcopy - Visible and legible */}
          <p className="mt-5 text-sm text-muted-foreground">
            3 – 5 minutos · Sin compromisos · <span className="font-semibold text-primary">¡GRATIS!</span>
          </p>
        </div>
      </div>
    </section>
  );
}
