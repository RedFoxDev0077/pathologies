import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const CONTACT_PHONE_DISPLAY = "634 278 435";
const CONTACT_PHONE_TEL = "+34634278435";

const navLinks = [
  { href: "#que-resolvemos", label: "Qué resolvemos" },
  { href: "#como-funciona", label: "Cómo funciona" },
  { href: "#que-analizamos", label: "Patologías" },
  { href: "#packs", label: "Precios" },
  { href: "#preguntas", label: "FAQ" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Add background after scrolling past hero (100vh)
      setIsScrolled(window.scrollY > window.innerHeight - 100);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check initial state

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-background/95 backdrop-blur-md border-b border-border shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="container flex h-20 md:h-24 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/images/brand/logo.webp"
              alt="Mi Casa Verde - Diagnóstico Técnico"
              width={400}
              height={283}
              className="h-16 md:h-20 lg:h-24 w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-sm"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-6 lg:flex">
            {navLinks.map((link, index) => (
              <a
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors duration-200 hover:text-primary ${
                  isScrolled
                    ? "text-muted-foreground hover:text-foreground"
                    : "text-white/90 hover:text-white hero-text-shadow-sm"
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA & Theme Toggle */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href={`tel:${CONTACT_PHONE_TEL}`}
              className={`flex items-center gap-1.5 text-sm font-semibold transition-colors duration-200 hover:text-primary ${
                isScrolled
                  ? "text-foreground hover:text-primary"
                  : "text-white hover:text-white/90 hero-text-shadow-sm"
              }`}
              aria-label="Llamar por teléfono"
            >
              <Phone className="h-4 w-4" />
              {CONTACT_PHONE_DISPLAY}
            </a>
            <ThemeToggle />
            <Link
              to="/iniciar-sesion"
              className={`text-sm font-medium transition-colors duration-200 hover:text-primary ${
                isScrolled
                  ? "text-muted-foreground hover:text-foreground"
                  : "text-white/90 hover:text-white hero-text-shadow-sm"
              }`}
            >
              Iniciar Sesión
            </Link>
            <Button
              variant="cta"
              size="default"
              className={`btn-animated ${
                isScrolled ? "" : "shadow-lg shadow-primary/30"
              }`}
              asChild
            >
              <Link to="/asistente">Analizar mi caso</Link>
            </Button>
          </div>

          {/* Mobile Theme Toggle & Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              className="p-2 -mr-2 transition-transform duration-200 active:scale-95"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
            >
            {mobileMenuOpen ? (
              <X
                className={`h-6 w-6 transition-transform duration-300 rotate-0 hover:rotate-90 ${
                  isScrolled ? "text-foreground" : "text-white"
                }`}
              />
            ) : (
              <Menu
                className={`h-6 w-6 transition-transform duration-200 hover:scale-110 ${
                  isScrolled ? "text-foreground" : "text-white"
                }`}
              />
            )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`border-t border-border bg-background lg:hidden overflow-hidden transition-all duration-300 ease-out ${
            mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="container py-4">
            <ul className="space-y-2">
              {navLinks.map((link, index) => (
                <li
                  key={link.href}
                  className={`transition-all duration-300 ${
                    mobileMenuOpen
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-4"
                  }`}
                  style={{ transitionDelay: mobileMenuOpen ? `${index * 50}ms` : "0ms" }}
                >
                  <a
                    href={link.href}
                    className="block py-2 text-base text-foreground transition-colors duration-200 hover:text-primary hover:pl-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              {/* Login link */}
              <li
                className={`transition-all duration-300 ${
                  mobileMenuOpen
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-4"
                }`}
                style={{ transitionDelay: mobileMenuOpen ? `${navLinks.length * 50}ms` : "0ms" }}
              >
                <Link
                  to="/iniciar-sesion"
                  className="block py-2 text-base text-foreground transition-colors duration-200 hover:text-primary hover:pl-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Iniciar Sesión
                </Link>
              </li>
              {/* Phone (clickable on mobile) */}
              <li
                className={`transition-all duration-300 ${
                  mobileMenuOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                }`}
                style={{ transitionDelay: mobileMenuOpen ? `${(navLinks.length + 1) * 50}ms` : "0ms" }}
              >
                <a
                  href={`tel:${CONTACT_PHONE_TEL}`}
                  className="flex items-center gap-2 py-2 text-base font-semibold text-primary transition-colors duration-200 hover:pl-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Phone className="h-4 w-4" />
                  {CONTACT_PHONE_DISPLAY}
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Mobile Fixed CTA - Hidden, replaced by FloatingCtaIcon */}
    </>
  );
}
