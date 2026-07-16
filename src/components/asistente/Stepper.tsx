import { ExpedienteState, STATE_LABELS } from '@/types/expediente';
import { Check, Circle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepperProps {
  currentState: ExpedienteState;
  className?: string;
  compact?: boolean;
}

const VISIBLE_STATES = [
  ExpedienteState.S1_LOCALIZACION,
  ExpedienteState.S2_TIPO_DANO,
  ExpedienteState.S3_ANTIGUEDAD,
  ExpedienteState.S4_EVOLUCION,
  ExpedienteState.S5_MATERIAL_GRAFICO,
  ExpedienteState.S6_CONTEXTO,
  ExpedienteState.S7_DESCRIPCION_LIBRE,
  ExpedienteState.S7B_PREGUNTAS_TECNICAS,
  ExpedienteState.S8_ANALISIS_GRATUITO,
  ExpedienteState.S9_CONFIRMACION_PAGO,
  ExpedienteState.PAYMENT_COMPLETED,
  ExpedienteState.INFO_CONFIRMATION,
  ExpedienteState.S9_GENERACION_PREINFORME,
  ExpedienteState.DRAFT_SENT_TO_TECHNICIAN,
  ExpedienteState.FINAL_SENT,
];

export function Stepper({ currentState, className, compact = false }: StepperProps) {
  const states = VISIBLE_STATES;
  const currentIndex = states.indexOf(currentState);

  if (compact) {
    return (
      <div className={cn('flex items-center gap-1', className)}>
        {states.map((state, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div
              key={state}
              className={cn(
                'h-1.5 flex-1 rounded-full transition-colors',
                isCompleted && 'bg-primary',
                isCurrent && 'bg-primary/60',
                !isCompleted && !isCurrent && 'bg-muted'
              )}
              title={STATE_LABELS[state]}
            />
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn('space-y-2', className)}>
      {states.map((state, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isPending = index > currentIndex;

        return (
          <div
            key={state}
            className={cn(
              'flex items-center gap-3 text-sm',
              isPending && 'opacity-50'
            )}
          >
            <div
              className={cn(
                'flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                isCompleted && 'border-primary bg-primary text-primary-foreground',
                isCurrent && 'border-primary bg-background text-primary',
                isPending && 'border-muted bg-background text-muted-foreground'
              )}
            >
              {isCompleted ? (
                <Check className="h-3.5 w-3.5" />
              ) : isCurrent ? (
                <Circle className="h-2.5 w-2.5 fill-current" />
              ) : (
                <span className="text-xs">{index + 1}</span>
              )}
            </div>
            <span
              className={cn(
                'font-medium',
                isCurrent && 'text-foreground',
                !isCurrent && 'text-muted-foreground'
              )}
            >
              {STATE_LABELS[state]}
            </span>
            {isCurrent && (
              <Clock className="ml-auto h-4 w-4 text-muted-foreground" />
            )}
          </div>
        );
      })}
    </div>
  );
}
