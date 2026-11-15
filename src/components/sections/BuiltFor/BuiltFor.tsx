import React, { useRef, useState, useEffect } from 'react';
import { useScrollReveal } from '../../../hooks/useScrollReveal';

interface AudienceItem {
  num: string;
  role: string;
  label: string;
  desc: string;
}

interface JourneyData {
  id: string;
  label: string;
  path: string[];
  flag: number;
  branch: string;
}

interface JourneyProps extends JourneyData {
  index: number;
  prefersReducedMotion: boolean;
}

const AUDIENCES: AudienceItem[] = [
  {
    num: '01',
    role: 'QA Engineers',
    label: 'Automation & Focus',
    desc: 'Kurangi pekerjaan repetitif dalam membuat, menjalankan, dan merawat automation agar tim QA punya lebih banyak waktu untuk mengevaluasi kualitas dan memperluas cakupan pengujian.',
  },
  {
    num: '02',
    role: 'QA Leads',
    label: 'Visibility & Confidence',
    desc: 'Tingkatkan visibilitas terhadap aktivitas pengujian, hasil eksekusi, bukti kegagalan, dan progres testing tim dalam satu workspace yang terstruktur.',
  },
  {
    num: '03',
    role: 'Developers & Engineering Teams',
    label: 'Faster Handoff',
    desc: 'Permudah reproduksi dan investigasi kegagalan melalui hasil eksekusi yang rapi beserta bukti pengujian yang relevan saat terjadi masalah.',
  },
  {
    num: '04',
    role: 'Engineering Organizations',
    label: 'Structured Scale',
    desc: 'Kelola workflow pengujian web, API, dan performa secara lebih teratur seiring berkembangnya aplikasi, fitur, dan kebutuhan QA tim Anda.',
  },
];

const JOURNEYS: JourneyData[] = [
  {
    id: 'ecommerce',
    label: 'Ecommerce',
    path: ['Search', 'Filter', 'Product', 'Cart', 'Coupon', 'Checkout', 'Payment'],
    flag: 6,
    branch: 'Payment failure',
  },
  {
    id: 'fintech',
    label: 'Fintech',
    path: ['Login', 'OTP', 'Account', 'Transfer', 'Verification', 'Confirm'],
    flag: 1,
    branch: 'OTP timeout → retry',
  },
  {
    id: 'saas',
    label: 'SaaS',
    path: ['Invite user', 'Assign role', 'Permissions', 'Workflow', 'Notification'],
    flag: 1,
    branch: 'Role not applied',
  },
  {
    id: 'internal-tools',
    label: 'Internal tools',
    path: ['Sign in (SSO)', 'Request', 'Approval', 'Forms', 'Audit log'],
    flag: 3,
    branch: 'Form state lost on refresh',
  },
];

const WORKFLOW_TOUCHPOINTS = [
  'Excel & CSV',
  'Shared Reports',
  'Issue Handoff',
  'Team Alerts',
  'CI Workflows',
];

const JourneyItem: React.FC<JourneyProps> = ({
  index,
  label,
  path,
  flag,
  branch,
  prefersReducedMotion,
}) => {
  const itemRef = useRef<HTMLLIElement>(null);
  const [hasEnteredView, setHasEnteredView] = useState(prefersReducedMotion);

  useEffect(() => {
    if (prefersReducedMotion || hasEnteredView) return;

    const el = itemRef.current;
    if (!el) return;

    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
      setHasEnteredView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setHasEnteredView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [prefersReducedMotion, hasEnteredView]);

  const isVisible = hasEnteredView || prefersReducedMotion;
  const activeStepCount = Math.max(flag, 1);
  const stepDelayMs = prefersReducedMotion ? 0 : Math.min(110, Math.round(480 / activeStepCount));
  const branchDelayMs = prefersReducedMotion ? 0 : flag * stepDelayMs + 120;

  return (
    <li
      ref={itemRef}
      className="grid gap-4 border-t hairline py-6 lg:grid-cols-12 lg:items-center lg:gap-8"
    >
      <div className="lg:col-span-2">
        <p className="t-label text-space">0{index + 1}</p>
        <p className="mt-1.5 text-[18px] font-semibold tracking-tight text-ink">{label}</p>
      </div>
      <div className="min-w-0 lg:col-span-10">
        <ol className="flex flex-wrap items-center gap-x-1 gap-y-2">
          {path.map((step, stepIdx) => {
            const isReached = isVisible && stepIdx <= flag;
            const isFlagged = isVisible && stepIdx === flag;
            const isNextReached = isVisible && stepIdx < flag;
            const stepDelay = prefersReducedMotion || stepIdx > flag ? 0 : stepIdx * stepDelayMs;
            const connectorDelay = prefersReducedMotion || stepIdx >= flag ? 0 : (stepIdx + 1) * stepDelayMs;

            return (
              <li key={step} className="flex items-center">
                <span
                  className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-[13px] font-medium ring-1 ${
                    prefersReducedMotion ? '' : 'transition-colors duration-300'
                  } ${
                    isFlagged
                      ? 'bg-signal-red-soft font-semibold text-[#b4162f] ring-signal-red'
                      : isReached
                      ? 'bg-paper text-ink ring-sky/50'
                      : 'bg-paper text-graphite ring-[var(--hairline)]'
                  }`}
                  style={prefersReducedMotion ? undefined : { transitionDelay: `${stepDelay}ms` }}
                >
                  <span className="sr-only">Step {stepIdx + 1}: </span>
                  {isFlagged && (
                    <svg
                      aria-hidden="true"
                      className="size-3.5 shrink-0"
                      fill="none"
                      height="24"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="24"
                    >
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 8v5" />
                      <path d="M12 16.5h.01" />
                    </svg>
                  )}
                  <span>{step}</span>
                  {isFlagged && (
                    <span className="font-mono text-[10px] uppercase tracking-wider">
                      · Failed
                    </span>
                  )}
                  {stepIdx === flag && (
                    <span className="sr-only"> (Failure point: {branch})</span>
                  )}
                </span>
                {stepIdx < path.length - 1 && (
                  <>
                    <svg
                      aria-hidden="true"
                      className={`mx-1 size-3 shrink-0 sm:hidden ${
                        prefersReducedMotion ? '' : 'transition-colors duration-300'
                      } ${isNextReached ? 'text-sky' : 'text-space'}`}
                      fill="none"
                      height="24"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      style={prefersReducedMotion ? undefined : { transitionDelay: `${connectorDelay}ms` }}
                      viewBox="0 0 24 24"
                      width="24"
                    >
                      <path d="m9 6 6 6-6 6" />
                    </svg>
                    <span
                      aria-hidden="true"
                      className="relative mx-1.5 hidden h-px bg-smoke sm:block sm:w-8"
                    >
                      <span
                        className={`absolute inset-y-0 left-0 bg-sky ${
                          prefersReducedMotion ? '' : 'transition-[width] duration-300'
                        } ${isNextReached ? 'w-full' : 'w-0'}`}
                        style={prefersReducedMotion ? undefined : { transitionDelay: `${connectorDelay}ms` }}
                      />
                    </span>
                  </>
                )}
              </li>
            );
          })}
        </ol>
        <p
          className={`mt-3 flex items-start gap-1.5 font-mono text-[11.5px] leading-snug text-[#b4162f] ${
            prefersReducedMotion ? '' : 'transition-opacity duration-500'
          } ${isVisible ? 'opacity-100' : 'opacity-0'}`}
          style={prefersReducedMotion ? undefined : { transitionDelay: `${branchDelayMs}ms` }}
        >
          <svg
            aria-hidden="true"
            className="mt-0.5 size-3.5 shrink-0"
            fill="none"
            height="24"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="24"
          >
            <path d="m15 10 5 5-5 5" />
            <path d="M4 4v7a4 4 0 0 0 4 4h12" />
          </svg>
          <span>Off the happy path: {branch}</span>
        </p>
      </div>
    </li>
  );
};

export const BuiltFor: React.FC = () => {
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
      aria-labelledby="built-title"
      className="pb-16 pt-14 sm:pb-20 sm:pt-20 lg:pb-24 lg:pt-24"
      id="built-for"
    >
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-12">
        <header ref={headerRef} className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="t-label scroll-reveal flex items-center gap-2.5 text-graphite" data-revealed={headerRevealed}>
              <svg aria-hidden="true" className="size-3 shrink-0" viewBox="0 0 12 12">
                <rect fill="var(--color-sky)" height="6" opacity="1" rx="1.6" width="6" x="0" y="0" />
                <rect fill="var(--color-sky)" height="6" opacity="0.55" rx="1.6" width="6" x="6" y="6" />
              </svg>
              <span className="text-ink">06</span>
              <span aria-hidden="true" className="h-px w-6 bg-current opacity-40" />
              <span>BUILT FOR QA TEAMS</span>
            </p>
            <h2
              className="t-h2 scroll-reveal mt-5 max-w-[20ch] text-ink"
              data-revealed={headerRevealed}
              id="built-title"
              style={{ transitionDelay: '60ms' }}
            >
              Built for the People Behind Software Quality.
            </h2>
          </div>
          <div className="flex flex-col gap-5 lg:col-span-4 lg:pb-2">
            <p
              className="t-lede scroll-reveal max-w-[46ch] text-graphite"
              data-revealed={headerRevealed}
              style={{ transitionDelay: '120ms' }}
            >
              Baik Anda bekerja sendiri maupun bersama tim QA, TestPilot menyediakan workspace untuk membantu mengelola aktivitas pengujian dengan lebih terstruktur.
            </p>
          </div>
        </header>

        {/* 4 Audiences Grid */}
        <ul
          aria-label="Target QA audiences"
          className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4"
        >
          {AUDIENCES.map((item) => (
            <li
              key={item.num}
              className="flex flex-col justify-between rounded-2xl bg-canvas p-6 ring-1 ring-[var(--hairline)]"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-semibold text-graphite">{item.num}</span>
                  <span className="inline-flex items-center rounded-md bg-sky-soft px-2 py-0.5 text-[10px] font-semibold text-sky-ink">
                    {item.label}
                  </span>
                </div>
                <h3 className="mt-5 text-[18px] font-bold tracking-tight text-ink">{item.role}</h3>
                <p className="mt-2.5 text-[13.5px] leading-relaxed text-graphite">{item.desc}</p>
              </div>
            </li>
          ))}
        </ul>

        {/* Real-World Applications Section */}
        <div className="mt-20 lg:mt-28">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h3 className="t-h3 max-w-[24ch] text-ink">
              Real applications are complex. Your testing workflow should be ready for them.
            </h3>
            <p className="max-w-[46ch] text-[15px] leading-relaxed text-graphite">
              Dari proses autentikasi, transaksi, validasi data, hingga integrasi API, TestPilot membantu tim menyusun dan mengelola pengujian untuk berbagai skenario aplikasi (ilustrasi skenario).
            </p>
          </div>

          <ol className="mt-10 border-b hairline">
            {JOURNEYS.map((journey, idx) => (
              <JourneyItem
                key={journey.id}
                index={idx}
                label={journey.label}
                path={journey.path}
                flag={journey.flag}
                branch={journey.branch}
                id={journey.id}
                prefersReducedMotion={prefersReducedMotion}
              />
            ))}
          </ol>
          <p className="mt-6 text-[14px] font-medium text-arsenic">
            One workspace. Multiple testing workflows. Better use of your QA team&apos;s time.
          </p>
        </div>

        {/* Quality Callout */}
        <div className="mt-16 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 rounded-2xl bg-paper px-6 py-5 ring-1 ring-[var(--hairline)]">
          <div>
            <p className="text-[15px] font-bold text-ink">Quality is a team effort.</p>
            <p className="mt-0.5 max-w-[52ch] text-[13px] text-graphite">
              Membantu QA dan engineering meninjau hasil eksekusi, bukti kegagalan, dan tindak lanjut secara lebih terstruktur.
            </p>
          </div>
          <ul
            aria-label="Compatible workflow touchpoints"
            className="flex flex-wrap gap-x-5 gap-y-1 font-mono text-[12px] uppercase tracking-wider text-graphite"
          >
            {WORKFLOW_TOUCHPOINTS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
