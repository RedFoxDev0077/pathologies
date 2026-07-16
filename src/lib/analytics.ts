/**
 * Thin wrapper over gtag (loaded in index.html as AW-17995643190).
 *
 * Events are the ones named in the client's document, section 6:
 *   begin_analysis, complete_analysis, click_upgrade_400, click_upgrade_950, save_for_later
 *
 * Conversion *labels* (AW-XXXX/YYYY) are per-account and have to come from the
 * owner's Google Ads panel, so a conversion is only sent when the matching
 * VITE_GOOGLE_ADS_CONVERSION_* env var is present. The plain GA-style event is
 * always sent, so nothing is lost while we wait for the labels.
 */

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export type AnalyticsEvent =
  | 'begin_analysis'
  | 'complete_analysis'
  | 'click_upgrade_400'
  | 'click_upgrade_950'
  | 'save_for_later';

/** Google Ads conversion labels, supplied per-event via env when available. */
const CONVERSION_LABELS: Partial<Record<AnalyticsEvent, string | undefined>> = {
  begin_analysis: import.meta.env.VITE_ADS_CONV_BEGIN_ANALYSIS,
  complete_analysis: import.meta.env.VITE_ADS_CONV_COMPLETE_ANALYSIS,
  click_upgrade_400: import.meta.env.VITE_ADS_CONV_UPGRADE_400,
  click_upgrade_950: import.meta.env.VITE_ADS_CONV_UPGRADE_950,
};

export function trackEvent(
  event: AnalyticsEvent,
  params: Record<string, unknown> = {},
): void {
  try {
    if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;

    // Always emit the plain event (GA4 / Ads custom event).
    window.gtag('event', event, params);

    // Additionally fire a Google Ads conversion when a label is configured.
    const label = CONVERSION_LABELS[event];
    if (label) {
      window.gtag('event', 'conversion', { send_to: label, ...params });
    }
  } catch {
    // Analytics must never break the funnel.
  }
}
