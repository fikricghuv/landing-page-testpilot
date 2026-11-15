import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { ScaledViewport } from '../../common/ScaledViewport';
import { SimulatedCursor } from '../../common/SimulatedCursor';

const TOTAL_DURATION = 38;

export const CHAPTERS = [
  { key: 'prepare', label: 'Prepare', title: 'Prepare Your Test Scenarios', start: 0, caption: 'Test scenarios are ready. Application context is prepared for automation.' },
  { key: 'generate', label: 'Generate', title: 'Generate Playwright Automation', start: 3.2, caption: 'AI generates automation steps and assertions from your prepared scenario.' },
  { key: 'execute', label: 'Execute', title: 'Execute Regression Scenarios', start: 7.6, caption: 'TestPilot executes the enterprise workspace upgrade scenario in the browser and validates test steps.' },
  { key: 'verify', label: 'Verify', title: 'Validate Expected Results', start: 21.8, caption: 'Each execution step is checked against its expected result.' },
  { key: 'analyze', label: 'Analyze', title: 'Analyze Execution Evidence', start: 25.8, caption: 'Screenshots, videos, and execution logs are collected to help your team investigate unexpected behavior.' },
  { key: 'report', label: 'Report', title: 'Review Test Results', start: 32.0, caption: 'Execution results and supporting evidence are ready for QA review and team collaboration.' }
];

const CURSOR_EVENTS = [
  { at: 7.8, target: 'product-aero', click: 8.7 },
  { at: 9.2, target: 'size-42', click: 10.1 },
  { at: 10.5, target: 'add-to-cart', click: 11.4 },
  { at: 11.9, target: 'cart-icon', click: 12.8 },
  { at: 13.3, target: 'coupon-input', click: 14.2 },
  { at: 15.3, target: 'coupon-apply', click: 16.2 },
  { at: 16.7, target: 'checkout-btn', click: 17.6 },
  { at: 18.1, target: 'card-input', click: 19.0 },
  { at: 20.1, target: 'pay-btn', click: 21.0 },
  { at: 21.3, target: 'processing' }
];

const clamp = (val: number, min: number, max: number) => Math.min(max, Math.max(min, val));

export const HeroDemo: React.FC = () => {
  const [playing, setPlaying] = useState(true);
  const [timeState, setTimeState] = useState({ t: 0, loop: 0 });
  const [ticketPressed, setTicketPressed] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const viewportInnerRef = useRef<HTMLDivElement>(null);
  const lastTickRef = useRef<number>(performance.now());
  const shareTimerRef = useRef<number | null>(null);

  const clearShareState = useCallback(() => {
    setTicketPressed(false);
    setShowShareToast(false);
    if (shareTimerRef.current !== null) {
      window.clearTimeout(shareTimerRef.current);
      shareTimerRef.current = null;
    }
  }, []);

  // Timer loop
  useEffect(() => {
    if (!playing) return;
    lastTickRef.current = performance.now();
    const interval = window.setInterval(() => {
      const now = performance.now();
      const delta = Math.min(0.25, Math.max(0, (now - lastTickRef.current) / 1000));
      lastTickRef.current = now;

      setTimeState((prev) => {
        const nextT = prev.t + delta;
        if (nextT >= TOTAL_DURATION) {
          return { t: 0, loop: prev.loop + 1 };
        }
        return { t: nextT, loop: prev.loop };
      });
    }, 100);

    return () => window.clearInterval(interval);
  }, [playing]);

  useEffect(() => {
    if (timeState.loop > 0) {
      clearShareState();
    }
  }, [timeState.loop, clearShareState]);

  useEffect(() => {
    return () => {
      if (shareTimerRef.current !== null) {
        window.clearTimeout(shareTimerRef.current);
      }
    };
  }, []);

  const t = timeState.t;

  // Chapter index
  const chapterIdx = useMemo(() => {
    let idx = 0;
    CHAPTERS.forEach((ch, i) => {
      if (t >= ch.start) idx = i;
    });
    return idx;
  }, [t]);

  const chapterProgress = useMemo(() => {
    const curStart = CHAPTERS[chapterIdx].start;
    const nextStart = CHAPTERS[chapterIdx + 1]?.start ?? TOTAL_DURATION;
    return clamp((t - curStart) / (nextStart - curStart), 0, 1);
  }, [t, chapterIdx]);

  // Screen & generation overlay state
  const isGeneratingView = t >= 3.2 && t < 7.6;
  const currentScreen =
    t < 9.0
      ? 'home'
      : t < 13.1
      ? 'product'
      : t < 17.9
      ? 'cart'
      : t < 21.3
      ? 'checkout'
      : 'processing';

  // Active cursor target (visible only during Execute and Verify)
  const currentCursor = useMemo(() => {
    const activeEv = [...CURSOR_EVENTS].reverse().find((e) => t >= e.at) ?? null;
    const clickEv = [...CURSOR_EVENTS].reverse().find((e) => e.click !== undefined && t >= e.click) ?? null;
    const isPressed = clickEv && clickEv.click !== undefined && t - clickEv.click < 0.28 ? clickEv.target : null;

    return {
      target: activeEv?.target ?? null,
      clickId: clickEv ? Math.round((clickEv.click ?? 0) * 10) : null,
      visible: t >= 7.6 && t < 25.8,
      pressedTarget: isPressed
    };
  }, [t]);

  // Form typing simulation
  const couponText = 'PILOT20';
  const cardText = '4242 4242 4242 4242';
  const couponCharCount = clamp(Math.floor((t - 14.45) / 0.09), 0, couponText.length);
  const cardCharCount = clamp(Math.floor((t - 19.15) / 0.038), 0, cardText.length);

  const couponTyped = couponText.slice(0, couponCharCount);
  const cardTyped = cardText.slice(0, cardCharCount);
  const couponApplied = t >= 16.35;
  const isFailed = t >= 23.0;
  const isReportCompleted = t >= 34.5;

  // Synchronized status & feedback line across all six chapters
  const stageStatus = t < 3.2
    ? 'Ready'
    : t < 7.6
    ? 'Generating'
    : t < 21.8
    ? 'Running'
    : t < 25.8
    ? 'Verifying'
    : t < 32.0
    ? 'Analyzing'
    : isReportCompleted
    ? 'Completed'
    : 'Reporting';

  const agentStatusBadge = stageStatus;
  const windowStatus = stageStatus;

  const agentLines = [
    'Preparing test scenario and application context...',
    'Generating automation steps from your test scenario...',
    'Executing enterprise workspace upgrade scenario in browser...',
    isFailed
      ? 'Expected confirmation did not match actual state.'
      : 'Checking expected workspace activation state...',
    'Collecting execution evidence for failure analysis...',
    isReportCompleted
      ? 'Test execution completed. Your results are ready.'
      : 'Compiling suite summary and test report...'
  ];
  const currentAgentLine = agentLines[chapterIdx];

  // Synchronized 6-stage workflow breadcrumb: Prepare → Generate → Execute → Verify → Analyze → Report
  const journeyMilestones = useMemo(() => {
    return [
      { name: 'Prepare', active: t < 3.2, done: t >= 3.2 },
      { name: 'Generate', active: t >= 3.2 && t < 7.6, done: t >= 7.6 },
      { name: 'Execute', active: t >= 7.6 && t < 21.8, done: t >= 21.8 },
      { name: 'Verify', active: t >= 21.8 && t < 25.8 && !isFailed, done: false, failed: isFailed },
      { name: 'Analyze', active: t >= 25.8 && t < 32.0, done: t >= 32.0 },
      { name: 'Report', active: t >= 32.0 && !isReportCompleted, done: isReportCompleted }
    ];
  }, [t, isFailed, isReportCompleted]);

  // Elapsed seconds timer (tracks Execute + Verify window from 7.6s to 21.6s)
  const isRecording = t >= 7.6 && t < 25.8;
  const elapsedSec = t < 7.6 ? 0 : Math.min(14, Math.floor(t - 7.6));
  const elapsedStr = `00:${String(elapsedSec).padStart(2, '0')}`;

  // View mode: 'app' or 'trace'
  const isTraceView = t >= 25.8;
  const traceStage = t < 25.8 ? 0 : clamp(Math.floor((t - 25.8) / 0.55) + 1, 0, 9);

  // Toast
  const showIssueToast = t >= 23.3 && t < 26.5;

  useEffect(() => {
    if (!isReportCompleted) {
      clearShareState();
    }
  }, [isReportCompleted, clearShareState]);

  const jumpToChapter = (idx: number) => {
    lastTickRef.current = performance.now();
    clearShareState();
    setTimeState((prev) => ({
      t: CHAPTERS[idx].start,
      loop: prev.loop
    }));
  };

  const handleReplay = () => {
    lastTickRef.current = performance.now();
    clearShareState();
    setTimeState({ t: 0, loop: 0 });
    setPlaying(true);
  };

  const handleShareResults = () => {
    if (!isReportCompleted) return;
    setTicketPressed(true);
    setShowShareToast(true);
    if (shareTimerRef.current !== null) {
      window.clearTimeout(shareTimerRef.current);
    }
    shareTimerRef.current = window.setTimeout(() => {
      setShowShareToast(false);
      shareTimerRef.current = null;
    }, 3500);
  };

  return (
    <div
      ref={containerRef}
      id="demo"
      aria-label="TestPilot testing a checkout journey"
      aria-roledescription="product demonstration"
      className="relative"
      role="region"
    >
      <div className="pattern-dots rounded-[22px] bg-cloud p-1.5 ring-1 ring-[var(--hairline)] sm:rounded-[28px] sm:p-3">
        <div className="relative overflow-hidden rounded-[18px] bg-paper ring-1 ring-[var(--hairline)] shadow-[var(--shadow-window)]">
          {/* Window Header */}
          <div className="flex h-12 items-center gap-3 border-b hairline px-3 sm:px-4">
            <svg aria-hidden="true" className="size-[18px] lg:hidden" viewBox="0 0 220 220">
              <rect width="100" height="100" rx="20" fill="var(--color-sky)" />
            </svg>
            <p className="flex min-w-0 items-center gap-1.5 text-[12px] text-graphite">
              <span className="truncate font-semibold text-ink">TestPilot Workspace</span>
              <span className="hidden text-steel sm:inline">/</span>
              <span className="hidden truncate sm:inline">Enterprise SaaS Regression</span>
              <span className="hidden text-steel sm:inline">/</span>
              <span className="hidden sm:inline">Web Application</span>
            </p>

            <span className={`inline-flex h-[22px] shrink-0 items-center gap-1.5 rounded-md px-2 text-[0.6875rem] font-semibold whitespace-nowrap ml-1 ${
              isFailed && t < 28.4 ? 'bg-signal-red-soft text-signal-red' : windowStatus === 'Completed' ? 'bg-lime-soft text-lime-ink' : 'bg-sky-soft text-sky-ink'
            }`}>
              <span className={`size-1.5 rounded-full ${isFailed && t < 28.4 ? 'bg-signal-red animate-pulse' : windowStatus === 'Completed' ? 'bg-lime-ink' : 'bg-sky animate-pulse-dot'}`} />
              {windowStatus}
            </span>

            <span className="inline-flex h-[20px] items-center rounded bg-cloud px-1.5 text-[10px] font-mono font-medium text-graphite ring-1 ring-[var(--hairline)]">
              Demo Simulation
            </span>

            <div className="ml-auto flex items-center gap-2">
              <span className="hidden items-center gap-1.5 rounded-md bg-canvas px-2 py-1 text-[11px] text-graphite ring-1 ring-[var(--hairline)] md:flex">
                <svg aria-hidden="true" className="size-3" fill="none" height="24" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="24">
                  <rect height="14" rx="2" width="20" x="2" y="3" />
                  <line x1="8" x2="16" y1="21" y2="21" />
                  <line x1="12" x2="12" y1="17" y2="21" />
                </svg>
                Chrome · Desktop
              </span>
              <button
                type="button"
                onClick={() => {
                  lastTickRef.current = performance.now();
                  setPlaying((prev) => !prev);
                }}
                className={`hidden h-7 items-center gap-1.5 rounded-full px-3 text-[11.5px] font-semibold transition-all duration-200 sm:flex ${
                  playing ? 'bg-ink text-canvas' : 'bg-cloud text-graphite'
                }`}
              >
                <svg aria-hidden="true" className="size-3 fill-current" viewBox="0 0 24 24">
                  {playing ? (
                    <>
                      <rect x="6" y="4" width="4" height="16" rx="1" />
                      <rect x="14" y="4" width="4" height="16" rx="1" />
                    </>
                  ) : (
                    <path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z" />
                  )}
                </svg>
                {playing ? 'Pause' : 'Play'}
              </button>
            </div>
          </div>

          {/* Window Body */}
          <div className="grid md:grid-cols-[minmax(0,1fr)_252px] lg:grid-cols-[52px_minmax(0,1fr)_296px]">
            {/* Left Icon Rail */}
            <nav aria-label="Demo Navigation" className="flex w-[52px] flex-col items-center gap-2 border-r hairline bg-canvas/60 py-3 hidden lg:flex">
              <span className="grid size-8 place-items-center rounded-lg bg-sky-soft text-sky-ink" title="Home">
                <svg aria-hidden="true" className="size-[15px]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
                  <path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                </svg>
              </span>
              <span className="grid size-8 place-items-center rounded-lg text-graphite hover:text-ink transition-colors" title="Scenarios">
                <svg aria-hidden="true" className="size-[15px]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M13 5h8M13 12h8M13 19h8M3 17l2 2 4-4M3 7l2 2 4-4" />
                </svg>
              </span>
              <span className="grid size-8 place-items-center rounded-lg text-graphite hover:text-ink transition-colors" title="Results">
                <svg aria-hidden="true" className="size-[15px]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M9 9.003a1 1 0 0 1 1.517-.859l4.997 2.997a1 1 0 0 1 0 1.718l-4.997 2.997A1 1 0 0 1 9 14.996z" />
                  <circle cx="12" cy="12" r="10" />
                </svg>
              </span>
              <span className="relative grid size-8 place-items-center rounded-lg text-graphite" title="Issues">
                <svg aria-hidden="true" className="size-[15px]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
                  <path d="M12 9v4M12 17h.01" />
                </svg>
                {isFailed && <span className="absolute right-1 top-1 size-1.5 rounded-full bg-signal-red" />}
              </span>
            </nav>

            {/* Central Area: Viewport */}
            <div className="min-w-0 flex flex-col">
              {/* Workflow Breadcrumb Bar */}
              <div aria-label="Workflow Progress" className="no-scrollbar flex h-11 items-center gap-1.5 overflow-x-auto border-b hairline px-3 sm:px-4">
                <span className="t-label mr-1 shrink-0 text-space">Workflow</span>
                {journeyMilestones.map((m, i) => (
                  <React.Fragment key={m.name}>
                    {i > 0 && (
                      <span aria-hidden="true" className="relative h-px w-2 bg-smoke sm:w-3">
                        <span
                          className="absolute inset-y-0 left-0 bg-sky transition-[width] duration-500"
                          style={{ width: m.done || m.active || m.failed ? '100%' : '0%' }}
                        />
                      </span>
                    )}
                    <span
                      className={`flex h-6 items-center gap-1 rounded-full px-2.5 text-[11px] font-semibold ring-1 transition-colors duration-300 ${
                        m.failed
                          ? 'bg-signal-red text-white ring-signal-red'
                          : m.active
                          ? 'bg-sky-soft text-sky-ink ring-sky/40'
                          : m.done
                          ? 'bg-paper text-ink ring-[var(--hairline-strong)]'
                          : 'bg-paper text-space ring-[var(--hairline)]'
                      }`}
                    >
                      {m.active && (
                        <svg aria-hidden="true" className="size-3 animate-spin-slow" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                        </svg>
                      )}
                      {m.done && (
                        <svg aria-hidden="true" className="size-3 text-lime-ink" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      )}
                      {m.failed && (
                        <svg aria-hidden="true" className="size-3 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                      )}
                      {m.name}
                    </span>
                  </React.Fragment>
                ))}
              </div>

              {/* Responsive Browser Canvas Container */}
              <div className="relative p-2.5 sm:p-3 flex-1">
                {/* Browser address bar */}
                <div className="flex min-h-0 flex-col overflow-hidden rounded-xl bg-paper ring-1 ring-[var(--hairline)]">
                  <div className="flex h-8 shrink-0 items-center gap-2 border-b hairline bg-canvas px-2.5">
                    <span aria-hidden="true" className="flex gap-1">
                      <span className="size-2 rounded-full bg-smoke" />
                      <span className="size-2 rounded-full bg-smoke" />
                      <span className="size-2 rounded-full bg-smoke" />
                    </span>
                    <span className="flex min-w-0 flex-1 items-center gap-1.5 rounded-md bg-paper px-2 py-[3px] text-[10.5px] text-graphite ring-1 ring-[var(--hairline)]">
                      <svg aria-hidden="true" className="size-2.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <rect height="11" rx="2" ry="2" width="18" x="3" y="11" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                      <span className="truncate font-mono">
                        app.cloudpilot.io/{currentScreen === 'home' ? 'workspaces/plans' : currentScreen === 'product' ? 'workspaces/configure' : currentScreen === 'cart' ? 'billing/summary' : 'billing/checkout'}
                      </span>
                    </span>
                    <span className={`flex items-center gap-1.5 font-mono text-[10px] tabular-nums ${isRecording ? 'text-signal-red' : 'text-graphite'}`}>
                      <span aria-hidden="true" className={`size-1.5 rounded-full ${isRecording ? 'animate-pulse-dot bg-signal-red' : 'bg-smoke'}`} />
                      REC {elapsedStr}
                    </span>
                  </div>

                  {/* Interactive App Screen with Scaling Viewport */}
                  <div className="relative overflow-hidden bg-white">
                    {/* Simulated Toast Notifications */}
                    {showIssueToast && (
                      <div className="rise-in absolute right-3 top-3 z-30 w-[min(300px,calc(100%-24px))] rounded-xl bg-paper p-3 shadow-[var(--shadow-float)] ring-1 ring-[var(--hairline)]">
                        <div className="flex gap-2.5">
                          <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-signal-red-soft text-signal-red">
                            <svg aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
                              <path d="M12 9v4M12 17h.01" />
                            </svg>
                          </span>
                          <div className="min-w-0 text-[12px]">
                            <p className="font-bold text-signal-red">Issue Detected · Demo Simulation</p>
                            <p className="mt-0.5 leading-snug text-graphite">Workspace activation state was not confirmed after payment submission.</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {showShareToast && (
                      <div className="rise-in absolute right-3 top-3 z-30 w-[min(300px,calc(100%-24px))] rounded-xl bg-paper p-3 shadow-[var(--shadow-float)] ring-1 ring-[var(--hairline)]">
                        <div className="flex gap-2.5">
                          <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-lime-soft text-lime-ink">
                            <svg aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path d="M20 6 9 17l-5-5" />
                            </svg>
                          </span>
                          <div className="min-w-0 text-[12px]">
                            <p className="font-bold text-ink">Demo Simulation · Results Shared for Review</p>
                            <p className="mt-0.5 leading-snug text-graphite">Simulated team review preview prepared with video, screenshots, network logs, console logs, and DOM snapshot.</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Scaled App & Cursor Viewport */}
                    <ScaledViewport width={960} height={600} innerRef={viewportInnerRef}>
                      <div className="relative h-[600px] w-[960px] bg-white text-ink overflow-hidden select-none">
                        {/* Mock SaaS App Header */}
                        <header className="flex h-14 items-center justify-between border-b border-[#e2e8f0] px-8 bg-slate-50/50">
                          <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                              <div className="size-6 rounded-md bg-sky flex items-center justify-center text-white text-[11px] font-bold">
                                TP
                              </div>
                              <span className="text-[15px] font-bold tracking-tight text-ink">CloudPilot Platform</span>
                            </div>
                            <span className="text-[12px] font-medium text-graphite hover:text-ink cursor-pointer">Workspaces</span>
                            <span className="text-[12px] font-medium text-graphite hover:text-ink cursor-pointer">Team Members</span>
                            <span className="text-[12px] font-medium text-graphite hover:text-ink cursor-pointer">CI/CD Gate</span>
                            <span className="text-[12px] font-medium text-sky font-semibold cursor-pointer">Billing</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span
                              data-target="cart-icon"
                              className={`relative px-3 py-1.5 rounded-lg border border-[#e2e8f0] bg-white flex items-center gap-2 text-[12px] font-semibold text-ink transition-transform ${
                                currentCursor.pressedTarget === 'cart-icon' ? 'scale-90' : ''
                              }`}
                            >
                              <svg aria-hidden="true" className="size-4 text-graphite" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <rect width="20" height="14" x="2" y="5" rx="2" />
                                <line x1="2" x2="22" y1="10" y2="10" />
                              </svg>
                              <span>Billing Review</span>
                              {t >= 11.65 && (
                                <span className="grid size-4 place-items-center rounded-full bg-sky text-[10px] font-bold text-white animate-scale-in">
                                  1
                                </span>
                              )}
                            </span>
                          </div>
                        </header>

                        {/* Screen 1: Workspace Plans */}
                        {currentScreen === 'home' && (
                          <div className="p-8">
                            <div className="rounded-2xl bg-midnight p-6 text-white flex justify-between items-center relative overflow-hidden">
                              <div>
                                <span className="text-[11px] font-bold uppercase tracking-widest text-sky">Workspace Tier: Starter (Free)</span>
                                <h2 className="text-[24px] font-bold mt-1">Upgrade to Pro Team Workspace</h2>
                                <p className="text-[13px] text-steel">Unlock AI self-healing tests, unlimited team seats, and parallel test executions.</p>
                              </div>
                              <div className="size-24 rounded-full bg-sky/20 blur-2xl absolute -right-6 -bottom-6" />
                            </div>

                            <div className="mt-7">
                              <h3 className="text-[14px] font-bold text-graphite uppercase tracking-wider">Select Subscription Plan</h3>
                              <div className="mt-3 grid grid-cols-3 gap-5">
                                {/* Plan 1 */}
                                <div className="rounded-2xl border border-[#e2e8f0] p-5 opacity-70 bg-slate-50/50">
                                  <span className="text-[12px] font-bold text-graphite">Starter</span>
                                  <p className="text-[24px] font-black text-ink mt-1">$0 <span className="text-[12px] font-normal text-graphite">/ mo</span></p>
                                  <p className="text-[12px] text-graphite mt-2">Up to 2 projects & 50 monthly test runs.</p>
                                  <div className="mt-4 pt-3 border-t border-[#e2e8f0] text-[11px] text-graphite space-y-1.5">
                                    <p>✓ 1 Team Seat</p>
                                    <p>✓ Basic Playwright Export</p>
                                  </div>
                                </div>

                                {/* Plan 2 (Target) */}
                                <div
                                  data-target="product-aero"
                                  className={`rounded-2xl border-2 p-5 transition-all relative ${
                                    currentCursor.pressedTarget === 'product-aero' ? 'scale-[0.97] bg-sky-soft/40' : 'hover:border-sky'
                                  } border-sky bg-white shadow-sm`}
                                >
                                  <span className="absolute -top-3 right-4 rounded-full bg-sky text-white px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase">
                                    Recommended
                                  </span>
                                  <span className="text-[12px] font-bold text-sky">Team Pro</span>
                                  <p className="text-[24px] font-black text-ink mt-1">$49 <span className="text-[12px] font-normal text-graphite">/ seat / mo</span></p>
                                  <p className="text-[12px] text-graphite mt-2">Autonomous AI test generator & self-healing.</p>
                                  <div className="mt-4 pt-3 border-t border-[#e2e8f0] text-[11px] text-ink space-y-1.5">
                                    <p className="font-medium text-sky-ink">✓ Unlimited Test Journeys</p>
                                    <p className="font-medium text-sky-ink">✓ Self-Healing Locators</p>
                                    <p className="font-medium text-sky-ink">✓ 10 Parallel Cloud Runners</p>
                                  </div>
                                </div>

                                {/* Plan 3 */}
                                <div className="rounded-2xl border border-[#e2e8f0] p-5 opacity-70 bg-slate-50/50">
                                  <span className="text-[12px] font-bold text-graphite">Enterprise</span>
                                  <p className="text-[24px] font-black text-ink mt-1">Custom</p>
                                  <p className="text-[12px] text-graphite mt-2">Dedicated single-tenant infrastructure.</p>
                                  <div className="mt-4 pt-3 border-t border-[#e2e8f0] text-[11px] text-graphite space-y-1.5">
                                    <p>✓ Dedicated VPC Runner</p>
                                    <p>✓ 99.99% SLA & Support</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Screen 2: Plan Configuration */}
                        {currentScreen === 'product' && (
                          <div className="p-8 grid grid-cols-2 gap-10 items-center">
                            <div className="rounded-3xl border border-[#e2e8f0] bg-slate-50/70 p-6">
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-soft px-2.5 py-0.5 text-[11px] font-bold text-sky-ink">
                                Selected Tier
                              </span>
                              <h2 className="text-[26px] font-black mt-2">Team Pro Workspace</h2>
                              <p className="text-[13px] text-graphite mt-2">
                                Autonomous QA suite for engineering teams shipping web & API applications.
                              </p>

                              <div className="mt-6 space-y-3">
                                <div className="flex items-center gap-2.5 text-[12px]">
                                  <span className="size-5 rounded-full bg-lime-soft flex items-center justify-center text-lime-ink font-bold">✓</span>
                                  <span>Automated Playwright Script Synthesis</span>
                                </div>
                                <div className="flex items-center gap-2.5 text-[12px]">
                                  <span className="size-5 rounded-full bg-lime-soft flex items-center justify-center text-lime-ink font-bold">✓</span>
                                  <span>Dynamic DOM Mutation Recovery</span>
                                </div>
                                <div className="flex items-center gap-2.5 text-[12px]">
                                  <span className="size-5 rounded-full bg-lime-soft flex items-center justify-center text-lime-ink font-bold">✓</span>
                                  <span>GitHub Actions / GitLab CI Webhook Gate</span>
                                </div>
                              </div>
                            </div>

                            <div>
                              <span className="text-[12px] font-semibold text-sky">Step 2: Configuration</span>
                              <h3 className="text-[20px] font-bold mt-1">Configure Billing Cycle</h3>
                              <p className="text-[13px] text-graphite mt-1">Choose how often your organization is billed.</p>

                              <div className="mt-6">
                                <label className="text-[12px] font-bold text-graphite block">Billing Frequency</label>
                                <div className="mt-2 grid grid-cols-2 gap-3">
                                  <button
                                    type="button"
                                    className="p-3 rounded-xl border border-[#e2e8f0] text-left text-[12px] text-graphite opacity-60"
                                  >
                                    <p className="font-bold text-ink">Monthly</p>
                                    <p>$49 / seat / mo</p>
                                  </button>
                                  <button
                                    type="button"
                                    data-target="size-42"
                                    className={`p-3 rounded-xl border-2 text-left text-[12px] transition-all ${
                                      t >= 10.1
                                        ? 'border-sky bg-sky-soft/40 text-ink shadow-sm'
                                        : 'border-[#e2e8f0] text-ink'
                                    } ${currentCursor.pressedTarget === 'size-42' ? 'scale-95' : ''}`}
                                  >
                                    <div className="flex items-center justify-between">
                                      <p className="font-bold text-sky">Annual (Save 20%)</p>
                                      <span className="text-[9px] bg-lime text-ink px-1.5 py-0.5 rounded font-bold">PROMO</span>
                                    </div>
                                    <p className="text-graphite mt-0.5">$39 / seat / mo (billed yearly)</p>
                                  </button>
                                </div>
                              </div>

                              <div className="mt-8">
                                <button
                                  type="button"
                                  data-target="add-to-cart"
                                  className={`h-12 w-full rounded-xl font-bold text-[14px] flex items-center justify-center gap-2 transition-all ${
                                    t >= 11.4 ? 'bg-lime text-ink' : 'bg-ink text-white'
                                  } ${currentCursor.pressedTarget === 'add-to-cart' ? 'scale-95' : ''}`}
                                >
                                  {t >= 11.4 ? (
                                    <>
                                      <svg aria-hidden="true" className="size-4 text-ink" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                        <path d="M20 6 9 17l-5-5" />
                                      </svg>
                                      Configuration Saved
                                    </>
                                  ) : (
                                    'Continue to Review'
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Screen 3: Billing & Subscription Summary */}
                        {currentScreen === 'cart' && (
                          <div className="p-8 max-w-2xl mx-auto">
                            <h2 className="text-[22px] font-bold">Subscription & Billing Review</h2>
                            <div className="mt-5 rounded-2xl border border-[#e2e8f0] p-4 flex items-center gap-4 bg-slate-50/50">
                              <div className="size-14 rounded-xl bg-sky-soft flex items-center justify-center text-sky font-bold text-[13px]">
                                PRO
                              </div>
                              <div className="flex-1">
                                <p className="font-bold text-[14px]">CloudPilot Pro Team Workspace</p>
                                <p className="text-[12px] text-graphite">5 Team Seats · Annual Billing</p>
                              </div>
                              <p className="font-bold text-[14px]">$195.00 <span className="text-[11px] font-normal text-graphite">/ mo</span></p>
                            </div>

                            {/* Coupon Input */}
                            <div className="mt-6 flex gap-3">
                              <div
                                data-target="coupon-input"
                                className={`flex-1 h-11 px-3.5 rounded-xl border flex items-center font-mono text-[13px] ${
                                  t >= 14.2 && t < 16.3 ? 'border-sky ring-2 ring-sky/20' : 'border-[#e2e8ea]'
                                }`}
                              >
                                {couponTyped ? (
                                  <span>{couponTyped}</span>
                                ) : (
                                  <span className="text-[#a9adbb]">Enter promo code</span>
                                )}
                                {t >= 14.2 && t < 16.3 && <span className="inline-block w-[2px] h-4 bg-ink animate-blink ml-0.5" />}
                              </div>
                              <button
                                type="button"
                                data-target="coupon-apply"
                                className={`px-5 rounded-xl bg-cloud font-semibold text-[13px] transition-transform ${
                                  currentCursor.pressedTarget === 'coupon-apply' ? 'scale-95' : ''
                                }`}
                              >
                                Apply
                              </button>
                            </div>

                            {couponApplied && (
                              <p className="mt-2 text-[12px] font-semibold text-lime-ink flex items-center gap-1.5">
                                <svg aria-hidden="true" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                  <path d="M20 6 9 17l-5-5" />
                                </svg>
                                Voucher PILOT20 applied · 20% discount
                              </p>
                            )}

                            {/* Summary */}
                            <div className="mt-6 border-t border-[#eceef3] pt-4 space-y-2 text-[13px]">
                              <div className="flex justify-between text-graphite">
                                <span>Subtotal</span>
                                <span>$195.00</span>
                              </div>
                              {couponApplied && (
                                <div className="flex justify-between text-lime-ink font-semibold">
                                  <span>Discount (PILOT20)</span>
                                  <span>-$39.00</span>
                                </div>
                              )}
                              <div className="flex justify-between text-[15px] font-bold text-ink pt-2 border-t border-[#eceef3]">
                                <span>Total Due</span>
                                <span>{couponApplied ? '$156.00 / mo' : '$195.00 / mo'}</span>
                              </div>
                            </div>

                            <button
                              type="button"
                              data-target="checkout-btn"
                              className={`mt-6 h-12 w-full rounded-xl bg-ink font-bold text-[14px] text-white transition-transform ${
                                currentCursor.pressedTarget === 'checkout-btn' ? 'scale-95' : ''
                              }`}
                            >
                              Proceed to Payment Details
                            </button>
                          </div>
                        )}

                        {/* Screen 4: Payment Details */}
                        {currentScreen === 'checkout' && (
                          <div className="p-8 max-w-xl mx-auto relative">
                            <h2 className="text-[22px] font-bold">Payment Information</h2>
                            <p className="text-[13px] text-graphite mt-1">Authorize corporate payment method for your workspace.</p>

                            <div className="mt-6 space-y-4">
                              <div>
                                <label className="text-[12px] font-bold text-graphite block">Corporate Credit Card</label>
                                <div
                                  data-target="card-input"
                                  className={`mt-1.5 h-11 px-3.5 rounded-xl border flex items-center font-mono text-[13px] ${
                                    t >= 19.0 && t < 20.8 ? 'border-sky ring-2 ring-sky/20' : 'border-[#e2e8ea]'
                                  }`}
                                >
                                  {cardTyped ? (
                                    <span>{cardTyped}</span>
                                  ) : (
                                    <span className="text-[#a9adbb]">4242 •••• •••• ••••</span>
                                  )}
                                  {t >= 19.0 && t < 20.8 && <span className="inline-block w-[2px] h-4 bg-ink animate-blink ml-0.5" />}
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-[12px] font-bold text-graphite block">Expiry Date</label>
                                  <div className="mt-1.5 h-11 px-3.5 rounded-xl border border-[#e2e8ea] flex items-center font-mono text-[13px] text-ink">
                                    12 / 28
                                  </div>
                                </div>
                                <div>
                                  <label className="text-[12px] font-bold text-graphite block">CVC Security Code</label>
                                  <div className="mt-1.5 h-11 px-3.5 rounded-xl border border-[#e2e8ea] flex items-center font-mono text-[13px] text-ink">
                                    •••
                                  </div>
                                </div>
                              </div>

                              <button
                                type="button"
                                data-target="pay-btn"
                                className={`mt-6 h-12 w-full rounded-xl bg-ink font-bold text-[14px] text-white flex items-center justify-center gap-2 transition-transform ${
                                  currentCursor.pressedTarget === 'pay-btn' ? 'scale-95' : ''
                                }`}
                              >
                                Confirm Subscription · $156.00/mo
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Screen 5: Processing & Verification Modal Overlay */}
                        {currentScreen === 'processing' && (
                          <div
                            data-target="processing"
                            className="absolute inset-0 bg-white/80 backdrop-blur-[2px] flex items-center justify-center p-6 z-10"
                          >
                            <div className={`w-[340px] rounded-2xl bg-paper p-6 text-center ring-1 ${
                              isFailed ? 'ring-2 ring-signal-red shadow-[0_20px_50px_-20px_rgba(239,68,68,0.3)]' : 'ring-[var(--hairline)] shadow-[var(--shadow-float)]'
                            }`}>
                              <div className="grid size-12 mx-auto place-items-center rounded-full bg-cloud">
                                {isFailed ? (
                                  <svg aria-hidden="true" className="size-6 text-signal-red" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" x2="12" y1="8" y2="12" />
                                    <line x1="12" x2="12.01" y1="16" y2="16" />
                                  </svg>
                                ) : (
                                  <svg aria-hidden="true" className="size-6 text-sky animate-spin-slow" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                                  </svg>
                                )}
                              </div>
                              <h4 className="mt-4 font-bold text-[16px]">
                                {isFailed ? 'Activation Pending · Timeout 402' : t >= 21.8 ? 'Verifying Workspace Status…' : 'Authorizing Corporate Card…'}
                              </h4>
                              <p className="mt-1 text-[12px] text-graphite">
                                {isFailed
                                  ? 'Payment authorization webhook timed out past expected 10s threshold.'
                                  : t >= 21.8
                                  ? 'Checking expected active status in enterprise workspace.'
                                  : 'Please wait while subscription verification completes.'}
                              </p>
                            </div>
                          </div>
                        )}

{/* Step 02 Overlay: Automation Generation */}
                        {isGeneratingView && (
                          <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] flex items-center justify-center p-6 z-10 rise-in">
                            <div className="w-[420px] rounded-2xl bg-paper p-6 ring-1 ring-[var(--hairline)] shadow-[var(--shadow-float)]">
                              <div className="flex items-center gap-3">
                                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-sky-soft text-sky-ink">
                                  <svg aria-hidden="true" className="size-4 animate-spin-slow" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                                  </svg>
                                </span>
                                <div>
                                  <p className="text-[11px] font-mono uppercase tracking-wider text-sky-ink font-semibold">Generating Automation</p>
                                  <h4 className="text-[15px] font-bold text-ink">Enterprise Workspace Upgrade Scenario</h4>
                                </div>
                              </div>
                              <ul className="mt-4 space-y-2 text-[12px]">
                                {[
                                  { at: 3.4, text: 'Open NovaDesk & select "Team Pro" workspace' },
                                  { at: 4.3, text: 'Configure Annual billing tier & 5 team seats' },
                                  { at: 5.2, text: 'Apply voucher code PILOT20 & verify invoice' },
                                  { at: 6.1, text: 'Submit corporate card & assert activation state' }
                                ].map((step) => {
                                  const ready = t >= step.at;
                                  return (
                                    <li
                                      key={step.text}
                                      className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 transition-all duration-300 ${
                                        ready ? 'border-[var(--hairline)] bg-canvas text-ink' : 'border-transparent bg-paper text-steel opacity-50'
                                      }`}
                                    >
                                      <span className={`text-[11px] font-bold ${ready ? 'text-lime-ink' : 'text-steel'}`}>
                                        {ready ? '✓' : '•'}
                                      </span>
                                      <span className="font-medium">{step.text}</span>
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          </div>
                        )}

                        {/* Interactive Cursor */}
                        <SimulatedCursor
                          container={viewportInnerRef}
                          target={currentCursor.target}
                          clickId={currentCursor.clickId}
                          visible={currentCursor.visible}
                          width={960}
                          height={600}
                          label="TestPilot"
                          durationMs={700}
                        />
                      </div>
                    </ScaledViewport>

                    {/* Staged Trace Overlay (Transition when Chapter 5 Analyze starts) */}
                    {isTraceView && (
                      <div className="absolute inset-0 z-20 bg-paper p-4 overflow-y-auto rise-in">
                        <div className="flex items-center justify-between border-b hairline pb-3">
                          <div className="flex items-center gap-2">
                            <span className="rounded-md bg-signal-red-soft px-2 py-0.5 text-[11px] font-bold text-signal-red">
                              Issue Detected
                            </span>
                            <span className="font-mono text-[11px] text-graphite">TR-1042</span>
                            <span className="text-[12px] text-graphite">· Checkout Scenario (Suite 1/8) · Step 9/12</span>
                            <span className="rounded bg-cloud px-1.5 py-0.5 text-[10px] font-mono text-graphite">Demo Simulation</span>
                          </div>
                          <span className="text-[11px] font-mono text-graphite">00:00:14</span>
                        </div>

                        <h3 className="text-[17px] font-bold mt-2">
                          Workspace activation state was not confirmed after payment submission.
                        </h3>

                        <div className="mt-4 grid md:grid-cols-2 gap-4">
                          {/* Evidence list */}
                          <div className="space-y-3">
                            <p className="t-label text-space">Evidence Collected</p>
                            <div className="grid grid-cols-3 gap-2">
                              {['Execution Video', 'Screenshots', 'Network Logs', 'Console Logs', 'DOM Snapshot'].map((ev) => (
                                <div key={ev} className="rounded-lg bg-canvas p-2 text-[11px] font-semibold border hairline">
                                  {ev}
                                </div>
                              ))}
                            </div>

                            {traceStage >= 4 && (
                              <div className="mt-3 rounded-xl border border-signal-red/30 bg-signal-red-soft p-3 text-[12px]">
                                <p className="font-bold text-signal-red">Simulated Network Log · POST /api/v1/billing/subscriptions · 402</p>
                                <p className="mt-1 text-arsenic font-mono text-[11px]">
                                  payment_authorization_timeout: Gateway timeout while activating subscription token
                                </p>
                                <p className="mt-1.5 text-[11.5px] leading-snug text-graphite">
                                  The simulated payment gateway timed out on the authorization webhook, causing workspace activation to stall in pending state.
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Expected vs Actual */}
                          <div className="space-y-3">
                            <p className="t-label text-space">Verification Analysis</p>
                            <div className="rounded-lg bg-canvas p-2.5 text-[12px] border hairline">
                              <span className="font-bold text-ink block">Expected:</span>
                              <span className="text-graphite">Subscription authorizes for $156.00/mo and workspace status updates to \"Active Pro\".</span>
                            </div>
                            <div className="rounded-lg bg-signal-red-soft p-2.5 text-[12px] border border-signal-red/20">
                              <span className="font-bold text-signal-red block">Actual:</span>
                              <span className="text-arsenic">The simulated 402 gateway timeout stalled activation, leaving the workspace in a pending state without displaying the success banner.</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar: Autonomous Agent Activity & Results */}
            <aside aria-label="Aktivitas Test Agent" className="flex min-h-0 flex-col border-t hairline md:h-0 md:min-h-full md:border-l md:border-t-0">
              {/* Agent Status Console Card */}
              <div className="flex items-center gap-3 p-3 md:block">
                <div className="relative w-[96px] shrink-0 overflow-hidden rounded-xl md:w-full">
                  <div className={`aspect-square md:aspect-[5/3] relative flex flex-col items-center justify-center rounded-xl p-3 text-center transition-colors duration-300 ring-1 ring-[var(--hairline)] ${
                    isFailed ? 'bg-signal-red-soft/40 ring-signal-red/30' : 'bg-midnight text-canvas'
                  }`}>
                    {/* Center Icon */}
                    <div className={`relative flex size-10 items-center justify-center rounded-xl font-mono text-sm font-bold shadow-sm ${
                      isFailed ? 'bg-signal-red text-white' : 'bg-paper/10 text-sky ring-1 ring-white/15'
                    }`}>
                      {isFailed ? (
                        <svg className="size-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      ) : (
                        <svg className="size-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="9" />
                          <circle cx="12" cy="12" r="3" className="fill-sky" />
                          <path strokeLinecap="round" d="M12 3v3M12 18v3M3 12h3M18 12h3" />
                        </svg>
                      )}
                    </div>
                    
                    <span className="relative mt-2 hidden text-[10px] font-mono tracking-wider uppercase text-graphite md:block">
                      {isFailed && t < 28.4 ? 'ISSUE DETECTED' : isReportCompleted ? '1 ISSUE IN SUITE' : 'TEST EXECUTION ACTIVE'}
                    </span>
                  </div>
                  
                  <span className="absolute bottom-2 left-2 hidden md:block">
                    <span className={`inline-flex h-[20px] items-center gap-1 rounded px-1.5 text-[10px] font-semibold ${
                      isFailed && t < 28.4 ? 'bg-signal-red text-white' : windowStatus === 'Completed' ? 'bg-lime-soft text-lime-ink' : 'bg-sky-soft text-sky-ink'
                    }`}>
                      <span className={`size-1.5 rounded-full ${isFailed && t < 28.4 ? 'bg-white' : windowStatus === 'Completed' ? 'bg-lime-ink' : 'bg-sky animate-pulse-dot'}`} />
                      {agentStatusBadge}
                    </span>
                  </span>
                </div>

                <div className="min-w-0 md:mt-3">
                  <p className="flex items-center gap-1.5 text-[12px] font-bold">
                    TestPilot
                    <span className="font-normal text-graphite">· QA Workspace</span>
                  </p>
                  <p className="rise-in mt-0.5 text-[12px] leading-snug text-arsenic">
                    {currentAgentLine}
                  </p>
                </div>
              </div>

              {/* Sidebar Content: Log or Results */}
              {chapterIdx < 5 ? (
                <div className="relative flex min-h-0 flex-1 flex-col justify-end overflow-hidden px-3 pb-3 md:[mask-image:linear-gradient(to_bottom,transparent,black_48px)]">
                  <ol aria-label="Test Execution Logs" className="relative space-y-1">
                    <li className="rise-in rounded-lg px-2 py-1.5 bg-canvas text-[11.5px]">
                      <div className="flex gap-2">
                        <span className="text-lime-ink font-bold">✓</span>
                        <div>
                          <span className="font-semibold block">Checkout scenario prepared</span>
                        app.cloudpilot.io/{currentScreen === 'home' ? 'workspaces/plans' : currentScreen === 'product' ? 'workspaces/configure' : currentScreen === 'cart' ? 'billing/summary' : 'billing/checkout'}
                        </div>
                      </div>
                      <span className="mt-1.5 block pl-4 text-[10px] text-space">
                        Choose any starting option:
                      </span>
                      <div className="mt-1 flex flex-wrap items-center gap-1 pl-4">
                        {['Excel / CSV Import', 'AI Discovery', 'Manual Recording'].map((src, i) => (
                          <React.Fragment key={src}>
                            {i > 0 && <span className="text-[9.5px] text-space">or</span>}
                            <span
                              className={`rounded px-1.5 py-0.5 text-[9.5px] font-medium ring-1 ring-[var(--hairline)] ${
                                src === 'AI Discovery' ? 'bg-sky-soft text-sky-ink font-semibold' : 'bg-paper text-graphite'
                              }`}
                            >
                              {src}
                            </span>
                          </React.Fragment>
                        ))}
                      </div>
                    </li>
                    {t >= 3.6 && (
                      <li className="rise-in flex gap-2 rounded-lg px-2 py-1 bg-canvas text-[11.5px]">
                        <span className="text-lime-ink font-bold">✓</span>
                        <span className="font-semibold">Generated 4 workspace upgrade test steps</span>
                      </li>
                    )}
                    {t >= 5.6 && (
                      <li className="rise-in flex gap-2 rounded-lg px-2 py-1 bg-canvas text-[11.5px]">
                        <span className="text-lime-ink font-bold">✓</span>
                        <span className="font-semibold">DOM selectors &amp; activation assertion mapped</span>
                      </li>
                    )}
                    {t >= 8.7 && (
                      <li className="rise-in flex gap-2 rounded-lg px-2 py-1 bg-canvas text-[11.5px]">
                        <span className="text-lime-ink font-bold">✓</span>
                        <span className="font-semibold">Selected plan &quot;Team Pro&quot;</span>
                      </li>
                    )}
                    {t >= 10.1 && (
                      <li className="rise-in flex gap-2 rounded-lg px-2 py-1 bg-canvas text-[11.5px]">
                        <span className="text-lime-ink font-bold">✓</span>
                        <span className="font-semibold">Configured Annual billing tier</span>
                      </li>
                    )}
                    {t >= 21.0 && (
                      <li className="rise-in flex gap-2 rounded-lg px-2 py-1 bg-canvas text-[11.5px]">
                        <span className="text-lime-ink font-bold">✓</span>
                        <span className="font-semibold">Applied discount voucher PILOT20 (−$39.00)</span>
                      </li>
                    )}
                    {t >= 21.0 && (
                      <li className="rise-in flex gap-2 rounded-lg px-2 py-1 bg-canvas text-[11.5px]">
                        <span className="text-lime-ink font-bold">✓</span>
                        <span className="font-semibold">Submitted corporate card authorization</span>
                      </li>
                    )}
                    {isFailed && (
                      <li className="rise-in flex gap-2 rounded-lg px-2 py-1 bg-signal-red-soft text-[11.5px]">
                        <span className="text-signal-red font-bold">✕</span>
                        <div>
                          <span className="font-semibold text-signal-red block">Confirmation verification failed</span>
                          <span className="text-arsenic block">Gateway timeout 402 left status in pending</span>
                        </div>
                      </li>
                    )}
                  </ol>
                </div>
              ) : (
                /* Chapter 6: Final Results & Team Review Action */
                <div className="rise-in space-y-2.5 p-3">
                  <div className="rounded-xl bg-canvas p-3 ring-1 ring-[var(--hairline)]">
                    <div className="flex items-center justify-between">
                      <p className="t-label text-space">Suite Summary</p>
                      <span className="text-[10px] font-mono text-graphite">Demo Simulation</span>
                    </div>
                    <p className="mt-1 text-[11px] font-medium text-ink">Enterprise SaaS Regression Suite</p>
                    <p className="text-[10.5px] font-mono text-graphite">Simulated suite runtime: 2m 18s</p>
                    <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                      <div className="rounded-lg bg-paper py-1.5 ring-1 ring-[var(--hairline)]">
                        <p className="text-[15px] font-bold">8</p>
                        <p className="text-[10px] text-graphite">Scenarios</p>
                      </div>
                      <div className="rounded-lg bg-paper py-1.5 ring-1 ring-[var(--hairline)]">
                        <p className="text-[15px] font-bold text-lime-ink">7</p>
                        <p className="text-[10px] text-graphite">Passed</p>
                      </div>
                      <div className="rounded-lg bg-paper py-1.5 ring-1 ring-[var(--hairline)]">
                        <p className="text-[15px] font-bold text-signal-red">1</p>
                        <p className="text-[10px] text-graphite">Failed</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl p-3 ring-1 ring-signal-red/30 bg-paper">
                    <div className="flex items-center justify-between gap-2">
                      <span className="rounded bg-signal-red-soft px-1.5 py-0.5 text-[10px] font-bold text-signal-red">1 Issue · Checkout</span>
                      <span className="font-mono text-[10px] text-graphite">
                        {isReportCompleted ? 'Ready for Team Review' : 'Compiling Report'}
                      </span>
                    </div>
                    <p className="mt-1.5 text-[12px] font-semibold leading-snug">
                      Workspace activation state was not confirmed after payment submission.
                    </p>
                    <div className="mt-2.5 flex gap-1.5">
                      <button
                        type="button"
                        disabled={!isReportCompleted}
                        onClick={handleShareResults}
                        className={`flex h-7 flex-1 items-center justify-center gap-1 rounded-full text-[11px] font-semibold transition-all duration-200 ${
                          !isReportCompleted
                            ? 'bg-cloud text-space cursor-not-allowed opacity-80'
                            : ticketPressed
                            ? 'bg-lime text-ink cursor-pointer'
                            : 'bg-ink text-canvas cursor-pointer'
                        }`}
                      >
                        {!isReportCompleted
                          ? 'Preparing Results...'
                          : ticketPressed
                          ? '✓ Shared (Demo Simulation)'
                          : 'Share Test Results'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </div>

      {/* Chapters Scrubbing Navigation & Controls */}
      <div className="mt-3 flex flex-col gap-3 sm:mt-4 lg:flex-row lg:items-center lg:gap-5">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              lastTickRef.current = performance.now();
              setPlaying((prev) => !prev);
            }}
            aria-label={playing ? 'Pause demo' : 'Play demo'}
            className="grid size-9 shrink-0 place-items-center rounded-full bg-paper text-ink ring-1 ring-[var(--hairline-strong)] transition-colors hover:bg-ink hover:text-canvas"
          >
            <svg aria-hidden="true" className="size-4 fill-current" viewBox="0 0 24 24">
              {playing ? (
                <>
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </>
              ) : (
                <path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z" />
              )}
            </svg>
          </button>
          <button
            type="button"
            onClick={handleReplay}
            aria-label="Replay from start"
            className="grid size-9 shrink-0 place-items-center rounded-full bg-paper text-ink ring-1 ring-[var(--hairline-strong)] transition-colors hover:bg-ink hover:text-canvas"
          >
            <svg aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
          </button>
        </div>

        {/* Chapters timeline bar */}
        <ol aria-label="Workflow Steps" className="grid flex-1 grid-cols-6 gap-1.5">
          {CHAPTERS.map((ch, idx) => {
            const fillWidth = idx < chapterIdx ? 100 : idx === chapterIdx ? chapterProgress * 100 : 0;
            return (
              <li key={ch.key}>
                <button
                  type="button"
                  onClick={() => jumpToChapter(idx)}
                  className="group block w-full text-left cursor-pointer"
                  aria-label={`Jump to step ${idx + 1}: ${ch.title}`}
                >
                  <span className="block h-[3px] overflow-hidden rounded-full bg-smoke">
                    <span
                      className="block h-full rounded-full bg-ink transition-[width] duration-100 ease-linear"
                      style={{ width: `${fillWidth}%` }}
                    />
                  </span>
                  <span
                    className={`mt-1.5 flex gap-1 font-mono text-[10px] uppercase tracking-wider ${
                      idx === chapterIdx ? 'text-ink font-bold' : 'text-space group-hover:text-graphite'
                    }`}
                  >
                    <span className="hidden xl:inline">0{idx + 1}</span>
                    {ch.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        <p aria-live="off" className="hidden min-h-[2.6em] max-w-[34ch] text-[12.5px] leading-snug text-graphite lg:block">
          {chapterIdx === 5 && !isReportCompleted
            ? 'Compiling suite summary and execution evidence for QA review...'
            : CHAPTERS[chapterIdx].caption}
        </p>
      </div>
    </div>
  );
};

