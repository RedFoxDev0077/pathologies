import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Cookie } from 'lucide-react';
import { getStoredConsent, setConsent } from '@/lib/analytics';

/**
 * Cookie consent banner (Consent Mode v2).
 *
 * Required for two separate reasons:
 *   - AEPD guidance: measurement/advertising cookies need prior consent, and
 *     rejecting must be as easy as accepting — hence two equally weighted
 *     buttons and no "X to dismiss" (dismissing would imply consent).
 *   - Since March 2024 Google requires Consent Mode v2 signals for EEA traffic;
 *     without them Ads audiences and conversion modelling degrade.
 *
 * Defaults are denied in index.html; nothing here grants anything until the
 * visitor chooses.
 */
export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only ask when no decision has been recorded yet.
    if (getStoredConsent() === null) setVisible(true);
  }, []);

  if (!visible) return null;

  const decide = (choice: 'granted' | 'denied') => {
    setConsent(choice);
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Consentimiento de cookies"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/98 backdrop-blur supports-[backdrop-filter]:bg-background/90"
    >
      <div className="container mx-auto flex max-w-5xl flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-6">
        <div className="flex items-start gap-3">
          <Cookie className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" aria-hidden="true" />
          <p className="text-xs leading-relaxed text-muted-foreground md:text-sm">
            Usamos cookies propias y de terceros para medir el uso de la web y la eficacia de
            nuestras campañas. Puedes aceptarlas o rechazarlas: si las rechazas, seguiremos
            midiendo de forma anónima y agregada. Más detalles en{' '}
            <Link to="/cookies" className="text-primary underline underline-offset-2">
              política de cookies
            </Link>{' '}
            y{' '}
            <Link to="/privacidad" className="text-primary underline underline-offset-2">
              privacidad
            </Link>
            .
          </p>
        </div>

        <div className="flex flex-shrink-0 gap-2 sm:ml-auto">
          {/* Reject is given the same size and prominence as accept, on purpose. */}
          <Button
            variant="outline"
            size="sm"
            className="flex-1 sm:flex-none"
            onClick={() => decide('denied')}
          >
            Rechazar
          </Button>
          <Button size="sm" className="flex-1 sm:flex-none" onClick={() => decide('granted')}>
            Aceptar
          </Button>
        </div>
      </div>
    </div>
  );
}
