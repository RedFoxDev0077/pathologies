import { ExpedienteState } from '@/types/expediente';
import { Button } from '@/components/ui/button';

interface QuickRepliesProps {
  estado: ExpedienteState;
  perfil: 'particular' | 'abogado' | 'administrador';
  onSelect: (reply: string) => void;
  evidencias?: Evidence[];
}

interface Evidence {
  id: string;
  status: 'uploading' | 'validating' | 'completed' | 'error';
  validated?: boolean;
}

// Profile-specific button labels
const QUICK_REPLIES_BY_PROFILE: Record<'particular' | 'abogado' | 'administrador', Partial<Record<ExpedienteState, string[]>>> = {
  particular: {
    [ExpedienteState.S1_LOCALIZACION]: [
      'Pared', 'Suelo', 'Techo', 'Fachada', 'Cubierta', 'Instalación', 'No lo sé',
    ],
    [ExpedienteState.S2_TIPO_DANO]: [
      'Grieta o fisura', 'Manchas de humedad', 'Desconchados', 'Deformaciones', 'Olor o ruido extraño', 'No lo sé',
    ],
    [ExpedienteState.S3_ANTIGUEDAD]: [
      'Hace días', 'Hace semanas', 'Hace meses', 'Desde hace años', 'No lo sé',
    ],
    [ExpedienteState.S4_EVOLUCION]: [
      'Ha empeorado', 'Está igual', 'Ha mejorado', 'No lo sé',
    ],
    [ExpedienteState.S6_CONTEXTO]: [
      'Lluvias fuertes', 'Obras o reformas cercanas', 'Cambio en instalaciones', 'Ninguna de las anteriores',
    ],
  },
  abogado: {
    [ExpedienteState.S1_LOCALIZACION]: [
      'Pared', 'Suelo', 'Techo', 'Fachada', 'Cubierta', 'Instalación', 'Se desconoce',
    ],
    [ExpedienteState.S2_TIPO_DANO]: [
      'Grieta o fisura', 'Manchas de humedad', 'Desconchados', 'Deformaciones', 'Olor o ruido extraño', 'Se desconoce',
    ],
    [ExpedienteState.S3_ANTIGUEDAD]: [
      'Días', 'Semanas', 'Meses', 'Años', 'Se desconoce',
    ],
    [ExpedienteState.S4_EVOLUCION]: [
      'Se ha agravado', 'Se mantiene estable', 'Ha mejorado', 'Se desconoce',
    ],
    [ExpedienteState.S6_CONTEXTO]: [
      'Lluvias intensas', 'Obras o reformas', 'Modificación de instalaciones', 'Ninguno de los anteriores',
    ],
  },
  administrador: {
    [ExpedienteState.S1_LOCALIZACION]: [
      'Pared', 'Suelo', 'Techo', 'Fachada', 'Cubierta', 'Instalación', 'Se desconoce',
    ],
    [ExpedienteState.S2_TIPO_DANO]: [
      'Grieta o fisura', 'Manchas de humedad', 'Desconchados', 'Deformaciones', 'Olor o ruido extraño', 'Se desconoce',
    ],
    [ExpedienteState.S3_ANTIGUEDAD]: [
      'Días', 'Semanas', 'Meses', 'Años', 'Se desconoce',
    ],
    [ExpedienteState.S4_EVOLUCION]: [
      'Ha evolucionado', 'Se mantiene estable', 'Ha mejorado', 'Se desconoce',
    ],
    [ExpedienteState.S6_CONTEXTO]: [
      'Lluvias intensas', 'Obras o reformas en el edificio', 'Incidencias en instalaciones', 'Ninguna incidencia',
    ],
  },
};

export function QuickReplies({ estado, perfil, onSelect, evidencias = [] }: QuickRepliesProps) {
  // S5: Show "Continuar" button only when EXACTLY at S5 state and at least 1 photo is validated
  if (estado === ExpedienteState.S5_MATERIAL_GRAFICO) {
    const hasValidatedPhotos = evidencias.some(
      e => e.status === 'completed' && e.validated
    );

    if (hasValidatedPhotos) {
      return (
        <div className="flex flex-wrap gap-2 items-center">
          <Button
            variant="default"
            size="lg"
            className="h-auto px-6 py-3 text-base font-semibold"
            onClick={() => onSelect('Continuar con el diagnóstico')}
          >
            Continuar con el diagnóstico
          </Button>
        </div>
      );
    }
    // At S5 but no validated photos yet, show nothing
    return null;
  }

  // For all other states, show the profile-specific quick replies
  const profileReplies = QUICK_REPLIES_BY_PROFILE[perfil];
  const replies = profileReplies?.[estado];

  if (!replies || replies.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {replies.map((reply) => (
        <Button
          key={reply}
          variant="outline"
          size="sm"
          className="h-auto px-3 py-2 text-sm whitespace-nowrap"
          onClick={() => onSelect(reply)}
        >
          {reply}
        </Button>
      ))}
    </div>
  );
}
