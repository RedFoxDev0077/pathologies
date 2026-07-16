import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { casaDiagAPI, GuestInvite, GuestExpiry } from '@/services/api/casadiag-api';
import { Copy, Check, UserPlus, ShieldAlert, Clock, Eye } from 'lucide-react';

const formatDate = (value: string | null) =>
  value
    ? new Date(value).toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

export function GuestAccessPanel() {
  const [invites, setInvites] = useState<GuestInvite[]>([]);
  const [activeCount, setActiveCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [label, setLabel] = useState('');
  const [expiry, setExpiry] = useState<GuestExpiry>('7d');

  // The raw token is only ever available right after creation.
  const [newLink, setNewLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [revokeTarget, setRevokeTarget] = useState<GuestInvite | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await casaDiagAPI.getGuestInvites();
      setInvites(data.invites || []);
      setActiveCount(data.activeCount || 0);
    } catch {
      toast({
        title: 'No se pudieron cargar los accesos de invitado',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async () => {
    if (label.trim().length < 2) {
      toast({ title: 'Indica un nombre para la invitación', variant: 'destructive' });
      return;
    }
    setCreating(true);
    try {
      const { token } = await casaDiagAPI.createGuestInvite(label.trim(), expiry);
      setNewLink(`${window.location.origin}/invitado/${token}`);
      setCopied(false);
      setLabel('');
      await load();
    } catch {
      toast({ title: 'No se pudo crear la invitación', variant: 'destructive' });
    } finally {
      setCreating(false);
    }
  };

  const handleRevoke = async () => {
    if (!revokeTarget) return;
    const target = revokeTarget;
    setRevokeTarget(null);
    try {
      await casaDiagAPI.revokeGuestInvite(target.id);
      toast({
        title: 'Acceso anulado',
        description: `${target.label} ha perdido el acceso inmediatamente.`,
      });
      await load();
    } catch {
      toast({ title: 'No se pudo anular el acceso', variant: 'destructive' });
    }
  };

  const copyLink = async () => {
    if (!newLink) return;
    try {
      await navigator.clipboard.writeText(newLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast({ title: 'Copia el enlace manualmente', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Owner status (doc 7.3) */}
      <div
        className={`rounded-lg border p-4 ${
          activeCount > 0
            ? 'border-primary/30 bg-primary/5'
            : 'border-border bg-muted/30'
        }`}
      >
        <div className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-primary" />
          <p className="font-semibold">
            {activeCount > 0
              ? `Hay ${activeCount} invitado${activeCount > 1 ? 's' : ''} activo${activeCount > 1 ? 's' : ''}`
              : 'No hay invitados activos'}
          </p>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Los invitados tienen acceso de <strong>solo lectura</strong>. No pueden
          modificar contenidos, cambiar tu contraseña, eliminar la cuenta ni acceder
          a datos de facturación.
        </p>
      </div>

      {/* Create invitation (doc 7.1) */}
      <div className="rounded-lg border border-border p-4">
        <h3 className="mb-3 flex items-center gap-2 font-semibold">
          <UserPlus className="h-4 w-4" /> Crear invitación
        </h3>
        <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto] sm:items-end">
          <div>
            <Label htmlFor="guest-label" className="text-xs">
              Nombre del invitado
            </Label>
            <Input
              id="guest-label"
              placeholder="Ej: Elliot - desarrollador"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              maxLength={80}
            />
          </div>
          <div>
            <Label className="text-xs">Caducidad</Label>
            <Select value={expiry} onValueChange={(v) => setExpiry(v as GuestExpiry)}>
              <SelectTrigger className="w-[170px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7 días</SelectItem>
                <SelectItem value="30d">30 días</SelectItem>
                <SelectItem value="unlimited">Hasta anulación manual</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleCreate} disabled={creating}>
            {creating ? 'Creando...' : 'Generar enlace'}
          </Button>
        </div>

        {newLink && (
          <div className="mt-4 rounded-md border border-primary/30 bg-primary/5 p-3">
            <p className="mb-2 text-sm font-medium">
              Enlace de acceso creado. Cópialo ahora:{' '}
              <span className="text-destructive">no volverá a mostrarse.</span>
            </p>
            <div className="flex gap-2">
              <Input readOnly value={newLink} className="font-mono text-xs" />
              <Button variant="outline" onClick={copyLink}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Envíalo por un canal privado. Cualquiera con este enlace obtiene acceso
              de solo lectura hasta que lo anules.
            </p>
          </div>
        )}
      </div>

      {/* Invitation list */}
      <div className="rounded-lg border border-border">
        <div className="border-b border-border px-4 py-3">
          <h3 className="font-semibold">Invitaciones</h3>
        </div>
        {loading ? (
          <p className="p-4 text-sm text-muted-foreground">Cargando...</p>
        ) : invites.length === 0 ? (
          <p className="p-4 text-sm text-muted-foreground">
            Todavía no has creado ninguna invitación.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {invites.map((invite) => (
              <li
                key={invite.id}
                className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{invite.label}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                        invite.status === 'active'
                          ? 'bg-primary/10 text-primary'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {invite.status === 'active'
                        ? 'Activo'
                        : invite.status === 'revoked'
                          ? 'Anulado'
                          : 'Caducado'}
                    </span>
                  </div>
                  <p className="mt-1 flex flex-wrap gap-x-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Creado: {formatDate(invite.createdAt)}
                    </span>
                    <span>
                      Caduca:{' '}
                      {invite.expiresAt ? formatDate(invite.expiresAt) : 'sin caducidad'}
                    </span>
                    {invite.lastUsedAt && (
                      <span>Último acceso: {formatDate(invite.lastUsedAt)}</span>
                    )}
                  </p>
                </div>

                {invite.status === 'active' && (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="shrink-0"
                    onClick={() => setRevokeTarget(invite)}
                  >
                    <ShieldAlert className="mr-1.5 h-4 w-4" />
                    Anular acceso ahora
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Confirmation (doc 7.3) */}
      <AlertDialog
        open={!!revokeTarget}
        onOpenChange={(open) => !open && setRevokeTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Este usuario perderá el acceso inmediatamente
              {revokeTarget ? ` (${revokeTarget.label})` : ''}. Su sesión se cerrará y
              el enlace dejará de funcionar.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRevoke}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Anular acceso ahora
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
