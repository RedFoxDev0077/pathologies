import { Star, Quote } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const testimonials = [
  {
    id: 1,
    name: "María García López",
    role: "Propietaria en Valencia",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    quote: "El diagnóstico me ayudó a entender exactamente el problema de humedad en mi vivienda. Muy profesional y claro en las explicaciones.",
    rating: 5,
    pathology: "Humedades",
  },
  {
    id: 2,
    name: "Carlos Rodríguez Martín",
    role: "Administrador de fincas",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    quote: "Gestiono varias comunidades y este servicio me ha permitido documentar casos de forma eficiente. Los informes son muy completos.",
    rating: 5,
    pathology: "Grietas",
  },
  {
    id: 3,
    name: "Ana Fernández Ruiz",
    role: "Propietaria en Alicante",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    quote: "Tenía filtraciones en el techo y no sabía qué hacer. El informe técnico me dio la claridad que necesitaba para actuar.",
    rating: 5,
    pathology: "Filtraciones",
  },
  {
    id: 4,
    name: "José Luis Martínez",
    role: "Abogado en Madrid",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    quote: "Necesitaba documentación técnica para un procedimiento judicial. El informe fue impecable y muy bien estructurado.",
    rating: 5,
    pathology: "Vicios constructivos",
  },
  {
    id: 5,
    name: "Laura Sánchez Pérez",
    role: "Propietaria en Castellón",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    quote: "Detectaron moho en una habitación y gracias al diagnóstico pude tomar las medidas correctas. Servicio excelente.",
    rating: 5,
    pathology: "Moho",
  },
  {
    id: 6,
    name: "Pedro Navarro Gil",
    role: "Propietario en Valencia",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    quote: "Las grietas en mi fachada me preocupaban mucho. El técnico explicó todo de forma clara y sin alarmismos innecesarios.",
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

function TestimonialCard({ testimonial }: { testimonial: typeof testimonials[0] }) {
  return (
    <div className="flex-shrink-0 w-[300px] md:w-[340px] p-6 bg-card rounded-xl border border-border shadow-sm hover:shadow-lg transition-all duration-300 group">
      {/* Quote Icon */}
      <div className="mb-4">
        <Quote className="h-8 w-8 text-primary/20 group-hover:text-primary/40 transition-colors duration-300" />
      </div>

      {/* Rating */}
      <div className="mb-3">
        <StarRating rating={testimonial.rating} />
      </div>

      {/* Quote Text */}
      <p className="text-sm text-muted-foreground leading-relaxed mb-6 italic">
        "{testimonial.quote}"
      </p>

      {/* Client Info */}
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="relative h-12 w-12 rounded-full overflow-hidden ring-2 ring-border group-hover:ring-primary/30 transition-all duration-300">
          <img
            src={testimonial.image}
            alt={testimonial.name}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Name & Role */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-foreground truncate">
            {testimonial.name}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {testimonial.role}
          </p>
        </div>
      </div>

      {/* Pathology Badge */}
      <div className="mt-4 pt-4 border-t border-border">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
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

  // Duplicate testimonials for seamless infinite scroll
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <section className="section bg-muted/30 dark:bg-muted/20 overflow-hidden">
      <div className="container">
        {/* Header */}
        <div
          ref={headerRef}
          className={`section-header transition-all duration-600 ease-out ${
            headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="section-title">Lo que dicen nuestros clientes</h2>
          <p className="section-subtitle">
            Opiniones reales de propietarios, administradores y profesionales que han confiado en nuestro servicio
          </p>
        </div>
      </div>

      {/* Carousel Container - Full width */}
      <div className="relative mt-8 md:mt-12">
        {/* Gradient Fade Left */}
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-background/80 dark:from-background/90 to-transparent z-10 pointer-events-none" />

        {/* Gradient Fade Right */}
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-background/80 dark:from-background/90 to-transparent z-10 pointer-events-none" />

        {/* Scrolling Track */}
        <div className="testimonials-carousel flex gap-6 py-4">
          {duplicatedTestimonials.map((testimonial, index) => (
            <TestimonialCard key={`${testimonial.id}-${index}`} testimonial={testimonial} />
          ))}
        </div>
      </div>

      {/* Trust Indicator */}
      <div className="container mt-8 md:mt-12">
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {testimonials.slice(0, 4).map((t, i) => (
                <div
                  key={t.id}
                  className="h-8 w-8 rounded-full overflow-hidden ring-2 ring-background"
                  style={{ zIndex: 4 - i }}
                >
                  <img
                    src={t.image}
                    alt={t.name}
                    className="h-full w-full object-cover"
                  />
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
