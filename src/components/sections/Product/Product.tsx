import React, { useEffect, useRef, useState } from 'react';
import { CapabilityVisual, type CapabilityId } from './ProductVisuals';
import { useScrollReveal } from '../../../hooks/useScrollReveal';

interface CapabilityTab {
  id: CapabilityId;
  num: string;
  name: string;
  title: string;
  description: string;
  panelHeading: string;
  panelSubtitle: string;
  badge: string;
  features: string[];
}

const CAPABILITIES: CapabilityTab[] = [
  {
    id: 'discovery',
    num: '01',
    name: 'AI Discovery',
    title: 'Discover Application Flows with AI.',
    description:
      'Biarkan AI membantu memahami struktur halaman, mengidentifikasi elemen antarmuka, dan mengeksplorasi kemungkinan alur pengguna sebagai dasar pengujian.',
    panelHeading: 'Application Discovery',
    panelSubtitle: 'Explore application structure and identify candidate testing journeys.',
    badge: 'Example Exploration',
    features: ['Page Exploration', 'UI Element Discovery', 'User Journey Mapping', 'Application Context'],
  },
  {
    id: 'recorder',
    num: '02',
    name: 'Manual Web Recording',
    title: 'Record the Flows That Matter.',
    description:
      'Tidak semua alur bisnis mudah ditemukan secara otomatis. Gunakan browser interaktif untuk melakukan klik, mengisi formulir, dan merekam langkah pengujian secara langsung.',
    panelHeading: 'Interactive Web Recorder',
    panelSubtitle: 'QA engineers control browser interactions while TestPilot captures reusable steps.',
    badge: 'QA Browser Session',
    features: ['Live Browser Interaction', 'Click & Input Recording', 'Locator Capture', 'Reusable Test Steps'],
  },
  {
    id: 'generation',
    num: '03',
    name: 'AI Test Generation',
    title: 'From Test Cases to Reviewable Scripts.',
    description:
      'Ubah skenario pengujian dari Excel atau CSV menjadi skrip automation dengan bantuan AI. Tim QA tetap dapat meninjau, mengedit selector, dan menyesuaikan asersi sebelum dijalankan.',
    panelHeading: 'AI Test Generation',
    panelSubtitle: 'Turn test scenarios and app context into reviewable automation scripts.',
    badge: 'Reviewable Script',
    features: ['Excel & CSV Import', 'Scenario Mapping', 'Playwright TypeScript', 'Parameterized Test Data'],
  },
  {
    id: 'healing',
    num: '04',
    name: 'AI-Assisted Healing',
    title: 'Investigate Locator Changes with AI Assistance.',
    description:
      'Ketika perubahan antarmuka menyebabkan locator gagal, TestPilot membantu menginvestigasi konteks DOM, menemukan kandidat locator alternatif, dan memvalidasi kandidat untuk ditinjau tim QA.',
    panelHeading: 'AI-Assisted Locator Recovery',
    panelSubtitle: 'Analyze failed locators, inspect DOM context, and review candidate alternatives.',
    badge: 'Needs QA Review',
    features: ['Failure Investigation', 'DOM Context Inspection', 'Candidate Locators', 'Reviewable Suggestions'],
  },
  {
    id: 'api-perf',
    num: '05',
    name: 'API & Performance Testing',
    title: 'Go Beyond UI Testing.',
    description:
      'Lengkapi pengujian aplikasi dengan API validation dan performance testing. Evaluasi perilaku endpoint serta respons aplikasi ketika menerima beban pengujian.',
    panelHeading: 'API & Performance Testing',
    panelSubtitle: 'Validate endpoint responses and inspect illustrative latency metrics under load.',
    badge: 'Illustrative Metrics',
    features: ['API Request Validation', 'Response Assertions', 'Virtual Users', 'Latency p95 (Sample)'],
  },
  {
    id: 'execution-reporting',
    num: '06',
    name: 'Test Execution & Reporting',
    title: 'Every Execution. Every Detail. One Place.',
    description:
      'Pantau proses pengujian dan pahami hasilnya melalui laporan, log, screenshot, serta video. Semua bukti membantu tim QA dan developer melakukan investigasi dengan lebih terarah.',
    panelHeading: 'Test Execution & Evidence',
    panelSubtitle: 'Connect run verdicts directly with logs, screenshots, video, and exportable reports.',
    badge: 'Execution Evidence',
    features: ['Run Summary', 'Execution Logs', 'Screenshots & Video', 'Exportable Reports'],
  },
  {
    id: 'collaboration',
    num: '07',
    name: 'Team Collaboration & Integrations',
    title: 'Keep Your QA Team Connected.',
    description:
      'Hubungkan workflow pengujian dengan tools yang sudah digunakan tim. Bagikan informasi hasil pengujian dan koordinasikan tindak lanjut melalui integrasi yang tersedia.',
    panelHeading: 'Example Team Integrations',
    panelSubtitle: "Illustrative preview of sharing findings across Jira, Slack, and spreadsheets.",
    badge: 'Example Integration',
    features: ['Jira Issue Sync', 'Slack Notifications', 'Excel & CSV Test Data', 'Shared Triage Context'],
  },
];

const SIDEBAR_GROUPS = [
  { label: 'Eksplorasi App', matches: (tab: number) => tab === 0 },
  { label: 'Recorder & Skenario', matches: (tab: number) => tab === 1 || tab === 2 },
  { label: 'Locator Recovery', matches: (tab: number) => tab === 3 },
  { label: 'API & Performance', matches: (tab: number) => tab === 4 },
  { label: 'Eksekusi & Laporan', matches: (tab: number) => tab === 5 },
  { label: 'Integrasi Tim', matches: (tab: number) => tab === 6 },
];

export const Product: React.FC = () => {
  const { ref: headerRef, isRevealed: headerRevealed } = useScrollReveal<HTMLElement>();
  const [activeTab, setActiveTab] = useState(0);
  const [isPointerInside, setIsPointerInside] = useState(false);
  const [isFocusInside, setIsFocusInside] = useState(false);
  const [rotationResetKey, setRotationResetKey] = useState(0);
  const [panelStep] = useState(3);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isDesktopLg, setIsDesktopLg] = useState(true);

  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const activeCapability = CAPABILITIES[activeTab];

  // Track reduced-motion preference and lg breakpoint cleanly
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const desktopQuery = window.matchMedia('(min-width: 1024px)');

    setPrefersReducedMotion(motionQuery.matches);
    setIsDesktopLg(desktopQuery.matches);

    const onMotionChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    const onDesktopChange = (e: MediaQueryListEvent) => setIsDesktopLg(e.matches);

    motionQuery.addEventListener('change', onMotionChange);
    desktopQuery.addEventListener('change', onDesktopChange);
    return () => {
      motionQuery.removeEventListener('change', onMotionChange);
      desktopQuery.removeEventListener('change', onDesktopChange);
    };
  }, []);


  const selectTab = (index: number, moveFocus = false) => {
    setActiveTab(index);
    setRotationResetKey((prev) => prev + 1);
    if (moveFocus) {
      tabRefs.current[index]?.focus();
    }
  };

  const handleTabKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    const count = CAPABILITIES.length;
    let nextIndex: number | null = null;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      nextIndex = (index + 1) % count;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      nextIndex = (index - 1 + count) % count;
    } else if (e.key === 'Home') {
      nextIndex = 0;
    } else if (e.key === 'End') {
      nextIndex = count - 1;
    }

    if (nextIndex !== null) {
      e.preventDefault();
      selectTab(nextIndex, true);
    }
  };

  const autoRotationActive = isDesktopLg && !prefersReducedMotion;
  const isPaused = !autoRotationActive || isPointerInside || isFocusInside;

  return (
    <section aria-labelledby="product-title" className="pb-24 pt-14 sm:pb-32 sm:pt-20 lg:pb-36 lg:pt-24" id="product">
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-12">
        {/* Header */}
        <header ref={headerRef} className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="t-label scroll-reveal flex items-center gap-2.5 text-graphite" data-revealed={headerRevealed}>
              <svg aria-hidden="true" className="size-3 shrink-0" viewBox="0 0 12 12">
                <rect fill="var(--color-sky)" height="6" opacity="1" rx="1.6" width="6" x="0" y="0" />
                <rect fill="var(--color-sky)" height="6" opacity="0.55" rx="1.6" width="6" x="6" y="6" />
              </svg>
              <span className="text-ink">03</span>
              <span aria-hidden="true" className="h-px w-6 bg-current opacity-40"></span>
              <span>PLATFORM CAPABILITIES</span>
            </p>
            <h2
              className="t-h2 scroll-reveal mt-5 max-w-[24ch] text-ink"
              data-revealed={headerRevealed}
              id="product-title"
              style={{ transitionDelay: '60ms' }}
            >
              Everything Your QA Team Needs in One Workspace.
            </h2>
          </div>
          <div className="flex flex-col gap-5 lg:col-span-4 lg:pb-2">
            <p
              className="t-lede scroll-reveal max-w-[46ch] text-graphite"
              data-revealed={headerRevealed}
              style={{ transitionDelay: '120ms' }}
            >
              Dari eksplorasi aplikasi hingga laporan pengujian, TestPilot membantu menyederhanakan aktivitas QA dengan workflow yang saling terhubung.
            </p>
          </div>
        </header>

        {/* Tab & Interactive Panel Grid */}
        <div
          onPointerEnter={() => setIsPointerInside(true)}
          onPointerLeave={() => setIsPointerInside(false)}
          onFocusCapture={() => setIsFocusInside(true)}
          onBlurCapture={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
              setIsFocusInside(false);
            }
          }}
          className="mt-14 grid gap-6 lg:mt-20 lg:grid-cols-12 lg:gap-10"
        >
          {/* Capability Navigation Rail */}
          <div className="min-w-0 lg:col-span-4">
            <div
              aria-label="Kemampuan Platform"
              aria-orientation={isDesktopLg ? 'vertical' : 'horizontal'}
              className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0"
              role="tablist"
            >
              {CAPABILITIES.map((cap, index) => {
                const isActive = index === activeTab;
                return (
                  <button
                    key={cap.id}
                    ref={(el) => {
                      tabRefs.current[index] = el;
                    }}
                    aria-controls={`cap-panel-${cap.id}`}
                    aria-selected={isActive}
                    id={`cap-tab-${cap.id}`}
                    onClick={() => selectTab(index, false)}
                    onKeyDown={(e) => handleTabKeyDown(e, index)}
                    role="tab"
                    tabIndex={isActive ? 0 : -1}
                    type="button"
                    className={`group relative shrink-0 rounded-full px-4 py-2.5 text-left transition-colors focus-visible:ring-2 focus-visible:ring-lime lg:rounded-none lg:border-t lg:px-0 lg:py-5 ${isActive
                        ? 'bg-ink text-canvas lg:bg-transparent lg:text-ink'
                        : 'bg-paper text-arsenic ring-1 ring-[var(--hairline)] lg:bg-transparent lg:ring-0 hover:text-ink'
                      } lg:border-[var(--hairline-strong)] cursor-pointer`}
                  >
                    {/* Desktop Auto-Progress Bar (disabled on mobile & reduced motion) */}
                    {isActive && autoRotationActive && (
                      <span className="absolute inset-x-0 -top-px hidden h-[2px] overflow-hidden lg:block" aria-hidden="true">
                        <span
                          key={`${activeTab}-${rotationResetKey}`}
                          className="block h-full origin-left bg-sky"
                          style={{
                            animation: 'cap-progress 5s linear both',
                            animationPlayState: isPaused ? 'paused' : 'running',
                          }}
                          onAnimationEnd={() => {
                            setActiveTab((prev) => (prev + 1) % CAPABILITIES.length);
                          }}
                        />
                      </span>
                    )}

                    <span className="flex items-center gap-3">
                      <span className={`size-2 rounded-full shrink-0 ${isActive ? 'bg-sky' : 'bg-smoke group-hover:bg-graphite'}`} />
                      <span className="whitespace-nowrap text-[14px] font-semibold lg:text-[17px] lg:tracking-tight">
                        {cap.name}
                      </span>
                      <span className="ml-auto hidden font-mono text-[10px] text-space lg:inline">
                        {cap.num}
                      </span>
                    </span>

                    {/* Desktop Accordion Description */}
                    <div
                      className={`hidden overflow-hidden pl-5 lg:block ${prefersReducedMotion ? '' : 'transition-all duration-300 ease-out'
                        } ${isActive
                          ? 'max-h-20 opacity-100 mt-2.5'
                          : 'max-h-0 opacity-0 mt-0 pointer-events-none'
                        }`}
                    >
                      <p className="text-[14px] leading-relaxed text-graphite font-normal">
                        {cap.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Subtle Desktop Auto-Cycle Status */}
            {autoRotationActive && (
              <div className="mt-3 hidden items-center justify-between border-t hairline pt-3 lg:flex">
                {/* <span className="font-mono text-[10.5px] text-graphite">
                  {isPointerInside || isFocusInside
                    ? 'Auto-preview paused while reading'
                    : 'Auto-preview active (5s per capability)'}
                </span> */}
              </div>
            )}

            {/* Mobile Dynamic Description Box */}
            <div className="mt-4 rounded-xl bg-paper p-3 ring-1 ring-[var(--hairline)] shadow-sm lg:hidden">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="font-mono text-[10px] font-bold text-sky-ink bg-sky-soft px-1.5 py-0.5 rounded">
                  {activeCapability.num}
                </span>
                <span className="text-[13px] font-bold text-ink">
                  {activeCapability.name}
                </span>
              </div>
              <p className="text-[13px] leading-relaxed text-graphite">
                {activeCapability.description}
              </p>
            </div>
          </div>

          {/* Interactive Right Dashboard Panel */}
          <div className="min-w-0 lg:col-span-8">
            <div
              aria-labelledby={`cap-tab-${activeCapability.id}`}
              className="pattern-dots min-w-0 rounded-[24px] bg-cloud p-2 ring-1 ring-[var(--hairline)] sm:p-3"
              id={`cap-panel-${activeCapability.id}`}
              role="tabpanel"
              tabIndex={0}
            >
              <div style={{ minHeight: isDesktopLg ? '530px' : undefined }}>
                <div className="relative flex h-full overflow-hidden rounded-[18px] bg-paper ring-1 ring-[var(--hairline)] shadow-[var(--shadow-window)]" style={{ minHeight: isDesktopLg ? '530px' : undefined }}>
                  {/* Internal App Navigation (Mock) */}
                  <nav aria-label="Navigasi Pusat Kendali" className="hidden w-[188px] shrink-0 flex-col border-r hairline bg-paper px-3 py-3 text-[12px] xl:flex">
                    <div className="mb-3 flex items-center gap-2 px-1.5">
                      <span className="size-4 rounded bg-sky" />
                      <span className="font-semibold tracking-tight text-ink">
                        TestPilot
                      </span>
                    </div>
                    <div className="mb-3 flex items-center gap-2 rounded-lg px-1.5 py-1">
                      <span className="grid size-6 place-items-center rounded-md bg-ink text-[10px] font-bold text-canvas">
                        A
                      </span>
                      <span className="leading-tight">
                        <span className="block font-semibold text-ink">
                          Acme Commerce
                        </span>
                        <span className="block text-[10px] text-graphite">
                          Illustrative App
                        </span>
                      </span>
                    </div>
                    <div className="mb-2">
                      <p className="px-1.5 pb-1 pt-2 text-[10px] font-medium uppercase tracking-wider text-space">
                        Workspace
                      </p>
                      {SIDEBAR_GROUPS.map((item) => {
                        const active = item.matches(activeTab);
                        return (
                          <span
                            key={item.label}
                            className={`flex items-center gap-2 rounded-md px-1.5 py-[5px] ${active ? 'bg-sky-soft text-sky-ink font-semibold' : 'text-arsenic'
                              }`}
                          >
                            <span className="truncate">{item.label}</span>
                          </span>
                        );
                      })}
                    </div>
                  </nav>

                  {/* Dashboard Main Area */}
                  <div className="flex min-w-0 flex-1 flex-col">
                    {/* Top Header of the Internal Window */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b hairline px-4 py-3 sm:px-5">
                      <div className="min-w-0">
                        <p className="text-[15px] font-bold tracking-tight text-ink">
                          {activeCapability.panelHeading}
                        </p>
                        <p className="mt-0.5 text-[11.5px] text-graphite">
                          {activeCapability.panelSubtitle}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-1.5">
                        <span className="inline-flex h-[22px] items-center rounded-md bg-sky-soft px-2 text-[0.6875rem] font-semibold whitespace-nowrap text-sky-ink">
                          {activeCapability.badge}
                        </span>
                        <span className="inline-flex h-[22px] items-center rounded-md bg-cloud px-2 font-mono text-[10px] text-graphite whitespace-nowrap">
                          Illustrative Preview
                        </span>
                      </div>
                    </div>

                    {/* Panel Content Body */}
                    <div className="relative min-h-0 flex-1 p-4 sm:p-5">
                      <div
                        key={activeTab}
                        style={{
                          animation: prefersReducedMotion
                            ? 'none'
                            : 'visual-fade-in 250ms cubic-bezier(0.16, 1, 0.3, 1) both',
                        }}
                      >
                        {/* Shared Capability Context Summary */}
                        <div className="rounded-xl bg-paper p-3 sm:p-4 ring-1 ring-[var(--hairline)] shadow-sm">
                          <div className="flex items-start gap-3">
                            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-ink text-canvas ring-1 ring-[var(--hairline)]">
                              <svg aria-hidden="true" className="size-4 text-sky" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="text-[13px] font-bold text-ink">
                                {activeCapability.title}
                              </p>
                              <div className="mt-2 flex flex-wrap gap-1.5">
                                {activeCapability.features.map((feature) => (
                                  <span
                                    key={feature}
                                    className="rounded-md bg-canvas px-2 py-0.5 text-[11px] font-medium text-graphite ring-1 ring-[var(--hairline)]"
                                  >
                                    {feature}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Feature-Specific Visualization */}
                        <CapabilityVisual
                          capabilityId={activeCapability.id}
                          prefersReducedMotion={prefersReducedMotion}
                          revealStep={panelStep}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Hidden inactive tabpanels so every tab's aria-controls resolves cleanly */}
            {CAPABILITIES.map((cap, idx) =>
              idx === activeTab ? null : (
                <div
                  key={cap.id}
                  aria-labelledby={`cap-tab-${cap.id}`}
                  hidden
                  id={`cap-panel-${cap.id}`}
                  role="tabpanel"
                />
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
