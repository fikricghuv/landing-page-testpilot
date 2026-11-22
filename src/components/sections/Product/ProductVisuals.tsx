import React from 'react';

export type CapabilityId =
  | 'discovery'
  | 'recorder'
  | 'generation'
  | 'healing'
  | 'api-perf'
  | 'execution-reporting'
  | 'collaboration';

interface CapabilityVisualProps {
  capabilityId: CapabilityId;
  prefersReducedMotion?: boolean;
}

const DISCOVERY_PAGES = [
  { path: '/', label: 'Home', elements: '6 elements', status: 'Mapped' },
  { path: '/products', label: 'Catalog & Filter', elements: '9 elements', status: 'Mapped' },
  { path: '/checkout', label: 'Cart & Promo', elements: '7 elements', status: 'Active Scan' },
];

const DISCOVERY_JOURNEYS = [
  {
    name: 'Browse → Filter → Product Detail',
    context: 'Navigation & search inputs',
    status: 'Coverage: 100%',
    priority: 'Core Flow',
  },
  {
    name: 'Cart → Promo HEMAT20 → Payment',
    context: 'Form submission & price summary',
    status: 'Ready to Record',
    priority: 'Critical Path',
  },
];

const RECORDED_ACTIONS = [
  { step: '01', action: 'NAVIGATE', detail: '/products/aero-runner', locator: 'page.goto(url)', status: 'Saved' },
  { step: '02', action: 'FILL', detail: 'Promo: HEMAT20', locator: "[data-testid='promo-input']", status: 'Saved' },
  { step: '03', action: 'CLICK', detail: 'Pay $96.00', locator: "role=button[name='Pay $96.00']", status: 'Captured Just Now' },
];

const PLAYWRIGHT_SNIPPET = [
  { num: '1', code: "import { test, expect } from '@playwright/test';", tone: 'graphite' },
  { num: '2', code: "const promoCode = testData.promoCode; // 'HEMAT20'", tone: 'sky' },
  { num: '3', code: "test('checkout promo validation', async ({ page }) => {", tone: 'sky' },
  { num: '4', code: "  await page.goto('/checkout');", tone: 'canvas' },
  { num: '5', code: "  await page.getByLabel('Promo').fill(promoCode);", tone: 'canvas' },
  { num: '6', code: "  await expect(page.getByText('$96.00')).toBeVisible();", tone: 'lime' },
  { num: '7', code: '});', tone: 'sky' },
];

const HEALING_STEPS = [
  {
    step: '1. Locator Failure Detected',
    summary: "Selector '#submit-order-old' timed out on checkout page",
    tag: 'Broken',
    tone: 'red' as const,
  },
  {
    step: '2. Heuristic DOM Context Search',
    summary: "Found role=button[name='Complete Purchase'] inside checkout form",
    tag: 'Candidate Found',
    tone: 'sky' as const,
  },
  {
    step: '3. QA Review & Validation',
    summary: 'Candidate verified against live DOM with 99.4% confidence score',
    tag: 'Confidence 99.4%',
    tone: 'lime' as const,
  },
];

export const CapabilityVisual: React.FC<CapabilityVisualProps> = ({
  capabilityId,
  prefersReducedMotion = false,
}) => {
  if (capabilityId === 'discovery') {
    return (
      <div className="mt-4 flex flex-col gap-3">
        {/* Application Page Hierarchy Map */}
        <div className="rounded-xl bg-paper p-3 sm:p-4 ring-1 ring-[var(--hairline)] shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-sky opacity-75"></span>
                <span className="relative inline-flex size-2 rounded-full bg-sky"></span>
              </span>
              <span className="text-[12px] font-bold text-ink">Discovered Application Page Map</span>
            </div>
            <span className="rounded bg-sky-soft px-2 py-0.5 font-mono text-[10px] font-semibold text-sky-ink">
              Live DOM &amp; A11y Tree Explorer
            </span>
          </div>

          <div className="mt-3 overflow-hidden rounded-lg bg-canvas p-2.5 ring-1 ring-[var(--hairline)]">
            <svg
              aria-label="Example hierarchy of discovered application pages"
              className="h-auto w-full select-none"
              role="img"
              viewBox="0 0 560 92"
            >
              <path
                className="animate-flow-dash"
                d="M126 46 C158 46 158 20 190 20"
                fill="none"
                stroke="var(--color-sky)"
                strokeDasharray="4 3"
                strokeWidth="1.5"
              />
              <path
                className="animate-flow-dash"
                d="M126 46 C158 46 158 72 190 72"
                fill="none"
                stroke="var(--color-steel)"
                strokeDasharray="4 3"
                strokeWidth="1.4"
              />
              <path
                className="animate-flow-dash"
                d="M326 20 C356 20 356 46 386 46"
                fill="none"
                stroke="var(--color-sky)"
                strokeDasharray="4 3"
                strokeWidth="1.5"
              />
              <path
                className="animate-flow-dash"
                d="M326 72 C356 72 356 46 386 46"
                fill="none"
                stroke="var(--color-steel)"
                strokeDasharray="4 3"
                strokeWidth="1.4"
              />

              {/* Node 1: Home */}
              <g transform="translate(8 28)">
                <rect fill="var(--color-paper)" height="36" rx="8" stroke="var(--color-sky)" strokeWidth="1.4" width="118" />
                <circle cx="16" cy="18" fill="var(--color-lime)" r="3" />
                <text fill="var(--color-ink)" fontFamily="var(--font-sans)" fontSize="11" fontWeight="700" x="26" y="16">
                  / (Home)
                </text>
                <text fill="var(--color-graphite)" fontFamily="var(--font-mono)" fontSize="9.5" x="26" y="29">
                  6 UI elements
                </text>
              </g>

              {/* Node 2: Products */}
              <g transform="translate(190 2)">
                <rect fill="var(--color-paper)" height="36" rx="8" stroke="var(--color-sky)" strokeWidth="1.4" width="136" />
                <circle cx="16" cy="18" fill="var(--color-lime)" r="3" />
                <text fill="var(--color-ink)" fontFamily="var(--font-sans)" fontSize="11" fontWeight="700" x="26" y="16">
                  /products
                </text>
                <text fill="var(--color-graphite)" fontFamily="var(--font-mono)" fontSize="9.5" x="26" y="29">
                  Catalog &amp; filter
                </text>
              </g>

              {/* Node 3: Search */}
              <g transform="translate(190 54)">
                <rect fill="var(--color-paper)" height="36" rx="8" stroke="var(--color-steel)" strokeDasharray="3 2" strokeWidth="1.1" width="136" />
                <circle cx="16" cy="18" fill="var(--color-steel)" r="3" />
                <text fill="var(--color-arsenic)" fontFamily="var(--font-sans)" fontSize="11" fontWeight="600" x="26" y="16">
                  /search
                </text>
                <text fill="var(--color-graphite)" fontFamily="var(--font-mono)" fontSize="9.5" x="26" y="29">
                  Keyword filter
                </text>
              </g>

              {/* Node 4: Checkout (Active Scan Target) */}
              <g transform="translate(386 28)">
                <rect fill="var(--color-sky-soft)" height="36" rx="8" stroke="var(--color-sky)" strokeWidth="1.6" width="164" />
                <circle cx="18" cy="18" fill="var(--color-sky)" r="3.5" className="animate-pulse" />
                <text fill="var(--color-sky-ink)" fontFamily="var(--font-sans)" fontSize="11" fontWeight="700" x="28" y="16">
                  /checkout
                </text>
                <text fill="var(--color-graphite)" fontFamily="var(--font-mono)" fontSize="9.5" x="28" y="29">
                  Active Scan · 7 Controls
                </text>
              </g>
            </svg>
          </div>
        </div>

        {/* Discovered Context & Candidate Journeys */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-paper p-3 ring-1 ring-[var(--hairline)] shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-[11.5px] font-bold text-ink">Identified Pages &amp; Controls</p>
              <span className="font-mono text-[9.5px] text-graphite">3 Total</span>
            </div>
            <ul className="mt-2 flex flex-col gap-1.5">
              {DISCOVERY_PAGES.map((page) => (
                <li
                  key={page.path}
                  className="flex items-center justify-between gap-2 rounded-lg bg-canvas px-2.5 py-1.5 text-[11px] ring-1 ring-[var(--hairline)]"
                >
                  <span className="truncate font-semibold text-ink">
                    <span className="font-mono text-sky-ink">{page.path}</span> · {page.label}
                  </span>
                  <span className="shrink-0 rounded bg-paper px-1.5 py-0.5 font-mono text-[9.5px] font-medium text-graphite ring-1 ring-[var(--hairline)]">
                    {page.elements}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl bg-paper p-3 ring-1 ring-[var(--hairline)] shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-[11.5px] font-bold text-ink">Candidate User Journeys</p>
              <span className="font-mono text-[9.5px] text-sky-ink font-semibold">AI Generated</span>
            </div>
            <ul className="mt-2 flex flex-col gap-1.5">
              {DISCOVERY_JOURNEYS.map((journey) => (
                <li
                  key={journey.name}
                  className="rounded-lg bg-canvas px-2.5 py-2 ring-1 ring-[var(--hairline)]"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-[11px] font-semibold text-ink">{journey.name}</span>
                    <span className="shrink-0 rounded bg-sky-soft px-1.5 py-0.5 font-mono text-[9.5px] font-semibold text-sky-ink">
                      {journey.status}
                    </span>
                  </div>
                  <p className="mt-0.5 font-mono text-[10px] text-graphite">{journey.context}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (capabilityId === 'recorder') {
    return (
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {/* Interactive Browser Frame Controlled by QA */}
        <div className="rounded-xl bg-paper p-3 ring-1 ring-[var(--hairline)] shadow-sm">
          <div className="flex items-center justify-between gap-2 border-b hairline pb-2">
            <div className="flex items-center gap-1.5 truncate">
              <span className="size-2 rounded-full bg-signal-red/60" />
              <span className="size-2 rounded-full bg-signal-yellow/60" />
              <span className="size-2 rounded-full bg-lime/60" />
              <span className="ml-1 truncate font-mono text-[10px] text-graphite">
                app.acme.example/checkout
              </span>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-signal-red-soft px-2 py-0.5 font-mono text-[10px] font-bold text-signal-red">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-signal-red opacity-75"></span>
                <span className="relative inline-flex size-2 rounded-full bg-signal-red"></span>
              </span>
              REC · Step 03
            </span>
          </div>

          <div className="mt-2.5 rounded-lg bg-canvas p-3 ring-1 ring-[var(--hairline)]">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[12px] font-bold text-ink">Aero Runner Shoes</span>
              <span className="rounded bg-paper px-1.5 py-0.5 font-mono text-[10px] text-graphite ring-1 ring-[var(--hairline)]">
                Size EU 42
              </span>
            </div>

            <div className="mt-2.5 flex items-center justify-between gap-2 rounded-md bg-paper px-2.5 py-1.5 text-[11px] ring-1 ring-[var(--hairline)]">
              <span className="font-mono text-graphite">Promo</span>
              <span className="font-mono font-semibold text-lime-ink">HEMAT20 (-20%) ✓</span>
            </div>

            {/* Clickable button with simulated QA cursor click */}
            <div className="relative mt-2.5 flex items-center justify-between gap-2 rounded-lg bg-ink px-3 py-2 text-canvas">
              <div className="flex items-center gap-2">
                <span className="text-[11.5px] font-semibold">Pay $96.00</span>
                <span className="rounded bg-sky/20 px-1.5 py-0.5 font-mono text-[9.5px] font-medium text-sky">
                  Captured
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="relative flex size-2.5">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-sky opacity-80"></span>
                  <span className="relative inline-flex size-2.5 rounded-full bg-sky"></span>
                </span>
                <svg className="size-3.5 fill-canvas text-canvas animate-cursor-pulse" viewBox="0 0 24 24">
                  <path d="M4 0l16 12.279-6.78 1.074 4.444 8.647-3.743 1.92-4.445-8.647-5.476 5.476z" />
                </svg>
              </div>
            </div>
          </div>

          <p className="mt-2 font-mono text-[10px] text-graphite">
            Interactive recording preserves user intent while isolating robust locators.
          </p>
        </div>

        {/* Captured Steps & Locators */}
        <div className="flex flex-col justify-between rounded-xl bg-paper p-3 ring-1 ring-[var(--hairline)] shadow-sm">
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11.5px] font-bold text-ink">Recorded Actions &amp; Locators</span>
              <span className="rounded bg-lime-soft px-1.5 py-0.5 font-mono text-[10px] font-semibold text-lime-ink">
                3 Steps
              </span>
            </div>

            <ul className="mt-2.5 flex flex-col gap-2">
              {RECORDED_ACTIONS.map((item, idx) => (
                <li
                  key={item.step}
                  className={`rounded-lg px-2.5 py-2 ring-1 transition-all ${
                    idx === 2
                      ? 'bg-sky-soft/60 ring-sky/30 border-l-2 border-sky'
                      : 'bg-canvas ring-[var(--hairline)]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10.5px] font-bold text-sky-ink">
                      {item.step} · {item.action}
                    </span>
                    <span className="truncate text-[11px] font-medium text-ink">{item.detail}</span>
                  </div>
                  <p className="mt-1 truncate font-mono text-[10px] text-graphite">
                    Locator: <code className="text-ink font-semibold">{item.locator}</code>
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-2.5 flex items-center justify-between border-t hairline pt-2">
            <span className="font-mono text-[10px] text-graphite">Target Framework: Playwright / TS</span>
            <span className="font-mono text-[10px] font-semibold text-sky-ink">Ready to Export</span>
          </div>
        </div>
      </div>
    );
  }

  if (capabilityId === 'generation') {
    return (
      <div className="mt-4 flex flex-col gap-3">
        {/* Input Scenario & Parameterization Strip */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-paper p-3 ring-1 ring-[var(--hairline)] shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[10px] font-bold text-lime-ink bg-lime-soft px-1.5 py-0.5 rounded">
                1. TEST DATA INPUT
              </span>
              <span className="font-mono text-[10px] text-graphite">Checkout_v3.xlsx</span>
            </div>
            <p className="mt-2 text-[11.5px] font-semibold text-ink">
              TC-03 · Checkout with valid promo code
            </p>
            <p className="mt-0.5 font-mono text-[10px] text-graphite">
              Inputs: promoCode = &quot;HEMAT20&quot;, expectedTotal = &quot;$96.00&quot;
            </p>
          </div>

          <div className="rounded-xl bg-paper p-3 ring-1 ring-[var(--hairline)] shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[10px] font-bold text-sky-ink bg-sky-soft px-1.5 py-0.5 rounded">
                2. AI SYNTHESIS
              </span>
              <span className="font-mono text-[10px] text-sky-ink font-semibold">Deterministic TS</span>
            </div>
            <p className="mt-2 truncate font-mono text-[10.5px] text-ink">
              Page Object Model + Assertions
            </p>
            <p className="mt-0.5 font-mono text-[10px] text-graphite">
              Generated clean spec file without vendor lock-in
            </p>
          </div>
        </div>

        {/* Reviewable Generated Playwright Script */}
        <div className="overflow-hidden rounded-xl bg-midnight text-canvas ring-1 ring-[var(--hairline-dark)] shadow-md">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--hairline-dark)] bg-phantom px-3 py-2">
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-[#ef4444]" />
              <span className="size-2 rounded-full bg-[#eab308]" />
              <span className="size-2 rounded-full bg-[#10b981]" />
              <span className="ml-1.5 font-mono text-[11px] text-canvas">
                checkout-promo.spec.ts (Playwright TS)
              </span>
            </div>
            <span className="rounded bg-sky-soft px-2 py-0.5 font-mono text-[10px] font-semibold text-sky-ink">
              Review Required · Editable
            </span>
          </div>
          <pre className="overflow-x-auto p-3 font-mono text-[11px] leading-relaxed">
            {PLAYWRIGHT_SNIPPET.map((line) => (
              <div key={line.num} className="flex gap-3">
                <span className="w-4 shrink-0 select-none text-right text-space">{line.num}</span>
                <span
                  className={
                    line.tone === 'lime'
                      ? 'text-lime font-semibold'
                      : line.tone === 'sky'
                      ? 'text-sky'
                      : line.tone === 'graphite'
                      ? 'text-space'
                      : 'text-canvas'
                  }
                >
                  {line.code}
                </span>
              </div>
            ))}
            <div className="mt-1 flex items-center pl-7">
              <span className="font-mono text-[10px] text-space">// Ready for execution</span>
              <span className="inline-block h-3 w-1.5 bg-sky animate-cursor-blink ml-1" />
            </div>
          </pre>
        </div>
      </div>
    );
  }

  if (capabilityId === 'healing') {
    return (
      <div className="mt-4 flex flex-col gap-3">
        {/* Transparent Step-by-Step Recovery Flow */}
        <div className="rounded-xl bg-paper p-3 sm:p-4 ring-1 ring-[var(--hairline)] shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b hairline pb-2">
            <div className="flex items-center gap-2">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-lime opacity-75"></span>
                <span className="relative inline-flex size-2 rounded-full bg-lime"></span>
              </span>
              <span className="text-[12px] font-bold text-ink">
                Automated Locator Recovery Pipeline
              </span>
            </div>
            <span className="rounded bg-cloud px-2 py-0.5 font-mono text-[10px] text-graphite">
              QA Approval Required
            </span>
          </div>

          <ul className="mt-3 flex flex-col gap-2">
            {HEALING_STEPS.map((item) => {
              const badgeClass =
                item.tone === 'red'
                  ? 'bg-signal-red-soft text-signal-red'
                  : item.tone === 'lime'
                  ? 'bg-lime-soft text-lime-ink'
                  : 'bg-sky-soft text-sky-ink';
              return (
                <li
                  key={item.step}
                  className="rounded-lg bg-canvas px-3 py-2 ring-1 ring-[var(--hairline)]"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11.5px] font-bold text-ink">{item.step}</span>
                    <span className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold ${badgeClass}`}>
                      {item.tag}
                    </span>
                  </div>
                  <p className="mt-1 font-mono text-[10.5px] text-graphite">{item.summary}</p>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Before / Suggested Comparison */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-paper p-3 ring-1 ring-signal-red/20 border-l-2 border-signal-red">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold text-signal-red">BROKEN LOCATOR</span>
              <span className="font-mono text-[9.5px] text-signal-red">Timed Out</span>
            </div>
            <p className="mt-1.5 font-mono text-[11px] font-semibold text-ink line-through decoration-signal-red">
              #submit-order-old
            </p>
            <p className="mt-1 text-[10.5px] text-graphite">DOM updated: attribute removed in checkout redesign.</p>
          </div>

          <div className="rounded-xl bg-paper p-3 ring-1 ring-lime/30 border-l-2 border-lime">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold text-lime-ink">SUGGESTED ALTERNATIVE</span>
              <span className="font-mono text-[9.5px] font-bold text-lime-ink">Match 99.4% ✓</span>
            </div>
            <p className="mt-1.5 truncate font-mono text-[11px] font-semibold text-sky-ink">
              getByRole(&apos;button&apos;, &#123; name: &apos;Complete Purchase&apos; &#125;)
            </p>
            <p className="mt-1 text-[10.5px] text-graphite">Self-healed candidate verified against accessible DOM.</p>
          </div>
        </div>
      </div>
    );
  }

  if (capabilityId === 'api-perf') {
    return (
      <div className="mt-4 flex flex-col gap-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {/* API Validation Panel */}
          <div className="rounded-xl bg-paper p-3 sm:p-4 ring-1 ring-[var(--hairline)] shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[12px] font-bold text-ink">API Contract Validation</span>
              <span className="inline-flex items-center gap-1.5 rounded bg-lime-soft px-2 py-0.5 font-mono text-[10px] font-semibold text-lime-ink">
                <span className="size-1.5 rounded-full bg-lime" />
                200 OK · 42ms
              </span>
            </div>

            <div className="mt-2.5 rounded-lg bg-midnight p-2.5 font-mono text-[10.5px] text-canvas">
              <div className="flex items-center gap-2">
                <span className="rounded bg-sky px-1.5 py-0.5 text-[9.5px] font-bold text-canvas">POST</span>
                <span className="truncate text-[10px] text-canvas">/api/v1/checkout/apply-promo</span>
              </div>
              <pre className="mt-2 overflow-x-auto text-[10px] text-steel">
{`{ "code": "HEMAT20", "cartTotal": 120 }`}
              </pre>
            </div>

            <ul className="mt-2.5 flex flex-col gap-1.5 font-mono text-[10.5px]">
              <li className="flex items-center justify-between rounded bg-canvas px-2 py-1 ring-1 ring-[var(--hairline)]">
                <span className="text-ink">response.status === 200</span>
                <span className="font-semibold text-lime-ink">Passed ✓</span>
              </li>
              <li className="flex items-center justify-between rounded bg-canvas px-2 py-1 ring-1 ring-[var(--hairline)]">
                <span className="text-ink">data.discountedTotal === 96</span>
                <span className="font-semibold text-lime-ink">Passed ✓</span>
              </li>
            </ul>
          </div>

          {/* Performance / Load Testing Panel */}
          <div className="rounded-xl bg-paper p-3 sm:p-4 ring-1 ring-[var(--hairline)] shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[12px] font-bold text-ink">Performance &amp; Load Metrics</span>
              <span className="rounded bg-sky-soft px-1.5 py-0.5 font-mono text-[10px] font-semibold text-sky-ink">
                40 Concurrent Users
              </span>
            </div>

            <div className="mt-2.5 grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-canvas p-2.5 ring-1 ring-[var(--hairline)]">
                <p className="font-mono text-[10px] text-graphite">Virtual Users</p>
                <p className="mt-0.5 text-[15px] font-bold text-ink">40 VUs</p>
                <div className="mt-1 h-1 w-full rounded-full bg-cloud overflow-hidden">
                  <div className="h-full w-4/5 rounded-full bg-sky" />
                </div>
              </div>
              <div className="rounded-lg bg-canvas p-2.5 ring-1 ring-[var(--hairline)]">
                <p className="font-mono text-[10px] text-graphite">p95 Latency</p>
                <p className="mt-0.5 text-[15px] font-bold text-sky-ink">295 ms</p>
                <div className="mt-1 h-1 w-full rounded-full bg-cloud overflow-hidden">
                  <div className="h-full w-2/3 rounded-full bg-lime" />
                </div>
              </div>
              <div className="rounded-lg bg-canvas p-2.5 ring-1 ring-[var(--hairline)]">
                <p className="font-mono text-[10px] text-graphite">Avg Response</p>
                <p className="mt-0.5 text-[15px] font-bold text-ink">142 ms</p>
                <div className="mt-1 h-1 w-full rounded-full bg-cloud overflow-hidden">
                  <div className="h-full w-1/2 rounded-full bg-sky" />
                </div>
              </div>
              <div className="rounded-lg bg-canvas p-2.5 ring-1 ring-[var(--hairline)]">
                <p className="font-mono text-[10px] text-graphite">Throughput</p>
                <p className="mt-0.5 text-[13px] font-bold text-ink">84 r/s · 0.0% err</p>
                <div className="mt-1 h-1 w-full rounded-full bg-cloud overflow-hidden">
                  <div className="h-full w-full rounded-full bg-lime" />
                </div>
              </div>
            </div>

            {/* Latency Distribution bar */}
            <div className="mt-2.5 rounded-lg bg-canvas px-2.5 py-1.5 ring-1 ring-[var(--hairline)]">
              <div className="flex items-center justify-between text-[9.5px] font-mono text-graphite">
                <span>p50: 92ms</span>
                <span>p90: 180ms</span>
                <span>p95: 295ms</span>
              </div>
            </div>
          </div>
        </div>

        <p className="rounded-lg bg-paper px-3 py-1.5 font-mono text-[10px] text-graphite ring-1 ring-[var(--hairline)]">
          Preview metrics illustrate synthetic load results; actual performance depends on staging infrastructure.
        </p>
      </div>
    );
  }

  if (capabilityId === 'execution-reporting') {
    return (
      <div className="mt-4 flex flex-col gap-3">
        {/* Run Summary */}
        <div className="rounded-xl bg-paper p-3 sm:p-4 ring-1 ring-[var(--hairline)] shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-[12px] font-bold text-ink">Test Run Summary · #142</span>
              <p className="font-mono text-[10px] text-graphite">Checkout Regression Suite</p>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-[10.5px]">
              <span className="rounded bg-lime-soft px-2 py-0.5 font-semibold text-lime-ink">14 Passed</span>
              <span className="rounded bg-signal-red-soft px-2 py-0.5 font-semibold text-signal-red">1 Failed</span>
            </div>
          </div>

          {/* Execution Progress Bar */}
          <div className="mt-2.5 flex h-2 w-full gap-1 overflow-hidden rounded-full bg-cloud">
            <div className="h-full flex-[14] rounded-full bg-lime" title="14 Passed" />
            <div className="h-full flex-[1] rounded-full bg-signal-red" title="1 Failed" />
          </div>

          <div className="mt-2.5 flex items-center justify-between gap-2 rounded-lg bg-canvas px-3 py-2 ring-1 ring-[var(--hairline)]">
            <span className="truncate text-[11.5px] font-semibold text-ink">
              TC-03 · Promo Checkout Confirmation Timeout
            </span>
            <span className="shrink-0 font-mono text-[10px] font-bold text-signal-red">Failed at Step 12</span>
          </div>
        </div>

        {/* Linked Evidence Artifacts */}
        <div className="rounded-xl bg-paper p-3 sm:p-4 ring-1 ring-[var(--hairline)] shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11.5px] font-bold text-ink">Collected Evidence Artifacts for TC-03</span>
            <span className="font-mono text-[10px] font-semibold text-sky-ink">Full Trace Linked</span>
          </div>

          <div className="mt-2.5 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              { title: 'Execution Logs', meta: '402 API mismatch', icon: '📝', badge: 'Error at L42' },
              { title: 'DOM Snapshot', meta: 'checkout-err.png', icon: '📸', badge: 'Captured' },
              { title: 'Video Replay', meta: 'run-142.webm · 14s', icon: '🎬', badge: '00:14 Playable' },
              { title: 'HTML Report', meta: '15 checks · Export', icon: '📊', badge: 'Ready' },
            ].map((item) => (
              <div key={item.title} className="rounded-lg bg-canvas p-2.5 ring-1 ring-[var(--hairline)] transition-all hover:bg-paper">
                <div className="flex items-center justify-between">
                  <span className="text-base">{item.icon}</span>
                  <span className="font-mono text-[9px] font-medium text-sky-ink">{item.badge}</span>
                </div>
                <p className="mt-1 text-[11px] font-bold text-ink">{item.title}</p>
                <p className="mt-0.5 font-mono text-[9.5px] text-graphite truncate">{item.meta}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 07 — collaboration
  return (
    <div className="mt-4 flex flex-col gap-3">
      <div className="rounded-xl bg-paper p-3 sm:p-4 ring-1 ring-[var(--hairline)] shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-[12px] font-bold text-ink">Shared Execution Finding · TC-03 Triage</span>
          <span className="rounded bg-sky-soft px-2 py-0.5 font-mono text-[10px] font-semibold text-sky-ink">
            Two-Way Team Sync
          </span>
        </div>
        <p className="mt-1 text-[11.5px] text-graphite">
          One-click sync pushes execution trace, logs, and video replay directly into developer workflows:
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl bg-paper p-3 ring-1 ring-[var(--hairline)] shadow-sm border-t-2 border-sky">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[12px] font-bold text-ink">Jira Issue</p>
            <span className="rounded bg-sky-soft px-1.5 py-0.5 font-mono text-[9.5px] font-semibold text-sky-ink">
              Ready for Dev
            </span>
          </div>
          <p className="mt-1.5 font-mono text-[10.5px] font-bold text-ink">QA-284 · Bug</p>
          <p className="mt-1 text-[10.5px] leading-relaxed text-graphite">
            Failure trace and screenshot auto-attached for developer triage.
          </p>
        </div>

        <div className="rounded-xl bg-paper p-3 ring-1 ring-[var(--hairline)] shadow-sm border-t-2 border-lime">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[12px] font-bold text-ink">Slack Alert</p>
            <span className="rounded bg-lime-soft px-1.5 py-0.5 font-mono text-[9.5px] font-semibold text-lime-ink">
              Delivered
            </span>
          </div>
          <p className="mt-1.5 font-mono text-[10.5px] font-bold text-ink">#qa-release-alerts</p>
          <p className="mt-1 text-[10.5px] leading-relaxed text-graphite">
            Notified engineering channel with run verdict and direct link to report.
          </p>
        </div>

        <div className="rounded-xl bg-paper p-3 ring-1 ring-[var(--hairline)] shadow-sm border-t-2 border-slate-400">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[12px] font-bold text-ink">Excel &amp; CSV</p>
            <span className="rounded bg-cloud px-1.5 py-0.5 font-mono text-[9.5px] font-semibold text-graphite">
              Synced
            </span>
          </div>
          <p className="mt-1.5 font-mono text-[10.5px] font-bold text-ink">Checkout_v3.xlsx</p>
          <p className="mt-1 text-[10.5px] leading-relaxed text-graphite">
            Status and coverage sync back to structured test plans seamlessly.
          </p>
        </div>
      </div>
    </div>
  );
};
