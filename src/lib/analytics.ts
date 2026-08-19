/**
 * Analytics: GA4 + Google Ads, behind Consent Mode v2.
 *
 * Covers the 8-step funnel the owner asked for:
 *
 *   1. Landing visit ............ page_view (sent on every SPA route change)
 *   2. Click "Analizar mi caso" . click_start_analysis
 *   3. Assistant started ........ select_profile -> begin_analysis
 *      (chat progress) .......... diagnostic_step (one per S0..S7B), evidence_uploaded
 *   4. Free analysis done ....... complete_analysis
 *   5. Paid offer seen .......... view_offer
 *   6. Click to buy ............. click_upgrade_400 / click_upgrade_950
 *   7. Checkout started ......... begin_checkout -> checkout_submitted
 *   8. Payment completed ........ purchase
 *
 * Every event carries the traffic source (utm_*, gclid, or a channel derived
 * from the referrer), so drop-off can be sliced by campaign without needing
 * GA4's own attribution to line up.
 *
 * Two ids are involved and they are NOT interchangeable:
 *   - VITE_GA4_ID   (G-XXXXXXXXXX) -> reporting, funnel exploration
 *   - Google Ads    (AW-17995643190, hardcoded in index.html) -> bidding
 *
 * Google Ads *conversions* additionally need a per-account label
 * (AW-XXXXXXXX/YYYYYYYY) that can only be generated from the owner's Ads
 * panel. Until a label is supplied via the matching VITE_ADS_CONV_* variable,
 * the plain event is still sent (so GA4 is complete and nothing is lost) and
 * only the Ads conversion ping is skipped.
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export type AnalyticsEvent =
  | 'click_start_analysis'
  | 'select_profile'
  | 'begin_analysis'
  | 'diagnostic_step'
  | 'evidence_uploaded'
  | 'complete_analysis'
  | 'view_offer'
  | 'click_upgrade_400'
  | 'click_upgrade_950'
  | 'begin_checkout'
  | 'checkout_submitted'
  | 'purchase'
  | 'save_for_later';

/** Google Ads conversion labels, supplied per-event via env when available.
 *
 * complete_analysis is deliberately NOT here: it must fire exactly once per
 * expediente, at the moment the analysis is shown, and never on reload/reopen.
 * That guarantee can't be met by the generic per-event path, so it is fired
 * explicitly via fireConversionOnce() from the analysis screen instead — see
 * ADS_CONV_COMPLETE_ANALYSIS below. Keeping it out of this map also prevents a
 * double count with that explicit call. */
const CONVERSION_LABELS: Partial<Record<AnalyticsEvent, string | undefined>> = {
  begin_analysis: import.meta.env.VITE_ADS_CONV_BEGIN_ANALYSIS,
  click_upgrade_400: import.meta.env.VITE_ADS_CONV_UPGRADE_400,
  click_upgrade_950: import.meta.env.VITE_ADS_CONV_UPGRADE_950,
  begin_checkout: import.meta.env.VITE_ADS_CONV_BEGIN_CHECKOUT,
  purchase: import.meta.env.VITE_ADS_CONV_PURCHASE,
};

/**
 * Google Ads "Análisis gratuito completado" conversion action.
 * Fired once per expediente from the "Tu pre-diagnóstico está listo" screen.
 * Overridable via env, with the owner-supplied label as the default so it works
 * without any CI variable being set.
 */
export const ADS_CONV_COMPLETE_ANALYSIS: string =
  import.meta.env.VITE_ADS_CONV_COMPLETE_ANALYSIS ||
  'AW-17995643190/_e6vCKa4xeQcELby_oRD';

// GA4 measurement id. Falls back to the property's id so measurement works even
// if the CI variable is not set; it is a public id, not a secret.
const GA4_ID: string = import.meta.env.VITE_GA4_ID || 'G-CPBKTDYVCV';

// ---------------------------------------------------------------------------
// Consent (Consent Mode v2)
// ---------------------------------------------------------------------------

/**
 * The defaults are set in index.html *before* gtag.js loads — that ordering is
 * what makes Consent Mode work at all, so it cannot live here. This module only
 * records the visitor's choice and pushes the update.
 */
const CONSENT_KEY = 'casadiag_consent_v2';

export type ConsentChoice = 'granted' | 'denied';

function safeGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null; // Safari private mode
  }
}

function safeSet(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* nothing we can do; the banner will simply ask again next visit */
  }
}

export function getStoredConsent(): ConsentChoice | null {
  const raw = safeGet(CONSENT_KEY);
  return raw === 'granted' || raw === 'denied' ? raw : null;
}

/** Push the visitor's decision to gtag and remember it. */
export function setConsent(choice: ConsentChoice): void {
  safeSet(CONSENT_KEY, choice);
  applyConsent(choice);
}

function applyConsent(choice: ConsentChoice): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('consent', 'update', {
    ad_storage: choice,
    ad_user_data: choice,
    ad_personalization: choice,
    analytics_storage: choice,
  });
}

// ---------------------------------------------------------------------------
// Traffic source attribution
// ---------------------------------------------------------------------------

const ATTRIBUTION_KEY = 'casadiag_attribution';

export interface Attribution {
  source: string;
  medium: string;
  campaign?: string;
  content?: string;
  term?: string;
  gclid?: string;
  landing_page?: string;
  first_seen?: string;
}

/** Map a referrer host onto the channels the owner asked to distinguish. */
function channelFromReferrer(referrer: string): { source: string; medium: string } {
  if (!referrer) return { source: 'direct', medium: 'none' };

  let host = '';
  try {
    host = new URL(referrer).hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return { source: 'direct', medium: 'none' };
  }

  // Same-site navigation is not a new source.
  if (typeof window !== 'undefined' && host === window.location.hostname.replace(/^www\./, '')) {
    return { source: 'direct', medium: 'none' };
  }

  if (/(^|\.)google\./.test(host)) return { source: 'google', medium: 'organic' };
  if (/(^|\.)bing\.|(^|\.)duckduckgo\.|(^|\.)ecosia\.|(^|\.)yahoo\./.test(host)) {
    return { source: host.split('.')[0], medium: 'organic' };
  }
  if (host.includes('instagram')) return { source: 'instagram', medium: 'social' };
  if (host.includes('facebook') || host === 'fb.me' || host === 'l.facebook.com') {
    return { source: 'facebook', medium: 'social' };
  }
  if (host.includes('linkedin') || host === 'lnkd.in') return { source: 'linkedin', medium: 'social' };
  if (host.includes('t.co') || host.includes('twitter') || host.includes('x.com')) {
    return { source: 'twitter', medium: 'social' };
  }
  if (host.includes('whatsapp')) return { source: 'whatsapp', medium: 'social' };
  if (host.includes('youtube')) return { source: 'youtube', medium: 'social' };

  return { source: host, medium: 'referral' };
}

/**
 * Resolve the current visit's source and persist it.
 *
 * Stored in localStorage rather than sessionStorage on purpose: the funnel can
 * span days (the "save my case" link is valid for 30 days), and a conversion
 * that lands a week later should still be credited to the campaign that
 * produced it. A fresh utm_source or gclid overwrites the stored value — that is
 * the "last non-direct click" model Google Ads itself uses.
 */
export function captureAttribution(): Attribution {
  if (typeof window === 'undefined') return { source: 'direct', medium: 'none' };

  const params = new URLSearchParams(window.location.search);
  const utmSource = params.get('utm_source');
  const gclid = params.get('gclid');

  const stored = (() => {
    const raw = safeGet(ATTRIBUTION_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as Attribution;
    } catch {
      return null;
    }
  })();

  // No new campaign signal: keep whatever we already credited.
  if (!utmSource && !gclid && stored) return stored;

  const derived = channelFromReferrer(document.referrer || '');

  const attribution: Attribution = {
    source: utmSource || (gclid ? 'google' : derived.source),
    medium: params.get('utm_medium') || (gclid ? 'cpc' : derived.medium),
    campaign: params.get('utm_campaign') || undefined,
    content: params.get('utm_content') || undefined,
    term: params.get('utm_term') || undefined,
    gclid: gclid || undefined,
    landing_page: stored?.landing_page || window.location.pathname,
    first_seen: stored?.first_seen || new Date().toISOString(),
  };

  safeSet(ATTRIBUTION_KEY, JSON.stringify(attribution));
  return attribution;
}

/** Read the stored attribution without touching it. */
export function getAttribution(): Attribution {
  const raw = safeGet(ATTRIBUTION_KEY);
  if (raw) {
    try {
      return JSON.parse(raw) as Attribution;
    } catch {
      /* fall through */
    }
  }
  return captureAttribution();
}

/** Flattened, gtag-friendly copy of the attribution for event params. */
function attributionParams(): Record<string, unknown> {
  const a = getAttribution();
  return {
    traffic_source: a.source,
    traffic_medium: a.medium,
    traffic_campaign: a.campaign,
    gclid: a.gclid,
    landing_page: a.landing_page,
  };
}

// ---------------------------------------------------------------------------
// Init
// ---------------------------------------------------------------------------

let initialised = false;

/**
 * Configure GA4 and replay a stored consent decision.
 *
 * Call once, as early as possible. The Google Ads tag is already configured in
 * index.html; this only adds the GA4 stream when an id is available, so the
 * build stays functional before the owner supplies one.
 */
export function initAnalytics(): void {
  if (initialised || typeof window === 'undefined') return;
  initialised = true;

  captureAttribution();

  const stored = getStoredConsent();
  if (stored) applyConsent(stored);

  if (typeof window.gtag !== 'function') return;

  if (GA4_ID) {
    // send_page_view: false because route changes are reported explicitly by
    // trackPageView(). In GA4, also switch OFF Enhanced measurement ->
    // "Page changes based on browser history events" or hits will double count.
    window.gtag('config', GA4_ID, { send_page_view: false });
  }
}

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------

/** Report a virtual pageview. Safe to call on every route change. */
export function trackPageView(path: string, title?: string): void {
  try {
    if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
    if (!GA4_ID) return; // Ads-only setups do not need virtual pageviews

    window.gtag('event', 'page_view', {
      page_path: path,
      page_location: window.location.href,
      page_title: title || document.title,
      ...attributionParams(),
    });
  } catch {
    // Analytics must never break navigation.
  }
}

export function trackEvent(
  event: AnalyticsEvent,
  params: Record<string, unknown> = {},
): void {
  try {
    if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;

    const enriched = { ...attributionParams(), ...params };

    // Always emit the plain event (GA4 / Ads custom event).
    window.gtag('event', event, enriched);

    // Additionally fire a Google Ads conversion when a label is configured.
    const label = CONVERSION_LABELS[event];
    if (label) {
      window.gtag('event', 'conversion', { send_to: label, ...enriched });
    }
  } catch {
    // Analytics must never break the funnel.
  }
}

// ---------------------------------------------------------------------------
// One-time Google Ads conversions (deduplicated per entity)
// ---------------------------------------------------------------------------

// Same-tab guard: two components (desktop panel + mobile tab) can render the
// analysis screen in the same load, so an in-memory set stops a double fire
// before localStorage has been written.
const firedThisSession = new Set<string>();
const FIRED_STORE = 'casadiag_fired_conversions';

function loadFired(): Set<string> {
  try {
    const raw = localStorage.getItem(FIRED_STORE);
    return new Set<string>(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set<string>();
  }
}

function persistFired(keys: Set<string>): void {
  try {
    localStorage.setItem(FIRED_STORE, JSON.stringify([...keys]));
  } catch {
    /* private mode / quota — the in-memory guard still holds for this tab */
  }
}

/**
 * Fire a Google Ads conversion at most once for a given (label, dedupeId).
 *
 * Used for the "Análisis gratuito completado" conversion, which must register
 * exactly once per expediente and never again when the user reloads, returns to
 * the "Análisis" tab, or reopens the case later. The persistent guard is keyed
 * by expediente id, so the guarantee holds across sessions on the same device.
 */
export function fireConversionOnce(
  label: string,
  dedupeId: string,
  params: Record<string, unknown> = {},
): void {
  try {
    if (!label || !dedupeId) return;
    const key = `${label}:${dedupeId}`;

    if (firedThisSession.has(key)) return;

    const stored = loadFired();
    if (stored.has(key)) {
      firedThisSession.add(key);
      return;
    }

    if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;

    window.gtag('event', 'conversion', { send_to: label, ...params });

    firedThisSession.add(key);
    stored.add(key);
    persistFired(stored);
  } catch {
    // Analytics must never break the funnel.
  }
}

/**
 * Step 8. Kept separate from trackEvent because a purchase needs a monetary
 * value and a transaction id for de-duplication.
 *
 * `valueEur` should come from the backend's own record of what was charged.
 * When it is unknown the value is omitted rather than guessed — a wrong
 * conversion value trains Google Ads on bad data, which is worse than none.
 */
export function trackPurchase(opts: {
  transactionId: string;
  valueEur?: number;
  caseId?: string;
  /**
   * False when the payment could not be confirmed against the backend. Such
   * rows are still reported (losing real sales is worse) but must be
   * filterable, since an unverified purchase may not be a purchase at all.
   */
  verified?: boolean;
}): void {
  const fallback = Number(import.meta.env.VITE_REPORT_VALUE_EUR);
  const value = opts.valueEur ?? (Number.isFinite(fallback) ? fallback : undefined);

  trackEvent('purchase', {
    transaction_id: opts.transactionId,
    case_id: opts.caseId,
    verified: opts.verified !== false,
    ...(value !== undefined ? { value, currency: 'EUR' } : {}),
  });
}
