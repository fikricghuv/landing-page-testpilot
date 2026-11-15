import React, { useState, useEffect, useRef } from 'react';
import { ScaledViewport } from '../../common/ScaledViewport';
import { SimulatedCursor } from '../../common/SimulatedCursor';

export type ShowcaseScenarioId =
  | 'checkout'
  | 'authentication'
  | 'security-question'
  | 'otp-transfer';

export interface ShowcaseValidationSummary {
  expected: string;
  actual: string;
  finding: string;
}

export interface ShowcaseCardProps {
  id: ShowcaseScenarioId;
  title: string;
  description?: string;
  scenarioExample?: string;
  domain: string;
  duration: string;
  verdict: 'passed' | 'failed';
  verdictText: string;
  validationSummary: ShowcaseValidationSummary;
  isMobile?: boolean;
  prefersReducedMotion?: boolean;
}

interface CursorStep {
  target: string | null;
  click: number | null;
}

const TOTAL_STEPS = 5;
const STEP_INTERVAL_MS = 1250;

const CURSOR_SEQUENCES: Record<'checkout' | 'authentication' | 'otp-transfer', CursorStep[]> = {
  checkout: [
    { target: 'coupon-input', click: 0 },
    { target: 'coupon-apply', click: 1 },
    { target: 'checkout-btn', click: 2 },
    { target: 'spin', click: null },
    { target: null, click: null },
  ],
  authentication: [
    { target: 'signin-btn', click: 0 },
    { target: 'answer-input', click: 1 },
    { target: 'continue-btn', click: 2 },
    { target: 'overview', click: null },
    { target: null, click: null },
  ],
  'otp-transfer': [
    { target: 'send-btn', click: 0 },
    { target: 'resend-btn', click: 1 },
    { target: 'otp-code', click: 2 },
    { target: 't2', click: null },
    { target: null, click: null },
  ],
};

export const ShowcaseInteractiveCard: React.FC<ShowcaseCardProps> = ({
  id,
  title,
  description,
  scenarioExample,
  domain,
  duration,
  verdict,
  verdictText,
  validationSummary,
  isMobile = false,
  prefersReducedMotion: prefersReducedMotionProp,
}) => {
  const normalizedId: 'checkout' | 'authentication' | 'otp-transfer' =
    id === 'security-question' ? 'authentication' : id;

  const [step, setStep] = useState(TOTAL_STEPS - 1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayedOnce, setHasPlayedOnce] = useState(false);
  const [playRunId, setPlayRunId] = useState(0);
  const [internalReducedMotion, setInternalReducedMotion] = useState(false);

  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotionProp !== undefined) return;
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setInternalReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setInternalReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [prefersReducedMotionProp]);

  const prefersReducedMotion = prefersReducedMotionProp ?? internalReducedMotion;

  useEffect(() => {
    if (!isPlaying) return;

    if (step >= TOTAL_STEPS - 1) {
      setIsPlaying(false);
      return;
    }

    const timer = window.setTimeout(() => {
      setStep((prev) => Math.min(prev + 1, TOTAL_STEPS - 1));
    }, STEP_INTERVAL_MS);

    return () => window.clearTimeout(timer);
  }, [isPlaying, step, playRunId]);

  const startPlayback = () => {
    setHasPlayedOnce(true);
    setStep(0);
    setIsPlaying(true);
    setPlayRunId((prev) => prev + 1);
  };

  const stopToResult = () => {
    setIsPlaying(false);
    setStep(TOTAL_STEPS - 1);
  };

  const handleTogglePlayback = () => {
    if (isPlaying) {
      stopToResult();
      return;
    }

    if (prefersReducedMotion) {
      setHasPlayedOnce(true);
      setStep((prev) => (prev >= TOTAL_STEPS - 1 ? 0 : prev + 1));
      return;
    }

    startPlayback();
  };

  const handleMouseEnterPreview = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return;
    if (prefersReducedMotion || isPlaying || hasPlayedOnce) return;
    startPlayback();
  };

  const cursorConfig = CURSOR_SEQUENCES[normalizedId][step] ?? { target: null, click: null };
  const isFinalStep = step >= TOTAL_STEPS - 1;

  const buttonLabel = isPlaying
    ? `Stop (${step + 1}/${TOTAL_STEPS})`
    : prefersReducedMotion
    ? isFinalStep
      ? 'Step Through'
      : `Next Step (${step + 1}/${TOTAL_STEPS})`
    : hasPlayedOnce
    ? 'Replay'
    : 'Play Demo';

  return (
    <article className="flex h-full flex-col">
      <div
        onPointerEnter={handleMouseEnterPreview}
        className={`relative overflow-hidden rounded-[18px] ring-1 ring-[var(--hairline-dark)] ${
          prefersReducedMotion
            ? ''
            : 'transition-transform duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1'
        }`}
      >
        <ScaledViewport width={720} height={450} innerRef={viewportRef}>
          {normalizedId === 'checkout' && (
            <div className="h-[450px] w-[720px] select-none bg-white text-ink">
              <div className="flex h-9 items-center gap-2 border-b border-[#eceef3] bg-canvas px-3">
                <span className="flex gap-1">
                  <span className="size-2 rounded-full bg-smoke" />
                  <span className="size-2 rounded-full bg-smoke" />
                  <span className="size-2 rounded-full bg-smoke" />
                </span>
                <span className="flex flex-1 items-center gap-1.5 rounded-md bg-white px-2.5 py-1 font-mono text-[11px] text-graphite ring-1 ring-[#eceef3]">
                  store.acme-demo.com/checkout
                </span>
              </div>
              <div className="flex h-11 items-center gap-2 border-b border-[#eceef3] px-5">
                <span className="grid size-6 place-items-center rounded-md bg-sky text-[11px] font-black text-white">
                  A
                </span>
                <span className="text-[13px] font-black tracking-[0.14em]">ACME</span>
              </div>

              <div className="mx-auto max-w-[420px] space-y-3.5 px-3 pt-6">
                <div>
                  <p className="text-[20px] font-bold leading-tight tracking-tight">
                    {step < 3 ? 'Keranjang Belanja' : 'Checkout'}
                  </p>
                  <p className="mt-1 text-[13px] text-graphite">
                    Total {step >= 2 ? '$96.00' : '$120.00'}
                  </p>
                </div>

                {step < 3 ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-xl border border-[#eceef3] p-3.5 text-[14px]">
                      <span>Aero Runner (Ukuran 42)</span>
                      <span className="font-bold">$120.00</span>
                    </div>
                    <div className="flex gap-2">
                      <div
                        data-target="coupon-input"
                        className={`flex h-10 flex-1 items-center rounded-lg border px-3 font-mono text-[13px] ${
                          step >= 1 ? 'border-sky font-semibold text-ink' : 'border-[#eceef3] text-graphite'
                        }`}
                      >
                        {step >= 1 ? 'HEMAT20' : 'Kode kupon'}
                      </div>
                      <button
                        type="button"
                        tabIndex={-1}
                        data-target="coupon-apply"
                        className={`rounded-lg px-3.5 text-[13px] font-semibold ${
                          step >= 2 ? 'bg-lime text-ink' : 'bg-cloud text-graphite'
                        }`}
                      >
                        {step >= 2 ? 'Diterapkan' : 'Terapkan'}
                      </button>
                    </div>
                    <button
                      type="button"
                      tabIndex={-1}
                      data-target="checkout-btn"
                      className="h-10 w-full rounded-full bg-ink text-[14px] font-bold text-white"
                    >
                      Bayar Sekarang
                    </button>
                  </div>
                ) : (
                  <div className="relative" data-target="spin">
                    {step < 4 ? (
                      <div className="flex flex-col items-center rounded-xl bg-white py-7 ring-1 ring-[#eceef3]">
                        <svg
                          aria-hidden="true"
                          className={`size-6 text-sky ${prefersReducedMotion ? '' : 'animate-spin-slow'}`}
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                        </svg>
                        <p className="mt-3 text-[13px] font-semibold text-ink">
                          Memproses pengajuan checkout…
                        </p>
                        <p className="mt-1 text-[11.5px] text-graphite">
                          Menunggu halaman konfirmasi
                        </p>
                      </div>
                    ) : (
                      <div className="rounded-xl border-2 border-dashed border-signal-red bg-signal-red-soft p-4">
                        <div className="flex items-center justify-between gap-2">
                          <span className="inline-flex items-center gap-1 rounded bg-signal-red px-2 py-0.5 text-[10.5px] font-bold text-white">
                            ✕ Issue Found
                          </span>
                          <span className="font-mono text-[11px] font-semibold text-[#b4162f]">
                            10s wait exceeded
                          </span>
                        </div>
                        <p className="mt-2.5 text-[15px] font-bold text-ink">
                          Confirmation not received
                        </p>
                        <div className="mt-2 space-y-1 text-[12px] text-arsenic">
                          <p>
                            <span className="font-mono font-semibold text-ink">Expected:</span> Confirmation page
                          </p>
                          <p>
                            <span className="font-mono font-semibold text-[#b4162f]">Actual:</span> No confirmation detected
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {normalizedId === 'authentication' && (
            <div className="h-[450px] w-[720px] select-none bg-white text-ink">
              <div className="flex h-9 items-center gap-2 border-b border-[#eceef3] bg-canvas px-3">
                <span className="flex gap-1">
                  <span className="size-2 rounded-full bg-smoke" />
                  <span className="size-2 rounded-full bg-smoke" />
                  <span className="size-2 rounded-full bg-smoke" />
                </span>
                <span className="flex flex-1 items-center gap-1.5 rounded-md bg-white px-2.5 py-1 font-mono text-[11px] text-graphite ring-1 ring-[#eceef3]">
                  app.northwind-demo.com/accounts
                </span>
              </div>
              <div className="flex h-11 items-center gap-2 border-b border-[#eceef3] px-5">
                <span className="grid size-6 place-items-center rounded-md bg-[#0f766e] text-[11px] font-black text-white">
                  N
                </span>
                <span className="text-[13px] font-black tracking-[0.14em]">NORTHWIND BANK</span>
              </div>

              <div className="mx-auto max-w-[360px] space-y-3.5 px-3 pt-6">
                {step < 1 ? (
                  <div className="space-y-3">
                    <h3 className="text-[19px] font-bold">Masuk ke Rekening</h3>
                    <div className="flex h-10 items-center rounded-lg border border-[#eceef3] bg-canvas px-3 text-[13px] text-ink">
                      qa+premium@northwind-demo.com
                    </div>
                    <div className="flex h-10 items-center rounded-lg border border-[#eceef3] bg-canvas px-3 font-mono text-[13px] text-ink">
                      ••••••••••••
                    </div>
                    <button
                      type="button"
                      tabIndex={-1}
                      data-target="signin-btn"
                      className="h-10 w-full rounded-lg bg-ink text-[14px] font-bold text-white"
                    >
                      Masuk
                    </button>
                  </div>
                ) : step < 3 ? (
                  <div className="space-y-3">
                    <h3 className="text-[19px] font-bold">Pertanyaan Keamanan</h3>
                    <p className="text-[13px] text-graphite">Di kota mana Anda dilahirkan?</p>
                    <div
                      data-target="answer-input"
                      className={`flex h-10 items-center rounded-lg border px-3 text-[13.5px] ${
                        step >= 2
                          ? 'border-sky font-medium text-ink'
                          : 'border-[#eceef3] text-graphite'
                      }`}
                    >
                      {step >= 2 ? 'Riverside' : 'Masukkan jawaban keamanan…'}
                    </div>
                    <button
                      type="button"
                      tabIndex={-1}
                      data-target="continue-btn"
                      className="h-10 w-full rounded-lg bg-ink text-[14px] font-bold text-white"
                    >
                      Lanjutkan
                    </button>
                  </div>
                ) : (
                  <div data-target="overview" className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-[19px] font-bold">Ringkasan Rekening</h3>
                      <span className="rounded bg-lime-soft px-2 py-0.5 text-[11px] font-bold text-lime-ink">
                        ✓ Terverifikasi
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-[#eceef3] p-3.5 text-[13.5px]">
                      <div>
                        <p className="font-bold">Everyday Account</p>
                        <p className="text-[11.5px] text-graphite">•• 4821</p>
                      </div>
                      <p className="font-bold">$4,850.20</p>
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-[#eceef3] p-3.5 text-[13.5px]">
                      <div>
                        <p className="font-bold">Tabungan Utama</p>
                        <p className="text-[11.5px] text-graphite">•• 1190</p>
                      </div>
                      <p className="font-bold">$8,902.00</p>
                    </div>
                    {step >= 4 && (
                      <div className="rounded-lg bg-lime-soft px-3 py-2 text-[12px] font-semibold text-lime-ink ring-1 ring-lime">
                        ✓ Login and security verification passed
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {normalizedId === 'otp-transfer' && (
            <div className="pattern-dots grid h-[450px] w-[720px] place-items-center bg-cloud select-none">
              <div className="relative flex h-[420px] w-[226px] flex-col overflow-hidden rounded-[30px] bg-white text-ink shadow-xl ring-[6px] ring-ink">
                <div className="flex h-7 items-center justify-between border-b border-[#eceef3] px-5 text-[10px] font-semibold">
                  <span>9:41</span>
                  <span className="h-2 w-4 rounded-sm border border-ink/70" />
                </div>
                <div className="flex items-center gap-2 border-b border-[#eceef3] px-4 py-2">
                  <span className="grid size-5 place-items-center rounded-md bg-[#3d5c0d] text-[10px] font-black text-white">
                    L
                  </span>
                  <span className="text-[12px] font-bold">Lumen Wallet</span>
                </div>

                <div className="flex flex-1 flex-col justify-between p-3.5">
                  {step === 0 ? (
                    <div className="flex h-full flex-col">
                      <div className="space-y-2.5">
                        <p className="text-[12.5px] font-bold text-ink">Kirim ke Sam Lee</p>
                        <p className="text-[22px] font-bold tracking-tight">$50.00</p>
                        <div className="rounded-lg bg-cloud p-2.5 text-[11px] text-graphite">
                          Transfer via Lumen Balance · Penerima terverifikasi
                        </div>
                      </div>
                      <button
                        type="button"
                        tabIndex={-1}
                        data-target="send-btn"
                        className="mt-auto h-9 w-full rounded-lg bg-ink text-[12px] font-bold text-white"
                      >
                        Kirim &amp; Minta OTP
                      </button>
                    </div>
                  ) : step < 3 ? (
                    <div className="space-y-3">
                      <div>
                        <p className="text-[12.5px] font-bold">Verifikasi OTP</p>
                        <p className="text-[11px] text-graphite">Transfer $50.00 ke Sam Lee</p>
                      </div>
                      <div className="rounded-lg bg-cloud p-2.5 text-[11px]">
                        <p className="text-graphite">Kode OTP dikirim ke •• 72</p>
                        <div
                          data-target="otp-code"
                          className={`mt-1.5 rounded border bg-white px-2 py-1 font-mono text-[14px] font-bold tracking-wider ${
                            step >= 2 ? 'border-sky text-ink' : 'border-[#eceef3] text-graphite'
                          }`}
                        >
                          {step >= 2 ? '482913' : '••••••'}
                        </div>
                      </div>
                      <button
                        type="button"
                        tabIndex={-1}
                        data-target="resend-btn"
                        className="text-[11.5px] font-semibold text-sky-ink"
                      >
                        Minta kode baru
                      </button>
                      <p className="text-[10.5px] text-graphite">
                        {step === 1
                          ? 'OTP sebelumnya timeout — meminta ulang'
                          : 'Kode baru 482913 diverifikasi'}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      <p className="text-[13px] font-bold">Aktivitas Terakhir</p>
                      <div className="flex items-center justify-between rounded-lg border border-[#eceef3] p-2 text-[11.5px]">
                        <div>
                          <p className="font-semibold text-ink">Ke Sam Lee</p>
                          <p className="font-mono text-[10px] text-graphite">First · 14:02:11</p>
                        </div>
                        <span className="font-bold text-ink">$50.00</span>
                      </div>
                      <div
                        data-target="t2"
                        className={`relative flex items-center justify-between rounded-lg border p-2 text-[11.5px] ${
                          step >= 4
                            ? 'border-signal-red bg-signal-red-soft'
                            : 'border-[#eceef3] bg-white'
                        }`}
                      >
                        <div>
                          <p className="font-semibold text-ink">Ke Sam Lee (Ulang)</p>
                          <p className="font-mono text-[10px] text-graphite">Repeated · 14:02:19</p>
                        </div>
                        <span className="font-bold text-[#b4162f]">$50.00</span>
                        {step >= 4 && (
                          <span className="absolute -top-2.5 right-1 rounded bg-signal-red px-1.5 py-0.5 text-[9px] font-bold text-white">
                            Duplicate!
                          </span>
                        )}
                      </div>
                      {step >= 4 && (
                        <div className="rounded-lg bg-signal-red-soft p-2.5 text-[10.5px] leading-snug text-[#b4162f] ring-1 ring-signal-red">
                          <p className="font-bold">Duplicate transaction detected</p>
                          <p className="mt-0.5 text-arsenic">
                            First: $50.00 · Repeated: $50.00
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Simulated Cursor: hidden cleanly during final state or reduced motion */}
          <SimulatedCursor
            container={viewportRef}
            target={cursorConfig.target}
            clickId={cursorConfig.click}
            visible={!prefersReducedMotion && isPlaying && cursorConfig.target !== null}
            width={720}
            height={450}
            label="TestPilot"
          />
        </ScaledViewport>

        {/* Demo Simulation Badge */}
        <span className="absolute bottom-3 right-3 flex items-center rounded-md bg-ink/80 px-2 py-0.5 font-mono text-[10px] font-semibold text-steel ring-1 ring-[var(--hairline-dark)]">
          Demo Simulation
        </span>

        {/* Duration badge */}
        <span className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-md bg-ink/85 px-2 py-1 font-mono text-[11px] tabular-nums text-canvas">
          <svg aria-hidden="true" className="size-3 fill-current" viewBox="0 0 24 24">
            <path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z" />
          </svg>
          {duration}
        </span>

        {/* Verdict Badge */}
        <span
          className={`absolute right-3 top-3 flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-bold shadow-sm ${
            verdict === 'failed' ? 'bg-signal-red text-white' : 'bg-lime text-ink'
          }`}
        >
          <span aria-hidden="true">{verdict === 'failed' ? '✕' : '✓'}</span>
          <span>{verdictText}</span>
        </span>
      </div>

      {/* Card Narrative & TestPilot Validation Result */}
      <div className="mt-4 flex flex-1 flex-col">
        <h3 className="text-[clamp(1.15rem,1.6vw,1.35rem)] font-semibold leading-snug tracking-tight text-canvas">
          {title}
        </h3>
        {description && (
          <p className="mt-1 text-[13px] leading-relaxed text-steel">
            {description}
          </p>
        )}
        {scenarioExample && (
          <p className="mt-2 text-[12px] leading-relaxed text-space">
            <span className="font-semibold text-steel">Skenario:</span> {scenarioExample}
          </p>
        )}

        {/* Restrained TestPilot Result Summary & Footer pinned cleanly for column alignment */}
        <div className="mt-auto pt-3">
          <div
            className="rounded-xl bg-phantom p-3 ring-1 ring-[var(--hairline-dark)]"
            aria-label={`TestPilot validation result for ${title}`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--hairline-dark)] pb-2">
              <span
                className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider ${
                  verdict === 'failed'
                    ? 'bg-signal-red text-white'
                    : 'bg-lime text-ink'
                }`}
              >
                <span aria-hidden="true">{verdict === 'failed' ? '✕' : '✓'}</span>
                <span>{verdict === 'failed' ? 'Failed · Issue Found' : 'Passed'}</span>
              </span>
              <span className="text-[11px] font-medium text-steel">
                {validationSummary.finding}
              </span>
            </div>
            <dl className="mt-2 space-y-1 text-[11.5px] leading-snug">
              <div className="flex gap-1.5">
                <dt className="shrink-0 font-mono text-space">Expected:</dt>
                <dd className="text-canvas">{validationSummary.expected}</dd>
              </div>
              <div className="flex gap-1.5">
                <dt className="shrink-0 font-mono text-space">Actual:</dt>
                <dd className={verdict === 'failed' ? 'font-medium text-signal-red' : 'font-medium text-lime'}>
                  {validationSummary.actual}
                </dd>
              </div>
            </dl>
          </div>

          {/* Footer Metadata + Keyboard/Touch Playback Control */}
          <div className="flex items-center justify-between gap-3 pt-3">
            <p className="flex min-w-0 items-center gap-1.5 font-mono text-[11.5px] text-space">
              {isMobile ? (
                <svg aria-hidden="true" className="size-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect height="20" rx="2" ry="2" width="14" x="5" y="2" />
                  <path d="M12 18h.01" />
                </svg>
              ) : (
                <svg aria-hidden="true" className="size-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect height="14" rx="2" width="20" x="2" y="3" />
                  <line x1="8" x2="16" y1="21" y2="21" />
                  <line x1="12" x2="12" y1="17" y2="21" />
                </svg>
              )}
              <span className="truncate">{domain}</span>
            </p>

            <button
              type="button"
              data-showcase-control="true"
              onClick={handleTogglePlayback}
              aria-label={`${buttonLabel} — ${title}`}
              className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full bg-canvas/10 px-2.5 py-1 font-mono text-[10.5px] font-semibold text-canvas ring-1 ring-[var(--hairline-dark)] transition-colors hover:bg-lime hover:text-ink focus-visible:ring-2 focus-visible:ring-lime"
            >
              <svg aria-hidden="true" className="size-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                {isPlaying ? (
                  <rect x="6" y="6" width="12" height="12" rx="1" />
                ) : (
                  <path d="M8 5v14l11-7z" />
                )}
              </svg>
              <span>{buttonLabel}</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
