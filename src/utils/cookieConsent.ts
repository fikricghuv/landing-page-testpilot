export interface CookiePreferences {
  necessary: true;
  analytics: boolean;
  preferences: boolean;
  updatedAt: string;
}

export const COOKIE_CONSENT_STORAGE_KEY = 'testpilot.cookie_consent.v1';
export const COOKIE_NAME = 'testpilot_consent';
export const OPEN_COOKIE_PREFERENCES_EVENT = 'testpilot:open-cookie-preferences';
export const COOKIE_CONSENT_UPDATED_EVENT = 'testpilot:cookie-consent-updated';

const CONSENT_MAX_AGE_SECONDS = 60 * 60 * 24 * 180; // 180 days

export function readCookieConsent(): CookiePreferences | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<CookiePreferences>;
    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      typeof parsed.analytics !== 'boolean' ||
      typeof parsed.preferences !== 'boolean'
    ) {
      return null;
    }

    return {
      necessary: true,
      analytics: parsed.analytics,
      preferences: parsed.preferences,
      updatedAt:
        typeof parsed.updatedAt === 'string' ? parsed.updatedAt : new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function saveCookieConsent(values: {
  analytics: boolean;
  preferences: boolean;
}): CookiePreferences {
  const next: CookiePreferences = {
    necessary: true,
    analytics: values.analytics,
    preferences: values.preferences,
    updatedAt: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Ignore storage quota or private-mode errors
    }

    const encoded = encodeURIComponent(
      JSON.stringify({
        necessary: true,
        analytics: next.analytics,
        preferences: next.preferences,
      }),
    );
    const secureFlag = window.location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `${COOKIE_NAME}=${encoded}; Path=/; Max-Age=${CONSENT_MAX_AGE_SECONDS}; SameSite=Lax${secureFlag}`;

    window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_UPDATED_EVENT, { detail: next }));
  }

  return next;
}

export function openCookiePreferencesModal(): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(OPEN_COOKIE_PREFERENCES_EVENT));
}

