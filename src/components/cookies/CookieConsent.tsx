import React, { useEffect, useState } from 'react';
import {
  COOKIE_CONSENT_UPDATED_EVENT,
  CookiePreferences,
  OPEN_COOKIE_PREFERENCES_EVENT,
  readCookieConsent,
  saveCookieConsent,
} from '../../utils/cookieConsent';
import { AppRoute } from '../../utils/navigation';

interface CookieConsentProps {
  onNavigate: (route: AppRoute) => void;
}

interface ConsentCategory {
  key: 'analytics' | 'preferences';
  title: string;
  description: string;
}

const OPTIONAL_CATEGORIES: ConsentCategory[] = [
  {
    key: 'analytics',
    title: 'Analytics & Telemetry',
    description:
      'Helps us understand aggregate engagement with product previews and documentation pages so we can improve the QA experience.',
  },
  {
    key: 'preferences',
    title: 'Functional Preferences',
    description:
      'Remembers interactive UI preferences such as selected demo tabs or viewport filters between visits.',
  },
];

export const CookieConsent: React.FC<CookieConsentProps> = ({ onNavigate }) => {
  const [savedConsent, setSavedConsent] = useState<CookiePreferences | null>(() =>
    readCookieConsent(),
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState<boolean>(
    () => readCookieConsent()?.analytics ?? false,
  );
  const [preferencesEnabled, setPreferencesEnabled] = useState<boolean>(
    () => readCookieConsent()?.preferences ?? true,
  );

  useEffect(() => {
    const handleOpen = () => {
      const latest = readCookieConsent();
      if (latest) {
        setAnalyticsEnabled(latest.analytics);
        setPreferencesEnabled(latest.preferences);
      }
      setModalOpen(true);
    };

    const handleUpdated = (event: Event) => {
      const detail = (event as CustomEvent<CookiePreferences>).detail;
      if (detail) {
        setSavedConsent(detail);
        setAnalyticsEnabled(detail.analytics);
        setPreferencesEnabled(detail.preferences);
      }
    };

    window.addEventListener(OPEN_COOKIE_PREFERENCES_EVENT, handleOpen);
    window.addEventListener(COOKIE_CONSENT_UPDATED_EVENT, handleUpdated);
    return () => {
      window.removeEventListener(OPEN_COOKIE_PREFERENCES_EVENT, handleOpen);
      window.removeEventListener(COOKIE_CONSENT_UPDATED_EVENT, handleUpdated);
    };
  }, []);

  useEffect(() => {
    if (!modalOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setModalOpen(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [modalOpen]);

  const handleAcceptAll = () => {
    const next = saveCookieConsent({ analytics: true, preferences: true });
    setSavedConsent(next);
    setModalOpen(false);
  };

  const handleEssentialOnly = () => {
    const next = saveCookieConsent({ analytics: false, preferences: false });
    setSavedConsent(next);
    setModalOpen(false);
  };

  const handleSaveCustom = () => {
    const next = saveCookieConsent({
      analytics: analyticsEnabled,
      preferences: preferencesEnabled,
    });
    setSavedConsent(next);
    setModalOpen(false);
  };

  const handleOpenPolicy = (event: React.MouseEvent<HTMLAnchorElement>, route: AppRoute) => {
    event.preventDefault();
    setModalOpen(false);
    onNavigate(route);
  };

  const showBanner = savedConsent === null && !modalOpen;

  return (
    <>
      {showBanner && (
        <aside
          aria-label="Cookie consent"
          aria-live="polite"
          className="tp-cookie-banner"
          role="region"
        >
          <div className="flex items-start justify-between gap-3">
            <span className="t-label text-sky-ink">Cookies &amp; Privacy</span>
            <span className="rounded bg-cloud px-1.5 py-0.5 font-mono text-[10px] font-medium text-graphite">
              You decide
            </span>
          </div>

          <p className="mt-2 text-[13.5px] leading-relaxed text-arsenic">
            TestPilot uses essential storage to keep the site reliable and optional cookies to
            remember UI settings and measure interest. Read our{' '}
            <a
              className="tp-inline-link"
              href="/cookies"
              onClick={(e) => handleOpenPolicy(e, '/cookies')}
            >
              Cookie Policy
            </a>{' '}
            and{' '}
            <a
              className="tp-inline-link"
              href="/privacy"
              onClick={(e) => handleOpenPolicy(e, '/privacy')}
            >
              Privacy Policy
            </a>
            .
          </p>

          <div className="tp-cookie-actions">
            <button className="tp-btn-primary" onClick={handleAcceptAll} type="button">
              Accept All
            </button>
            <button className="tp-btn-secondary" onClick={handleEssentialOnly} type="button">
              Essential Only
            </button>
            <button
              className="tp-btn-ghost"
              onClick={() => setModalOpen(true)}
              type="button"
            >
              Manage
            </button>
          </div>
        </aside>
      )}

      {modalOpen && (
        <div
          aria-labelledby="tp-cookie-modal-title"
          aria-modal="true"
          className="tp-cookie-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalOpen(false);
          }}
          role="dialog"
        >
          <div className="tp-cookie-dialog">
            <div className="flex items-center justify-between border-b border-[var(--hairline)] px-5 py-4 sm:px-6">
              <div>
                <p className="t-label text-sky-ink">Preference Center</p>
                <h2
                  className="mt-1 text-[18px] font-bold tracking-tight text-ink"
                  id="tp-cookie-modal-title"
                >
                  Manage Cookie Preferences
                </h2>
              </div>
              <button
                aria-label="Close cookie preferences"
                className="tp-btn-ghost"
                onClick={() => setModalOpen(false)}
                type="button"
              >
                <svg
                  aria-hidden="true"
                  className="size-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            <div className="tp-cookie-dialog-body">
              <p className="text-[13.5px] leading-relaxed text-graphite">
                Choose which optional categories TestPilot may store in your browser. Essential
                storage remains enabled so your consent choice and core site navigation work as
                expected. See details in our{' '}
                <a
                  className="tp-inline-link"
                  href="/cookies"
                  onClick={(e) => handleOpenPolicy(e, '/cookies')}
                >
                  Cookie Policy
                </a>
                .
              </p>

              <div className="tp-cookie-card">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-[14.5px] font-semibold text-ink">Strictly Necessary</h3>
                    <span className="rounded bg-lime-soft px-2 py-0.5 font-mono text-[10.5px] font-semibold text-lime-ink">
                      Always Active
                    </span>
                  </div>
                  <p className="mt-1 text-[13px] leading-relaxed text-graphite">
                    Required for security, route navigation, and persisting your cookie consent
                    choice across browser sessions.
                  </p>
                </div>
                <button
                  aria-checked="true"
                  aria-label="Strictly Necessary cookies always active"
                  className="tp-switch cursor-not-allowed opacity-80"
                  disabled
                  role="switch"
                  type="button"
                >
                  <span className="tp-switch-thumb" />
                </button>
              </div>

              {OPTIONAL_CATEGORIES.map((category) => {
                const checked =
                  category.key === 'analytics' ? analyticsEnabled : preferencesEnabled;
                const toggle = () => {
                  if (category.key === 'analytics') {
                    setAnalyticsEnabled((prev) => !prev);
                  } else {
                    setPreferencesEnabled((prev) => !prev);
                  }
                };

                return (
                  <div key={category.key} className="tp-cookie-card">
                    <div>
                      <h3 className="text-[14.5px] font-semibold text-ink">{category.title}</h3>
                      <p className="mt-1 text-[13px] leading-relaxed text-graphite">
                        {category.description}
                      </p>
                    </div>
                    <button
                      aria-checked={checked}
                      aria-label={`Toggle ${category.title}`}
                      className="tp-switch"
                      onClick={toggle}
                      role="switch"
                      type="button"
                    >
                      <span className="tp-switch-thumb" />
                    </button>
                  </div>
                );
              })}

              {savedConsent && (
                <p className="font-mono text-[11px] text-graphite">
                  Saved preference: Analytics ({savedConsent.analytics ? 'On' : 'Off'}) ·
                  Preferences ({savedConsent.preferences ? 'On' : 'Off'})
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2 border-t border-[var(--hairline)] bg-canvas px-5 py-3.5 sm:px-6">
              <button className="tp-btn-secondary" onClick={handleEssentialOnly} type="button">
                Essential Only
              </button>
              <button className="tp-btn-secondary" onClick={handleSaveCustom} type="button">
                Save Preferences
              </button>
              <button className="tp-btn-primary" onClick={handleAcceptAll} type="button">
                Accept All
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

