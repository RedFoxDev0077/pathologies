import { Info, AlertCircle } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const points = [
  "El asistente ofrece orientación preliminar, no un diagnóstico definitivo.",
  "Nada se envía sin validación humana: un técnico revisa cada informe antes de su emisión.",
  "Este servicio no sustituye una inspección presencial cuando sea necesaria.",
  "Tus evidencias se almacenan de forma segura con acceso temporal y controlado.",
  "Consentimiento RGPD registrado: tus datos se tratan conforme a la normativa vigente.",
  "El pago se autoriza al solicitar el informe, pero solo se captura cuando se entrega.",
];

export function TransparencySection() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>({ threshold: 0.2 });

  return (
    <section ref={ref} className="section">
      <div className="container">
        <div className="mx-auto max-w-3xl">
          <div
            className={`card-institutional border-l-4 border-l-primary p-6 md:p-8 transition-all duration-700 ease-out ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
            }`}
          >
            <div className="mb-6 flex items-center gap-3">
              <AlertCircle className={`h-6 w-6 text-primary transition-transform duration-500 ${isVisible ? "scale-100" : "scale-0"}`} />
              <h2 className="text-xl font-semibold">Transparencia y límites</h2>
            </div>

            <p className="mb-6 text-muted-foreground">
              Es importante que entiendas el alcance de este servicio antes de
              comenzar. Lee atentamente los siguientes puntos:
            </p>

            <ul className="space-y-4">
              {points.map((point, index) => (
                <li
                  key={index}
                  className={`flex items-start gap-3 transition-all duration-500 ease-out ${
                    isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                  }`}
                  style={{ transitionDelay: isVisible ? `${200 + index * 80}ms` : "0ms" }}
                >
                  <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-muted-foreground" />
                  <span className="text-foreground">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
