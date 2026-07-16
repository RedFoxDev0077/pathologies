import { Link } from "react-router-dom";
import { Phone } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export function Footer() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>({ threshold: 0.2 });

  return (
    <footer ref={ref} className="border-t border-border bg-muted/30">
      <div className="container py-12">
        <div className="flex flex-col items-center gap-6 text-center">
          {/* Logo */}
          <div
            className={`flex items-center gap-2 transition-all duration-500 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary transition-transform duration-300 hover:scale-110">
              <span className="text-sm font-bold text-primary-foreground">DT</span>
            </div>
            <span className="font-semibold text-foreground">
              Diagnóstico Técnico
            </span>
          </div>

          {/* Phone */}
          <a
            href="tel:+34634278435"
            className={`flex items-center gap-2 text-base font-semibold text-foreground transition-all duration-500 hover:text-primary ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "50ms" }}
          >
            <Phone className="h-4 w-4 text-primary" />
            634 278 435
          </a>

          {/* Links */}
          <nav
            className={`flex flex-wrap justify-center gap-4 text-sm transition-all duration-500 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "100ms" }}
          >
            <Link
              to="/privacidad"
              className="text-muted-foreground transition-colors duration-200 hover:text-primary hover-underline"
            >
              Política de privacidad
            </Link>
            <Link
              to="/aviso-legal"
              className="text-muted-foreground transition-colors duration-200 hover:text-primary hover-underline"
            >
              Aviso legal
            </Link>
            <Link
              to="/cookies"
              className="text-muted-foreground transition-colors duration-200 hover:text-primary hover-underline"
            >
              Política de cookies
            </Link>
          </nav>

          {/* Disclaimer */}
          <p
            className={`max-w-xl text-sm text-muted-foreground transition-all duration-500 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            Servicio técnico profesional. Diagnóstico preliminar asistido por IA
            con revisión humana obligatoria antes del envío del informe.
          </p>

          {/* Professional credentials */}
          <p
            className={`max-w-xl text-xs text-muted-foreground/80 transition-all duration-500 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "250ms" }}
          >
            Informes emitidos bajo responsabilidad profesional de José Francisco Castillo Miras,
            Arquitecto Colegiado nº 12.279 COACV / 3.353 COIAT Valencia.
          </p>

          {/* Copyright */}
          <p
            className={`text-xs text-muted-foreground/70 transition-all duration-500 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            © {new Date().getFullYear()} Diagnóstico Técnico de Patologías.
            Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
