import { Link } from "react-router-dom";
import { useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";

export function FloatingCtaIcon() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      {/* Desktop Floating CTA — always visible */}
      <div className="hidden lg:block fixed bottom-8 right-8 z-50">
        <Link
          to="/asistente"
          className="group relative flex items-center"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Ambient glow */}
          <div className="absolute -inset-3 bg-primary/40 rounded-full blur-xl opacity-50 group-hover:opacity-80 transition-opacity duration-500" />

          {/* Button */}
          <div className="relative flex items-center gap-2.5 bg-primary hover:bg-primary/90 text-white px-5 py-3.5 rounded-full shadow-[0_8px_32px_rgba(45,118,112,0.4)] group-hover:shadow-[0_8px_44px_rgba(45,118,112,0.65)] transition-all duration-300 group-hover:scale-105">
            <Sparkles className="h-4 w-4 flex-shrink-0 transition-transform duration-300 group-hover:rotate-12" />

            <span
              className={`font-semibold text-sm whitespace-nowrap overflow-hidden transition-all duration-300 ${
                isHovered ? "max-w-[200px] opacity-100" : "max-w-0 opacity-0"
              }`}
            >
              Analizar mi caso
            </span>

            <ArrowRight
              className={`h-4 w-4 flex-shrink-0 transition-all duration-300 ${
                isHovered ? "translate-x-0 opacity-100 w-4" : "-translate-x-2 opacity-0 w-0 overflow-hidden"
              }`}
            />
          </div>
        </Link>
      </div>

    </>
  );
}
