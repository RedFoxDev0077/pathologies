import { Prediagnostico } from '@/types/expediente';
import { AlertTriangle, Lightbulb, ArrowRight, Camera, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PrediagnosticoBlockProps {
  prediagnostico: Prediagnostico;
  className?: string;
}

export function PrediagnosticoBlock({ prediagnostico, className }: PrediagnosticoBlockProps) {
  const { hipotesis, posiblesCausas, proximosPasos, evidenciaAdicionalSugerida, riesgoPercibido } = prediagnostico;

  const riesgoConfig = {
    bajo: { label: 'Bajo', color: 'from-green-500 to-emerald-500', textColor: 'text-green-700 dark:text-green-400', bgColor: 'bg-green-50 dark:bg-green-950/50' },
    medio: { label: 'Medio', color: 'from-amber-500 to-orange-500', textColor: 'text-amber-700 dark:text-amber-400', bgColor: 'bg-amber-50 dark:bg-amber-950/50' },
    alto: { label: 'Alto', color: 'from-red-500 to-rose-500', textColor: 'text-red-700 dark:text-red-400', bgColor: 'bg-red-50 dark:bg-red-950/50' },
  };

  const riesgo = riesgoConfig[riesgoPercibido];

  const sections = [
    {
      icon: Lightbulb,
      title: 'Hipótesis',
      items: hipotesis,
      iconColor: 'text-primary',
      iconBg: 'from-primary/15 to-primary/5',
    },
    {
      icon: AlertTriangle,
      title: 'Posibles causas',
      items: posiblesCausas,
      iconColor: 'text-amber-500',
      iconBg: 'from-amber-500/15 to-amber-500/5',
    },
    {
      icon: ArrowRight,
      title: 'Próximos pasos recomendados',
      items: proximosPasos,
      iconColor: 'text-primary',
      iconBg: 'from-primary/15 to-primary/5',
    },
  ];

  return (
    <div className={cn('card-artistic group', className)}>
      {/* Shine sweep effect */}
      <div className="card-artistic-shine" />

      <div className="card-artistic-content !p-4 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="card-artistic-title text-base font-semibold">
              Prediagnóstico preliminar
            </h3>
            <p className="text-sm text-muted-foreground">
              Basado en la información proporcionada
            </p>
          </div>

          {/* Risk badge with glow */}
          <div className="relative">
            <div className={cn('absolute inset-0 rounded-full blur-md opacity-40', `bg-gradient-to-r ${riesgo.color}`)} />
            <div className={cn(
              'relative rounded-full px-3 py-1.5 text-xs font-semibold border',
              riesgo.bgColor,
              riesgo.textColor,
              'border-current/20'
            )}>
              Riesgo {riesgo.label}
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent group-hover:via-primary/30 transition-colors duration-500" />

        {/* Sections */}
        <div className="card-artistic-info space-y-4">
          {sections.map((section, sectionIndex) => (
            <div key={section.title} className="space-y-2">
              <div className="flex items-center gap-2">
                {/* Icon badge */}
                <div className="relative">
                  <div className={cn(
                    'absolute inset-[-2px] rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500',
                    `bg-gradient-to-br ${section.iconBg}`
                  )} />
                  <div className={cn(
                    'relative h-7 w-7 rounded-lg flex items-center justify-center transition-all duration-300',
                    `bg-gradient-to-br ${section.iconBg}`,
                    'group-hover:scale-105'
                  )}>
                    <section.icon className={cn('h-4 w-4', section.iconColor)} />
                  </div>
                </div>
                <span className="text-sm font-semibold text-foreground/90 group-hover:text-foreground transition-colors duration-300">
                  {section.title}
                </span>
              </div>

              <ul className="space-y-1.5 pl-9">
                {section.items.map((item, i) => (
                  <li
                    key={i}
                    className="card-artistic-info-item text-sm text-muted-foreground leading-relaxed !py-0.5 !border-0 list-disc marker:text-primary/50 group-hover:text-foreground/80 transition-colors duration-300"
                    style={{ transitionDelay: `${(sectionIndex * 3 + i) * 30}ms` }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Evidencia adicional */}
        {evidenciaAdicionalSugerida && (
          <div className="rounded-xl border border-border/50 bg-gradient-to-br from-muted/50 to-muted/30 p-3 group-hover:border-primary/20 transition-colors duration-300">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center flex-shrink-0">
                <Camera className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-primary/70 uppercase tracking-wide font-medium mb-0.5">
                  Evidencia adicional sugerida
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
                  {evidenciaAdicionalSugerida}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="rounded-xl border border-amber-200/50 dark:border-amber-800/30 bg-gradient-to-br from-amber-50 to-amber-50/50 dark:from-amber-950/30 dark:to-amber-950/20 p-3">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-amber-500/15 to-amber-500/5 dark:from-amber-500/20 dark:to-amber-500/10 flex items-center justify-center flex-shrink-0">
              <Info className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
            <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
              <strong>Orientación preliminar.</strong> Esta información no sustituye
              una inspección presencial cuando sea necesaria. Se recomienda consultar
              con un profesional para casos que requieran intervención.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
