import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

/**
 * Fixed bottom CTA bar shown only on mobile (< lg).
 * Stays visible during the whole scroll so the primary action
 * ("Analizar mi caso gratis") is always one tap away.
 * The landing <main> reserves space with `pb-20` so it never covers content.
 */
export function MobileStickyCta() {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 p-3 pt-2 bg-gradient-to-t from-background via-background/95 to-transparent">
      <Link
        to="/asistente"
        className="flex min-h-[56px] w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 text-base font-semibold text-white shadow-lg shadow-primary/30 transition-transform duration-200 active:scale-[0.98]"
      >
        Analizar mi caso gratis
        <ArrowRight className="h-5 w-5" />
      </Link>
    </div>
  );
}
