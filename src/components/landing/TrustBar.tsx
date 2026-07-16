import { BadgeCheck, ShieldCheck, Fingerprint, ScrollText, Award } from "lucide-react";

const trustItems = [
  { icon: BadgeCheck, label: "Revisión humana obligatoria", color: "text-emerald-500" },
  { icon: Fingerprint, label: "Evidencias seguras", color: "text-cyan-500" },
  { icon: ScrollText, label: "Expediente con trazabilidad", color: "text-violet-500" },
  { icon: ShieldCheck, label: "RGPD + consentimiento", color: "text-amber-500" },
  { icon: Award, label: "Informe profesional", color: "text-rose-500" },
];

// Duplicate items for seamless loop
const duplicatedItems = [...trustItems, ...trustItems, ...trustItems];

export function TrustBar() {
  return (
    <section className="relative py-6 md:py-8 overflow-hidden bg-gradient-to-r from-background via-muted/30 to-background">
      {/* Decorative top line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      {/* Marquee container */}
      <div className="flex animate-marquee">
        {duplicatedItems.map((item, index) => (
          <div
            key={index}
            className="flex-shrink-0 mx-4 md:mx-8"
          >
            <div className="group flex items-center gap-3 px-5 py-2.5 rounded-full bg-card/50 backdrop-blur-sm border border-border/30 hover:border-primary/50 hover:bg-card/80 transition-all duration-300 cursor-default">
              {/* Icon with glow */}
              <div className="relative">
                <div className={`absolute inset-0 ${item.color} blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-300`} />
                <item.icon className={`relative h-5 w-5 ${item.color} transition-transform duration-300 group-hover:scale-110`} />
              </div>

              {/* Separator dot */}
              <span className="h-1 w-1 rounded-full bg-border group-hover:bg-primary transition-colors duration-300" />

              {/* Label */}
              <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300 whitespace-nowrap">
                {item.label}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Decorative bottom line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
    </section>
  );
}
