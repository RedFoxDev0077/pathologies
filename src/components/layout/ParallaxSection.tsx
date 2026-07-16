import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type BackgroundType = "hero" | "process" | "services" | "trust";
type OverlayType = "white" | "muted" | "gradient" | "hero";

interface ParallaxSectionProps {
  background: BackgroundType;
  overlay?: OverlayType;
  children: ReactNode;
  className?: string;
}

const backgroundClasses: Record<BackgroundType, string> = {
  hero: "bg-hero",
  process: "bg-process",
  services: "bg-services",
  trust: "bg-trust",
};

const overlayClasses: Record<OverlayType, string> = {
  white: "parallax-overlay parallax-overlay-white",
  muted: "parallax-overlay parallax-overlay-muted",
  gradient: "parallax-overlay parallax-overlay-gradient",
  hero: "parallax-overlay parallax-overlay-hero",
};

export function ParallaxSection({
  background,
  overlay = "white",
  children,
  className,
}: ParallaxSectionProps) {
  return (
    <div
      className={cn(
        "parallax-section",
        backgroundClasses[background],
        className
      )}
    >
      <div className={overlayClasses[overlay]}>{children}</div>
    </div>
  );
}
