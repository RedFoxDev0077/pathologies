import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { casaDiagAPI } from '@/services/api/casadiag-api';
import { Eye, ShieldAlert } from 'lucide-react';

/**
 * Landing target for a guest invitation link (/invitado/:token).
 * Exchanges the one-time token for a read-only session and drops the guest
 * into the admin panel.
 */
export default function InvitadoAcceso() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const redeem = async () => {
      if (!token) {
        setError('Enlace de invitación no válido.');
        return;
      }
      try {
        const data = await casaDiagAPI.redeemGuestInvite(token);
        if (cancelled) return;

        // Store like a normal session so the API client attaches the token.
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('guestReadOnly', 'true');

        navigate('/admin', { replace: true });
      } catch (e: any) {
        if (cancelled) return;
        setError(
          e?.response?.data?.message ||
            'Esta invitación no es válida, ha caducado o ha sido anulada.',
        );
      }
    };

    redeem();
    return () => {
      cancelled = true;
    };
  }, [token, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-xl border border-border p-8 text-center">
        {error ? (
          <>
            <ShieldAlert className="mx-auto mb-4 h-10 w-10 text-destructive" />
            <h1 className="mb-2 text-xl font-bold">Acceso no disponible</h1>
            <p className="text-sm text-muted-foreground">{error}</p>
            <p className="mt-4 text-xs text-muted-foreground">
              Solicita un enlace nuevo al propietario.
            </p>
          </>
        ) : (
          <>
            <Eye className="mx-auto mb-4 h-10 w-10 animate-pulse text-primary" />
            <h1 className="mb-2 text-xl font-bold">Validando invitación…</h1>
            <p className="text-sm text-muted-foreground">
              Se te concederá acceso de solo lectura.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
