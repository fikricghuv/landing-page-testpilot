import React, { useEffect, useState } from 'react';
import {
  ShowcaseCardProps,
  ShowcaseInteractiveCard,
} from './ShowcaseInteractiveCard';
import { useScrollReveal } from '../../../hooks/useScrollReveal';

const SHOWCASE_SCENARIOS: Omit<ShowcaseCardProps, 'prefersReducedMotion'>[] = [
  {
    id: 'checkout',
    title: 'Validate a Checkout Journey',
    description: 'Uji alur pembelian produk, penggunaan kupon, dan proses checkout.',
    scenarioExample: 'Checkout confirmation did not appear after payment submission.',
    domain: 'store.acme-demo.com',
    duration: '1:24',
    verdict: 'failed',
    verdictText: 'Issue Found',
    validationSummary: {
      finding: 'Missing checkout confirmation',
      expected: 'Checkout confirmation page appears',
      actual: 'No confirmation detected after 10s',
    },
  },
  {
    id: 'authentication',
    title: 'Validate an Authentication Flow',
    description: 'Uji proses login, verifikasi keamanan, dan akses halaman akun pengguna.',
    scenarioExample: 'User successfully signed in and reached the account overview.',
    domain: 'app.northwind-demo.com',
    duration: '0:48',
    verdict: 'passed',
    verdictText: 'Passed',
    validationSummary: {
      finding: 'Authentication flow verified',
      expected: 'Account overview opens after verification',
      actual: 'Account overview loaded & verified',
    },
  },
  {
    id: 'otp-transfer',
    title: 'Validate an OTP Retry Scenario',
    description: 'Uji proses pengiriman ulang kode OTP dan validasi aktivitas transaksi.',
    scenarioExample: 'A repeated transaction was detected after an OTP retry.',
    domain: 'Lumen Wallet · Demo',
    duration: '1:12',
    verdict: 'failed',
    verdictText: 'Issue Found',
    isMobile: true,
    validationSummary: {
      finding: 'Duplicate transaction detected',
      expected: 'Single $50.00 transaction entry',
      actual: 'First: $50.00 · Repeated: $50.00',
    },
  },
];

export const Showcase: React.FC = () => {
  const { ref: headerRef, isRevealed: headerRevealed } = useScrollReveal<HTMLElement>();
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <section
      aria-labelledby="showcase-title"
      className="relative bg-midnight pb-20 pt-12 text-canvas sm:pb-28 sm:pt-16"
      id="showcase"
    >
      <div
        aria-hidden="true"
        className="pattern-dots-dark pointer-events-none absolute inset-0 opacity-50"
      />
      <div className="relative mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-12">
        <header ref={headerRef} className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="t-label scroll-reveal flex items-center gap-2.5 text-space" data-revealed={headerRevealed}>
              <svg aria-hidden="true" className="size-3 shrink-0" viewBox="0 0 12 12">
                <rect fill="var(--color-lime)" height="6" opacity="1" rx="1.6" width="6" x="0" y="0" />
                <rect fill="var(--color-lime)" height="6" opacity="0.55" rx="1.6" width="6" x="6" y="6" />
              </svg>
              <span className="text-canvas">07</span>
              <span aria-hidden="true" className="h-px w-6 bg-current opacity-40" />
              <span>INTERACTIVE SHOWCASE</span>
            </p>
            <h2
              className="t-h2 scroll-reveal mt-5 max-w-[18ch] text-canvas"
              data-revealed={headerRevealed}
              id="showcase-title"
              style={{ transitionDelay: '60ms' }}
            >
              See How Testing Workflows Come Together.
            </h2>
          </div>
          <div className="flex flex-col gap-5 lg:col-span-4 lg:pb-2">
            <p
              className="t-lede scroll-reveal max-w-[46ch] text-steel"
              data-revealed={headerRevealed}
              style={{ transitionDelay: '120ms' }}
            >
              Jelajahi contoh workflow pengujian dan lihat bagaimana TestPilot membantu tim QA menyiapkan, menjalankan, serta menganalisis skenario pengujian.
            </p>
            <a
              className="group inline-flex w-fit items-center gap-2 text-[15px] font-semibold text-lime hover:underline"
              href="#demo"
            >
              Explore interactive demo
              <svg
                aria-hidden="true"
                className="size-4 transition-transform group-hover:translate-x-0.5"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </header>

        <ul className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {SHOWCASE_SCENARIOS.map((scenario) => (
            <li key={scenario.id} className="h-full">
              <ShowcaseInteractiveCard
                {...scenario}
                prefersReducedMotion={prefersReducedMotion}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
