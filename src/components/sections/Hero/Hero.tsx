import React from 'react';
import { HeroMosaic } from './HeroMosaic';
import { HeroDemo } from './HeroDemo';
import { useDiscovery } from '../../discovery/DiscoveryContext';

export const Hero: React.FC = () => {
  const { openDiscovery } = useDiscovery();
  return (
    <section aria-labelledby="hero-title" className="relative overflow-clip pt-[88px] sm:pt-[104px] lg:pt-[120px]">
      {/* Dynamic Animated Mosaic Background */}
      <HeroMosaic className="opacity-75" />

      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-12 relative">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="lg:col-span-7">
            <p className="t-label flex items-center gap-2.5 text-graphite rise-in">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-soft px-3 py-1 text-[11px] font-bold tracking-wider text-sky-ink ring-1 ring-sky/20">
                <span className="size-1.5 rounded-full bg-sky animate-pulse-dot" />
                AUTONOMOUS QA WORKSPACE
              </span>
            </p>
            <h1 className="t-display mt-6" id="hero-title">
              <span className="block">
                <span className="word-wrap">
                  <span className="inline-block will-change-transform rise-word" data-w="true" style={{ animationDelay: '0.05s' }}>
                    Spend
                  </span>
                </span>{' '}
                <span className="word-wrap">
                  <span className="inline-block will-change-transform rise-word" data-w="true" style={{ animationDelay: '0.10s' }}>
                    Less
                  </span>
                </span>{' '}
                <span className="word-wrap">
                  <span className="inline-block will-change-transform rise-word" data-w="true" style={{ animationDelay: '0.15s' }}>
                    Time
                  </span>
                </span>{' '}
                <span className="word-wrap">
                  <span className="inline-block will-change-transform rise-word" data-w="true" style={{ animationDelay: '0.20s' }}>
                    Testing.
                  </span>
                </span>
              </span>
              <span className="block">
                <span className="word-wrap">
                  <span className="inline-block will-change-transform rise-word" data-w="true" style={{ animationDelay: '0.25s' }}>
                    Ship
                  </span>
                </span>{' '}
                <span className="word-wrap">
                  <span className="inline-block will-change-transform rise-word" data-w="true" style={{ animationDelay: '0.30s' }}>
                    Flawless
                  </span>
                </span>{' '}
                <span className="word-wrap">
                  <span className="inline-block will-change-transform rise-word" data-w="true" style={{ animationDelay: '0.35s' }}>
                    Software.
                  </span>
                </span>
                <span aria-hidden="true" className="ml-[0.06em] inline-block size-[0.16em] translate-y-[-0.06em] animate-blink rounded-[0.03em] bg-sky align-baseline"></span>
              </span>
            </h1>
          </div>
          <div className="lg:col-span-5 lg:pb-2">
            <div className="space-y-3">
              <p className="t-lede rise-in max-w-[48ch] text-graphite" style={{ animationDelay: '0.35s' }}>
                TestPilot memberdayakan tim QA dan developer mengotomatisasi pengujian web, API, dan alur regresi dengan kecerdasan buatan dalam satu workspace terpadu.
              </p>
              <p className="rise-in max-w-[48ch] text-[15px] leading-relaxed text-graphite" style={{ animationDelay: '0.40s' }}>
                Hasilkan skrip automation yang andal, jalankan pengujian lintas browser, dan perbaiki locator yang rusak secara mandiri (*self-healing*) sebelum sampai ke pengguna akhir.
              </p>
            </div>
            <div className="rise-in mt-7 flex flex-wrap gap-3" style={{ animationDelay: '0.45s' }}>
              <button
                type="button"
                onClick={openDiscovery}
                aria-label="Discover Your QA Workflow"
                className="group/btn relative inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-[-0.01em] transition-[background-color,color,box-shadow,transform] duration-200 ease-[var(--ease-standard)] active:scale-[0.98] whitespace-nowrap bg-ink text-canvas hover:bg-sky hover:text-white shadow-[inset_0_-1px_0_rgb(255_255_255/0.08)] h-12 px-6 text-[0.9375rem] cursor-pointer"
              >
                <svg
                  className="size-4 text-sky group-hover/btn:text-white transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                </svg>
                <span>Discover Your QA Workflow</span>
              </button>
              <a
                className="group/btn relative inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-[-0.01em] transition-[background-color,color,box-shadow,transform] duration-200 ease-[var(--ease-standard)] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap bg-paper text-ink ring-1 ring-inset ring-[var(--hairline-strong)] hover:ring-ink h-12 px-6 text-[0.9375rem]"
                href="#demo"
              >
                <span>Explore Interactive Demo</span>
                <svg
                  aria-hidden="true"
                  className="size-4 transition-transform duration-200 ease-[var(--ease-standard)] group-hover/btn:translate-x-0.5"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            </div>
            <div className="rise-in mt-7 rounded-2xl border hairline bg-cloud/50 p-3.5" style={{ animationDelay: '0.55s' }}>
              <p className="text-[13px] font-semibold text-ink">
                Autonomous Quality Platform built for Modern Engineering Teams
              </p>
              <div className="mt-2.5 flex flex-wrap gap-1.5 text-[11.5px] font-medium text-graphite">
                <span className="rounded-md bg-canvas px-2.5 py-1 text-ink ring-1 ring-[var(--hairline)] flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-lime" /> Self-Healing Locators
                </span>
                <span className="rounded-md bg-canvas px-2.5 py-1 text-ink ring-1 ring-[var(--hairline)] flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-sky" /> Playwright & Cypress Native
                </span>
                <span className="rounded-md bg-canvas px-2.5 py-1 text-ink ring-1 ring-[var(--hairline)] flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-lime" /> Zero Flaky Test Alerts
                </span>
                <span className="rounded-md bg-canvas px-2.5 py-1 text-ink ring-1 ring-[var(--hairline)] flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-sky" /> CI/CD Automation Gate
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Interactive Hero Demo */}
        <div className="rise-in mx-auto mt-10 max-w-[1280px] lg:mt-14" style={{ animationDelay: '0.3s' }}>
          <HeroDemo />
        </div>
      </div>
    </section>
  );
};
