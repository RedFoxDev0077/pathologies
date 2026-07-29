import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Camera, Cog, FileText, Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    description:
      "Pre-diagnóstico gratuito en pantalla. Si necesitas un documento firmado con propuesta de actuación y estimación económica, solicita tu informe técnico online.",
  },
];

export function HowItWorksVideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  // -1 until playback starts; then 0,1,2 as the avatar narrates each step.
  const [activeStep, setActiveStep] = useState(-1);

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

  // Light up the step that matches the current point in the narration.
  // Splitting the duration into equal thirds means it adapts to whatever the
  // final video length is; the exact cue points can be fine-tuned later if
  // José sends the timestamps at which he names each step.
  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (!v || !v.duration || Number.isNaN(v.duration)) return;
    const progress = v.currentTime / v.duration;
    const idx = Math.min(steps.length - 1, Math.floor(progress * steps.length));
    if (idx !== activeStep) setActiveStep(idx);
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
          <h2 className="section-title">¿Cómo descubrir qué le ocurre realmente a tu vivienda?</h2>
          <p className="section-subtitle">
            En menos de 5 minutos tendrás una primera orientación técnica gratuita.
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

            {/* LEFT — Avatar video */}
            <div className="flex flex-col items-center">
              {/* Native aspect is 9:16 (1080x1920). Match it so the avatar is
                  never cropped, and cap the width so a portrait clip does not
                  dominate the layout — it scales down fluidly on small screens. */}
              <div className="relative mx-auto w-full max-w-[280px] sm:max-w-[320px] aspect-[9/16] overflow-hidden rounded-xl border-2 border-border shadow-2xl shadow-primary/10 bg-muted">
                {/* preload="metadata" shows the first frame (the avatar) as a
                    natural poster without downloading the full 37 MB; the file
                    streams only once the visitor presses play. */}
                <video
                  ref={videoRef}
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-cover"
                  onClick={togglePlay}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => {
                    setIsPlaying(false);
                    setActiveStep(-1);
                  }}
                  onTimeUpdate={handleTimeUpdate}
                >
                  <source src="/videos/avatar-how-it-works.mp4#t=0.1" type="video/mp4" />
                </video>

                {/* Play overlay while paused */}
                {!isPlaying && (
                  <button
                    onClick={togglePlay}
                    className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors hover:bg-black/40 group"
                    aria-label="Reproducir vídeo"
                  >
                    <span className="w-20 h-20 rounded-full bg-primary/90 flex items-center justify-center shadow-lg shadow-primary/30 transition-transform duration-300 group-hover:scale-110">
                      <Play className="h-9 w-9 text-white ml-1" />
                    </span>
                  </button>
                )}
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3 mt-6">
                <Button variant="default" size="lg" onClick={togglePlay} className="rounded-full h-12 px-6 gap-2">
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
                  disabled={!started}
                  className="rounded-full h-12 w-12"
                >
                  {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </Button>
              </div>
            </div>

            {/* RIGHT — Steps (light up as the avatar narrates) */}
            <div className="space-y-4">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                const active = index === activeStep;
                return (
                  <div
                    key={step.id}
                    className={cn(
                      "relative p-5 md:p-6 rounded-xl border-2 bg-card transition-all duration-500",
                      active
                        ? "border-primary bg-primary/5 shadow-lg shadow-primary/20 scale-[1.02]"
                        : "border-border hover:border-primary/20"
                    )}
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <div
                        className={cn(
                          "flex items-center justify-center w-14 h-14 rounded-full transition-colors duration-500",
                          active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        )}
                      >
                        <span className="text-xl font-bold">{step.id}</span>
                      </div>
                      <div
                        className={cn(
                          "flex items-center justify-center w-12 h-12 rounded-full transition-colors duration-500",
                          active ? "bg-primary/15 text-primary" : "bg-muted/50 text-muted-foreground"
                        )}
                      >
                        <StepIcon className="h-6 w-6" />
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
