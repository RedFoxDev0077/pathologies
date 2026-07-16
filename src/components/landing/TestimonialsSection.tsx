import { Star, Quote } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

/**
 * Testimonials (document 4.1).
 *
 * - Photos removed (Option B in the document): the previous avatars were
 *   Unsplash stock faces, which read as fake. Each card now shows initials +
 *   name + city + pathology instead.
 * - Rendered as a static grid rather than the previous infinite marquee. The
 *   marquee had to render the array twice to loop seamlessly, which is what made
 *   the same names appear repeatedly; the document asks for one instance of each.
 */
const testimonials = [
  {
    id: 1,
    name: "María García López",
    initials: "MG",
    role: "Propietaria en Valencia",
    // Supplied by the client in the "Cambios y Optimizaciones" document as the
    // testimonial for the online report (mentions the phone consult and value).
    quote:
      "Hice el análisis gratis, subí las fotos, hablé con el arquitecto por teléfono y en 48 horas tenía el informe. Me ahorró una obra de 8.000 € que no necesitaba.",
    rating: 5,
    pathology: "Informe Técnico Online",
    featured: true,
  },
  {
    id: 2,
    name: "Carlos Rodríguez Martín",
    initials: "CR",
    role: "Administrador de fincas",
    quote:
      "Gestiono varias comunidades y este servicio me ha permitido documentar casos de forma eficiente. Los informes son muy completos.",
    rating: 5,
    pathology: "Grietas",
  },
  {
    id: 3,
    name: "Ana Fernández Ruiz",
    initials: "AF",
    role: "Propietaria en Alicante",
    quote:
      "Tenía filtraciones en el techo y no sabía qué hacer. El informe técnico me dio la claridad que necesitaba para actuar.",
    rating: 5,
    pathology: "Filtraciones",
  },
  {
    id: 4,
    name: "José Luis Martínez",
    initials: "JM",
    role: "Abogado en Madrid",
    quote:
      "Necesitaba documentación técnica para un procedimiento judicial. El informe fue impecable y muy bien estructurado.",
    rating: 5,
    pathology: "Vicios constructivos",
  },
  {
    id: 5,
    name: "Laura Sánchez Pérez",
    initials: "LS",
    role: "Propietaria en Castellón",
    quote:
      "Detectaron moho en una habitación y gracias al diagnóstico pude tomar las medidas correctas. Servicio excelente.",
    rating: 5,
    pathology: "Moho",
  },
  {
    id: 6,
    name: "Pedro Navarro Gil",
    initials: "PN",
    role: "Propietario en Valencia",
    quote:
      "Las grietas en mi fachada me preocupaban mucho. El técnico explicó todo de forma clara y sin alarmismos innecesarios.",
    rating: 5,
    pathology: "Fachadas",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted"
          }`}
        />
      ))}
    </div>
  );
}

function TestimonialCard({
  testimonial,
  index,
}: {
  testimonial: typeof testimonials[0];
  index: number;
}) {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>({ threshold: 0.15 });

  return (
    <div
      ref={ref}
      className={`group flex h-full flex-col rounded-xl border bg-card p-6 shadow-sm transition-all duration-500 hover:shadow-lg ${
        "featured" in testimonial && testimonial.featured
          ? "border-primary/30 ring-1 ring-primary/20"
          : "border-border"
      } ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
      style={{ transitionDelay: `${index * 70}ms` }}
    >
      <div className="mb-4 flex items-start justify-between">
        <Quote className="h-8 w-8 text-primary/20 transition-colors duration-300 group-hover:text-primary/40" />
        <StarRating rating={testimonial.rating} />
      </div>

      <p className="mb-6 flex-1 text-sm italic leading-relaxed text-muted-foreground">
        “{testimonial.quote}”
      </p>

      {/* Option B: initials instead of a stock photo */}
      <div className="flex items-center gap-3">
        <div
          className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary ring-2 ring-border transition-all duration-300 group-hover:ring-primary/30"
          aria-hidden="true"
        >
          {testimonial.initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">
            {testimonial.name}
          </p>
          <p className="truncate text-xs text-muted-foreground">{testimonial.role}</p>
        </div>
      </div>

      <div className="mt-4 border-t border-border pt-4">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          {testimonial.pathology}
        </span>
      </div>
    </div>
  );
}

export function TestimonialsSection() {
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation<HTMLDivElement>({
    threshold: 0.3,
  });

  return (
    <section className="section bg-muted/30 dark:bg-muted/20">
      <div className="container">
        <div
          ref={headerRef}
          className={`section-header transition-all duration-600 ease-out ${
            headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="section-title">Lo que dicen nuestros clientes</h2>
          <p className="section-subtitle">
            Opiniones de propietarios, administradores y profesionales que han
            confiado en nuestro servicio
          </p>
        </div>

        {/* One instance of each (document 4.1) */}
        <div className="mx-auto mt-8 grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-3 md:mt-12">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
          ))}
        </div>

        {/* Trust indicator */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {testimonials.slice(0, 4).map((t, i) => (
                <div
                  key={t.id}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary ring-2 ring-background"
                  style={{ zIndex: 4 - i }}
                  aria-hidden="true"
                >
                  {t.initials}
                </div>
              ))}
            </div>
            <span>+50 diagnósticos realizados</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium text-foreground">4.9/5</span>
            <span>valoración media</span>
          </div>
        </div>
      </div>
    </section>
  );
}
