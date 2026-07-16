import { PACKS, PackType } from '@/types/expediente';
import { PackCard } from './PackCard';

interface PacksSectionProps {
  selectedPack?: PackType;
  onSelectPack: (packId: PackType) => void;
  disabled?: boolean;
}

export function PacksSection({ selectedPack, onSelectPack, disabled }: PacksSectionProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold">Selecciona tu pack</h3>
        <p className="text-sm text-muted-foreground">
          Elige el nivel de servicio que necesitas
        </p>
      </div>

      <div className="grid gap-4">
        {PACKS.map((pack) => (
          <PackCard
            key={pack.id}
            pack={pack}
            selected={selectedPack === pack.id}
            onSelect={() => onSelectPack(pack.id)}
            disabled={disabled}
          />
        ))}
      </div>

      {/* Comparison note */}
      <div className="rounded-lg border border-border bg-muted/30 p-3">
        <p className="text-xs text-muted-foreground">
          <strong>Nota:</strong> El pack gratuito incluye el prediagnóstico en
          pantalla. Los packs de pago añaden un informe técnico con revisión
          humana obligatoria antes del envío.
        </p>
      </div>
    </div>
  );
}
