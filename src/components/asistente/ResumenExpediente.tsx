import { ResumenExpediente as ResumenType } from '@/types/expediente';
import { MapPin, Clock, AlertTriangle, FileText, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResumenExpedienteProps {
  resumen: ResumenType;
  className?: string;
}

export function ResumenExpediente({ resumen, className }: ResumenExpedienteProps) {
  const items = [
    {
      icon: MapPin,
      label: 'Ubicación',
      value: resumen.s1_localizacion || resumen.ubicacion,
      placeholder: 'No indicada',
    },
    {
      icon: FileText,
      label: 'Tipo de daño',
      value: resumen.s2_tipo_dano || resumen.tipoPatologia,
      placeholder: 'Por determinar',
    },
    {
      icon: Clock,
      label: 'Antigüedad',
      value: resumen.s3_antiguedad || resumen.antiguedad,
      placeholder: 'No indicada',
    },
    {
      icon: TrendingUp,
      label: 'Evolución',
      value: resumen.s4_evolucion,
      placeholder: 'No indicada',
    },
  ];

  return (
    <div className={cn('card-artistic group', className)}>
      {/* Shine sweep effect */}
      <div className="card-artistic-shine" />

      <div className="card-artistic-content !p-4">
        <h4 className="card-artistic-title text-sm font-medium mb-4">
          Resumen del expediente
        </h4>

        <div className="card-artistic-info space-y-3">
          {items.map((item, index) => (
            <div
              key={item.label}
              className="card-artistic-info-item flex items-start gap-3 !py-2"
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              {/* Icon badge */}
              <div className="relative flex-shrink-0">
                <div className="absolute inset-[-3px] rounded-lg bg-gradient-to-br from-primary/20 to-cyan-400/10 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative h-8 w-8 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-300">
                  <item.icon className="h-4 w-4 text-primary transition-transform duration-300 group-hover:scale-110" />
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs text-primary/70 uppercase tracking-wide font-medium mb-0.5">
                  {item.label}
                </p>
                <p className="text-sm font-medium text-foreground/90 group-hover:text-foreground transition-colors duration-300">
                  {item.value || (
                    <span className="text-muted-foreground italic">{item.placeholder}</span>
                  )}
                </p>
              </div>
            </div>
          ))}

          {resumen.sintomasObservados && resumen.sintomasObservados.length > 0 && (
            <div className="card-artistic-info-item flex items-start gap-3 !py-2">
              <div className="relative flex-shrink-0">
                <div className="absolute inset-[-3px] rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-400/10 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative h-8 w-8 rounded-lg bg-gradient-to-br from-amber-500/10 to-amber-500/5 dark:from-amber-500/20 dark:to-amber-500/10 flex items-center justify-center group-hover:from-amber-500/20 group-hover:to-amber-500/10 transition-all duration-300">
                  <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 transition-transform duration-300 group-hover:scale-110" />
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-amber-600/80 dark:text-amber-400/80 uppercase tracking-wide font-medium mb-1.5">
                  Síntomas observados
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {resumen.sintomasObservados.map((sintoma, i) => (
                    <span
                      key={i}
                      className="rounded-full bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 px-2.5 py-0.5 text-xs font-medium text-foreground/80 group-hover:from-primary/15 group-hover:to-primary/10 transition-all duration-300"
                    >
                      {sintoma}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {resumen.descripcionUsuario && (
            <div className="mt-4 rounded-xl border border-border/50 bg-gradient-to-br from-muted/50 to-muted/30 p-3 group-hover:border-primary/20 transition-colors duration-300">
              <p className="text-xs text-primary/70 uppercase tracking-wide font-medium mb-1">
                Descripción inicial
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 group-hover:text-foreground/80 transition-colors duration-300">
                {resumen.descripcionUsuario}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
