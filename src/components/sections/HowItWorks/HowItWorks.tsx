import React, { useState, useEffect, useRef } from 'react';
import { useScrollReveal } from '../../../hooks/useScrollReveal';

interface StepItem {
  num: string;
  title: string;
  description: string;
  tags: string[];
}

const STEPS_DATA: StepItem[] = [
  {
    num: '01',
    title: 'Start with What You Already Have.',
    description:
      'Import test case dari Excel atau CSV. TestPilot membantu mengubah skenario pengujian yang sudah dimiliki tim menjadi dasar pembuatan automation.',
    tags: ['Excel Import', 'CSV Import', 'Test Scenario Mapping'],
  },
  {
    num: '02',
    title: 'Explore Your Application Your Way.',
    description:
      'Gunakan AI Discovery untuk membantu mengeksplorasi struktur aplikasi dan menemukan kemungkinan alur pengujian. Untuk proses bisnis yang membutuhkan arahan khusus, gunakan Manual Web Recording untuk merekam interaksi langsung melalui browser.',
    tags: ['AI Discovery', 'Manual Web Recording', 'Interactive Browser', 'User Journey Exploration'],
  },
  {
    num: '03',
    title: 'Turn Scenarios into Automation.',
    description:
      'TestPilot menggunakan konteks skenario dan aplikasi untuk menghasilkan skrip pengujian secara otomatis. Tim QA dapat meninjau hasilnya dan menyesuaikan skrip sesuai kebutuhan.',
    tags: ['AI Script Generation', 'Scenario-Based Automation', 'Test Data Support'],
  },
  {
    num: '04',
    title: 'Run More Than Just UI Tests.',
    description:
      'Jalankan web UI automation, API testing, dan performance testing melalui satu workspace. Pantau hasil eksekusi dan status setiap pengujian.',
    tags: ['Web UI Automation', 'API Testing', 'Performance Testing'],
  },
  {
    num: '05',
    title: 'Understand Every Test Result.',
    description:
      'Ketika pengujian selesai, TestPilot mengumpulkan hasil, log, screenshot, dan video sebagai bukti. Gunakan informasi tersebut untuk membantu investigasi dan membagikan hasil kepada tim terkait.',
    tags: ['AI-Assisted Investigation', 'Execution Logs', 'Screenshots & Videos', 'Test Reports', 'Jira & Slack Integration'],
  },
];

const STAGES = [
  { name: 'Import', label: '01' },
  { name: 'Discover', label: '02' },
  { name: 'Generate', label: '03' },
  { name: 'Execute', label: '04' },
  { name: 'Analyze', label: '05' },
];

const STEP_METADATA = [
  {
    speech: 'Import test case Excel/CSV sebagai titik awal opsional, atau langsung lanjut ke Discovery / Recording.',
    badge: 'Optional Start · Import',
  },
  {
    speech: 'Atau mulai langsung dengan AI Discovery maupun rekam interaksi browser via Manual Web Recording.',
    badge: 'Discovery or Recording',
  },
  {
    speech: 'Baik dari Import, Discovery, maupun Recording, AI membantu menyusun skrip automation yang siap direview.',
    badge: 'Script Generation',
  },
  {
    speech: 'Jalankan web UI automation, API testing, dan performance testing secara terpisah maupun paralel.',
    badge: 'Unified Execution',
  },
  {
    speech: 'Kumpulkan bukti pengujian, log, screenshot, video, dan analisis untuk investigasi serta laporan tim.',
    badge: 'Evidence & Reports',
  },
];

const PIPELINE_NODES = [
  { num: '01', label: 'Import', x: 16 },
  { num: '02', label: 'Discover', x: 142 },
  { num: '03', label: 'Generate', x: 268 },
  { num: '04', label: 'Execute', x: 394 },
  { num: '05', label: 'Analyze', x: 520 },
];

const IMPORTED_ROWS = [
  { id: 'TC-01', name: 'User Login with Valid Credentials', type: 'Auth' },
  { id: 'TC-02', name: 'Product Search & Category Filter', type: 'Catalog' },
  { id: 'TC-03', name: 'Workspace Plan Upgrade with Code PILOT20', type: 'Billing' },
];

const PLAYWRIGHT_LINES = [
  { num: 1, code: "test('checkout with promo code', async ({ page }) => {", indent: 0 },
  { num: 2, code: "await page.goto('https://app.cloudpilot.io/workspaces/plans');", indent: 1 },
  { num: 3, code: "await page.getByRole('button', { name: 'Team Pro' }).click();", indent: 1 },
  { num: 4, code: "await page.getByLabel('Promo Code').fill('PILOT20');", indent: 1 },
  { num: 5, code: "await page.getByRole('button', { name: 'Confirm Subscription' }).click();", indent: 1 },
  { num: 6, code: "await expect(page.locator('#workspace-badge')).toHaveText('Active Pro');", indent: 1 },
  { num: 7, code: '});', indent: 0 },
];

const EXECUTION_TRACKS = [
  {
    name: 'Web UI Automation',
    status: 'Failed',
    progress: 92,
    metric: '11/12 steps · Confirmation screen timed out (14.2s)',
    tone: 'red' as const,
  },
  {
    name: 'API Testing',
    status: 'Passed',
    progress: 100,
    metric: '16/16 checks · Avg latency 184ms · 0 schema errors',
    tone: 'lime' as const,
  },
  {
    name: 'Performance Testing',
    status: 'Running',
    progress: 74,
    metric: 'p95: 310ms · 45 VUs · 0.0% HTTP errors',
    tone: 'sky' as const,
  },
];

export const HowItWorks: React.FC = () => {
  const { ref: headerRef, isRevealed: headerRevealed } = useScrollReveal<HTMLElement>();
  const [activeStep, setActiveStep] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);
  const ratiosRef = useRef<number[]>([0, 0, 0, 0, 0]);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    const steps = stepRefs.current;
    if (!steps.some(Boolean)) return;

    const pickClosestStep = () => {
      const viewportCenter = window.innerHeight * 0.45;
      let closestIdx = 0;
      let minDist = Infinity;
      steps.forEach((el, idx) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const center = rect.top + rect.height * 0.5;
        const dist = Math.abs(center - viewportCenter);
        if (dist < minDist) {
          minDist = dist;
          closestIdx = idx;
        }
      });
      setActiveStep((prev) => (prev === closestIdx ? prev : closestIdx));
    };

    if (typeof IntersectionObserver === 'undefined') {
      pickClosestStep();
      window.addEventListener('scroll', pickClosestStep, { passive: true });
      window.addEventListener('resize', pickClosestStep, { passive: true });
      return () => {
        window.removeEventListener('scroll', pickClosestStep);
        window.removeEventListener('resize', pickClosestStep);
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const idxAttr = entry.target.getAttribute('data-step');
          if (idxAttr === null) return;
          const idx = Number(idxAttr);
          if (!Number.isNaN(idx)) {
            ratiosRef.current[idx] = entry.isIntersecting ? entry.intersectionRatio : 0;
          }
        });

        let bestIdx = -1;
        let bestRatio = 0;
        ratiosRef.current.forEach((ratio, idx) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestIdx = idx;
          }
        });

        if (bestIdx !== -1) {
          setActiveStep((prev) => (prev === bestIdx ? prev : bestIdx));
        } else {
          pickClosestStep();
        }
      },
      {
        rootMargin: '-25% 0px -35% 0px',
        threshold: [0, 0.2, 0.4, 0.6, 0.8, 1],
      }
    );

    steps.forEach((el) => {
      if (el) observer.observe(el);
    });
    window.addEventListener('resize', pickClosestStep, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', pickClosestStep);
    };
  }, []);

  const scrollToStep = (index: number) => {
    setActiveStep(index);
    stepRefs.current[index]?.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'center',
    });
  };

  const currentMeta = STEP_METADATA[activeStep] || STEP_METADATA[0];
  const motionRiseClass = prefersReducedMotion ? '' : 'rise-in';
  const motionPulseClass = prefersReducedMotion ? '' : 'animate-pulse-dot';

  return (
    <section
      aria-labelledby="how-title"
      className="relative bg-cloud pb-20 pt-14 sm:pb-28 sm:pt-20 lg:pb-32 lg:pt-24"
      id="how-it-works"
    >
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-12">
        <header ref={headerRef} className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="t-label scroll-reveal flex items-center gap-2.5 text-graphite" data-revealed={headerRevealed}>
              <svg aria-hidden="true" className="size-3 shrink-0" viewBox="0 0 12 12">
                <rect fill="var(--color-sky)" height="6" opacity="1" rx="1.6" width="6" x="0" y="0" />
                <rect fill="var(--color-sky)" height="6" opacity="0.55" rx="1.6" width="6" x="6" y="6" />
              </svg>
              <span className="text-ink">02</span>
              <span aria-hidden="true" className="h-px w-6 bg-current opacity-40"></span>
              <span>HOW IT WORKS</span>
            </p>
            <h2
              className="t-h2 scroll-reveal mt-5 max-w-[24ch] text-ink"
              data-revealed={headerRevealed}
              id="how-title"
              style={{ transitionDelay: '60ms' }}
            >
              From Test Ideas to Actionable Results.
            </h2>
          </div>
          <div className="flex flex-col gap-5 lg:col-span-4 lg:pb-2">
            <p
              className="t-lede scroll-reveal max-w-[46ch] text-graphite"
              data-revealed={headerRevealed}
              style={{ transitionDelay: '120ms' }}
            >
              TestPilot menghubungkan proses pembuatan test automation, eksekusi, hingga analisis hasil dalam satu workflow. Anda dapat memulai dari test case yang sudah tersedia, eksplorasi AI, atau interaksi browser yang direkam secara manual.
            </p>
          </div>
        </header>

        <div className="relative mt-14 lg:mt-20 lg:grid lg:grid-cols-12 lg:gap-12">
          {/* Sticky Right Visual Container */}
          <div className="sticky top-16 z-10 -mx-4 bg-cloud px-4 pb-3 pt-3 sm:-mx-6 sm:px-6 lg:top-24 lg:col-span-7 lg:col-start-6 lg:row-start-1 lg:mx-0 lg:self-start lg:px-0 lg:pb-0 lg:pt-0">
            <div className="relative overflow-hidden rounded-[22px] bg-paper ring-1 ring-[var(--hairline)] sm:rounded-[26px]">
              <div aria-hidden="true" className="pattern-grid absolute inset-0 opacity-60"></div>

              {/* Tier 1: Accessible 5-Stage Navigation Rail */}
              <nav aria-label="Tahapan Cara Kerja" className="relative border-b hairline bg-paper/80 px-3 py-2.5 sm:px-4">
                <ol className="flex items-center gap-1.5">
                  {STAGES.map((stage, idx) => {
                    const isActive = activeStep === idx;
                    const isCompleted = activeStep > idx;
                    return (
                      <li key={stage.label} className="min-w-0 flex-1">
                        <button
                          type="button"
                          onClick={() => scrollToStep(idx)}
                          aria-current={isActive ? 'step' : undefined}
                          aria-label={`Pindah ke langkah ${stage.label}: ${stage.name}`}
                          className="group flex w-full cursor-pointer flex-col gap-1.5 rounded-md py-0.5 text-left transition-colors focus-visible:ring-2 focus-visible:ring-lime"
                        >
                          <span
                            className={`block h-[3px] w-full rounded-full ${prefersReducedMotion ? '' : 'transition-colors duration-300'} ${isActive ? 'bg-ink' : isCompleted ? 'bg-sky' : 'bg-smoke'
                              }`}
                            style={{ opacity: isCompleted ? 0.55 : 1 }}
                          />
                          <span
                            className={`flex items-center gap-1 truncate font-mono text-[10px] uppercase tracking-wider ${prefersReducedMotion ? '' : 'transition-colors duration-300'} ${isActive
                                ? 'font-bold text-ink'
                                : isCompleted
                                  ? 'text-graphite'
                                  : 'text-space group-hover:text-graphite'
                              }`}
                          >
                            <span>{stage.label}</span>
                            <span className="hidden sm:inline">{stage.name}</span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ol>
              </nav>

              {/* Context Header Strip (Non-overlapping normal document flow) */}
              <div className="relative flex flex-col items-start gap-2 border-b hairline bg-paper px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:px-4">
                <div className="flex min-w-0 items-center gap-2.5">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-ink text-sky">
                    <svg aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="9" />
                      <path strokeLinecap="round" d="M12 7v5l3 3" />
                    </svg>
                  </div>
                  <p key={activeStep} className={`${motionRiseClass} min-w-0 text-[12px] font-medium leading-snug text-ink`}>
                    {currentMeta.speech}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-1.5">
                  <span className="inline-flex h-[22px] items-center gap-1.5 rounded-md bg-canvas px-2 text-[10.5px] font-semibold text-ink ring-1 ring-inset ring-[var(--hairline-strong)]">
                    <span aria-hidden="true" className="size-1.5 rounded-full bg-sky" />
                    {currentMeta.badge}
                  </span>
                  <span className="rounded bg-cloud px-1.5 py-0.5 font-mono text-[10px] text-graphite">
                    Illustrative Data
                  </span>
                </div>
              </div>

              {/* Tier 1B: Progressive TestPilot 5-Stage Pipeline SVG (Decorative mirror of nav controls above) */}
              <div className="relative hidden border-b hairline bg-paper/80 px-4 py-3 sm:block">
                <svg
                  aria-hidden="true"
                  className="h-auto w-full"
                  viewBox="0 0 640 72"
                >
                  {/* Group Labels distinguishing non-sequential entry options from shared pipeline */}
                  <text
                    fill={activeStep < 2 ? 'var(--color-sky-ink)' : 'var(--color-space)'}
                    fontFamily="var(--font-mono)"
                    fontSize="8.5"
                    fontWeight="700"
                    letterSpacing="0.06em"
                    textAnchor="middle"
                    x="131"
                    y="12"
                  >
                    ENTRY OPTIONS (START ANYWHERE)
                  </text>
                  <text
                    fill={activeStep >= 2 ? 'var(--color-ink)' : 'var(--color-space)'}
                    fontFamily="var(--font-mono)"
                    fontSize="8.5"
                    fontWeight="700"
                    letterSpacing="0.06em"
                    textAnchor="middle"
                    x="446"
                    y="12"
                  >
                    CORE AUTOMATION WORKFLOW
                  </text>

                  {/* Subdued base connector from Discovery onward (Import & Discover do not depend sequentially) */}
                  <line
                    stroke="var(--color-smoke)"
                    strokeDasharray="4 4"
                    strokeWidth="1.5"
                    x1="246"
                    x2="572"
                    y1="39"
                    y2="39"
                  />

                  {/* Subdued alternative feed from Import directly into Generate */}
                  <path
                    d="M 68 56 Q 68 66 80 66 L 252 66 Q 262 66 268 46"
                    fill="none"
                    stroke="var(--color-smoke)"
                    strokeDasharray="4 4"
                    strokeWidth="1.3"
                  />

                  {/* OR divider between independent entry options */}
                  <text
                    fill="var(--color-space)"
                    fontFamily="var(--font-mono)"
                    fontSize="8.5"
                    fontWeight="700"
                    textAnchor="middle"
                    x="131"
                    y="42.5"
                  >
                    OR
                  </text>

                  {/* Progressive active feed from Import into Generate when activeStep >= 2 */}
                  <path
                    d="M 68 56 Q 68 66 80 66 L 252 66 Q 262 66 268 46"
                    fill="none"
                    pathLength="1"
                    stroke={activeStep === 2 ? 'var(--color-sky)' : 'var(--color-ink)'}
                    strokeDasharray="1"
                    strokeLinecap="round"
                    strokeWidth={activeStep === 2 ? '2' : '1.6'}
                    style={{
                      opacity: activeStep >= 2 ? (activeStep === 2 ? 0.85 : 0.35) : 0,
                      strokeDashoffset: activeStep >= 2 ? 0 : 1,
                      transition: prefersReducedMotion
                        ? 'none'
                        : 'stroke-dashoffset 0.55s var(--ease-out-expo), opacity 0.35s ease',
                    }}
                  />

                  {/* Progressive active connector segments (Discover/Import -> Generate -> Execute -> Analyze) */}
                  {[1, 2, 3].map((segIdx) => {
                    const x1 = PIPELINE_NODES[segIdx].x + 104;
                    const x2 = PIPELINE_NODES[segIdx + 1].x;
                    const isFilled = activeStep > segIdx;
                    return (
                      <line
                        key={segIdx}
                        pathLength="1"
                        stroke={segIdx + 1 === activeStep ? 'var(--color-sky)' : 'var(--color-ink)'}
                        strokeDasharray="1"
                        strokeLinecap="round"
                        strokeWidth={segIdx + 1 === activeStep ? '2.5' : '2'}
                        style={{
                          opacity: isFilled ? (segIdx + 1 === activeStep ? 1 : 0.45) : 0,
                          strokeDashoffset: isFilled ? 0 : 1,
                          transition: prefersReducedMotion
                            ? 'none'
                            : 'stroke-dashoffset 0.55s var(--ease-out-expo), opacity 0.35s ease',
                        }}
                        x1={x1}
                        x2={x2}
                        y1="39"
                        y2="39"
                      />
                    );
                  })}

                  {/* 5 Pipeline Nodes (static diagram nodes; use nav buttons above for interaction) */}
                  {PIPELINE_NODES.map((node, idx) => {
                    const isActive = activeStep === idx;
                    const isDone = idx >= 2 ? activeStep > idx : activeStep >= 2;
                    return (
                      <g
                        key={node.num}
                        style={{ transition: prefersReducedMotion ? 'none' : 'opacity 0.3s ease' }}
                        transform={`translate(${node.x} 22)`}
                      >
                        <rect
                          fill={
                            isActive
                              ? 'var(--color-ink)'
                              : isDone
                                ? 'var(--color-sky-soft)'
                                : 'var(--color-canvas)'
                          }
                          height="34"
                          rx="10"
                          stroke={
                            isActive
                              ? 'var(--color-ink)'
                              : isDone
                                ? 'var(--color-sky)'
                                : 'var(--color-steel)'
                          }
                          strokeDasharray={isActive || isDone ? 'none' : '3 3'}
                          strokeWidth={isActive ? '1.5' : '1'}
                          style={{ transition: prefersReducedMotion ? 'none' : 'fill 0.3s ease, stroke 0.3s ease' }}
                          width="104"
                        />
                        <text
                          fill={isActive ? 'var(--color-sky)' : isDone ? 'var(--color-sky-ink)' : 'var(--color-space)'}
                          fontFamily="var(--font-mono)"
                          fontSize="10"
                          fontWeight="700"
                          x="12"
                          y="20.5"
                        >
                          {isDone ? '✓' : node.num}
                        </text>
                        <text
                          fill={isActive ? 'var(--color-canvas)' : isDone ? 'var(--color-ink)' : 'var(--color-graphite)'}
                          fontFamily="var(--font-sans)"
                          fontSize="11.5"
                          fontWeight="600"
                          x="32"
                          y="21"
                        >
                          {node.label}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Tier 2 & 3: Active Stage Progressive Visual Canvas */}
              <div className="relative bg-canvas/50 p-3 sm:p-5">
                {/* Mobile Compact Stage-Specific Visual (< sm) */}
                <div className="sm:hidden">
                  {activeStep === 0 && (
                    <div key="m-0" className={`${motionRiseClass} rounded-xl border hairline bg-paper p-3`}>
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-[10.5px] font-bold text-ink">regression-suite.xlsx</span>
                        <span className="rounded bg-sky-soft px-1.5 py-0.5 font-mono text-[10px] font-semibold text-sky-ink">
                          38 Sample Rows
                        </span>
                      </div>
                      <div className="mt-2 flex items-center justify-between gap-2 rounded-lg bg-canvas px-2.5 py-2 ring-1 ring-[var(--hairline)]">
                        <span className="truncate text-[11px] font-medium text-ink">
                          <strong className="font-mono text-sky-ink">TC-03</strong> Promo checkout ($120 → $96)
                        </span>
                        <span className="shrink-0 rounded bg-lime-soft px-1.5 py-0.5 text-[10px] font-semibold text-lime-ink">
                          Optional Start
                        </span>
                      </div>
                    </div>
                  )}

                  {activeStep === 1 && (
                    <div key="m-1" className={`${motionRiseClass} grid grid-cols-2 gap-2`}>
                      <div className="rounded-xl border hairline bg-paper p-2.5">
                        <span className="block font-mono text-[10px] font-bold text-sky-ink">Option A · AI</span>
                        <p className="mt-1 text-[11px] font-semibold text-ink">AI Discovery</p>
                        <p className="mt-0.5 font-mono text-[10px] text-graphite">6 pages · 24 UI (sample)</p>
                      </div>
                      <div className="rounded-xl border hairline bg-paper p-2.5">
                        <span className="block font-mono text-[10px] font-bold text-ink">Option B · Manual</span>
                        <p className="mt-1 text-[11px] font-semibold text-ink">Web Recording</p>
                        <p className="mt-0.5 font-mono text-[10px] text-signal-red">● QA-Controlled</p>
                      </div>
                    </div>
                  )}

                  {activeStep === 2 && (
                    <div key="m-2" className={`${motionRiseClass} rounded-xl bg-midnight p-3 text-canvas`}>
                      <div className="flex items-center justify-between gap-2 border-b border-[var(--hairline-dark)] pb-1.5">
                        <span className="font-mono text-[10px]">workspace-billing.spec.ts</span>
                        <span className="rounded bg-lime-soft px-1.5 py-0.5 text-[10px] font-semibold text-lime-ink">
                          Ready for Review
                        </span>
                      </div>
                      <pre className="mt-2 overflow-x-auto font-mono text-[10px] leading-snug text-canvas">
                        <div className="text-sky">await page.getByLabel(&apos;Promo Code&apos;).fill(&apos;PILOT20&apos;);</div>
                        <div className="text-lime">await expect(page.locator(&apos;#workspace-badge&apos;)).toHaveText(&apos;Active Pro&apos;);</div>
                      </pre>
                    </div>
                  )}

                  {activeStep === 3 && (
                    <div key="m-3" className={`${motionRiseClass} flex flex-col gap-1.5`}>
                      {EXECUTION_TRACKS.map((track) => {
                        const badgeClass =
                          track.tone === 'red'
                            ? 'bg-signal-red-soft text-signal-red'
                            : track.tone === 'lime'
                              ? 'bg-lime-soft text-lime-ink'
                              : 'bg-sky-soft text-sky-ink';
                        return (
                          <div key={track.name} className="flex items-center justify-between gap-2 rounded-lg border hairline bg-paper px-2.5 py-1.5">
                            <span className="truncate text-[11px] font-bold text-ink">{track.name}</span>
                            <span className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold ${badgeClass}`}>
                              {track.status} · {track.progress}%
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {activeStep === 4 && (
                    <div key="m-4" className={`${motionRiseClass} rounded-xl border hairline bg-paper p-3`}>
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate text-[11.5px] font-bold text-ink">Mismatch: $96 promo vs $120 payload</span>
                        <span className="shrink-0 rounded bg-signal-red-soft px-1.5 py-0.5 font-mono text-[10px] font-bold text-signal-red">
                          TR-1042
                        </span>
                      </div>
                      <p className="mt-1 font-mono text-[10px] text-graphite">
                        Evidence · AI Investigation (Needs QA Review)
                      </p>
                    </div>
                  )}
                </div>

                {/* Desktop & Tablet Full Progressive Visual (sm+) */}
                <div className="hidden sm:block" style={{ minHeight: '320px' }}>
                  {/* STEP 01 — IMPORT */}
                  {activeStep === 0 && (
                    <div className={`${motionRiseClass} flex flex-col gap-3`}>
                      <div className="flex items-center justify-between gap-2">
                        <span className="t-label text-graphite">01 · Existing Test Case Import (Optional Start)</span>
                        <span className="rounded-md bg-sky-soft px-2 py-0.5 font-mono text-[10.5px] font-semibold text-sky-ink">
                          38 Scenarios · Sample Data
                        </span>
                      </div>

                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        {/* Source Spreadsheet Card */}
                        <div className="min-w-0 flex-1 rounded-xl border hairline bg-paper p-3 shadow-sm">
                          <div className="flex items-center gap-2.5">
                            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-lime-soft font-mono text-[10px] font-bold text-lime-ink ring-1 ring-[var(--hairline)]">
                              XLSX
                            </span>
                            <div className="min-w-0">
                              <p className="truncate text-[12px] font-bold text-ink">regression-suite.xlsx</p>
                              <p className="font-mono text-[10px] text-graphite">CSV / Excel · 38 rows (sample)</p>
                            </div>
                          </div>
                          <div className="mt-3 rounded-lg bg-canvas p-2 font-mono text-[10px] text-graphite ring-1 ring-[var(--hairline)]">
                            <div className="flex justify-between border-b hairline pb-1 text-space">
                              <span>ID</span>
                              <span>SCENARIO</span>
                              <span>STEPS</span>
                            </div>
                            <div className="mt-1 flex justify-between">
                              <span>TC-01</span>
                              <span className="truncate px-2">Login valid</span>
                              <span>4</span>
                            </div>
                            <div className="mt-0.5 flex justify-between">
                              <span>TC-02</span>
                              <span className="truncate px-2">Search filter</span>
                              <span>5</span>
                            </div>
                            <div className="mt-0.5 flex justify-between text-ink font-semibold">
                              <span>TC-03</span>
                              <span className="truncate px-2">Promo checkout</span>
                              <span>7</span>
                            </div>
                          </div>
                        </div>

                        {/* Transition Connector */}
                        <div className="flex shrink-0 items-center justify-center">
                          <svg aria-hidden="true" className="size-5 text-sky" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M5 12h14" />
                            <path d="m13 6 6 6-6 6" />
                          </svg>
                        </div>

                        {/* Mapped Structured Scenarios */}
                        <div className="min-w-0 flex-1 rounded-xl border hairline bg-paper p-3 shadow-sm">
                          <div className="flex items-center justify-between gap-2 border-b hairline pb-2">
                            <span className="truncate text-[11.5px] font-bold text-ink">Structured Test Scenarios</span>
                            <span className="shrink-0 font-mono text-[10px] font-semibold text-lime-ink">Ready</span>
                          </div>
                          <ul className="mt-2.5 flex flex-col gap-2">
                            {IMPORTED_ROWS.map((row, rIdx) => (
                              <li
                                key={row.id}
                                className={`${motionRiseClass} flex items-center justify-between gap-2 rounded-lg bg-canvas px-2.5 py-2 ring-1 ring-[var(--hairline)]`}
                                style={{ animationDelay: prefersReducedMotion ? '0ms' : `${rIdx * 90}ms` }}
                              >
                                <div className="flex min-w-0 items-center gap-2">
                                  <span className="shrink-0 whitespace-nowrap font-mono text-[10px] font-bold text-sky-ink">{row.id}</span>
                                  <span className="truncate text-[11.5px] font-medium text-ink">{row.name}</span>
                                </div>
                                <span className="shrink-0 rounded bg-lime-soft px-1.5 py-0.5 text-[10px] font-semibold text-lime-ink">
                                  Mapped
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <p className="text-[11px] text-graphite">
                        Already have specs? Import Excel/CSV directly into Generate—or skip Import and begin with AI Discovery or Manual Recording.
                      </p>
                    </div>
                  )}

                  {/* STEP 02 — DISCOVER (TWO ALTERNATIVE BRANCHES) */}
                  {activeStep === 1 && (
                    <div className={`${motionRiseClass} flex flex-col gap-3`}>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="t-label text-graphite">02 · Start From App Exploration or Manual Capture</span>
                        <span className="rounded-md bg-paper px-2 py-0.5 font-mono text-[10px] text-graphite ring-1 ring-[var(--hairline)]">
                          Independent alternatives (AI or Manual)
                        </span>
                      </div>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {/* Branch A: AI Discovery */}
                        <div className="rounded-xl border hairline bg-paper p-3 shadow-sm">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[12px] font-bold text-ink">Option A · AI Discovery</span>
                            <span className="inline-flex items-center gap-1 rounded bg-sky-soft px-1.5 py-0.5 font-mono text-[10px] font-semibold text-sky-ink">
                              <span aria-hidden="true" className={`size-1.5 rounded-full bg-sky ${motionPulseClass}`} />
                              Scanning App
                            </span>
                          </div>

                          {/* Supporting Explored App Journey Diagram (Clean, non-overlapping) */}
                          <div className="mt-2.5 rounded-lg bg-canvas p-2 ring-1 ring-[var(--hairline)]">
                            <p className="font-mono text-[10px] uppercase tracking-wider text-space">
                              Example Explored App Map
                            </p>
                            <svg
                              aria-label="Example explored e-commerce pages discovered by AI"
                              className="mt-1 h-auto w-full"
                              role="img"
                              viewBox="0 0 280 106"
                            >
                              {/* Connecting branches */}
                              <path d="M58 53 C76 53 76 24 94 24" fill="none" stroke="var(--color-sky)" strokeDasharray="4 4" strokeWidth="1.5" />
                              <path d="M58 53 C76 53 76 82 94 82" fill="none" stroke="var(--color-steel)" strokeDasharray="3 4" strokeWidth="1.2" />
                              <path d="M156 24 C169 24 169 53 182 53" fill="none" stroke="var(--color-sky)" strokeDasharray="4 4" strokeWidth="1.5" />
                              <path d="M156 82 C169 82 169 53 182 53" fill="none" stroke="var(--color-steel)" strokeDasharray="3 4" strokeWidth="1.2" />

                              {/* Nodes cleanly separated */}
                              <g transform="translate(4 39)">
                                <rect fill="var(--color-paper)" height="28" rx="7" stroke="var(--color-sky)" strokeWidth="1.2" width="54" />
                                <text fill="var(--color-ink)" fontFamily="var(--font-sans)" fontSize="9.5" fontWeight="600" textAnchor="middle" x="27" y="17.5">Beranda</text>
                              </g>
                              <g transform="translate(94 10)">
                                <rect fill="var(--color-paper)" height="28" rx="7" stroke="var(--color-sky)" strokeWidth="1.2" width="62" />
                                <text fill="var(--color-ink)" fontFamily="var(--font-sans)" fontSize="9.5" fontWeight="600" textAnchor="middle" x="31" y="17.5">Produk</text>
                              </g>
                              <g transform="translate(94 68)">
                                <rect fill="var(--color-paper)" height="28" rx="7" stroke="var(--hairline-strong)" strokeDasharray="3 2" strokeWidth="1" width="62" />
                                <text fill="var(--color-graphite)" fontFamily="var(--font-sans)" fontSize="9.5" fontWeight="600" textAnchor="middle" x="31" y="17.5">Cari / Filter</text>
                              </g>
                              <g transform="translate(182 39)">
                                <rect fill="var(--color-sky-soft)" height="28" rx="7" stroke="var(--color-sky)" strokeWidth="1.2" width="94" />
                                <text fill="var(--color-sky-ink)" fontFamily="var(--font-sans)" fontSize="9.5" fontWeight="600" textAnchor="middle" x="47" y="17.5">Cart &amp; Checkout</text>
                              </g>
                            </svg>
                          </div>
                          <p className="mt-2 font-mono text-[10px] text-graphite">
                            Example output: 6 pages · 24 UI elements
                          </p>
                        </div>

                        {/* Branch B: Manual Web Recording */}
                        <div className="rounded-xl border hairline bg-paper p-3 shadow-sm">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[12px] font-bold text-ink">Option B · Manual Recording</span>
                            <span className="inline-flex items-center gap-1 rounded bg-cloud px-1.5 py-0.5 font-mono text-[10px] font-semibold text-ink">
                              QA-Controlled
                            </span>
                          </div>

                          <div className="mt-2.5 rounded-lg bg-canvas p-2.5 ring-1 ring-[var(--hairline)]">
                            <div className="flex items-center justify-between border-b hairline pb-1">
                              <span className="font-mono text-[10px] text-graphite">app.bisnis-demo.com/checkout</span>
                              <span className="inline-flex items-center gap-1 font-mono text-[10px] text-signal-red">
                                <span aria-hidden="true" className={`size-1.5 rounded-full bg-signal-red ${motionPulseClass}`} />
                                REC
                              </span>
                            </div>
                            <ul className="mt-2 flex flex-col gap-1.5 font-mono text-[10px]">
                              <li className="flex items-center justify-between rounded bg-paper px-2 py-1 ring-1 ring-[var(--hairline)]">
                                <span className="font-semibold text-sky-ink">Navigate</span>
                                <span className="text-graphite">app.cloudpilot.io/workspaces/plans ($120)</span>
                              </li>
                              <li className="flex items-center justify-between rounded bg-paper px-2 py-1 ring-1 ring-[var(--hairline)]">
                                <span className="font-semibold text-sky-ink">Select</span>
                                <span className="text-graphite">Team Pro (Annual)</span>
                              </li>
                              <li className="flex items-center justify-between rounded bg-paper px-2 py-1 ring-1 ring-[var(--hairline)]">
                                <span className="font-semibold text-sky-ink">Fill</span>
                                <span className="text-graphite">Promo: PILOT20 (-20%)</span>
                              </li>
                              <li className="flex items-center justify-between rounded bg-paper px-2 py-1 ring-1 ring-[var(--hairline)]">
                                <span className="font-semibold text-ink">Click</span>
                                <span className="inline-flex items-center gap-1 text-ink font-semibold">
                                  Confirm $96.00
                                  <svg aria-hidden="true" className="size-3 text-sky" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M5 3l14 9-7 1.5L9 21z" />
                                  </svg>
                                </span>
                              </li>
                            </ul>
                          </div>
                          <p className="mt-2 font-mono text-[10px] text-graphite">
                            Recorded directly from QA browser session
                          </p>
                        </div>
                      </div>

                      {/* Shared Convergence Output */}
                      <div className="flex flex-wrap items-center justify-center gap-2 rounded-lg bg-paper px-3 py-2 text-[11.5px] font-medium text-ink ring-1 ring-[var(--hairline)]">
                        <span aria-hidden="true" className="size-2 rounded-full bg-lime" />
                        <span>Import, AI Discovery, or Manual Recording feed into:</span>
                        <span className="font-bold">Application Context &amp; Test Scenarios</span>
                      </div>
                    </div>
                  )}

                  {/* STEP 03 — GENERATE */}
                  {activeStep === 2 && (
                    <div className={`${motionRiseClass} flex flex-col gap-3`}>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="t-label text-graphite">03 · Scenario-to-Script Generation</span>
                        <span className="rounded-md bg-lime-soft px-2 py-0.5 text-[10.5px] font-semibold text-lime-ink">
                          Script Generated · Ready for Review
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 rounded-lg bg-paper px-3 py-2 text-[11px] ring-1 ring-[var(--hairline)]">
                        <span className="font-mono text-space">INPUT</span>
                        <span className="font-semibold text-ink">Workspace Plan Upgrade ($120.00 → $96.00 via PILOT20)</span>
                        <span aria-hidden="true" className="text-steel">→</span>
                        <span className="rounded bg-sky-soft px-1.5 py-0.5 font-mono text-[10px] font-semibold text-sky-ink">
                          Playwright TypeScript
                        </span>
                      </div>

                      <div className="overflow-hidden rounded-xl bg-midnight text-canvas ring-1 ring-[var(--hairline-dark)]">
                        <div className="flex items-center justify-between border-b border-[var(--hairline-dark)] bg-phantom px-3 py-2">
                          <span className="font-mono text-[11px] text-canvas">workspace-billing.spec.ts</span>
                          <span className="font-mono text-[10px] text-sky">Editable by QA</span>
                        </div>
                        <pre className="overflow-x-auto p-3 font-mono text-[11px] leading-relaxed">
                          {PLAYWRIGHT_LINES.map((line, lIdx) => (
                            <div
                              key={line.num}
                              className={`${motionRiseClass} flex gap-3`}
                              style={{
                                animationDelay: prefersReducedMotion ? '0ms' : `${lIdx * 70}ms`,
                              }}
                            >
                              <span className="w-4 shrink-0 select-none text-right text-space">{line.num}</span>
                              <span
                                className={line.num === 6 ? 'text-lime' : line.num === 1 || line.num === 7 ? 'text-sky' : 'text-canvas'}
                                style={{ paddingLeft: `${line.indent * 16}px` }}
                              >
                                {line.code}
                              </span>
                            </div>
                          ))}
                        </pre>
                      </div>

                      <p className="text-[11px] text-graphite">
                        Generated from imported, discovered, or recorded context (Team Pro plan with PILOT20 discounted to $96.00). QA can refine before running.
                      </p>
                    </div>
                  )}

                  {/* STEP 04 — EXECUTE */}
                  {activeStep === 3 && (
                    <div className={`${motionRiseClass} flex flex-col gap-3`}>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="t-label text-graphite">04 · Multi-Capability Execution Workspace</span>
                        <span className="rounded-md bg-paper px-2 py-0.5 font-mono text-[10px] text-graphite ring-1 ring-[var(--hairline)]">
                          Sample Run · Independent or parallel
                        </span>
                      </div>

                      <div className="flex flex-col gap-2.5">
                        {EXECUTION_TRACKS.map((track, tIdx) => {
                          const badgeClass =
                            track.tone === 'red'
                              ? 'bg-signal-red-soft text-signal-red'
                              : track.tone === 'lime'
                                ? 'bg-lime-soft text-lime-ink'
                                : 'bg-sky-soft text-sky-ink';
                          const barColor =
                            track.tone === 'red'
                              ? 'var(--color-signal-red)'
                              : track.tone === 'lime'
                                ? 'var(--color-lime-ink)'
                                : 'var(--color-sky)';
                          return (
                            <div
                              key={track.name}
                              className={`${motionRiseClass} rounded-xl border hairline bg-paper p-3 shadow-sm`}
                              style={{ animationDelay: prefersReducedMotion ? '0ms' : `${tIdx * 80}ms` }}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[12.5px] font-bold text-ink">{track.name}</span>
                                <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10.5px] font-semibold ${badgeClass}`}>
                                  {track.status === 'Running' && (
                                    <span aria-hidden="true" className={`size-1.5 rounded-full bg-sky ${motionPulseClass}`} />
                                  )}
                                  {track.status}
                                </span>
                              </div>
                              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-cloud">
                                <div
                                  className={`h-full rounded-full ${prefersReducedMotion ? '' : 'transition-all duration-700'}`}
                                  style={{
                                    width: `${track.progress}%`,
                                    backgroundColor: barColor,
                                  }}
                                />
                              </div>
                              <p className="mt-2 font-mono text-[10.5px] text-graphite">{track.metric}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* STEP 05 — ANALYZE */}
                  {activeStep === 4 && (
                    <div className={`${motionRiseClass} flex flex-col gap-3`}>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="t-label text-graphite">05 · Failure Evidence &amp; Investigation</span>
                        <span className="rounded-md bg-signal-red-soft px-2 py-0.5 font-mono text-[10.5px] font-bold text-signal-red">
                          Example Failure · TR-1042
                        </span>
                      </div>

                      {/* Non-overlapping Incident Summary Card */}
                      <div className="rounded-xl border hairline bg-paper p-3 shadow-sm">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="text-[13px] font-bold text-ink">
                            Checkout confirmation page did not appear after payment submission
                          </p>
                        </div>

                        {/* 4 Collected Evidence Tiles */}
                        <div className="mt-2.5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                          {[
                            { label: 'Execution Logs', sub: '402 status logged' },
                            { label: 'Screenshots', sub: 'Loading freeze' },
                            { label: 'Execution Video', sub: '00:14 replay' },
                            { label: 'Test Report', sub: 'Step 12 trace' },
                          ].map((item) => (
                            <div key={item.label} className="rounded-lg bg-canvas p-2 ring-1 ring-[var(--hairline)]">
                              <p className="text-[11px] font-semibold text-ink">{item.label}</p>
                              <p className="mt-0.5 font-mono text-[10px] text-graphite">{item.sub}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Investigation Assistance & Optional Team Reporting */}
                      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                        <div className="rounded-xl border hairline bg-paper p-3">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[11.5px] font-bold text-ink">AI-Assisted Investigation</span>
                            <span className="rounded bg-sky-soft px-1.5 py-0.5 font-mono text-[10px] font-semibold text-sky-ink">
                              Needs QA Review
                            </span>
                          </div>
                          <p className="mt-1.5 text-[11px] leading-snug text-graphite">
                            Detected mismatch in PILOT20 subscription checkout: UI showed $96.00 discounted total, while API billing endpoint processed pre-discount $120.00 payload (HTTP 402).
                          </p>
                        </div>

                        <div className="rounded-xl border hairline bg-paper p-3">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[11.5px] font-bold text-ink">Share Evidence (Optional)</span>
                            <span className="font-mono text-[10px] text-space">Destinations</span>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            <span className="rounded-md bg-canvas px-2.5 py-1 text-[11px] font-semibold text-ink ring-1 ring-[var(--hairline-strong)]">
                              Jira Issue
                            </span>
                            <span className="rounded-md bg-canvas px-2.5 py-1 text-[11px] font-semibold text-ink ring-1 ring-[var(--hairline-strong)]">
                              Slack Alert
                            </span>
                          </div>
                          <p className="mt-1.5 text-[10.5px] text-graphite">
                            Attach logs, screenshots, video, and report for developer triage.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Left Scrolling Steps List */}
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
                  className={`flex min-h-[52vh] flex-col justify-center py-10 lg:min-h-[72vh] ${prefersReducedMotion ? '' : 'transition-all duration-500'
                    } ${isActive ? 'opacity-100' : 'opacity-30'
                    }`}
                >
                  <p className="t-label text-graphite">
                    <span className={isActive ? 'font-bold text-ink' : 'text-graphite'}>
                      {step.num}
                    </span>
                    {' / 05'}
                  </p>
                  <h3 className={`t-h3 mt-4 ${prefersReducedMotion ? '' : 'transition-colors duration-300'} ${isActive ? 'text-ink' : 'text-graphite'}`}>
                    {step.title}
                  </h3>
                  <p className={`mt-4 max-w-[42ch] text-[16px] leading-relaxed ${prefersReducedMotion ? '' : 'transition-colors duration-300'} ${isActive ? 'text-graphite' : 'text-steel'}`}>
                    {step.description}
                  </p>
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {step.tags.map((tag, tIdx) => (
                      <li
                        key={tIdx}
                        className={`rounded-full px-3 py-1.5 text-[12.5px] font-medium ring-1 ${prefersReducedMotion ? '' : 'transition-all duration-300'
                          } ${isActive
                            ? 'bg-paper text-ink ring-[var(--hairline-strong)] shadow-sm'
                            : 'bg-paper/50 text-graphite ring-[var(--hairline)]'
                          }`}
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
};
