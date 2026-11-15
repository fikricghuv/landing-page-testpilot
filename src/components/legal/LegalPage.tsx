import React from 'react';
import { openCookiePreferencesModal } from '../../utils/cookieConsent';
import { AppRoute } from '../../utils/navigation';
import { LEGAL_DOCUMENTS, LegalDocRoute } from './legalContent';

interface LegalPageProps {
  route: LegalDocRoute;
  onNavigate: (route: AppRoute, sectionHash?: string) => void;
}

const LEGAL_TABS: Array<{ route: LegalDocRoute; label: string }> = [
  { route: '/privacy', label: 'Privacy Policy' },
  { route: '/terms', label: 'Terms of Service' },
  { route: '/cookies', label: 'Cookie Policy' },
];

export const LegalPage: React.FC<LegalPageProps> = ({ route, onNavigate }) => {
  const doc = LEGAL_DOCUMENTS[route];

  const handleRouteClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    targetRoute: AppRoute,
    sectionHash?: string,
  ) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    onNavigate(targetRoute, sectionHash);
  };

  return (
    <section aria-labelledby="legal-page-title" className="tp-legal-shell">
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-12">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--hairline)] pb-8">
          <div className="max-w-[68ch]">
            <div className="flex flex-wrap items-center gap-3">
              <a
                className="tp-btn-secondary"
                href="/"
                onClick={(e) => handleRouteClick(e, '/')}
              >
                &larr; Back to Home
              </a>
              <span className="t-label text-sky-ink">{doc.eyebrow}</span>
            </div>

            <h1 className="t-h2 mt-5 text-ink" id="legal-page-title">
              {doc.title}
            </h1>
            <p className="t-lede mt-4 text-graphite">{doc.subtitle}</p>
            <p className="mt-4 font-mono text-[12px] text-graphite">
              Last updated: {doc.lastUpdated}
            </p>
          </div>

          <nav aria-label="Legal documents" className="flex flex-wrap gap-2">
            {LEGAL_TABS.map((tab) => {
              const isActive = tab.route === route;
              return (
                <a
                  key={tab.route}
                  aria-current={isActive ? 'page' : undefined}
                  className={isActive ? 'tp-btn-primary' : 'tp-btn-secondary'}
                  href={tab.route}
                  onClick={(e) => handleRouteClick(e, tab.route)}
                >
                  {tab.label}
                </a>
              );
            })}
          </nav>
        </div>

        <div className="tp-legal-layout">
          <aside aria-label="Table of contents" className="tp-legal-toc">
            <p className="t-label text-graphite">On This Page</p>
            <ul className="mt-3 flex flex-col gap-1">
              {doc.sections.map((section) => (
                <li key={section.id}>
                  <a className="tp-legal-nav-link" href={`#${section.id}`}>
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-5 border-t border-[var(--hairline)] pt-4">
              <button
                className="tp-btn-secondary w-full"
                onClick={openCookiePreferencesModal}
                type="button"
              >
                Manage Cookie Preferences
              </button>
            </div>
          </aside>

          <article className="tp-legal-article">
            {doc.sections.map((section) => (
              <section key={section.id} className="tp-legal-section" id={section.id}>
                <h2>{section.title}</h2>
                {section.paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
                {section.bullets && (
                  <ul>
                    {section.bullets.map((bullet, index) => (
                      <li key={index}>{bullet}</li>
                    ))}
                  </ul>
                )}

                {route === '/cookies' && section.id === 'inventory' && doc.cookieInventory && (
                  <div className="tp-legal-table-wrap">
                    <table className="tp-legal-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Type</th>
                          <th>Category</th>
                          <th>Retention</th>
                          <th>Purpose</th>
                        </tr>
                      </thead>
                      <tbody>
                        {doc.cookieInventory.map((row) => (
                          <tr key={row.name}>
                            <td className="font-mono text-[12px] font-semibold text-ink">
                              {row.name}
                            </td>
                            <td>{row.storageType}</td>
                            <td>
                              <span className="rounded bg-lime-soft px-2 py-0.5 font-mono text-[11px] font-semibold text-lime-ink">
                                {row.category}
                              </span>
                            </td>
                            <td className="font-mono text-[12px]">{row.retention}</td>
                            <td>{row.purpose}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {route === '/cookies' && section.id === 'manage-controls' && (
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <button
                      className="tp-btn-primary"
                      onClick={openCookiePreferencesModal}
                      type="button"
                    >
                      Manage Cookie Preferences
                    </button>
                    <a
                      className="tp-btn-secondary"
                      href="/privacy"
                      onClick={(e) => handleRouteClick(e, '/privacy')}
                    >
                      Read Privacy Policy
                    </a>
                  </div>
                )}

                {route === '/privacy' && section.id === 'cookies-reference' && (
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <button
                      className="tp-btn-secondary"
                      onClick={openCookiePreferencesModal}
                      type="button"
                    >
                      Manage Cookie Preferences
                    </button>
                    <a
                      className="tp-btn-secondary"
                      href="/cookies"
                      onClick={(e) => handleRouteClick(e, '/cookies')}
                    >
                      View Cookie Policy
                    </a>
                  </div>
                )}
              </section>
            ))}

            <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[var(--hairline)] bg-canvas p-5">
              <div>
                <p className="text-[14px] font-semibold text-ink">
                  Want to evaluate TestPilot with your QA team?
                </p>
                <p className="mt-1 text-[13px] text-graphite">
                  Explore the interactive demo or request early access on the main page.
                </p>
              </div>
              <a
                className="tp-btn-primary"
                href="/#get-started"
                onClick={(e) => handleRouteClick(e, '/', 'get-started')}
              >
                Request Early Access
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};

