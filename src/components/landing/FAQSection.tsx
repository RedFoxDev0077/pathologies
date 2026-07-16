import { Helmet } from "react-helmet-async";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const faqs = [
  {
    question: "¿Qué problemas cubre este servicio?",
    answer:
      "El servicio cubre las patologías más comunes en viviendas: humedades, filtraciones, condensación, moho, grietas, fisuras, movimientos estructurales, problemas en cubiertas y terrazas, y deficiencias en fachadas y puentes térmicos. Si tu problema no encaja en estas categorías, el asistente te lo indicará.",
  },
  {
    question: "¿Qué evidencia conviene subir?",
    answer:
      "Fotos claras de la zona afectada (con buena iluminación), vídeos si hay goteo o movimiento activo, fotos panorámicas para contextualizar la ubicación, y cualquier documentación previa si existe. El asistente te guiará sobre qué evidencias son más útiles para tu caso concreto.",
  },
  {
    question: "¿Cuánto tiempo tarda el proceso?",
    answer:
      "La recopilación de información y el pre-diagnóstico en pantalla tardan entre 3 y 6 minutos, dependiendo de la cantidad de evidencias. Si solicitas un informe, el plazo de entrega depende del tipo de servicio contratado y la complejidad del caso.",
  },
  {
    question: "¿El informe se envía automáticamente?",
    answer:
      "No. El informe nunca se envía automáticamente. Primero se genera un borrador asistido por IA, y después un técnico lo revisa obligatoriamente antes de su emisión. Solo tras esta validación humana se procede al envío.",
  },
  {
    question: "¿Cómo funciona el pago?",
    answer:
      "Utilizamos un sistema de autorización y captura. Cuando solicitas un informe de pago, se autoriza el importe en tu tarjeta (sin cargarlo). Solo cuando el informe ha sido revisado y entregado, se captura el pago. Si por algún motivo no pudiéramos entregar el informe, la autorización se libera automáticamente.",
  },
  {
    question: "¿Qué pasa con mis datos y evidencias?",
    answer:
      "Tus datos se tratan conforme al RGPD y la normativa española de protección de datos. Las evidencias se almacenan de forma segura con acceso temporal controlado. El consentimiento queda registrado. Puedes ejercer tus derechos de acceso, rectificación, supresión y portabilidad en cualquier momento.",
  },
  {
    question: "¿Puedo usarlo como abogado o administrador de fincas?",
    answer:
      "Sí. Al inicio del proceso seleccionas tu perfil (Particular, Abogado o Administrador de fincas) y el asistente adapta su lenguaje y enfoque. Para abogados, el tono es más formal y técnico. Para administradores, se facilita la gestión de casos recurrentes con trazabilidad.",
  },
];

export function FAQSection() {
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation<HTMLDivElement>({
    threshold: 0.3,
  });
  const { ref: accordionRef, isVisible: accordionVisible } = useScrollAnimation<HTMLDivElement>({
    threshold: 0.1,
  });

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <section id="preguntas" className="section">
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      </Helmet>
      <div className="container">
        <div
          ref={headerRef}
          className={`section-header transition-all duration-600 ease-out ${
            headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="section-title">Preguntas frecuentes</h2>
          <p className="section-subtitle">
            Resolvemos las dudas más habituales sobre el servicio
          </p>
        </div>

        <div ref={accordionRef} className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className={`card-institutional card-glow overflow-hidden border px-0 transition-all duration-500 ease-out ${
                  accordionVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-6"
                }`}
                style={{ transitionDelay: accordionVisible ? `${index * 80}ms` : "0ms" }}
              >
                <AccordionTrigger className="px-4 md:px-6 py-3 md:py-4 text-left hover:no-underline [&[data-state=open]]:bg-accent/50 transition-colors duration-200">
                  <span className="font-medium text-sm md:text-base">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="px-4 md:px-6 pb-3 md:pb-4 pt-2 text-xs md:text-sm text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
