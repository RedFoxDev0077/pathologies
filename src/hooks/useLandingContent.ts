import { useState, useEffect } from 'react';
import { casaDiagAPI } from '@/services/api/casadiag-api';

export function useLandingContent<T>(key: string, defaultContent: T): { content: T; loading: boolean } {
  const [content, setContent] = useState<T>(defaultContent);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    casaDiagAPI.getLandingContent(key)
      .then((result) => {
        if (!cancelled && result.value) setContent(result.value as T);
      })
      .catch(() => { /* fallback to default silently */ })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [key]);

  return { content, loading };
}
