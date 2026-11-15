import React, { useEffect, useRef, useState } from 'react';
import { VisionGridCanvas } from './VisionGridCanvas';
import { useScrollReveal } from '../../../hooks/useScrollReveal';

interface VisionStep {
  num: string;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
}

const STEPS_DATA: VisionStep[] = [
  {
    num: '01',
    title: 'Plan',
    subtitle: 'Understand before testing.',
    description:
      'Mulai dari test case, eksplorasi aplikasi, atau alur bisnis yang direkam secara manual. Bangun konteks yang dibutuhkan sebelum pengujian dijalankan.',
    badge: 'Context',
  },
  {
    num: '02',
    title: 'Generate',
    subtitle: 'Turn context into automation.',
    description:
      'Gunakan AI untuk membantu menghasilkan skrip automation berdasarkan skenario dan informasi aplikasi yang tersedia.',
    badge: 'Automation',
  },
  {
    num: '03',
    title: 'Execute',
    subtitle: 'Validate real application behavior.',
    description:
      'Jalankan pengujian web, API, dan performance untuk mengevaluasi perilaku aplikasi berdasarkan skenario yang telah ditentukan.',
    badge: 'Execution',
  },
  {
    num: '04',
    title: 'Improve',
    subtitle: 'Learn from every execution.',
    description:
      'Analisis kegagalan, gunakan bantuan AI untuk investigasi dan pemulihan locator, lalu validasi hasilnya agar kualitas proses QA terus meningkat.',
    badge: 'Improvement',
  },
];

const PLAN_SOURCES = ['Excel / CSV Import', 'AI Discovery', 'Manual Recording'];

const GENERATED_SCRIPT_LINES = [
  { num: '1', text: "test('TC-03 promo checkout', async ({ page }) => {", tone: 'sky' },
  { num: '2', text: "  await page.getByLabel('Promo').fill(data.promoCode);", tone: 'smoke' },
  { num: '3', text: "  await page.getByRole('button', { name: 'Pay $96.00' }).click();", tone: 'smoke' },
  { num: '4', text: "  await expect(page.getByText('Order Confirmed')).toBeVisible();", tone: 'lime' },
  { num: '5', text: '});', tone: 'sky' },
];

const EXECUTE_TRACKS = [
  {
    name: 'Web UI Testing',
    status: 'Failed · Step 10/10',
    detail: 'Confirmation timed out after HEMAT20 · screenshot & video captured',
    badgeClass: 'bg-signal-red-soft text-[#b4162f]',
  },
  {
    name: 'API Testing',
    status: 'Passed · 16/16 checks',
    detail: 'POST /api/payments/intent & /confirm · payload contracts checked',
    badgeClass: 'bg-lime-soft text-lime-ink',
  },
  {
    name: 'Performance Testing',
    status: 'Sample · 40 VUs',
    detail: 'Avg 142 ms · p95 295 ms · 0.0% HTTP errors (illustrative)',
    badgeClass: 'bg-sky-soft text-sky-ink',
  },
];

const VisionStageCard: React.FC<{ stepIndex: number }> = ({ stepIndex }) => {
  if (stepIndex === 0) {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-paper text-ink shadow-[0_30px_80px_-30px_rgb(0_0_0/0.6)]">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b hairline px-4 py-2.5">
          <p className="t-label text-graphite">01 · Plan</p>
          <span className="inline-flex h-[22px] shrink-0 items-center rounded-md bg-cloud px-2 text-[0.6875rem] font-semibold whitespace-nowrap text-arsenic">
            QA Planning Workspace · Illustrative
          </span>
        </div>

        <div className="p-4 sm:p-5">
          <div className="flex flex-wrap items-center gap-1.5">
            {PLAN_SOURCES.map((source, idx) => (
              <span
                key={source}
                className={`rounded-md px-2 py-0.5 text-[10.5px] font-semibold ring-1 ring-[var(--hairline)] ${
                  idx === 0 ? 'bg-sky-soft text-sky-ink' : 'bg-canvas text-arsenic'
                }`}
              >
                {source}
              </span>
            ))}
          </div>

          <div className="mt-3 rounded-xl bg-canvas p-3 ring-1 ring-[var(--hairline)]">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-[11px] font-bold text-sky-ink">TC-03 · Planned Scenario</span>
              <span className="rounded bg-paper px-1.5 py-0.5 font-mono text-[10px] text-graphite ring-1 ring-[var(--hairline)]">
                Linked: TR-1042 coverage
              </span>
            </div>
            <p className="mt-1.5 text-[15px] font-bold leading-snug tracking-tight text-ink">
              Checkout with Promo Code HEMAT20
            </p>
            <p className="mt-0.5 text-[11.5px] text-graphite">
              Mapped from Excel test case, AI page exploration, or recorded user journey.
            </p>
          </div>

          <div className="mt-3 grid grid-cols-1 gap-2 text-[11.5px] sm:grid-cols-2">
            <div className="rounded-lg bg-canvas p-2.5">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-graphite">Preconditions</p>
              <p className="mt-0.5 text-ink">Logged-in QA user · Aero Runner (EU 42) in cart</p>
            </div>
            <div className="rounded-lg bg-canvas p-2.5">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-graphite">Test Data</p>
              <p className="mt-0.5 font-mono text-[11px] text-ink">promo: &quot;HEMAT20&quot; · subtotal: $120 → $96</p>
            </div>
            <div className="rounded-lg bg-canvas p-2.5 sm:col-span-2">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-graphite">Expected Result</p>
              <p className="mt-0.5 text-ink">Discounted total ($96.00) is submitted and order confirmation renders.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (stepIndex === 1) {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-paper text-ink shadow-[0_30px_80px_-30px_rgb(0_0_0/0.6)]">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b hairline px-4 py-2.5">
          <p className="t-label text-graphite">02 · Generate</p>
          <span className="inline-flex h-[22px] shrink-0 items-center rounded-md bg-cloud px-2 text-[0.6875rem] font-semibold whitespace-nowrap text-arsenic">
            AI Test Generation
          </span>
        </div>

        <div className="p-4 sm:p-5">
          <div className="grid grid-cols-1 gap-2 text-[11px] sm:grid-cols-3">
            <div className="rounded-lg bg-canvas p-2.5 ring-1 ring-[var(--hairline)]">
              <p className="font-mono text-[10px] font-bold text-graphite">1. SCENARIO INPUT</p>
              <p className="mt-1 font-semibold text-ink">TC-03 · Checkout_v3.xlsx</p>
            </div>
            <div className="rounded-lg bg-sky-soft p-2.5 ring-1 ring-[var(--hairline)]">
              <p className="font-mono text-[10px] font-bold text-sky-ink">2. AI PROCESSING</p>
              <p className="mt-1 font-semibold text-ink">Steps, locators &amp; assertions</p>
            </div>
            <div className="rounded-lg bg-lime-soft p-2.5 ring-1 ring-[var(--hairline)]">
              <p className="font-mono text-[10px] font-bold text-lime-ink">3. OUTPUT SCRIPT</p>
              <p className="mt-1 font-semibold text-ink">Playwright TypeScript</p>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px]">
            <span className="font-mono font-semibold text-ink">checkout-promo.spec.ts</span>
            <span className="rounded bg-sky-soft px-2 py-0.5 font-mono text-[10px] font-semibold text-sky-ink">
              Reviewable by QA
            </span>
          </div>

          <div className="no-scrollbar mt-2 overflow-x-auto rounded-lg bg-ink py-2.5 font-mono text-[11px] leading-[1.65]">
            {GENERATED_SCRIPT_LINES.map((line) => (
              <p
                key={line.num}
                className={`flex w-max min-w-full gap-3 px-3 ${
                  line.tone === 'lime' ? 'text-lime' : line.tone === 'sky' ? 'text-sky' : 'text-smoke'
                }`}
              >
                <span className="w-3 shrink-0 select-none text-space">{line.num}</span>
                <span className="whitespace-pre">{line.text}</span>
              </p>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-graphite">
            <span>Strategy: Role &amp; label locators · Parameterized test data</span>
            <span className="font-mono text-[10px] text-arsenic">Illustrative Draft</span>
          </div>
        </div>
      </div>
    );
  }

  if (stepIndex === 2) {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-paper text-ink shadow-[0_30px_80px_-30px_rgb(0_0_0/0.6)]">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b hairline px-4 py-2.5">
          <p className="t-label text-graphite">03 · Execute</p>
          <span className="inline-flex h-[22px] shrink-0 items-center rounded-md bg-cloud px-2 text-[0.6875rem] font-semibold whitespace-nowrap text-arsenic">
            Execution &amp; Evidence · Sample Run
          </span>
        </div>

        <div className="p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-canvas px-3 py-2 text-[11.5px] ring-1 ring-[var(--hairline)]">
            <span className="font-semibold text-ink">Suite Run #142 · Staging Environment</span>
            <span className="font-mono text-[10.5px] text-graphite">Illustrative Run Data</span>
          </div>

          <div className="mt-3 space-y-2">
            {EXECUTE_TRACKS.map((track) => (
              <div key={track.name} className="rounded-xl bg-canvas p-3 ring-1 ring-[var(--hairline)]">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[12.5px] font-bold text-ink">{track.name}</span>
                  <span
                    className={`inline-flex h-[20px] items-center rounded-md px-2 text-[10.5px] font-semibold ${track.badgeClass}`}
                  >
                    {track.status}
                  </span>
                </div>
                <p className="mt-1 font-mono text-[10.5px] text-graphite">{track.detail}</p>
              </div>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[11px]">
            <span className="font-semibold text-ink">Captured Evidence:</span>
            {['Execution Logs', 'Screenshots', 'Video Replay', 'Network & Metrics'].map((artifact) => (
              <span
                key={artifact}
                className="rounded-md bg-canvas px-2 py-0.5 text-[10.5px] text-arsenic ring-1 ring-[var(--hairline)]"
              >
                {artifact}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-paper text-ink shadow-[0_30px_80px_-30px_rgb(0_0_0/0.6)]">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b hairline px-4 py-2.5">
        <p className="t-label text-graphite">04 · Improve</p>
        <span className="inline-flex h-[22px] shrink-0 items-center rounded-md bg-cloud px-2 text-[0.6875rem] font-semibold whitespace-nowrap text-arsenic">
          AI-Assisted Healing &amp; Re-run
        </span>
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-1.5 text-[10.5px] font-mono text-graphite">
          <span className="rounded bg-signal-red-soft px-1.5 py-0.5 font-semibold text-[#b4162f]">Failure</span>
          <span aria-hidden="true">→</span>
          <span className="rounded bg-canvas px-1.5 py-0.5 ring-1 ring-[var(--hairline)]">Evidence</span>
          <span aria-hidden="true">→</span>
          <span className="rounded bg-sky-soft px-1.5 py-0.5 font-semibold text-sky-ink">Locator Suggestion</span>
          <span aria-hidden="true">→</span>
          <span className="rounded bg-lime-soft px-1.5 py-0.5 font-semibold text-lime-ink">QA Validation</span>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <div className="rounded-lg bg-canvas p-2.5 ring-1 ring-[var(--hairline)]">
            <p className="font-mono text-[10px] font-bold text-[#b4162f]">FAILED LOCATOR</p>
            <p className="mt-1 truncate font-mono text-[11px] text-ink">#submit-order-old</p>
            <p className="mt-0.5 text-[10.5px] text-graphite">Unmatched after button text update</p>
          </div>
          <div className="rounded-lg bg-sky-soft p-2.5 ring-1 ring-[var(--hairline)]">
            <p className="font-mono text-[10px] font-bold text-sky-ink">SUGGESTED ALTERNATIVE</p>
            <p className="mt-1 truncate font-mono text-[11px] text-ink">
              getByRole(&apos;button&apos;, &#123; name: &apos;Complete Purchase&apos; &#125;)
            </p>
            <p className="mt-0.5 text-[10.5px] text-graphite">Validated candidate · QA approved</p>
          </div>
        </div>

        <div className="mt-3 rounded-xl bg-canvas p-3 ring-1 ring-[var(--hairline)]">
          <div className="flex flex-wrap items-center justify-between gap-2 text-[11.5px]">
            <span className="font-semibold text-ink">Sample Regression Validation (Illustrative)</span>
            <span className="font-mono text-[11px] font-bold tabular-nums text-lime-ink">23/23 Passed</span>
          </div>
          <div aria-hidden="true" className="mt-2 grid grid-cols-[repeat(23,minmax(0,1fr))] gap-[3px]">
            {Array.from({ length: 23 }).map((_, gIdx) => (
              <span key={gIdx} className="aspect-square rounded-[2px] bg-lime" />
            ))}
          </div>
        </div>

        <div className="mt-3 flex items-start gap-2.5 rounded-xl bg-lime/25 p-3 ring-1 ring-lime">
          <svg aria-hidden="true" className="mt-px size-4 shrink-0 text-lime-ink" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24">
            <circle cx="12" cy="12" r="10" />
            <path d="m16 9-5.5 5.5L8 12" />
          </svg>
          <div className="min-w-0 text-[11.5px]">
            <p className="font-bold text-ink">Test Script Updated After QA Verification</p>
            <p className="text-graphite">
              TestPilot assists with locator recovery and regression re-runs while QA engineers review and approve changes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Vision: React.FC = () => {
  const { ref: headerRef, isRevealed: headerRevealed } = useScrollReveal<HTMLElement>();
  const [activeStep, setActiveStep] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);

    const onChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const computeActiveStep = () => {
      rafIdRef.current = null;
      const steps = stepRefs.current;
      if (!steps.some(Boolean)) return;

      const viewportCenter = window.innerHeight * 0.45;
      let closestIndex = 0;
      let minDistance = Infinity;

      steps.forEach((step, index) => {
        if (!step) return;
        const rect = step.getBoundingClientRect();
        if (rect.top <= viewportCenter && rect.bottom >= viewportCenter) {
          closestIndex = index;
          minDistance = 0;
        } else {
          const elementCenter = rect.top + rect.height * 0.5;
          const distance = Math.abs(elementCenter - viewportCenter);
          if (distance < minDistance) {
            minDistance = distance;
            closestIndex = index;
          }
        }
      });

      setActiveStep((prev) => (prev === closestIndex ? prev : closestIndex));
    };

    const scheduleUpdate = () => {
      if (rafIdRef.current !== null) return;
      rafIdRef.current = window.requestAnimationFrame(computeActiveStep);
    };

    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate, { passive: true });
    computeActiveStep();

    return () => {
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      if (rafIdRef.current !== null) {
        window.cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  const scrollToStep = (index: number) => {
    setActiveStep(index);
    stepRefs.current[index]?.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'center',
    });
  };

  return (
    <section
      aria-labelledby="vision-title"
      className="relative overflow-clip bg-midnight pb-24 pt-14 text-canvas sm:pb-32 sm:pt-20 lg:pb-36 lg:pt-24"
      id="vision"
    >
      <VisionGridCanvas tone="brand" fade={true} />

      <div className="relative mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-12">
        <header ref={headerRef} className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="t-label scroll-reveal flex items-center gap-2.5 text-space" data-revealed={headerRevealed}>
              <svg aria-hidden="true" className="size-3 shrink-0" viewBox="0 0 12 12">
                <rect fill="var(--color-lime)" height="6" opacity="1" rx="1.6" width="6" x="0" y="0" />
                <rect fill="var(--color-lime)" height="6" opacity="0.55" rx="1.6" width="6" x="6" y="6" />
              </svg>
              <span className="text-canvas">05</span>
              <span aria-hidden="true" className="h-px w-6 bg-current opacity-40"></span>
              <span>OUR APPROACH</span>
            </p>
            <h2
              className="scroll-reveal mt-6 text-[clamp(2.75rem,7vw,7rem)] font-semibold leading-[0.95] tracking-[-0.055em]"
              data-revealed={headerRevealed}
              id="vision-title"
              style={{ transitionDelay: '60ms' }}
            >
              <span className="block text-canvas">Plan.</span>
              <span className="block text-canvas">Generate.</span>
              <span className="block text-canvas">Execute.</span>
              <span className="block text-lime">Improve.</span>
            </h2>
          </div>
          <div className="lg:col-span-4 lg:pb-3">
            <p
              className="t-lede scroll-reveal text-steel"
              data-revealed={headerRevealed}
              style={{ transitionDelay: '120ms' }}
            >
              Kami percaya bahwa masa depan QA bukan tentang menggantikan penilaian seorang QA Engineer. Masa depan QA adalah memberikan lebih banyak kemampuan kepada tim untuk bekerja secara efektif, memahami risiko, dan menjaga kualitas software.
            </p>
            <ul aria-label="Testing Approach" className="mt-6 flex flex-wrap gap-2">
              <li>
                <span className="inline-flex h-[22px] shrink-0 items-center gap-1.5 rounded-md bg-sky-soft px-2 text-[0.6875rem] font-semibold whitespace-nowrap text-sky-ink">
                  <span aria-hidden="true" className="size-1.5 rounded-full bg-current"></span>
                  Connected QA Lifecycle
                </span>
              </li>
            </ul>
          </div>
        </header>

        {/* Mobile Quick Stage Jumper (Non-sticky natural flow on < lg) */}
        <nav aria-label="Navigasi Tahapan Pendekatan" className="mt-10 lg:hidden">
          <ol className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {STEPS_DATA.map((step, idx) => {
              const isCurrent = activeStep === idx;
              return (
                <li key={step.num}>
                  <button
                    aria-current={isCurrent ? 'step' : undefined}
                    className={`flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-left ring-1 focus-visible:ring-2 focus-visible:ring-lime ${
                      isCurrent
                        ? 'bg-paper text-ink ring-[var(--hairline-strong)] font-semibold'
                        : 'bg-phantom text-steel ring-[var(--hairline-dark)]'
                    }`}
                    type="button"
                    onClick={() => scrollToStep(idx)}
                  >
                    <span className="text-[12.5px] font-semibold">{step.title}</span>
                    <span className="font-mono text-[10px] text-sky">{step.num}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="relative mt-8 lg:mt-24 lg:grid lg:grid-cols-12 lg:gap-12">
          {/* Desktop Sticky Right Preview Cards Container (lg+ only) */}
          <div className="hidden lg:sticky lg:top-24 lg:col-span-7 lg:col-start-6 lg:row-start-1 lg:block lg:self-start">
            {/* Accessible Stage Progress Indicators */}
            <nav aria-label="Tahapan Siklus">
              <ol className="mb-5 grid grid-cols-4 gap-2">
                {STEPS_DATA.map((step, idx) => {
                  const isCurrent = activeStep === idx;
                  return (
                    <li key={step.num}>
                      <button
                        aria-current={isCurrent ? 'step' : undefined}
                        aria-label={`Pindah ke langkah ${step.num}: ${step.title} — ${step.badge}`}
                        className="w-full cursor-pointer rounded-md py-1 text-left focus-visible:ring-2 focus-visible:ring-lime"
                        type="button"
                        onClick={() => scrollToStep(idx)}
                      >
                        <span className="block h-[3px] overflow-hidden rounded-full bg-phantom">
                          <span
                            className={`block h-full bg-sky ${
                              prefersReducedMotion ? '' : 'transition-[width] duration-300 ease-[var(--ease-out-expo)]'
                            }`}
                            style={{ width: activeStep >= idx ? '100%' : '0%' }}
                          />
                        </span>
                        <span
                          className={`mt-2 block font-mono text-[10.5px] uppercase tracking-wider ${
                            prefersReducedMotion ? '' : 'transition-colors duration-300'
                          } ${isCurrent ? 'font-bold text-canvas' : activeStep > idx ? 'text-steel' : 'text-graphite'}`}
                        >
                          {step.title}
                        </span>
                        <span
                          className={`mt-0.5 block text-[11px] ${
                            prefersReducedMotion ? '' : 'transition-colors duration-300'
                          } ${activeStep >= idx ? 'text-sky' : 'text-space'}`}
                        >
                          {step.badge}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </nav>

            {/* Stacked Grid Container avoids height jump across cards */}
            <div style={{ display: 'grid' }}>
              {STEPS_DATA.map((step, idx) => {
                const isCurrent = activeStep === idx;
                return (
                  <div
                    key={step.num}
                    aria-hidden={!isCurrent}
                    className={`${
                      prefersReducedMotion ? '' : 'transition-all duration-300 ease-[var(--ease-out-expo)]'
                    } ${isCurrent ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
                    style={{
                      gridArea: '1 / 1',
                      transform: prefersReducedMotion || isCurrent ? 'translateY(0)' : 'translateY(12px)',
                    }}
                  >
                    <VisionStageCard stepIndex={idx} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Left Scrolling Steps List (includes natural inline cards on mobile/tablet < lg) */}
          <ol className="relative lg:col-span-5 lg:row-start-1">
            {STEPS_DATA.map((step, idx) => {
              const isActive = activeStep === idx;
              return (
                <li
                  key={step.num}
                  ref={(el) => {
                    stepRefs.current[idx] = el;
                  }}
                  data-step={idx}
                  className={`flex flex-col justify-center py-8 sm:py-10 lg:min-h-[78vh] ${
                    prefersReducedMotion ? '' : 'transition-opacity duration-300'
                  } ${isActive ? 'opacity-100' : 'opacity-100 lg:opacity-30'}`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`font-mono text-[12px] ${
                        prefersReducedMotion ? '' : 'transition-colors duration-300'
                      } ${isActive ? 'font-bold text-canvas' : 'text-canvas lg:text-space'}`}
                    >
                      {step.num}
                    </span>
                    <span className="inline-flex h-[22px] shrink-0 items-center gap-1.5 rounded-md bg-sky-soft px-2 text-[0.6875rem] font-semibold whitespace-nowrap text-sky-ink">
                      <span aria-hidden="true" className="size-1.5 rounded-full bg-current"></span>
                      {step.badge}
                    </span>
                  </div>
                  <h3
                    className={`mt-5 text-[clamp(2.25rem,4vw,3.5rem)] font-semibold leading-none tracking-[-0.045em] ${
                      prefersReducedMotion ? '' : 'transition-colors duration-300'
                    } ${isActive ? 'text-canvas' : 'text-canvas lg:text-graphite'}`}
                  >
                    {step.title}
                  </h3>
                  <p
                    className={`mt-4 text-[19px] font-semibold tracking-tight ${
                      prefersReducedMotion ? '' : 'transition-colors duration-300'
                    } ${isActive ? 'text-canvas' : 'text-canvas lg:text-graphite'}`}
                  >
                    {step.subtitle}
                  </p>
                  <p
                    className={`mt-3 max-w-[44ch] text-[15.5px] leading-relaxed ${
                      prefersReducedMotion ? '' : 'transition-colors duration-300'
                    } ${isActive ? 'text-steel' : 'text-steel lg:text-graphite'}`}
                  >
                    {step.description}
                  </p>

                  {/* Natural inline card representation for mobile & tablet (< lg) */}
                  <div className="mt-6 lg:hidden">
                    <VisionStageCard stepIndex={idx} />
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Bottom Closing Banner */}
        <div className="mt-24 border-t border-[var(--hairline-dark)] pt-16 lg:mt-32 lg:pt-24">
          <h5 className="text-[clamp(1.25rem,2vw,1.625rem)] font-semibold leading-tight tracking-[-0.03em]">
            <span className="block text-graphite">AI handles repetitive work.</span>
            <span className="block text-canvas">
              QA engineers focus on <span className="text-lime">quality.</span>
            </span>
          </h5>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <p className="max-w-[52ch] text-[16px] leading-relaxed text-steel">
              TestPilot membantu mengurangi pekerjaan teknis yang berulang agar QA Engineer memiliki lebih banyak waktu untuk mengevaluasi risiko, memperluas test coverage, dan memastikan aplikasi bekerja sebagaimana mestinya.
            </p>
            <p className="max-w-[52ch] text-[14px] leading-relaxed text-space md:justify-self-end">
              One connected workspace. Multiple testing workflows. Better use of your QA team's time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
