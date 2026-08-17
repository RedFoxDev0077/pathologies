import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackEvent, trackPageView } from '@/lib/analytics';

/**
 * Renders nothing. Handles the two funnel signals that are page-level rather
 * than component-level:
 *
 *   Step 1 — a page_view on every SPA route change. Without this, gtag reports
 *            a single pageview for the whole session and no landing/exit data.
 *
 *   Step 2 — a click on any CTA that sends the visitor into the assistant.
 *            Done with one delegated listener instead of an onClick on each of
 *            the ~16 entry points (header, hero, sticky bars, packs, 4 SEO
 *            pages...), so a newly added CTA is measured automatically.
 *            Tag a wrapper or the link with data-cta="name" to label it;
 *            otherwise the enclosing <section id> is used.
 */
export function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    // Defer one tick so react-helmet-async has swapped <title> and the
    // pageview carries the new page's title rather than the previous one.
    const id = window.setTimeout(() => {
      trackPageView(location.pathname + location.search);
    }, 0);
    return () => window.clearTimeout(id);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target || typeof target.closest !== 'function') return;

      const link = target.closest('a[href="/asistente"]');
      if (!link) return;

      const labelled = link.closest('[data-cta]') as HTMLElement | null;
      const section = link.closest('section[id]') as HTMLElement | null;

      trackEvent('click_start_analysis', {
        cta_location: labelled?.dataset.cta || section?.id || 'unknown',
        from_page: window.location.pathname,
      });
    };

    // Capture phase: fire before react-router unmounts the clicked element.
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  return null;
}
