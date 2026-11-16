import React, { useEffect, useRef, useState } from 'react';
import { useScrollReveal } from '../../../hooks/useScrollReveal';

type ScreenState =
  | 'plans'
  | 'plans-selected'
  | 'configure'
  | 'summary'
  | 'summary-coupon'
  | 'checkout'
  | 'checkout-filled'
  | 'processing'
  | 'failed';

interface TimelineStep {
  t: number;
  label: string;
  screen: ScreenState;
  fail?: boolean;
}

interface NetworkEvent {
  stepIndex: number;
  time: string;
  method: string;
  path: string;
  status: number;
  ms: number;
  flagged?: boolean;
}

interface ConsoleEvent {
  stepIndex: number;
  time: string;
  level: 'ERROR' | 'WARN';
  message: string;
}

const TIMELINE_STEPS: TimelineStep[] = [
  { t: 0, label: 'Navigate to app.cloudpilot.io/workspaces/plans', screen: 'plans' },
  { t: 2, label: 'Select "Team Pro" workspace tier', screen: 'plans-selected' },
  { t: 4, label: 'Configure Annual billing tier & 5 team seats', screen: 'configure' },
  { t: 6, label: 'Review billing summary & invoice', screen: 'summary' },
  { t: 8, label: 'Apply voucher code PILOT20 (-20%)', screen: 'summary-coupon' },
  { t: 10, label: 'Proceed to enterprise checkout', screen: 'checkout' },
  { t: 12, label: 'Enter corporate test card details', screen: 'checkout-filled' },
  { t: 14, label: 'Submit payment & authorize subscription', screen: 'processing' },
  { t: 24, label: 'Activation timeout: HTTP 402 gateway timeout (10s)', screen: 'failed', fail: true },
];

const TOTAL_DURATION_SECONDS = TIMELINE_STEPS[TIMELINE_STEPS.length - 1].t;
const PAYMENT_SUBMIT_STEP = 7;
const FAILURE_STEP = TIMELINE_STEPS.length - 1;

const NETWORK_EVENTS: NetworkEvent[] = [
  { stepIndex: 2, time: '00:04', method: 'POST', path: '/api/v1/workspaces/seats', status: 200, ms: 88 },
  { stepIndex: 3, time: '00:06', method: 'GET', path: '/api/v1/billing/summary', status: 200, ms: 74 },
  { stepIndex: 4, time: '00:08', method: 'POST', path: '/api/v1/billing/coupons', status: 200, ms: 112 },
  { stepIndex: 6, time: '00:12', method: 'POST', path: '/api/v1/billing/intent', status: 200, ms: 215 },
  { stepIndex: 7, time: '00:14', method: 'POST', path: '/api/v1/billing/subscriptions', status: 402, ms: 412, flagged: true },
  { stepIndex: 8, time: '00:24', method: 'GET', path: '/api/v1/workspaces/status', status: 204, ms: 58 },
];

const CONSOLE_EVENTS: ConsoleEvent[] = [
  {
    stepIndex: 7,
    time: '00:14',
    level: 'ERROR',
    message: 'SubscriptionAuthError: payment_gateway_timeout (expected 200, received 402 on /api/v1/billing/subscriptions)',
  },
  {
    stepIndex: 8,
    time: '00:24',
    level: 'WARN',
    message: 'Workspace activation timeout after 10s without confirmation banner',
  },
];

const EVIDENCE_POINTS = [
  {
    n: 1,
    title: 'What Happened',
    desc: 'Ringkasan masalah, status pengujian, dan dampak yang teridentifikasi.',
  },
  {
    n: 2,
    title: 'Where It Happened',
    desc: 'Informasi skenario, halaman, langkah pengujian, dan waktu terjadinya masalah.',
  },
  {
    n: 3,
    title: 'Expected vs Actual',
    desc: 'Perbandingan antara hasil yang diharapkan dan perilaku aplikasi yang ditemukan.',
  },
  {
    n: 4,
    title: 'Execution Steps',
    desc: 'Langkah-langkah yang dijalankan untuk membantu tim memahami dan mereproduksi masalah.',
  },
  {
    n: 5,
    title: 'Technical Evidence',
    desc: 'Screenshot, video, log konsol, informasi jaringan, dan data pendukung lainnya yang tersedia.',
  },
  {
    n: 6,
    title: 'Team Handoff',
    desc: 'Bagikan hasil pengujian dan bukti terkait melalui integrasi workflow yang tersedia.',
  },
];

type EvidenceTabId = 'summary' | 'network' | 'console' | 'dom';
type TraceTabId = 'findings' | 'steps';

const EVIDENCE_TABS: { id: EvidenceTabId; label: string }[] = [
  { id: 'summary', label: 'Summary' },
  { id: 'network', label: 'Network' },
  { id: 'console', label: 'Console' },
  { id: 'dom', label: 'DOM' },
];

const TRACE_TABS: { id: TraceTabId; label: string }[] = [
  { id: 'findings', label: 'Findings' },
  { id: 'steps', label: 'Steps' },
];

const formatSeconds = (sec: number) => `00:${String(sec).padStart(2, '0')}`;

const getDomSnapshot = (screen: ScreenState, time: string): string => {
  if (screen === 'failed') {
    return `<!-- Captured at ${time} (Stalled / Timed out) -->
<div class="workspace-activation-modal" data-state="stalled" role="alert">
  <span class="status-badge" aria-label="Subscription authorization failed" />
  <h2>Workspace activation stalled (HTTP 402)</h2>
  <p class="error-msg">payment_authorization_timeout: Gateway timeout</p>
</div>
<!-- #activation-banner: not detected after 10s (00:14–00:24) -->`;
  }
  if (screen === 'processing') {
    return `<!-- Captured at ${time} -->
<div class="workspace-activation-modal" data-state="processing">
  <svg class="spinner" aria-busy="true" />
  <h2>Mengotorisasi langganan Pro Team...</h2>
</div>`;
  }
  return `<!-- Captured at ${time} -->
<main data-screen="${screen}">
  <div data-testid="workspace-tier">Team Pro</div>
  <button data-testid="checkout-flow-cta">
    ${screen === 'summary' || screen === 'summary-coupon' ? 'Lanjut ke Checkout' : screen === 'checkout' || screen === 'checkout-filled' ? 'Otorisasi $156.00/bln' : 'Pilih Team Pro'}
  </button>
</main>`;
};

export const Traces: React.FC = () => {
  const { ref: headerRef, isRevealed: headerRevealed } = useScrollReveal<HTMLElement>();
  const [selectedPoint, setSelectedPoint] = useState<number | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeTraceTab, setActiveTraceTab] = useState<TraceTabId>('findings');
  const [activeEvidenceTab, setActiveEvidenceTab] = useState<EvidenceTabId>('summary');
  const [sentToast, setSentToast] = useState<string | null>(null);
  const [handoffAnnouncement, setHandoffAnnouncement] = useState<string>('');
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);
  const [previewScale, setPreviewScale] = useState<number>(0.6);

  const sectionRef = useRef<HTMLElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const evidenceTabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const traceTabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Refs for predictable observer playback policy without recreating observer
  const prefersReducedMotionRef = useRef<boolean>(false);
  const userManuallyPausedRef = useRef<boolean>(false);
  const hasCompletedRef = useRef<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const applyPreference = (matches: boolean) => {
      prefersReducedMotionRef.current = matches;
      setPrefersReducedMotion(matches);
      if (matches) {
        setIsPlaying(false);
      }
    };
    applyPreference(mq.matches);

    const onChange = (e: MediaQueryListEvent) => applyPreference(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Responsive 16:9 browser preview scaling based on actual container width
  useEffect(() => {
    const container = previewContainerRef.current;
    if (!container) return;

    const updateScale = () => {
      const width = container.getBoundingClientRect().width;
      if (width > 0) {
        setPreviewScale(width / 960);
      }
    };

    updateScale();

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', updateScale, { passive: true });
      return () => window.removeEventListener('resize', updateScale);
    }

    const observer = new ResizeObserver(updateScale);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Viewport visibility lifecycle (starts paused, starts on entry, pauses on exit)
  useEffect(() => {
    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    const handleVisibility = (visibleEnough: boolean, inViewport: boolean) => {
      if (!inViewport) {
        setIsPlaying(false);
        return;
      }
      if (
        visibleEnough &&
        !prefersReducedMotionRef.current &&
        !userManuallyPausedRef.current &&
        !hasCompletedRef.current
      ) {
        setIsPlaying(true);
      }
    };

    if (typeof IntersectionObserver === 'undefined') {
      const checkRect = () => {
        const rect = sectionEl.getBoundingClientRect();
        const vh = window.innerHeight || 800;
        const visibleHeight = Math.min(rect.bottom, vh) - Math.max(rect.top, 0);
        const ratio = rect.height > 0 ? Math.max(0, visibleHeight / rect.height) : 0;
        handleVisibility(ratio >= 0.25, visibleHeight > 0);
      };
      checkRect();
      window.addEventListener('scroll', checkRect, { passive: true });
      window.addEventListener('resize', checkRect, { passive: true });
      return () => {
        window.removeEventListener('scroll', checkRect);
        window.removeEventListener('resize', checkRect);
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        handleVisibility(entry.intersectionRatio >= 0.25, entry.isIntersecting);
      },
      { threshold: [0, 0.25, 0.5] }
    );

    observer.observe(sectionEl);
    return () => observer.disconnect();
  }, []);

  // Bounded playback timer (stops cleanly at the final timeline step)
  useEffect(() => {
    if (!isPlaying) return;

    if (stepIndex >= FAILURE_STEP) {
      hasCompletedRef.current = true;
      setIsPlaying(false);
      return;
    }

    const stepDelayMs = stepIndex === PAYMENT_SUBMIT_STEP ? 1600 : 1050;
    const timer = window.setTimeout(() => {
      setStepIndex((prev) => Math.min(FAILURE_STEP, prev + 1));
    }, stepDelayMs);

    return () => window.clearTimeout(timer);
  }, [isPlaying, stepIndex]);

  // Toast feedback auto-dismiss
  useEffect(() => {
    if (!sentToast) return;
    const timer = window.setTimeout(() => setSentToast(null), 3200);
    return () => window.clearTimeout(timer);
  }, [sentToast]);

  const jumpToStep = (index: number) => {
    const clamped = Math.max(0, Math.min(FAILURE_STEP, index));
    userManuallyPausedRef.current = true;
    hasCompletedRef.current = clamped >= FAILURE_STEP;
    setIsPlaying(false);
    setStepIndex(clamped);
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      userManuallyPausedRef.current = true;
      setIsPlaying(false);
      return;
    }
    userManuallyPausedRef.current = false;
    hasCompletedRef.current = false;
    if (stepIndex >= FAILURE_STEP) {
      setStepIndex(0);
    }
    setIsPlaying(true);
  };

  const handleSelectPoint = (pointNum: number) => {
    setSelectedPoint((prev) => {
      const next = prev === pointNum ? null : pointNum;
      if (next === 1) setActiveTraceTab('findings');
      if (next === 4) setActiveTraceTab('steps');
      if (next === 3) setActiveEvidenceTab('summary');
      if (next === 5) setActiveEvidenceTab('network');
      return next;
    });
  };

  const handleEvidenceKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, idx: number) => {
    const count = EVIDENCE_TABS.length;
    let nextIdx: number | null = null;
    if (e.key === 'ArrowRight') nextIdx = (idx + 1) % count;
    else if (e.key === 'ArrowLeft') nextIdx = (idx - 1 + count) % count;
    else if (e.key === 'Home') nextIdx = 0;
    else if (e.key === 'End') nextIdx = count - 1;

    if (nextIdx !== null) {
      e.preventDefault();
      setActiveEvidenceTab(EVIDENCE_TABS[nextIdx].id);
      evidenceTabRefs.current[nextIdx]?.focus();
    }
  };

  const handleTraceKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, idx: number) => {
    const count = TRACE_TABS.length;
    let nextIdx: number | null = null;
    if (e.key === 'ArrowRight') nextIdx = (idx + 1) % count;
    else if (e.key === 'ArrowLeft') nextIdx = (idx - 1 + count) % count;
    else if (e.key === 'Home') nextIdx = 0;
    else if (e.key === 'End') nextIdx = count - 1;

    if (nextIdx !== null) {
      e.preventDefault();
      setActiveTraceTab(TRACE_TABS[nextIdx].id);
      traceTabRefs.current[nextIdx]?.focus();
    }
  };

  const handleHandoffDemo = (platform: string) => {
    setSentToast(platform);
    setHandoffAnnouncement(`Demo Simulation: Preview action triggered for ${platform}. No real external export occurred.`);
  };

  const displayPoint = hoveredPoint ?? selectedPoint;
  const currentStep = TIMELINE_STEPS[stepIndex] || TIMELINE_STEPS[0];
  const formattedTime = formatSeconds(currentStep.t);
  const totalFormattedTime = formatSeconds(TOTAL_DURATION_SECONDS);
  const visibleNetworkEvents = NETWORK_EVENTS.filter((ev) => ev.stepIndex <= stepIndex);
  const visibleConsoleEvents = CONSOLE_EVENTS.filter((ev) => ev.stepIndex <= stepIndex);

  const renderBadge = (n: number, positionClass: string) => {
    const isHot = displayPoint === n;
    return (
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute z-20 hidden size-5 place-items-center rounded-[5px] font-mono text-[10px] font-bold lg:grid ${prefersReducedMotion ? '' : 'transition-all duration-300'
          } ${isHot ? 'bg-sky text-white shadow-md' : 'bg-ink text-canvas'} ${positionClass}`}
        style={!prefersReducedMotion && isHot ? { transform: 'scale(1.1)' } : undefined}
      >
        {n}
      </span>
    );
  };

  const highlightRing = (n: number) =>
    displayPoint === n ? 'ring-2 ring-sky ring-offset-2 ring-offset-paper' : '';

  return (
    <section
      ref={sectionRef}
      aria-labelledby="traces-title"
      className="relative bg-paper pb-24 pt-14 sm:pb-32 sm:pt-20 lg:pb-36 lg:pt-24"
      id="traces"
    >
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-12">
        {/* Header */}
        <header ref={headerRef} className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="t-label scroll-reveal flex items-center gap-2.5 text-graphite" data-revealed={headerRevealed}>
              <svg aria-hidden="true" className="size-3 shrink-0" viewBox="0 0 12 12">
                <rect fill="var(--color-sky)" height="6" opacity="1" rx="1.6" width="6" x="0" y="0" />
                <rect fill="var(--color-sky)" height="6" opacity="0.55" rx="1.6" width="6" x="6" y="6" />
              </svg>
              <span className="text-ink">04</span>
              <span aria-hidden="true" className="h-px w-6 bg-current opacity-40"></span>
              <span>TEST EVIDENCE</span>
            </p>
            <h2
              className="t-h2 scroll-reveal mt-5 max-w-[20ch] text-ink"
              data-revealed={headerRevealed}
              id="traces-title"
              style={{ transitionDelay: '60ms' }}
            >
              Don't Just Know That a Test Failed. Understand Why.
            </h2>
          </div>
          <div className="flex flex-col gap-5 lg:col-span-4 lg:pb-2">
            <p
              className="t-lede scroll-reveal max-w-[46ch] text-graphite"
              data-revealed={headerRevealed}
              style={{ transitionDelay: '120ms' }}
            >
              TestPilot mengumpulkan bukti eksekusi untuk membantu QA dan developer memahami masalah, menemukan konteksnya, dan melakukan investigasi mendalam.
            </p>
          </div>
        </header>

        {/* Main Content */}
        <div className="mt-12 grid gap-6 lg:mt-16 lg:grid-cols-[236px_minmax(0,1fr)] lg:items-start xl:gap-8">
          {/* Left Navigation: Evidence Structure */}
          <aside className="order-2 lg:order-1 lg:sticky lg:top-24">
            <p className="t-label hidden pb-3 text-space lg:block">Evidence Structure</p>
            <ol aria-label="Evidence Structure" className="grid gap-x-6 gap-y-2 sm:grid-cols-2 lg:grid-cols-1 lg:gap-y-1">
              {EVIDENCE_POINTS.map((item) => {
                const isSelected = selectedPoint === item.n;
                const isHighlighted = displayPoint === item.n;
                return (
                  <li key={item.n}>
                    <button
                      aria-pressed={isSelected}
                      className={`w-full cursor-pointer rounded-xl px-3 py-2.5 text-left focus-visible:ring-2 focus-visible:ring-lime ${prefersReducedMotion ? '' : 'transition-all duration-200'
                        } ${isHighlighted ? 'bg-ink text-canvas shadow-sm' : 'hover:bg-canvas'}`}
                      type="button"
                      onPointerEnter={() => setHoveredPoint(item.n)}
                      onPointerLeave={() => setHoveredPoint((prev) => (prev === item.n ? null : prev))}
                      onFocus={() => setHoveredPoint(item.n)}
                      onBlur={() => setHoveredPoint((prev) => (prev === item.n ? null : prev))}
                      onClick={() => handleSelectPoint(item.n)}
                    >
                      <span className="flex items-center gap-2.5 text-[14px] font-semibold">
                        <span
                          className={`grid size-5 shrink-0 place-items-center rounded-[5px] font-mono text-[10px] font-bold ${prefersReducedMotion ? '' : 'transition-colors'
                            } ${isHighlighted ? 'bg-sky text-white' : 'bg-ink text-canvas'}`}
                        >
                          {item.n}
                        </span>
                        {item.title}
                      </span>
                      <span className={`mt-1 block pl-[30px] text-[12.5px] leading-snug ${isHighlighted ? 'text-steel' : 'text-graphite'}`}>
                        {item.desc}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
            <p className="mt-4 px-3 text-[11.5px] leading-relaxed text-space">
              Arahkan kursor, navigasi keyboard, atau klik poin untuk menyorot bagian terkait di dalam Trace.
            </p>
          </aside>

          {/* Right Dashboard Window */}
          <div className="pattern-dots order-1 min-w-0 rounded-[26px] bg-cloud p-1.5 ring-1 ring-[var(--hairline)] sm:p-2.5 lg:order-2">
            <div
              aria-label="Trace detail (interactive demo)"
              className="relative overflow-hidden rounded-[18px] bg-paper ring-1 ring-[var(--hairline)] shadow-[var(--shadow-window)]"
            >
              {/* Point 2: Header Top Bar */}
              <div
                className={`relative border-b hairline px-4 py-2.5 sm:px-5 ${prefersReducedMotion ? '' : 'transition-all duration-300'
                  } ${highlightRing(2)}`}
              >
                {renderBadge(2, 'left-2 top-2')}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 lg:pl-5">
                  <p className="flex items-center gap-1 text-[11px] text-graphite">
                    Hasil Pengujian
                    <svg aria-hidden="true" className="lucide lucide-chevron-right size-3" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24">
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </p>
                  <h3 className="text-[15px] font-bold tracking-tight">Enterprise SaaS: Workspace Upgrade</h3>
                  <span className="inline-flex h-[22px] shrink-0 items-center gap-1.5 rounded-md px-2 text-[0.6875rem] font-semibold whitespace-nowrap bg-lime-soft text-lime-ink">
                    <svg aria-hidden="true" className="lucide lucide-circle-check size-3" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24">
                      <circle cx="12" cy="12" r="10" />
                      <path d="m16 9-5.5 5.5L8 12" />
                    </svg>
                    Completed
                  </span>
                  <span className="inline-flex h-[22px] shrink-0 items-center gap-1.5 rounded-md px-2 text-[0.6875rem] font-semibold whitespace-nowrap ring-1 ring-inset ring-[var(--hairline-strong)] text-arsenic bg-paper hidden sm:inline-flex">
                    <svg aria-hidden="true" className="lucide lucide-monitor size-3" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24">
                      <rect height="14" rx="2" width="20" x="2" y="3" />
                      <line x1="8" x2="16" y1="21" y2="21" />
                      <line x1="12" x2="12" y1="17" y2="21" />
                    </svg>
                    Chrome · 1440×900
                  </span>
                  <span className="inline-flex h-[22px] shrink-0 items-center gap-1.5 rounded-md px-2 text-[0.6875rem] font-semibold whitespace-nowrap ring-1 ring-inset ring-[var(--hairline-strong)] text-arsenic bg-paper hidden xl:inline-flex">
                    <svg aria-hidden="true" className="lucide lucide-key-round size-3" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24">
                      <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z" />
                      <circle cx="16.5" cy="7.5" fill="currentColor" r=".5" />
                    </svg>
                    Target: app.cloudpilot.io
                  </span>
                  <span className="inline-flex h-[22px] shrink-0 items-center rounded-md px-2 text-[0.6875rem] font-semibold whitespace-nowrap bg-canvas text-graphite ring-1 ring-inset ring-[var(--hairline)] hidden sm:inline-flex">
                    Demo Simulation
                  </span>
                  <p className="ml-auto hidden gap-3 text-[11px] text-graphite md:flex">
                    <span><b className="text-ink">8</b> scenarios</span>
                    <span><b className="text-ink">87%</b> passed</span>
                    <span><b className="text-signal-red">1</b> issue detected</span>
                  </p>
                </div>
              </div>

              {/* 3-Column Content Layout */}
              <div className="grid lg:grid-cols-[minmax(0,1fr)_272px] xl:grid-cols-[186px_minmax(0,1fr)_280px]">
                {/* Column 1: Scenarios Sidebar */}
                <div className="hidden border-r hairline p-2.5 xl:block">
                  <p className="t-label px-1.5 pb-2 text-space">Suite Scenarios (8)</p>
                  <ul className="space-y-0.5">
                    {[
                      { name: 'SSO & SAML Authentication', status: 'passed' },
                      { name: 'Role-based invite flow', status: 'passed' },
                      { name: 'API rate limit & webhook', status: 'passed' },
                      { name: 'Enterprise Workspace Upgrade', status: 'failed' },
                      { name: 'Multi-region runner check', status: 'passed' },
                      { name: 'Audit logs compliance export', status: 'passed' },
                      { name: 'Webhook endpoint setup', status: 'passed' },
                      { name: 'Subscription downgrade flow', status: 'passed' },
                    ].map((sc) => {
                      const isFailed = sc.status === 'failed';
                      return (
                        <li
                          key={sc.name}
                          className={`flex gap-1.5 rounded-lg px-1.5 py-1 text-[11px] ${isFailed ? 'bg-canvas ring-1 ring-[var(--hairline)] font-semibold' : 'text-arsenic'
                            }`}
                        >
                          {isFailed ? (
                            <svg aria-hidden="true" className="mt-px size-3 shrink-0 text-signal-red" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24">
                              <circle cx="12" cy="12" r="10" />
                              <path d="m15 9-6 6" />
                              <path d="m9 9 6 6" />
                            </svg>
                          ) : (
                            <svg aria-hidden="true" className="mt-px size-3 shrink-0 text-lime-ink" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24">
                              <circle cx="12" cy="12" r="10" />
                              <path d="m16 9-5.5 5.5L8 12" />
                            </svg>
                          )}
                          <span className="leading-snug">{sc.name}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Column 2: Video Player & Evidence Tabs */}
                <div className="min-w-0 border-b hairline p-3 lg:border-b-0 lg:border-r">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[12.5px] font-bold">Enterprise Workspace Upgrade Scenario</p>
                    <span className="inline-flex h-[22px] shrink-0 items-center gap-1.5 rounded-md px-2 text-[0.6875rem] font-semibold whitespace-nowrap bg-signal-red-soft text-[#b4162f]">
                      Failed · TR-1042
                    </span>
                    <span className="text-[11px] text-graphite">
                      CloudPilot · Step {stepIndex + 1}/{TIMELINE_STEPS.length} · {formattedTime}
                    </span>
                  </div>

                  {/* Point 5: Responsive 16:9 Video Player Box */}
                  <div
                    className={`relative mt-2.5 overflow-hidden rounded-xl bg-ink ring-1 ring-[var(--hairline)] ${prefersReducedMotion ? '' : 'transition-all duration-300'
                      } ${highlightRing(5)}`}
                  >
                    {renderBadge(5, 'left-2 top-2')}
                    <div ref={previewContainerRef} className="relative w-full overflow-hidden" style={{ aspectRatio: '16 / 9' }}>
                      <div
                        className="absolute left-0 top-0 origin-top-left"
                        style={{
                          width: '960px',
                          height: '540px',
                          transform: `scale(${previewScale})`,
                        }}
                      >
                        <div className="relative h-[540px] w-[960px] overflow-hidden bg-white text-ink select-none font-sans">
                          {/* Inner Mock CloudPilot Browser Header */}
                          <header className="flex h-[52px] items-center justify-between border-b border-[#eceef3] px-7 bg-slate-50/50">
                            <div className="flex items-center gap-6">
                              <div className="flex items-center gap-2">
                                <div className="size-6 rounded-md bg-sky flex items-center justify-center text-white text-[11px] font-bold">
                                  TP
                                </div>
                                <span className="text-[15px] font-bold tracking-tight text-ink">CloudPilot Platform</span>
                              </div>
                              <nav aria-label="Mock SaaS navigation" className="flex gap-5 text-[12.5px] font-medium text-[#555a66]">
                                <span>Workspaces</span>
                                <span>Team Members</span>
                                <span>CI/CD Gate</span>
                                <span className="font-semibold text-sky">Billing</span>
                              </nav>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="relative px-3 py-1.5 rounded-lg border border-[#e2e8f0] bg-white flex items-center gap-2 text-[12px] font-semibold text-ink">
                                <svg aria-hidden="true" className="size-4 text-graphite" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <rect width="20" height="14" x="2" y="5" rx="2" />
                                  <line x1="2" x2="22" y1="10" y2="10" />
                                </svg>
                                <span>Billing Review</span>
                                {stepIndex >= 3 && (
                                  <span className="grid size-4 place-items-center rounded-full bg-sky text-[10px] font-bold text-white">
                                    1
                                  </span>
                                )}
                              </span>
                            </div>
                          </header>

                          {/* Dynamic Browser Screen Content (488px exact remaining height) */}
                          <div className="relative overflow-hidden" style={{ height: '488px' }}>
                            {/* Screen 1: Workspace Plans */}
                            {(currentStep.screen === 'plans' || currentStep.screen === 'plans-selected') && (
                              <div className="px-7 pt-5">
                                <div className="relative flex items-center justify-between overflow-hidden rounded-2xl bg-midnight px-8 text-white" style={{ height: '135px' }}>
                                  <div>
                                    <p className="text-[11px] font-bold uppercase tracking-widest text-sky">Workspace Tier: Starter (Free)</p>
                                    <p className="mt-1.5 text-[26px] font-bold leading-none tracking-tight">Upgrade to Pro Team Workspace</p>
                                    <p className="mt-2 text-[12.5px] text-steel">Unlock AI self-healing tests, unlimited team seats, and parallel test executions.</p>
                                  </div>
                                  <div className="size-28 rounded-full bg-sky/20 blur-2xl absolute -right-6 -bottom-6" />
                                </div>

                                <div className="mt-5 flex items-baseline justify-between">
                                  <p className="text-[14px] font-bold text-graphite uppercase tracking-wider">Select Subscription Plan</p>
                                  <p className="text-[11.5px] text-graphite">Demo Target: app.cloudpilot.io</p>
                                </div>

                                <div className="mt-3 grid grid-cols-3 gap-5">
                                  {/* Starter */}
                                  <div className="rounded-2xl border border-[#eceef3] p-4.5 bg-slate-50/50 opacity-70">
                                    <span className="text-[12px] font-bold text-graphite">Starter</span>
                                    <p className="text-[22px] font-black text-ink mt-1">$0 <span className="text-[12px] font-normal text-graphite">/ bln</span></p>
                                    <p className="text-[11.5px] text-graphite mt-1.5">Up to 2 projects &amp; 50 monthly test runs.</p>
                                    <div className="mt-4 pt-3 border-t border-[#eceef3] text-[11px] text-graphite space-y-1">
                                      <p>✓ 1 Team Seat</p>
                                      <p>✓ Basic Playwright Export</p>
                                    </div>
                                  </div>

                                  {/* Team Pro (Target) */}
                                  <div className={`relative rounded-2xl p-4.5 transition-all ${
                                    stepIndex >= 1
                                      ? 'border-2 border-sky bg-sky-soft/30 shadow-sm ring-1 ring-sky/30'
                                      : 'border border-[#eceef3] bg-white'
                                  }`}>
                                    <span className="absolute -top-2.5 right-4 rounded-full bg-sky px-2 py-0.5 text-[9.5px] font-bold text-white uppercase tracking-wider">
                                      Recommended
                                    </span>
                                    <span className="text-[12px] font-bold text-sky-ink">Team Pro</span>
                                    <p className="text-[22px] font-black text-ink mt-1">$195 <span className="text-[12px] font-normal text-graphite">/ bln</span></p>
                                    <p className="text-[11.5px] text-graphite mt-1.5">Unlimited test suites, AI healing &amp; parallel runs.</p>
                                    <div className="mt-4 pt-3 border-t border-sky/20 text-[11px] text-ink space-y-1">
                                      <p className="font-semibold text-sky-ink">✓ 5 Included Team Seats</p>
                                      <p>✓ AI Locator Auto-Healing</p>
                                      <p>✓ Full Execution Evidence Traces</p>
                                    </div>
                                    <div className={`mt-4 flex h-8 items-center justify-center rounded-lg text-[11.5px] font-semibold ${
                                      stepIndex >= 1 ? 'bg-sky text-white' : 'bg-ink text-white'
                                    }`}>
                                      {stepIndex >= 1 ? '✓ Selected' : 'Choose Team Pro'}
                                    </div>
                                  </div>

                                  {/* Enterprise */}
                                  <div className="rounded-2xl border border-[#eceef3] p-4.5 bg-slate-50/50 opacity-70">
                                    <span className="text-[12px] font-bold text-graphite">Enterprise</span>
                                    <p className="text-[22px] font-black text-ink mt-1">Custom</p>
                                    <p className="text-[11.5px] text-graphite mt-1.5">Dedicated infrastructure, SSO, and custom SLA.</p>
                                    <div className="mt-4 pt-3 border-t border-[#eceef3] text-[11px] text-graphite space-y-1">
                                      <p>✓ Unlimited Seats</p>
                                      <p>✓ On-premise Execution Agent</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Screen 2: Configure Workspace */}
                            {currentStep.screen === 'configure' && (
                              <div className="grid grid-cols-[1fr_340px] gap-8 px-7 pt-6">
                                <div>
                                  <p className="text-[11px] font-bold uppercase tracking-wider text-sky-ink">Step 2 · Workspace Setup</p>
                                  <p className="mt-1 text-[24px] font-bold tracking-tight">Configure Pro Team Workspace</p>
                                  <p className="mt-1 text-[12.5px] text-graphite">Define billing cadence and seat capacity for your testing organization.</p>

                                  <div className="mt-6 space-y-4">
                                    <div className="rounded-xl border border-[#eceef3] p-4 bg-slate-50/40">
                                      <div className="flex items-center justify-between">
                                        <div>
                                          <p className="text-[13px] font-semibold text-ink">Billing Frequency</p>
                                          <p className="text-[11.5px] text-graphite">Annual billing saves 20% on monthly seat pricing.</p>
                                        </div>
                                        <div className="flex items-center gap-1 rounded-lg bg-paper p-1 border border-[#eceef3]">
                                          <span className="px-2.5 py-1 text-[11.5px] font-medium text-graphite">Monthly</span>
                                          <span className="px-2.5 py-1 text-[11.5px] font-bold bg-sky text-white rounded-md shadow-xs">
                                            Annual (-20%)
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="rounded-xl border border-[#eceef3] p-4 bg-slate-50/40">
                                      <div className="flex items-center justify-between">
                                        <div>
                                          <p className="text-[13px] font-semibold text-ink">Active QA Seats</p>
                                          <p className="text-[11.5px] text-graphite">5 seats included in standard Pro tier.</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <span className="size-7 rounded-md border border-[#eceef3] bg-white grid place-items-center text-graphite text-xs font-bold">-</span>
                                          <span className="font-mono text-sm font-bold px-2">5</span>
                                          <span className="size-7 rounded-md border border-[#eceef3] bg-white grid place-items-center text-graphite text-xs font-bold">+</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="rounded-2xl bg-[#f6f7fa] p-5 text-[12.5px]">
                                  <p className="text-[14px] font-bold">Workspace Configuration</p>
                                  <dl className="mt-3 space-y-2">
                                    <div className="flex justify-between">
                                      <dt className="text-graphite">Plan</dt>
                                      <dd className="font-semibold text-ink">Team Pro</dd>
                                    </div>
                                    <div className="flex justify-between">
                                      <dt className="text-graphite">Cadence</dt>
                                      <dd className="font-semibold text-ink">Annual Billing</dd>
                                    </div>
                                    <div className="flex justify-between">
                                      <dt className="text-graphite">Total Seats</dt>
                                      <dd className="font-semibold text-ink">5 QA Engineers</dd>
                                    </div>
                                    <div className="flex justify-between border-t border-[#e2e4ea] pt-2 text-[14px] font-bold">
                                      <dt>Estimated Cost</dt>
                                      <dd className="text-sky-ink">$156.00 <span className="text-xs font-normal text-graphite">/ bln</span></dd>
                                    </div>
                                  </dl>
                                  <div className="mt-5 flex h-10 items-center justify-center rounded-lg bg-sky text-[12.5px] font-semibold text-white">
                                    ✓ Configuration Verified
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Screen 3: Billing Review / Summary */}
                            {(currentStep.screen === 'summary' || currentStep.screen === 'summary-coupon') && (
                              <div className="grid grid-cols-[1fr_340px] gap-8 px-7 pt-6">
                                <div>
                                  <p className="text-[22px] font-bold tracking-tight">Billing Review &amp; Invoice</p>
                                  <div className="mt-4 flex items-center gap-4 rounded-2xl border border-[#eceef3] p-4 bg-white shadow-xs">
                                    <div className="size-12 rounded-xl bg-sky flex items-center justify-center text-white font-bold font-mono text-sm">
                                      PRO
                                    </div>
                                    <div className="flex-1 text-[13px]">
                                      <p className="font-bold text-ink">Team Pro Workspace Subscription</p>
                                      <p className="text-[11.5px] text-graphite">Annual Tier · 5 Active Seats · Priority Support</p>
                                    </div>
                                    <span className="text-[14px] font-bold text-ink">$195.00/bln</span>
                                  </div>

                                  <div className="mt-6 max-w-[380px]">
                                    <p className="text-[12px] font-semibold">Voucher / Promo Code</p>
                                    <div className="mt-2 flex gap-2">
                                      <div
                                        className={`flex h-10 flex-1 items-center rounded-lg border bg-white px-3 font-mono text-[13px] ${
                                          stepIndex >= 4 ? 'border-sky ring-2 ring-sky/30' : 'border-[#e2e4ea]'
                                        }`}
                                      >
                                        {stepIndex >= 4 ? 'PILOT20' : 'Enter voucher code'}
                                      </div>
                                      <div className="grid h-10 place-items-center rounded-lg bg-[#eceef3] px-4 text-[12.5px] font-semibold">
                                        Apply
                                      </div>
                                    </div>
                                    {stepIndex >= 4 && (
                                      <p className="mt-2 flex items-center gap-1.5 text-[11.5px] font-semibold text-lime-ink">
                                        <svg aria-hidden="true" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                          <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                        PILOT20 applied · 20% Discount Activated
                                      </p>
                                    )}
                                  </div>
                                </div>

                                <div className="rounded-2xl bg-[#f6f7fa] p-5 text-[12.5px]">
                                  <p className="text-[14px] font-bold">Invoice Summary</p>
                                  <dl className="mt-3 space-y-2">
                                    <div className="flex justify-between">
                                      <dt className="text-graphite">Subtotal</dt>
                                      <dd>$195.00</dd>
                                    </div>
                                    {stepIndex >= 4 && (
                                      <div className="flex justify-between text-lime-ink font-medium">
                                        <dt>Discount (PILOT20)</dt>
                                        <dd>−$39.00</dd>
                                      </div>
                                    )}
                                    <div className="flex justify-between">
                                      <dt className="text-graphite">Tax / VAT</dt>
                                      <dd>$0.00</dd>
                                    </div>
                                    <div className="flex justify-between border-t border-[#e2e4ea] pt-2 text-[14px] font-bold">
                                      <dt>Total Due Monthly</dt>
                                      <dd>{stepIndex >= 4 ? '$156.00' : '$195.00'}</dd>
                                    </div>
                                  </dl>
                                  <div className="mt-5 flex h-11 items-center justify-center rounded-full bg-ink text-[13px] font-semibold text-white">
                                    Proceed to Checkout
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Screen 4 & 5: Checkout, Processing, & Failure */}
                            {(currentStep.screen === 'checkout' ||
                              currentStep.screen === 'checkout-filled' ||
                              currentStep.screen === 'processing' ||
                              currentStep.screen === 'failed') && (
                              <div className="relative h-full">
                                <div className="grid grid-cols-[1fr_320px] gap-8 px-7 pt-6">
                                  <div>
                                    <p className="text-[22px] font-bold tracking-tight">Enterprise Checkout</p>
                                    <div className="mt-4 max-w-[460px] space-y-3">
                                      <div>
                                        <span className="text-[11px] font-semibold text-[#555a66]">Admin Email</span>
                                        <div className="mt-1 flex h-10 items-center rounded-lg border border-[#e2e4ea] bg-white px-3 text-[12.5px]">
                                          admin@novadesk.io
                                        </div>
                                      </div>
                                      <div>
                                        <span className="text-[11px] font-semibold text-[#555a66]">Workspace Subdomain</span>
                                        <div className="mt-1 flex h-10 items-center rounded-lg border border-[#e2e4ea] bg-white px-3 font-mono text-[12px] text-graphite">
                                          novadesk.cloudpilot.io
                                        </div>
                                      </div>
                                      <div>
                                        <span className="text-[11px] font-semibold text-[#555a66]">Corporate Card Number</span>
                                        <div className="mt-1 flex h-10 items-center rounded-lg border border-[#e2e4ea] bg-white px-3 font-mono text-[12.5px]">
                                          {stepIndex >= 6 ? '4242 4242 4242 4242' : '•••• •••• •••• ••••'}
                                        </div>
                                      </div>
                                      <div className="grid grid-cols-2 gap-3">
                                        <div>
                                          <span className="text-[11px] font-semibold text-[#555a66]">Expiry</span>
                                          <div className="mt-1 flex h-10 items-center rounded-lg border border-[#e2e4ea] bg-white px-3 text-[12.5px]">
                                            12 / 28
                                          </div>
                                        </div>
                                        <div>
                                          <span className="text-[11px] font-semibold text-[#555a66]">CVC</span>
                                          <div className="mt-1 flex h-10 items-center rounded-lg border border-[#e2e4ea] bg-white px-3 text-[12.5px]">
                                            •••
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="rounded-2xl bg-[#f6f7fa] p-5 text-[12.5px]">
                                    <p className="text-[14px] font-bold">Subscription Order</p>
                                    <dl className="mt-3 space-y-2">
                                      <div className="flex justify-between">
                                        <dt className="text-graphite">Team Pro (Annual)</dt>
                                        <dd>$195.00</dd>
                                      </div>
                                      <div className="flex justify-between text-lime-ink">
                                        <dt>Voucher (PILOT20)</dt>
                                        <dd>−$39.00</dd>
                                      </div>
                                      <div className="flex justify-between border-t border-[#e2e4ea] pt-2 text-[14px] font-bold">
                                        <dt>Total</dt>
                                        <dd>$156.00/bln</dd>
                                      </div>
                                    </dl>
                                    <div className="mt-5 flex h-11 items-center justify-center rounded-full bg-ink text-[13px] font-semibold text-white">
                                      Authorize &amp; Activate ($156.00/bln)
                                    </div>
                                  </div>
                                </div>

                                {/* Processing vs Distinct Stalled Failure Modal */}
                                {(currentStep.screen === 'processing' || currentStep.screen === 'failed') && (
                                  <div
                                    className="absolute inset-0 z-10 grid place-items-center"
                                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.76)', backdropFilter: 'blur(2px)' }}
                                  >
                                    <div
                                      className={`relative flex w-[370px] flex-col items-center rounded-2xl bg-white px-7 py-7 text-center shadow-[0_20px_50px_-20px_rgb(20_20_26/0.35)] ${
                                        currentStep.screen === 'failed'
                                          ? 'ring-2 ring-signal-red'
                                          : 'ring-1 ring-[#eceef3]'
                                      }`}
                                    >
                                      {currentStep.screen === 'processing' ? (
                                        <>
                                          <div
                                            className={`size-9 rounded-full border-sky ${prefersReducedMotion ? '' : 'animate-spin'}`}
                                            style={{ borderWidth: '3px', borderStyle: 'solid', borderTopColor: 'transparent' }}
                                          />
                                          <p className="mt-4 text-[15px] font-bold text-ink">Mengotorisasi langganan Pro Team...</p>
                                          <p className="mt-1 text-[12px] text-[#555a66]">
                                            Menghubungkan ke gateway pembayaran dan memvalidasi token.
                                          </p>
                                        </>
                                      ) : (
                                        <>
                                          <span
                                            aria-hidden="true"
                                            className="pointer-events-none absolute -inset-3 rounded-[22px] border-2 border-dashed border-signal-red/70"
                                          />
                                          <span className="absolute -top-4 left-1/2 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-md bg-signal-red px-3 py-1 text-[11px] font-bold text-white shadow-lg">
                                            <svg aria-hidden="true" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                                              <line x1="12" x2="12" y1="9" y2="13" />
                                              <line x1="12" x2="12.01" y1="17" y2="17" />
                                            </svg>
                                            Tidak ada konfirmasi setelah 10 detik
                                          </span>

                                          <div className="grid size-10 place-items-center rounded-full bg-signal-red-soft text-[#b4162f]">
                                            <svg aria-hidden="true" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                              <circle cx="12" cy="12" r="9" />
                                              <path strokeLinecap="round" d="M12 8v5M12 16h.01" />
                                            </svg>
                                          </div>
                                          <p className="mt-3 text-[15px] font-bold text-ink">
                                            Aktivasi workspace terhenti (HTTP 402)
                                          </p>
                                          <p className="mt-1 text-[12px] text-[#555a66]">
                                            Simulated gateway timeout pada webhook otorisasi, menyebabkan aktivasi workspace tertahan pada status pending.
                                          </p>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Video Player Controls Bar */}
                    <div className="flex items-center gap-3 bg-ink px-3 py-1.5 text-canvas">
                      <button
                        aria-label={isPlaying ? 'Pause recording' : stepIndex >= FAILURE_STEP ? 'Replay recording' : 'Play recording'}
                        className="grid size-6 cursor-pointer place-items-center rounded-full bg-canvas/10 focus-visible:ring-2 focus-visible:ring-lime"
                        type="button"
                        onClick={togglePlayPause}
                      >
                        {isPlaying ? (
                          <svg aria-hidden="true" className="size-3 fill-current" viewBox="0 0 24 24">
                            <rect height="18" rx="1" width="5" x="14" y="3" />
                            <rect height="18" rx="1" width="5" x="5" y="3" />
                          </svg>
                        ) : (
                          <svg aria-hidden="true" className="ml-0.5 size-3 fill-current" viewBox="0 0 24 24">
                            <polygon points="5 3 19 12 5 21 5 3" />
                          </svg>
                        )}
                      </button>

                      {/* Scrubber progress bar */}
                      <div className="relative h-5 flex-1">
                        <span className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-canvas/15"></span>
                        <span
                          className={`absolute left-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-sky ${prefersReducedMotion ? '' : 'transition-all duration-300'
                            }`}
                          style={{ width: `${(currentStep.t / TOTAL_DURATION_SECONDS) * 100}%` }}
                        ></span>
                        {TIMELINE_STEPS.map((step, idx) => (
                          <button
                            key={step.label}
                            aria-label={`Lompat ke ${formatSeconds(step.t)}: ${step.label}`}
                            className={`absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-[3px] focus-visible:ring-2 focus-visible:ring-lime ${prefersReducedMotion ? '' : 'transition-transform'
                              } ${step.fail
                                ? 'bg-signal-red ring-1 ring-white/50'
                                : idx <= stepIndex
                                  ? 'bg-sky'
                                  : 'bg-canvas/50'
                              }`}
                            style={{ left: `${(step.t / TOTAL_DURATION_SECONDS) * 100}%` }}
                            type="button"
                            onClick={() => jumpToStep(idx)}
                          />
                        ))}
                      </div>

                      <span
                        className="font-mono text-[10px] tabular-nums text-steel"
                        title="Simulated execution timeline timestamps (accelerated playback)"
                      >
                        {formattedTime} / {totalFormattedTime}
                      </span>
                    </div>
                  </div>

                  {/* Evidence Tabs */}
                  <div
                    aria-label="Evidence"
                    aria-orientation="horizontal"
                    className="mt-2 flex items-center gap-1 border-b hairline"
                    role="tablist"
                  >
                    {EVIDENCE_TABS.map((tab, idx) => {
                      const isSelected = activeEvidenceTab === tab.id;
                      const badge = tab.id === 'console' && visibleConsoleEvents.length > 0 ? String(visibleConsoleEvents.length) : null;
                      return (
                        <button
                          key={tab.id}
                          ref={(el) => {
                            evidenceTabRefs.current[idx] = el;
                          }}
                          aria-controls={`evidence-panel-${tab.id}`}
                          aria-selected={isSelected}
                          className={`-mb-px cursor-pointer border-b-2 px-2.5 py-1.5 text-[11.5px] font-semibold focus-visible:ring-2 focus-visible:ring-lime ${prefersReducedMotion ? '' : 'transition-colors'
                            } ${isSelected ? 'border-ink text-ink' : 'border-transparent text-graphite hover:text-ink'}`}
                          id={`evidence-tab-${tab.id}`}
                          role="tab"
                          tabIndex={isSelected ? 0 : -1}
                          type="button"
                          onClick={() => setActiveEvidenceTab(tab.id)}
                          onKeyDown={(e) => handleEvidenceKeyDown(e, idx)}
                        >
                          {tab.label}
                          {badge && <span className="ml-1 text-signal-red">{badge}</span>}
                        </button>
                      );
                    })}
                    <span className="ml-auto hidden text-[10.5px] text-graphite sm:inline">
                      Sim. time {formattedTime}
                    </span>
                  </div>

                  {/* Evidence Tab Panels */}
                  <div className="mt-1.5 pl-1.5 pt-1.5" style={{ minHeight: '168px' }}>
                    <div
                      aria-labelledby="evidence-tab-summary"
                      className={`relative grid gap-2 rounded-xl text-[11.5px] sm:grid-cols-2 ${prefersReducedMotion ? '' : 'transition-opacity duration-200'
                        } ${activeEvidenceTab === 'summary' ? `opacity-100 ${highlightRing(3)}` : 'hidden opacity-0'}`}
                      hidden={activeEvidenceTab !== 'summary'}
                      id="evidence-panel-summary"
                      role="tabpanel"
                      tabIndex={0}
                    >
                      {renderBadge(3, '-left-1.5 -top-1.5')}
                      <div className="rounded-lg bg-canvas p-2.5">
                        <p className="font-semibold text-graphite">Expected Result</p>
                        <p className="mt-0.5 leading-snug text-ink">
                          Subscription authorizes for $156.00/bln and workspace status updates to "Active Pro".
                        </p>
                      </div>
                      <div className="rounded-lg bg-signal-red-soft p-2.5">
                        <p className="font-semibold text-[#b4162f]">Actual Result</p>
                        <p className="mt-0.5 leading-snug text-ink">
                          Confirmation stalled after HTTP 402; no workspace activation banner appeared within 10s (00:14–00:24).
                        </p>
                      </div>
                      <div className="rounded-lg bg-sky-soft px-2.5 py-2 sm:col-span-2">
                        <p className="flex items-center gap-1 font-semibold text-sky-ink">
                          <svg aria-hidden="true" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" />
                            <path d="M20 2v4" />
                            <path d="M22 4h-4" />
                            <circle cx="4" cy="20" r="2" />
                          </svg>
                          Possible Root Cause
                        </p>
                        <p className="mt-0.5 leading-snug text-arsenic">
                          The simulated payment gateway timed out on the authorization webhook (HTTP 402 on /api/v1/billing/subscriptions), causing workspace activation to stall in pending state without displaying the success banner.
                        </p>
                      </div>
                    </div>

                    <div
                      aria-labelledby="evidence-tab-network"
                      className={`overflow-y-auto font-mono text-[10.5px] space-y-1 ${prefersReducedMotion ? '' : 'transition-opacity duration-200'
                        } ${activeEvidenceTab === 'network' ? 'opacity-100' : 'hidden opacity-0'}`}
                      hidden={activeEvidenceTab !== 'network'}
                      id="evidence-panel-network"
                      role="tabpanel"
                      style={{ maxHeight: '168px' }}
                      tabIndex={0}
                    >
                      {visibleNetworkEvents.length === 0 ? (
                        <p className="rounded bg-canvas px-2.5 py-2 text-graphite">
                          No billing API requests recorded yet at {formattedTime}. Advance timeline to step 3 (00:04) or later.
                        </p>
                      ) : (
                        visibleNetworkEvents.map((req) => (
                          <div
                            key={`${req.time}-${req.path}`}
                            className={`flex items-center gap-2 rounded px-2 py-[5px] ${req.flagged ? 'bg-signal-red-soft font-semibold text-[#b4162f]' : 'text-arsenic'
                              }`}
                          >
                            <span className="w-10 shrink-0 text-graphite">{req.time}</span>
                            <span className="w-10 shrink-0 text-graphite">{req.method}</span>
                            <span className="min-w-0 flex-1 truncate">{req.path}</span>
                            <span className="shrink-0">{req.status}</span>
                            <span className="w-12 shrink-0 text-right text-graphite">{req.ms}ms</span>
                          </div>
                        ))
                      )}
                    </div>

                    <div
                      aria-labelledby="evidence-tab-console"
                      className={`space-y-1.5 font-mono text-[10.5px] ${prefersReducedMotion ? '' : 'transition-opacity duration-200'
                        } ${activeEvidenceTab === 'console' ? 'opacity-100' : 'hidden opacity-0'}`}
                      hidden={activeEvidenceTab !== 'console'}
                      id="evidence-panel-console"
                      role="tabpanel"
                      tabIndex={0}
                    >
                      {visibleConsoleEvents.length === 0 ? (
                        <p className="rounded bg-canvas px-2.5 py-2 text-graphite">
                          No console errors recorded up to {formattedTime}. Errors occur at subscription authorization (00:14).
                        </p>
                      ) : (
                        visibleConsoleEvents.map((ev) => (
                          <p
                            key={`${ev.time}-${ev.level}`}
                            className={`rounded px-2.5 py-1.5 ${ev.level === 'ERROR'
                              ? 'bg-signal-red-soft text-[#b4162f]'
                              : 'bg-signal-yellow-soft text-[#7a5d00]'
                              }`}
                          >
                            <span className="mr-1.5 text-graphite">{ev.time}</span>
                            <span className="font-semibold uppercase">{ev.level}</span> {ev.message}
                          </p>
                        ))
                      )}
                    </div>

                    <div
                      aria-labelledby="evidence-tab-dom"
                      className={
                        prefersReducedMotion
                          ? activeEvidenceTab === 'dom'
                            ? 'opacity-100'
                            : 'hidden opacity-0'
                          : `transition-opacity duration-200 ${activeEvidenceTab === 'dom' ? 'opacity-100' : 'hidden opacity-0'}`
                      }
                      hidden={activeEvidenceTab !== 'dom'}
                      id="evidence-panel-dom"
                      role="tabpanel"
                      tabIndex={0}
                    >
                      <pre className="overflow-x-auto rounded bg-canvas p-2.5 font-mono text-[10.5px] leading-relaxed text-arsenic">
                        {getDomSnapshot(currentStep.screen, formattedTime)}
                      </pre>
                    </div>
                  </div>
                </div>

                {/* Column 3: Trace Details (Findings vs Steps) */}
                <div className="min-w-0 p-3">
                  <div
                    aria-label="Trace details"
                    aria-orientation="horizontal"
                    className="flex items-center gap-1 border-b hairline"
                    role="tablist"
                  >
                    {TRACE_TABS.map((tab, idx) => {
                      const isSelected = activeTraceTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          ref={(el) => {
                            traceTabRefs.current[idx] = el;
                          }}
                          aria-controls={`trace-panel-${tab.id}`}
                          aria-selected={isSelected}
                          className={`-mb-px flex cursor-pointer items-center gap-1.5 border-b-2 px-2.5 py-1.5 text-[12px] font-semibold focus-visible:ring-2 focus-visible:ring-lime ${prefersReducedMotion ? '' : 'transition-colors'
                            } ${isSelected ? 'border-ink text-ink' : 'border-transparent text-graphite hover:text-ink'}`}
                          id={`trace-tab-${tab.id}`}
                          role="tab"
                          tabIndex={isSelected ? 0 : -1}
                          type="button"
                          onClick={() => setActiveTraceTab(tab.id)}
                          onKeyDown={(e) => handleTraceKeyDown(e, idx)}
                        >
                          {tab.label}
                          {tab.id === 'findings' && (
                            <span className="grid size-4 place-items-center rounded bg-signal-red text-[9px] text-white">
                              1
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Findings Panel */}
                  <div
                    aria-labelledby="trace-tab-findings"
                    className={`mt-2.5 space-y-2 ${activeTraceTab === 'findings' ? '' : 'hidden'}`}
                    hidden={activeTraceTab !== 'findings'}
                    id="trace-panel-findings"
                    role="tabpanel"
                    tabIndex={0}
                  >
                    {/* Point 1: Critical Finding */}
                    <div
                      className={`relative rounded-xl p-3 ring-1 ring-signal-red/30 ${prefersReducedMotion ? '' : 'transition-all duration-300'
                        } ${displayPoint === 1 ? 'ring-2 ring-sky ring-offset-2 ring-offset-paper bg-sky-soft shadow-md' : ''}`}
                    >
                      {renderBadge(1, '-left-2 -top-2')}
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-[12px] font-bold leading-snug">
                          Workspace activation state was not confirmed after payment submission.
                        </p>
                        <span className="inline-flex h-[22px] shrink-0 items-center gap-1.5 rounded-md px-2 text-[0.6875rem] font-semibold whitespace-nowrap bg-signal-red-soft text-[#b4162f]">
                          Critical
                        </span>
                      </div>
                      <p className="mt-1 text-[10.5px] text-graphite">
                        CloudPilot · Step {FAILURE_STEP + 1}/{TIMELINE_STEPS.length} · {totalFormattedTime}
                      </p>
                      <div className="mt-2 space-y-1.5 text-[11px]">
                        <button
                          className="block w-full cursor-pointer rounded-lg px-2.5 py-1.5 text-left ring-1 ring-[var(--hairline)] hover:bg-canvas hover:ring-sky focus-visible:ring-2 focus-visible:ring-lime"
                          type="button"
                          onClick={() => {
                            jumpToStep(FAILURE_STEP);
                            setActiveEvidenceTab('summary');
                          }}
                        >
                          Workspace activation stalled after corporate card submission
                          <span className="block font-mono text-[10px] text-graphite">00:14–00:24</span>
                        </button>
                        <button
                          className="block w-full cursor-pointer rounded-lg px-2.5 py-1.5 text-left ring-1 ring-[var(--hairline)] hover:bg-canvas hover:ring-sky focus-visible:ring-2 focus-visible:ring-lime"
                          type="button"
                          onClick={() => {
                            setActiveEvidenceTab('network');
                            jumpToStep(PAYMENT_SUBMIT_STEP);
                          }}
                        >
                          POST /api/v1/billing/subscriptions returned status 402
                          <span className="block font-mono text-[10px] text-graphite">00:14</span>
                        </button>
                      </div>
                      <p className="mt-2 text-[10.5px] leading-snug text-graphite">
                        <span className="font-semibold text-ink">Impact:</span> Team Pro workspace remains in pending tier despite successful checkout attempt.
                      </p>
                    </div>

                    <button
                      className="flex w-full cursor-pointer items-center justify-between rounded-lg px-2.5 py-2 text-[11.5px] font-semibold ring-1 ring-[var(--hairline)] hover:bg-canvas hover:ring-ink focus-visible:ring-2 focus-visible:ring-lime"
                      type="button"
                      onClick={() => setActiveTraceTab('steps')}
                    >
                      Reproduction Steps · {TIMELINE_STEPS.length} steps
                      <svg aria-hidden="true" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </button>
                  </div>

                  {/* Point 4: Steps Panel */}
                  <div
                    aria-labelledby="trace-tab-steps"
                    className={activeTraceTab === 'steps' ? '' : 'hidden'}
                    hidden={activeTraceTab !== 'steps'}
                    id="trace-panel-steps"
                    role="tabpanel"
                    tabIndex={0}
                  >
                    <ol
                      aria-label="Reproduction steps"
                      className={`relative mt-2.5 space-y-0.5 rounded-xl ${prefersReducedMotion ? '' : 'transition-all duration-300'
                        } ${highlightRing(4)}`}
                    >
                      {renderBadge(4, '-left-2 -top-2')}
                      {TIMELINE_STEPS.map((step, idx) => {
                        const isCurrent = idx === stepIndex;
                        const isFail = step.fail;
                        return (
                          <li key={step.label}>
                            <button
                              aria-current={isCurrent ? 'step' : undefined}
                              className={`flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-[5px] text-left text-[11px] focus-visible:ring-2 focus-visible:ring-lime ${isCurrent
                                ? 'bg-canvas ring-1 ring-[var(--hairline-strong)] font-semibold'
                                : 'hover:bg-canvas text-arsenic'
                                }`}
                              type="button"
                              onClick={() => jumpToStep(idx)}
                            >
                              {isFail ? (
                                <svg aria-hidden="true" className="size-3.5 shrink-0 text-signal-red" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <circle cx="12" cy="12" r="10" />
                                  <line x1="15" x2="9" y1="9" y2="15" />
                                  <line x1="9" x2="15" y1="9" y2="15" />
                                </svg>
                              ) : (
                                <svg aria-hidden="true" className="size-3.5 shrink-0 text-lime-ink" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <circle cx="12" cy="12" r="10" />
                                  <polyline points="16 9 10.5 14.5 8 12" />
                                </svg>
                              )}
                              <span className={`flex-1 truncate ${isFail ? 'font-semibold text-signal-red' : ''}`}>
                                {step.label}
                              </span>
                              <span className="font-mono text-[10px] text-graphite">
                                {formatSeconds(step.t)}
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ol>
                  </div>
                </div>
              </div>

              {/* Point 6: Engineering Handoff Bottom Bar */}
              <div
                className={`relative flex flex-wrap items-center gap-2 border-t hairline bg-canvas px-4 py-2.5 sm:px-5 ${prefersReducedMotion ? '' : 'transition-all duration-300'
                  } ${highlightRing(6)}`}
              >
                {renderBadge(6, 'left-2 top-1/2 -translate-y-1/2')}
                <span className="text-[11.5px] font-semibold text-graphite lg:pl-5">
                  Share test evidence to:
                </span>
                {['Jira', 'Slack', 'GitHub', 'Copy link'].map((platform) => (
                  <button
                    key={platform}
                    className="cursor-pointer rounded-full bg-paper px-3 py-1 text-[11.5px] font-semibold ring-1 ring-[var(--hairline-strong)] hover:bg-ink hover:text-canvas focus-visible:ring-2 focus-visible:ring-lime"
                    type="button"
                    onClick={() => handleHandoffDemo(platform)}
                  >
                    {platform}
                  </button>
                ))}
                {sentToast ? (
                  <span
                    className={`ml-auto flex items-center gap-1.5 text-[11.5px] font-medium text-lime-ink ${prefersReducedMotion ? '' : 'rise-in'
                      }`}
                  >
                    <svg aria-hidden="true" className="size-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Demo Simulation: Preview action triggered for {sentToast} (no external export sent).
                  </span>
                ) : (
                  <span className="ml-auto hidden text-[11px] text-graphite md:inline">
                    Demo Simulation · Illustrative Preview
                  </span>
                )}
              </div>

              {/* Dedicated accessible live region (single announcement per user click) */}
              <div aria-live="polite" className="sr-only" role="status">
                {handoffAnnouncement}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
