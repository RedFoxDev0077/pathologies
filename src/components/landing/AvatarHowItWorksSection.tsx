import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";

// Updated 7 steps from client feedback
const steps = [
  {
    id: 1,
    title: "Accede al asistente desde la web",
  },
  {
    id: 2,
    title: "Sube unas fotos nítidas del daño o un vídeo corto, si lo tienes",
  },
  {
    id: 3,
    title: "Indica la zona afectada: suelo, pared, techo...",
  },
  {
    id: 4,
    title: "Describe lo que observas",
  },
  {
    id: 5,
    title: "Responde a las preguntas clave que te vamos a formular",
  },
  {
    id: 6,
    title: "Aporta datos simples y reales",
  },
  {
    id: 7,
    title: "Con todo ello, nuestro asistente identificará las causas y riesgos más probables",
  },
];

export function AvatarHowItWorksSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation<HTMLDivElement>({
    threshold: 0.3,
  });

  const { ref: contentRef, isVisible: contentVisible } = useScrollAnimation<HTMLDivElement>({
    threshold: 0.2,
  });

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
  };

  return (
    <section
      id="como-funciona"
      className="section bg-gradient-to-b from-background to-muted/30"
    >
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
          </p>
        </div>

        {/* Main Content - Video + Steps */}
        <div
          ref={contentRef}
          className={cn(
            "mx-auto max-w-6xl transition-all duration-600 ease-out",
            contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-start">
            {/* LEFT SIDE - Video */}
            <div className="flex flex-col items-center">
              {/* Video Container */}
              <div className="relative w-full max-w-md">
                <div
                  className={cn(
                    "relative rounded-2xl overflow-hidden",
                    "bg-gradient-to-br from-primary/20 to-primary/5",
                    "ring-4 ring-primary/30 shadow-2xl shadow-primary/20",
                    "aspect-[9/16]"
                  )}
                >
                  <video
                    ref={videoRef}
                    className="absolute inset-0 w-full h-full object-cover"
                    playsInline
                    preload="metadata"
                    onEnded={handleVideoEnd}
                    onClick={togglePlay}
                    poster="/videos/como-funciona.mp4#t=0.1"
                  >
                    <source src="/videos/como-funciona.mp4" type="video/mp4" />
                  </video>

                  {/* Play overlay when paused */}
                  {!isPlaying && (
                    <div
                      className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
                      onClick={togglePlay}
                    >
                      <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center hover:bg-primary transition-colors">
                        <Play className="h-8 w-8 text-primary-foreground ml-1" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-3 mt-4">
                  {/* Play/Pause Button */}
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

                  {/* Mute Button */}
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleMute}
                    className="rounded-full h-12 w-12"
                  >
                    {isMuted ? (
                      <VolumeX className="h-5 w-5" />
                    ) : (
                      <Volume2 className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE - Steps */}
            <div className="space-y-3">
              {steps.map((step, idx) => (
                <div
                  key={step.id}
                  className={cn(
                    "relative p-4 md:p-5 rounded-xl border-2 transition-all duration-500",
                    "bg-card border-border hover:border-primary/40 hover:bg-primary/5"
                  )}
                  style={{ transitionDelay: `${idx * 50}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        "flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full",
                        "bg-primary text-primary-foreground font-bold"
                      )}
                    >
                      {step.id}
                    </div>
                    <p className="text-sm md:text-base text-foreground leading-relaxed pt-2">
                      {step.title}
                    </p>
                  </div>
                </div>
              ))}

              {/* No Pressure Message */}
              <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 text-center mt-6">
                <p className="text-destructive font-semibold text-sm">
                  Sin llamadas comerciales · Sin obras innecesarias · <span className="font-bold">Tú decides</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
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
