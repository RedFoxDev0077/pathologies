import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { BadgeCheck, ShieldCheck, Fingerprint, ScrollText, Award } from "lucide-react";

const trustItems = [
  { icon: BadgeCheck, label: "Revisión humana", color: "text-emerald-400" },
  { icon: Fingerprint, label: "Evidencias seguras", color: "text-cyan-400" },
  { icon: ScrollText, label: "Trazabilidad", color: "text-violet-400" },
  { icon: ShieldCheck, label: "RGPD", color: "text-amber-400" },
  { icon: Award, label: "Informe profesional", color: "text-rose-400" },
];

// Duplicate for seamless marquee loop
const duplicatedTrustItems = [...trustItems, ...trustItems, ...trustItems];

export function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let playAttempted = false;
    const attemptPlay = async () => {
      if (playAttempted) return;
      playAttempted = true;
      try {
        video.muted = true;
        await video.play();
      } catch {
        const playOnInteraction = async () => {
          try { video.muted = true; await video.play(); } catch {}
        };
        document.addEventListener("click", playOnInteraction, { once: true });
        document.addEventListener("touchstart", playOnInteraction, { once: true });
        document.addEventListener("scroll", playOnInteraction, { once: true });
      }
    };
    if (video.readyState >= 3) attemptPlay();
    else {
      video.addEventListener("loadeddata", attemptPlay, { once: true });
      video.addEventListener("canplay", attemptPlay, { once: true });
    }
    return () => { playAttempted = true; };
  }, []);

  const trustBullets = [
    "Análisis inicial gratuito con asistente inteligente",
    "Informe firmado por arquitecto colegiado desde 400 € + IVA",
    "Paga solo si decides continuar",
  ];

  return (
    <section className="relative h-[100svh] w-full overflow-hidden">
      {/* Video Background - Fullscreen */}
      <div className="absolute inset-0 z-0">
        {!videoError ? (
          <>
            <video
              ref={videoRef}
              autoPlay muted loop playsInline preload="auto"
              onLoadedData={() => setVideoLoaded(true)}
              onError={() => setVideoError(true)}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${videoLoaded ? "opacity-100" : "opacity-0"}`}
              poster="/images/hero/hero-poster.webp"
            >
              <source src="/videos/hero-background.mp4" type="video/mp4" />
            </video>
            {!videoLoaded && (
              <img src="/images/hero/hero-poster.webp" alt="" className="absolute inset-0 w-full h-full object-cover" />
            )}
          </>
        ) : (
          <img src="/images/hero/hero-poster.webp" alt="" className="absolute inset-0 w-full h-full object-cover" />
        )}

        {/* Gradient overlay - right side for text readability */}
        <div className="absolute inset-0 bg-gradient-to-l from-black/70 via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* ── DESKTOP — Text on right 40% ── */}
      <div className="hidden lg:flex relative z-10 h-full w-full">
        {/* Left 60% - Video visible */}
        <div className="w-[60%]" />

        {/* Right 40% - Floating text */}
        <div className="w-[40%] h-full flex items-center">
          <div className="w-full px-8 xl:px-12 py-12">
            {/* Eyebrow */}
            <p className="text-xs md:text-sm font-medium text-primary mb-4 drop-shadow-lg">
              Diagnóstico técnico independiente para viviendas
            </p>

            {/* H1 */}
            <h1 className="text-4xl xl:text-5xl 2xl:text-6xl font-bold leading-[1.1] mb-6 hero-text-shadow">
              <span className="text-white">¿Grietas, humedades</span>
              <br />
              <span className="text-white">o filtraciones</span>
              <br />
              <span className="text-primary drop-shadow-lg">en tu vivienda?</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg xl:text-xl text-white/90 leading-relaxed mb-8 max-w-md hero-text-shadow-sm">
              Sube fotos o vídeo y obtén una explicación técnica clara de qué
              ocurre, su gravedad y los pasos a seguir — sin alarmismos ni
              obras innecesarias.
            </p>

            {/* Trust Bullets */}
            <div className="space-y-3 mb-8">
              {trustBullets.map((bullet, index) => (
                <div key={index} className="flex items-center gap-3 text-sm xl:text-[15px]">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/30 backdrop-blur-sm flex items-center justify-center">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-white/90 hero-text-shadow-sm">{bullet}</span>
                </div>
              ))}
            </div>

            {/* CTA - Two Lines */}
            <Button
              variant="cta"
              size="lg"
              className="h-auto py-3 px-8 flex-col gap-0.5 rounded-lg shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 hover:scale-[1.02]"
              asChild
            >
              <Link to="/asistente">
                <span className="text-base font-semibold">Analiza tu caso Ahora</span>
                <span className="text-sm font-bold">¡ES GRATIS!</span>
              </Link>
            </Button>

            {/* Micro-copy */}
            <p className="mt-4 text-xs xl:text-sm text-white/70 hero-text-shadow-sm">
              Proceso guiado · 3-5 minutos · Sin compromiso
            </p>
          </div>
        </div>
      </div>

      {/* ── MOBILE — Text at bottom ── */}
      <div className="lg:hidden relative z-10 h-full w-full flex flex-col justify-end">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />

        <div className="relative z-10 px-5 pb-6 pt-4">
          <p className="text-xs font-medium text-primary mb-2 drop-shadow-lg">
            Diagnóstico técnico independiente
          </p>

          <h1 className="text-2xl sm:text-3xl font-bold leading-tight mb-3 hero-text-shadow">
            <span className="text-white">¿Grietas, humedades o filtraciones </span>
            <span className="text-primary">en tu vivienda?</span>
          </h1>

          <p className="text-sm text-white/85 leading-relaxed mb-4 hero-text-shadow-sm">
            Obtén una explicación técnica clara de qué ocurre y los pasos a seguir.
          </p>

          <div className="flex flex-wrap gap-2 mb-5">
            {trustBullets.map((bullet, index) => (
              <div key={index} className="flex items-center gap-1.5 text-xs bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5">
                <Check className="w-3 h-3 text-primary" />
                <span className="text-white/90">{bullet}</span>
              </div>
            ))}
          </div>

          <Button
            variant="cta"
            className="w-full h-auto py-3 flex-col gap-0.5 rounded-lg shadow-lg shadow-primary/30"
            asChild
          >
            <Link to="/asistente">
              <span className="text-base font-semibold">Analiza tu caso Ahora</span>
              <span className="text-sm font-bold">¡ES GRATIS!</span>
            </Link>
          </Button>

          <p className="mt-3 text-[11px] text-white/60 text-center">
            Proceso guiado · 3-5 min · Sin compromiso
          </p>
        </div>
      </div>

      {/* Trust Bar - Marquee at bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <div className="relative py-3 md:py-4 overflow-hidden">
          {/* Glass background */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-r from-black/60 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-l from-black/60 to-transparent z-10 pointer-events-none" />

          {/* Marquee */}
          <div className="relative flex animate-marquee">
            {duplicatedTrustItems.map((item, index) => (
              <div
                key={index}
                className="flex-shrink-0 flex items-center gap-2 mx-4 md:mx-6 text-white/80 hover:text-white transition-colors duration-300"
              >
                <item.icon className={`h-4 w-4 ${item.color}`} />
                <span className="text-xs md:text-sm font-medium whitespace-nowrap">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
