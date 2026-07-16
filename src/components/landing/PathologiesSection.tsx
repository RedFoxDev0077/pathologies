import { Droplets, Wind, AlertTriangle, Building2, Home, Thermometer } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const pathologies = [
  {
    icon: Droplets,
    title: "Humedades / Filtraciones",
    image: "/images/pathologies/humedades.webp",
    symptoms: "Manchas, desprendimiento de pintura, olor a humedad",
    evidence: "Fotos de la zona afectada, vídeo si hay goteo activo",
    result: "Orientación sobre origen probable y pasos a seguir",
  },
  {
    icon: Wind,
    title: "Condensación / Moho",
    image: "/images/pathologies/moho.webp",
    symptoms: "Vaho en cristales, manchas negras, ambiente cargado",
    evidence: "Fotos de ventanas y zonas afectadas, descripción de ventilación",
    result: "Análisis de factores y recomendaciones de mejora",
  },
  {
    icon: AlertTriangle,
    title: "Grietas / Fisuras",
    image: "/images/pathologies/grietas.webp",
    symptoms: "Grietas en paredes, techos o suelos, puertas que no cierran",
    evidence: "Fotos con referencia de escala, ubicación en plano si es posible",
    result: "Valoración de tipología y posible causa estructural",
  },
  {
    icon: Building2,
    title: "Movimientos / Asientos",
    image: "/images/pathologies/movimientos.webp",
    symptoms: "Desniveles, grietas en diagonal, separación de marcos",
    evidence: "Fotos panorámicas, historial si existe, nivel de burbuja",
    result: "Orientación sobre estabilidad y necesidad de estudio",
  },
  {
    icon: Home,
    title: "Cubiertas y Terrazas",
    image: "/images/pathologies/cubiertas.webp",
    symptoms: "Goteras, humedades bajo terraza, baldosas levantadas",
    evidence: "Fotos de cubierta, bajantes, encuentros con paramentos",
    result: "Análisis de puntos críticos y propuesta de actuación",
  },
  {
    icon: Thermometer,
    title: "Fachadas y Puentes Térmicos",
    image: "/images/pathologies/fachadas.webp",
    symptoms: "Condensación en esquinas, moho en paredes exteriores",
    evidence: "Fotos de fachada interior y exterior, orientación",
    result: "Identificación de puentes térmicos y soluciones",
  },
];

function PathologyCard({
  pathology,
  index,
}: {
  pathology: typeof pathologies[0];
  index: number;
}) {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>({ threshold: 0.15 });

  return (
    <article
      ref={ref}
      className={`card-artistic group transition-all duration-600 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
      style={{ transitionDelay: `${(index % 3) * 100}ms` }}
    >
      {/* Shine sweep effect */}
      <div className="card-artistic-shine" />

      {/* Image Container */}
      <div className="card-artistic-image h-40 md:h-52">
        <img
          src={pathology.image}
          alt={pathology.title}
          width={800}
          height={600}
          loading="lazy"
        />

        {/* Floating Icon Badge */}
        <div className="card-artistic-badge bottom-3 left-3 md:bottom-4 md:left-4 h-10 w-10 md:h-12 md:w-12 rounded-xl">
          <pathology.icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
        </div>
      </div>

      {/* Content */}
      <div className="card-artistic-content">
        <h3 className="card-artistic-title mb-4 text-base md:text-lg">
          {pathology.title}
        </h3>

        <div className="card-artistic-info space-y-1">
          <div className="card-artistic-info-item">
            <p className="font-medium text-xs text-primary/80 uppercase tracking-wide mb-0.5">
              Síntomas
            </p>
            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
              {pathology.symptoms}
            </p>
          </div>
          <div className="card-artistic-info-item">
            <p className="font-medium text-xs text-primary/80 uppercase tracking-wide mb-0.5">
              Evidencias
            </p>
            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
              {pathology.evidence}
            </p>
          </div>
          <div className="card-artistic-info-item">
            <p className="font-medium text-xs text-primary/80 uppercase tracking-wide mb-0.5">
              Resultado
            </p>
            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
              {pathology.result}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

export function PathologiesSection() {
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation<HTMLDivElement>({
    threshold: 0.3,
  });

  return (
    <section id="que-analizamos" className="section">
      <div className="container">
        <div
          ref={headerRef}
          className={`section-header transition-all duration-600 ease-out ${
            headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="section-title">Qué analizamos</h2>
          <p className="section-subtitle">
            Diagnóstico de las patologías más comunes en viviendas.
            <br />
            Cada caso se estudia de forma individual y recibe una orientación técnica específica, no respuestas genéricas.
          </p>
        </div>

        <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {pathologies.map((pathology, index) => (
            <PathologyCard key={index} pathology={pathology} index={index} />
          ))}
        </div>

        {/* Bridge Phrase */}
        <div className="mt-12 mx-auto max-w-3xl">
          <div className="bg-primary/5 border border-primary/20 rounded-lg px-6 py-5 text-center">
            <p className="text-sm md:text-base text-foreground leading-relaxed">
              <span className="font-medium">Independientemente del tipo de patología, todos los casos siguen el mismo criterio:</span>
              <br />
              <span className="font-bold text-primary">ningún diagnóstico se entrega sin revisión profesional</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
