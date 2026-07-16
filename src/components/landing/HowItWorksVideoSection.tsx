import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Camera, Cog, FileText, Play, Pause, Volume2, VolumeX } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";

const steps = [
  {
    id: 1,
    icon: Camera,
    title: "Subes fotos o vídeos",
    description: "Cuéntanos qué ocurre en tu vivienda. El sistema te guía paso a paso.",
  },
  {
    id: 2,
    icon: Cog,
    title: "Analizamos tu caso",
    description: "Identificamos qué ocurre, por qué ocurre y si es algo leve o importante.",
  },
  {
    id: 3,
    icon: FileText,
    title: "Recibes tu diagnóstico",
    description: "Pre-diagnóstico gratuito en pantalla. Si necesitas un documento firmado con propuesta de actuación y estimación económica, solicita tu informe técnico online.",
  },
];

export function HowItWorksVideoSection() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation<HTMLDivElement>({
    threshold: 0.3,
  });
  const { ref: contentRef, isVisible: contentVisible } = useScrollAnimation<HTMLDivElement>({
    threshold: 0.2,
  });

  const togglePlay = async () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      try {
        await videoRef.current.play();
        setIsPlaying(true);
      } catch {}
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <section id="como-funciona" className="section">
      <div className="container">
        {/* Header */}
        <div
          ref={headerRef}
          className={cn(
            "section-header transition-all duration-600 ease-out",
            headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <h2 className="section-title">¿Cómo funciona el diagnóstico?</h2>
          <p className="section-subtitle">
            Un proceso guiado, sencillo y sin compromiso.
            <br />
            <span className="font-medium text-foreground">Pulsa play y nuestro asistente te explica</span>
          </p>
        </div>

        {/* Main Content */}
        <div
          ref={contentRef}
          className={cn(
            "mx-auto max-w-6xl transition-all duration-600 ease-out",
            contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">

            {/* LEFT — Video (rectangular) */}
            <div className="flex flex-col items-center">
              <div className="relative w-full overflow-hidden rounded-xl border-2 border-border shadow-2xl shadow-primary/10">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  loop
                  className="w-full h-auto"
                  onClick={togglePlay}
                >
                  <source src="/videos/how-it-works.mp4" type="video/mp4" />
                </video>

                {/* Play overlay when paused */}
                {!isPlaying && (
                  <div
                    className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer transition-opacity duration-300"
                    onClick={togglePlay}
                  >
                    <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center shadow-lg shadow-primary/30">
                      <Play className="h-8 w-8 text-white ml-1" />
                    </div>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3 mt-6">
                <Button
                  variant="default"
                  size="lg"
                  onClick={togglePlay}
                  className="rounded-full h-12 px-6 gap-2"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="h-5 w-5" />
                      <span>Pausar</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5" />
                      <span>Reproducir</span>
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleMute}
                  className="rounded-full h-12 w-12"
                >
                  {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </Button>
              </div>
            </div>

            {/* RIGHT — Steps */}
            <div className="space-y-4">
              {steps.map((step) => {
                const StepIcon = step.icon;
                return (
                  <div
                    key={step.id}
                    className="relative p-5 md:p-6 rounded-xl border-2 bg-card border-border hover:border-primary/20 transition-all duration-500"
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted text-muted-foreground">
                        <span className="text-lg font-bold">{step.id}</span>
                      </div>
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted/50 text-muted-foreground">
                        <StepIcon className="h-5 w-5" />
                      </div>
                    </div>
                    <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                );
              })}

              {/* No Pressure Message */}
              <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 text-center mt-6">
                <p className="text-destructive font-semibold text-sm">
                  Sin llamadas comerciales · Sin obras innecesarias · <span className="font-bold">Tú decides</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-14 text-center">
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
          <p className="mt-5 text-sm text-muted-foreground">
            3 – 5 minutos · Sin compromisos · <span className="font-semibold text-primary">¡GRATIS!</span>
          </p>
        </div>
      </div>
    </section>
  );
}
