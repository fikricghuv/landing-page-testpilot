import React from 'react';
import { useScrollReveal } from '../../../hooks/useScrollReveal';
import { useDiscovery } from '../../discovery/DiscoveryContext';

interface PreviewRunItem {
  id: string;
  name: string;
  duration: string;
  status: 'passed' | 'failed';
}

const SAMPLE_EXECUTIONS: PreviewRunItem[] = [
  {
    id: 'checkout',
    name: 'Checkout Validation',
    duration: '2m 18s',
    status: 'failed',
  },
  {
    id: 'auth',
    name: 'Authentication Flow',
    duration: '0m 48s',
    status: 'passed',
  },
  {
    id: 'otp-retry',
    name: 'OTP Retry Scenario',
    duration: '1m 12s',
    status: 'failed',
  },
];

const EXPLORE_HIGHLIGHTS = [
  'Explore realistic QA testing scenarios',
  'See how automation workflows are prepared and executed',
  'Understand how test results and evidence support investigation',
];

export const GetStarted: React.FC = () => {
  const { ref: headerRef, isRevealed: headerRevealed } = useScrollReveal<HTMLDivElement>();
  const { openDiscovery } = useDiscovery();

  return (
    <section
      aria-labelledby="cta-title"
      className="relative overflow-hidden pb-16 pt-14 sm:pb-20 sm:pt-20 lg:pb-24"
      id="get-started"
    >
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-12">
        <div className="grid items-center gap-10 rounded-[32px] bg-paper p-6 ring-1 ring-[var(--hairline)] sm:p-10 lg:grid-cols-12 lg:p-16">
          <div ref={headerRef} className="min-w-0 lg:col-span-8">
            <p className="t-label scroll-reveal flex items-center gap-2.5 text-graphite" data-revealed={headerRevealed}>
              <svg aria-hidden="true" className="size-3 shrink-0" viewBox="0 0 12 12">
                <rect fill="var(--color-sky)" height="6" opacity="1" rx="1.6" width="6" x="0" y="0" />
                <rect fill="var(--color-sky)" height="6" opacity="0.55" rx="1.6" width="6" x="6" y="6" />
              </svg>
              <span className="text-ink">08</span>
              <span aria-hidden="true" className="h-px w-6 bg-current opacity-40" />
              <span>GET STARTED</span>
            </p>

            <h2
              className="scroll-reveal mt-6 max-w-[16ch] text-[clamp(2.4rem,5.4vw,4.75rem)] font-semibold leading-[0.95] tracking-[-0.045em] text-ink"
              data-revealed={headerRevealed}
              id="cta-title"
              style={{ transitionDelay: '60ms' }}
            >
              Less Repetitive Testing. More Focus on Quality.
            </h2>

            <p
              className="t-lede scroll-reveal mt-6 max-w-[52ch] text-graphite"
              data-revealed={headerRevealed}
              style={{ transitionDelay: '120ms' }}
            >
              Jelajahi demo interaktif untuk melihat alur skenario pengujian secara langsung, atau diskusikan kebutuhan workflow QA tim Anda bersama tim kami.
            </p>

            <div className="mt-9 flex flex-wrap gap-3" id="book-demo">
              <button
                type="button"
                onClick={openDiscovery}
                aria-label="Discover Your QA Workflow"
                className="group/btn relative inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-ink px-5 text-[0.9375rem] font-semibold tracking-[-0.01em] text-canvas shadow-[inset_0_-1px_0_rgb(255_255_255/0.08)] transition-[background-color,color,box-shadow,transform] duration-200 ease-[var(--ease-standard)] hover:bg-sky hover:text-white focus-visible:ring-2 focus-visible:ring-lime active:scale-[0.98] sm:px-6 cursor-pointer"
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
                aria-label="Explore Interactive Demo — jump to interactive demo section"
                className="group/btn relative inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-paper px-5 text-[0.9375rem] font-semibold tracking-[-0.01em] text-ink ring-1 ring-inset ring-[var(--hairline-strong)] transition-[background-color,color,box-shadow,transform] duration-200 ease-[var(--ease-standard)] hover:ring-ink focus-visible:ring-2 focus-visible:ring-lime active:scale-[0.98] sm:px-6"
                href="#demo"
              >
                <span>Explore Interactive Demo</span>
                <svg
                  aria-hidden="true"
                  className="size-4 transition-transform duration-200 ease-[var(--ease-standard)] group-hover/btn:translate-x-0.5"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </a>

              <a
                aria-label="Talk to Our Team — reach contact destination"
                className="group/btn relative inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-paper px-5 text-[0.9375rem] font-semibold tracking-[-0.01em] text-ink ring-1 ring-inset ring-[var(--hairline-strong)] transition-[background-color,color,box-shadow,transform] duration-200 ease-[var(--ease-standard)] hover:ring-ink focus-visible:ring-2 focus-visible:ring-lime active:scale-[0.98] sm:px-6"
                href="#contact"
              >
                Talk to Our Team
              </a>
            </div>

            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-graphite">
              {EXPLORE_HIGHLIGHTS.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span aria-hidden="true" className="font-bold text-lime-ink">
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="min-w-0 lg:col-span-4">
            <aside
              aria-label="Illustrative TestPilot workspace preview"
              className="relative mx-auto w-full max-w-[360px] rounded-2xl bg-midnight p-4 text-canvas shadow-[var(--shadow-float)] ring-1 ring-[var(--hairline-dark)] sm:p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--hairline-dark)] pb-3">
                <div className="flex min-w-0 items-center gap-2">
                  <span aria-hidden="true" className="flex shrink-0 items-center gap-1.5">
                    <span className="size-2.5 rounded-full bg-signal-red" />
                    <span className="size-2.5 rounded-full bg-signal-yellow" />
                    <span className="size-2.5 rounded-full bg-lime" />
                  </span>
                  <span className="truncate font-mono text-[11px] font-semibold text-canvas">
                    TestPilot Workspace
                  </span>
                </div>
                <span className="shrink-0 rounded bg-canvas/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-steel ring-1 ring-[var(--hairline-dark)]">
                  Workspace Preview
                </span>
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[12px] font-semibold text-canvas">
                    Recent Test Execution
                  </p>
                  <span className="font-mono text-[10px] text-space">
                    Illustrative sample
                  </span>
                </div>

                {/* Compact Sample Summary Counts */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg bg-phantom py-2 ring-1 ring-[var(--hairline-dark)]">
                    <p className="font-mono text-[10px] text-space">Passed</p>
                    <p className="mt-0.5 font-mono text-[13px] font-bold tabular-nums text-lime">1</p>
                  </div>
                  <div className="rounded-lg bg-phantom py-2 ring-1 ring-[var(--hairline-dark)]">
                    <p className="font-mono text-[10px] text-space">Failed</p>
                    <p className="mt-0.5 font-mono text-[13px] font-bold tabular-nums text-signal-red">2</p>
                  </div>
                  <div className="rounded-lg bg-phantom py-2 ring-1 ring-[var(--hairline-dark)]">
                    <p className="font-mono text-[10px] text-space">Runs</p>
                    <p className="mt-0.5 font-mono text-[13px] font-bold tabular-nums text-canvas">3</p>
                  </div>
                </div>

                {/* Illustrative Execution Items */}
                <ul className="space-y-2">
                  {SAMPLE_EXECUTIONS.map((run) => {
                    const isPassed = run.status === 'passed';
                    return (
                      <li
                        key={run.id}
                        className="flex items-center justify-between gap-2 rounded-lg bg-phantom px-3 py-2 ring-1 ring-[var(--hairline-dark)]"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-[12px] font-medium text-canvas">
                            {run.name}
                          </p>
                          <p className="font-mono text-[10px] tabular-nums text-space">
                            {run.duration}
                          </p>
                        </div>
                        <span
                          className={`inline-flex shrink-0 items-center gap-1 rounded px-2 py-0.5 font-mono text-[10px] font-bold ${
                            isPassed
                              ? 'bg-lime text-ink'
                              : 'bg-signal-red text-white'
                          }`}
                        >
                          <span aria-hidden="true">{isPassed ? '✓' : '✕'}</span>
                          <span>{isPassed ? 'Passed' : 'Failed'}</span>
                        </span>
                      </li>
                    );
                  })}
                </ul>

                <div className="rounded-xl bg-ink p-3 ring-1 ring-[var(--hairline-dark)]">
                  <p className="font-mono text-[10.5px] font-semibold text-sky">
                    Execution Evidence Included
                  </p>
                  <p className="mt-0.5 text-[11px] text-space">
                    Logs, screenshots &amp; steps prepared for QA review (sample data).
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
};
