import { Pack } from '@/types/expediente';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PackCardProps {
  pack: Pack;
  selected?: boolean;
  onSelect: () => void;
  disabled?: boolean;
}

export function PackCard({ pack, selected, onSelect, disabled }: PackCardProps) {
  const isGratis = pack.precio === 'Gratis';

  return (
    <div
      className={cn(
        'card-artistic group relative transition-all duration-500',
        selected && 'ring-2 ring-primary shadow-lg shadow-primary/20',
        pack.destacado && !selected && 'ring-1 ring-primary/30',
        disabled && 'opacity-50 pointer-events-none'
      )}
    >
      {/* Shine sweep effect */}
      <div className="card-artistic-shine" />

      {/* Destacado badge */}
      {pack.destacado && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-cyan-500 rounded-full blur-md opacity-50 animate-pulse" />
          {/* Badge content */}
          <div className="relative rounded-full bg-gradient-to-r from-primary to-primary/90 px-3 py-1 text-xs font-medium text-primary-foreground shadow-lg whitespace-nowrap border border-primary-foreground/10">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground animate-pulse" />
              Recomendado
            </span>
          </div>
        </div>
      )}

      {/* Selected glow */}
      {selected && (
        <div className="absolute -inset-[2px] bg-gradient-to-r from-primary/50 via-cyan-400/30 to-primary/50 rounded-[1.1rem] blur-sm opacity-70 -z-10" />
      )}

      <div className="card-artistic-content !p-4 space-y-3">
        {/* Header */}
        <div>
          <h4 className="card-artistic-title text-base font-semibold">{pack.nombre}</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{pack.descripcion}</p>
        </div>

        {/* Price */}
        <div className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          {pack.precio}
        </div>

        {/* Separator */}
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent group-hover:via-primary/30 transition-colors duration-500" />

        {/* Features */}
        <ul className="card-artistic-info space-y-2">
          {pack.incluye.map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-sm"
              style={{ transitionDelay: `${i * 30}ms` }}
            >
              <span className="flex-shrink-0 mt-0.5 h-4 w-4 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center group-hover:from-primary/30 group-hover:to-primary/20 transition-all duration-300">
                <Check className="h-2.5 w-2.5 text-primary" />
              </span>
              <span className="text-foreground/90 group-hover:text-foreground transition-colors duration-300">
                {item}
              </span>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <Button
          variant={selected ? 'default' : isGratis ? 'outline' : 'cta'}
          className={cn(
            'w-full',
            !selected && !isGratis && 'btn-animated shadow-md shadow-primary/20'
          )}
          onClick={onSelect}
          disabled={disabled}
        >
          <span>{selected ? 'Seleccionado' : isGratis ? 'Seleccionar' : 'Solicitar'}</span>
          {!selected && <ArrowRight className="h-4 w-4 ml-1" />}
        </Button>

        {!isGratis && (
          <p className="text-center text-[11px] text-muted-foreground">
            Autorización al solicitar, captura al entregar
          </p>
        )}
      </div>
    </div>
  );
}
