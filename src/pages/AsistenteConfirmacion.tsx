import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Clock, FileText, ArrowRight } from 'lucide-react';
import { getCurrentExpedienteId } from '@/lib/expediente-storage';

export default function AsistenteConfirmacion() {
  const expedienteId = getCurrentExpedienteId();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background">
        <div className="container flex h-14 items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
              <span className="text-xs font-bold text-primary-foreground">DT</span>
            </div>
            <span className="font-semibold text-sm">Diagnóstico Técnico</span>
          </Link>
        </div>
      </header>

      <main className="container py-16">
        <div className="mx-auto max-w-lg text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>

          <h1 className="mt-6 text-2xl font-semibold">Pago autorizado</h1>
          <p className="mt-2 text-muted-foreground">
            Tu expediente ha pasado a revisión humana
          </p>

          <div className="mt-8 rounded-lg border border-border bg-muted/30 p-6">
            <div className="flex items-center justify-center gap-3">
              <Clock className="h-5 w-5 text-amber-600" />
              <span className="font-medium">En revisión</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Un profesional revisará tu expediente y el informe antes de enviarlo.
              El cargo en tu tarjeta solo se realizará cuando el informe sea enviado.
            </p>
          </div>

          <div className="mt-8 space-y-3">
            <div className="flex items-center gap-3 text-left">
              <FileText className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Siguiente paso</p>
                <p className="text-sm text-muted-foreground">
                  Recibirás el informe por email tras la validación
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            {expedienteId && (
              <Button variant="cta" asChild>
                <Link to={`/asistente/expediente/${expedienteId}`}>
                  Ver mi expediente
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
            <Button variant="outline" asChild>
              <Link to="/">Volver a la página principal</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
