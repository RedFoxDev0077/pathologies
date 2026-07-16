import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

export function FloatingCta() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show floating CTA after scrolling past the hero (100vh)
      const scrollThreshold = window.innerHeight;
      setIsVisible(window.scrollY > scrollThreshold);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Check initial state
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 lg:hidden transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      {/* Background with subtle shadow */}
      <div className="bg-background/95 backdrop-blur-sm border-t border-border shadow-[0_-4px_20px_rgba(0,0,0,0.1)] px-4 py-3">
        <Button
          variant="cta"
          className="w-full h-12 text-base rounded-lg shadow-md shadow-primary/20"
          asChild
        >
          <Link to="/asistente">
            Analizar mi caso · Gratis
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
