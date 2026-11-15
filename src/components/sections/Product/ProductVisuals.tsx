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
  revealStep: number;
  prefersReducedMotion: boolean;
}

const DISCOVERY_PAGES = [
  { path: '/', label: 'Home', elements: '6 UI elements' },
  { path: '/products', label: 'Catalog & Filter', elements: '9 UI elements' },
  { path: '/checkout', label: 'Cart & Promo', elements: '7 UI elements' },
];

const DISCOVERY_JOURNEYS = [
  {
    name: 'Browse → Filter → Product Detail',
    context: 'Navigation & search inputs',
    status: 'Candidate Journey',
  },
  {
    name: 'Cart → Promo HEMAT20 → Payment',
    context: 'Form submission & price summary',
    status: 'Candidate Journey',
  },
];

const RECORDED_ACTIONS = [
  { step: '01', action: 'NAVIGATE', detail: '/products/aero-runner', locator: 'page.goto(url)' },
  { step: '02', action: 'FILL', detail: 'Promo: HEMAT20', locator: "[data-testid='promo-input']" },
  { step: '03', action: 'CLICK', detail: 'Pay $96.00', locator: "role=button[name='Pay $96.00']" },
];

const PLAYWRIGHT_SNIPPET = [
  { num: '1', code: "const promoCode = testData.promoCode; // 'HEMAT20'", tone: 'sky' },
  { num: '2', code: "test('checkout promo validation', async ({ page }) => {", tone: 'sky' },
  { num: '3', code: "  await page.getByLabel('Promo').fill(promoCode);", tone: 'canvas' },
  { num: '4', code: "  await expect(page.getByText('$96.00')).toBeVisible();", tone: 'lime' },
  { num: '5', code: '});', tone: 'sky' },
];

const HEALING_STEPS = [
  {
    step: '1. Locator Failure',
    summary: "Selector '#submit-order-old' timed out on checkout page",
    tag: 'Failed',
    tone: 'red' as const,
  },
  {
    step: '2. DOM Context & Candidates',
    summary: "Found role=button[name='Complete Purchase'] inside checkout form",
    tag: '2 Candidates',
    tone: 'sky' as const,
  },
  {
    step: '3. Validation & QA Review',
    summary: 'Candidate #1 matched 1 visible button in sample validation check',
    tag: 'Needs QA Review',
    tone: 'lime' as const,
  },
];

export const CapabilityVisual: React.FC<CapabilityVisualProps> = ({
  capabilityId,
  revealStep,
  prefersReducedMotion,
}) => {
  const revealClass = (minStep: number) => {
    const visible = prefersReducedMotion || revealStep >= minStep;
    const transition = prefersReducedMotion ? '' : 'transition-opacity duration-300';
    return `${transition} ${visible ? 'opacity-100' : 'opacity-0'}`;
  };

  if (capabilityId === 'discovery') {
    return (
      <div className="mt-4 flex flex-col gap-3">
        {/* Application Page Hierarchy Map */}
        <div className={`rounded-xl bg-paper p-3 sm:p-4 ring-1 ring-[var(--hairline)] shadow-sm ${revealClass(1)}`}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[12px] font-bold text-ink">Discovered Application Page Map</span>
            <span className="rounded bg-cloud px-2 py-0.5 font-mono text-[10px] text-graphite">
              Example Exploration · DOM &amp; A11y Tree
            </span>
          </div>

          <div className="mt-3 rounded-lg bg-canvas p-2.5 ring-1 ring-[var(--hairline)]">
            <svg
              aria-label="Example hierarchy of discovered application pages"
              className="h-auto w-full"
              role="img"
              viewBox="0 0 560 92"
            >
              <path
                d="M126 46 C158 46 158 20 190 20"
                fill="none"
                stroke="var(--color-sky)"
                strokeDasharray="4 3"
                strokeWidth="1.5"
              />
              <path
                d="M126 46 C158 46 158 72 190 72"
                fill="none"
                stroke="var(--color-steel)"
                strokeDasharray="4 3"
                strokeWidth="1.4"
              />
              <path
                d="M326 20 C356 20 356 46 386 46"
                fill="none"
                stroke="var(--color-sky)"
                strokeDasharray="4 3"
                strokeWidth="1.5"
              />
              <path
                d="M326 72 C356 72 356 46 386 46"
                fill="none"
                stroke="var(--color-steel)"
                strokeDasharray="4 3"
                strokeWidth="1.4"
              />

              <g transform="translate(8 28)">
                <rect fill="var(--color-paper)" height="36" rx="8" stroke="var(--color-sky)" strokeWidth="1.4" width="118" />
                <text fill="var(--color-ink)" fontFamily="var(--font-sans)" fontSize="11" fontWeight="700" x="12" y="16">
                  / (Home)
                </text>
                <text fill="var(--color-graphite)" fontFamily="var(--font-mono)" fontSize="9.5" x="12" y="29">
                  6 elements
                </text>
              </g>

              <g transform="translate(190 2)">
                <rect fill="var(--color-paper)" height="36" rx="8" stroke="var(--color-sky)" strokeWidth="1.4" width="136" />
                <text fill="var(--color-ink)" fontFamily="var(--font-sans)" fontSize="11" fontWeight="700" x="12" y="16">
                  /products
                </text>
                <text fill="var(--color-graphite)" fontFamily="var(--font-mono)" fontSize="9.5" x="12" y="29">
                  Catalog &amp; sizes
                </text>
              </g>

              <g transform="translate(190 54)">
                <rect fill="var(--color-paper)" height="36" rx="8" stroke="var(--color-steel)" strokeDasharray="3 2" strokeWidth="1.1" width="136" />
                <text fill="var(--color-arsenic)" fontFamily="var(--font-sans)" fontSize="11" fontWeight="600" x="12" y="16">
                  /search
                </text>
                <text fill="var(--color-graphite)" fontFamily="var(--font-mono)" fontSize="9.5" x="12" y="29">
                  Category filter
                </text>
              </g>

              <g transform="translate(386 28)">
                <rect fill="var(--color-sky-soft)" height="36" rx="8" stroke="var(--color-sky)" strokeWidth="1.4" width="164" />
                <text fill="var(--color-sky-ink)" fontFamily="var(--font-sans)" fontSize="11" fontWeight="700" x="12" y="16">
                  /checkout
                </text>
                <text fill="var(--color-graphite)" fontFamily="var(--font-mono)" fontSize="9.5" x="12" y="29">
                  Promo input · Pay CTA
                </text>
              </g>
            </svg>
          </div>
        </div>

        {/* Discovered Context & Candidate Journeys */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className={`rounded-xl bg-paper p-3 ring-1 ring-[var(--hairline)] shadow-sm ${revealClass(2)}`}>
            <p className="text-[11.5px] font-bold text-ink">Identified Pages &amp; Controls</p>
            <ul className="mt-2 flex flex-col gap-1.5">
              {DISCOVERY_PAGES.map((page) => (
                <li
                  key={page.path}
                  className="flex items-center justify-between gap-2 rounded-lg bg-canvas px-2.5 py-1.5 text-[11px] ring-1 ring-[var(--hairline)]"
                >
                  <span className="truncate font-semibold text-ink">
                    <span className="font-mono text-sky-ink">{page.path}</span> · {page.label}
                  </span>
                  <span className="shrink-0 font-mono text-[10px] text-graphite">{page.elements}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className={`rounded-xl bg-paper p-3 ring-1 ring-[var(--hairline)] shadow-sm ${revealClass(3)}`}>
            <p className="text-[11.5px] font-bold text-ink">Candidate User Journeys</p>
            <ul className="mt-2 flex flex-col gap-1.5">
              {DISCOVERY_JOURNEYS.map((journey) => (
                <li
                  key={journey.name}
                  className="rounded-lg bg-canvas px-2.5 py-2 ring-1 ring-[var(--hairline)]"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-[11px] font-semibold text-ink">{journey.name}</span>
                    <span className="shrink-0 rounded bg-sky-soft px-1.5 py-0.5 font-mono text-[10px] text-sky-ink">
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
        <div className={`rounded-xl bg-paper p-3 ring-1 ring-[var(--hairline)] shadow-sm ${revealClass(1)}`}>
          <div className="flex items-center justify-between gap-2 border-b hairline pb-2">
            <span className="truncate font-mono text-[10.5px] text-graphite">
              app.acme-commerce.example/checkout
            </span>
            <span className="inline-flex shrink-0 items-center gap-1 rounded bg-signal-red-soft px-1.5 py-0.5 font-mono text-[10px] font-semibold text-signal-red">
              ● QA Session
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
              <span className="font-mono font-semibold text-sky-ink">HEMAT20 (-20%)</span>
            </div>

            <div className="mt-2.5 flex items-center justify-between gap-2 rounded-lg bg-ink px-3 py-2 text-canvas">
              <span className="text-[11.5px] font-semibold">Pay $96.00</span>
              <span
                className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 font-mono text-[10px] text-sky"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.12)' }}
              >
                Clicked by QA
              </span>
            </div>
          </div>

          <p className="mt-2 font-mono text-[10px] text-graphite">
            QA controls every click and input while TestPilot captures selectors.
          </p>
        </div>

        {/* Captured Steps & Locators */}
        <div className={`flex flex-col justify-between rounded-xl bg-paper p-3 ring-1 ring-[var(--hairline)] shadow-sm ${revealClass(2)}`}>
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11.5px] font-bold text-ink">Recorded Actions &amp; Locators</span>
              <span className="rounded bg-lime-soft px-1.5 py-0.5 font-mono text-[10px] font-semibold text-lime-ink">
                Reusable Steps
              </span>
            </div>

            <ul className="mt-2.5 flex flex-col gap-2">
              {RECORDED_ACTIONS.map((item) => (
                <li
                  key={item.step}
                  className="rounded-lg bg-canvas px-2.5 py-2 ring-1 ring-[var(--hairline)]"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10.5px] font-bold text-sky-ink">
                      {item.step} · {item.action}
                    </span>
                    <span className="truncate text-[11px] font-medium text-ink">{item.detail}</span>
                  </div>
                  <p className="mt-1 truncate font-mono text-[10px] text-graphite">
                    Locator: {item.locator}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <p className={`mt-2.5 text-[10.5px] text-graphite ${revealClass(3)}`}>
            Saved as editable test steps—refine locators or assertions anytime.
          </p>
        </div>
      </div>
    );
  }

  if (capabilityId === 'generation') {
    return (
      <div className="mt-4 flex flex-col gap-3">
        {/* Input Scenario & Parameterization Strip */}
        <div className={`grid grid-cols-1 gap-3 sm:grid-cols-2 ${revealClass(1)}`}>
          <div className="rounded-xl bg-paper p-3 ring-1 ring-[var(--hairline)] shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[10px] font-bold text-lime-ink bg-lime-soft px-1.5 py-0.5 rounded">
                1. CSV / EXCEL INPUT
              </span>
              <span className="font-mono text-[10px] text-graphite">Checkout_v3.xlsx</span>
            </div>
            <p className="mt-2 text-[11.5px] font-semibold text-ink">
              TC-03 · Checkout with valid promo code
            </p>
            <p className="mt-0.5 font-mono text-[10px] text-graphite">
              Mapped: Enter promo → verify $96.00 subtotal
            </p>
          </div>

          <div className={`rounded-xl bg-paper p-3 ring-1 ring-[var(--hairline)] shadow-sm ${revealClass(2)}`}>
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[10px] font-bold text-sky-ink bg-sky-soft px-1.5 py-0.5 rounded">
                2. TEST DATA &amp; CONTEXT
              </span>
              <span className="font-mono text-[10px] text-graphite">Parameterized</span>
            </div>
            <p className="mt-2 truncate font-mono text-[10.5px] text-ink">
              {`{ promoCode: "HEMAT20", total: "$96.00" }`}
            </p>
            <p className="mt-0.5 font-mono text-[10px] text-graphite">
              Combined with DOM context for script draft
            </p>
          </div>
        </div>

        {/* Reviewable Generated Playwright Script */}
        <div className={`overflow-hidden rounded-xl bg-midnight text-canvas ring-1 ring-[var(--hairline-dark)] ${revealClass(3)}`}>
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--hairline-dark)] bg-phantom px-3 py-2">
            <span className="font-mono text-[11px] text-canvas">checkout-promo.spec.ts (Playwright TS)</span>
            <span className="rounded bg-sky-soft px-2 py-0.5 font-mono text-[10px] font-semibold text-sky-ink">
              Review Required · Editable by QA
            </span>
          </div>
          <pre className="overflow-x-auto p-3 font-mono text-[11px] leading-relaxed">
            {PLAYWRIGHT_SNIPPET.map((line) => (
              <div key={line.num} className="flex gap-3">
                <span className="w-4 shrink-0 select-none text-right text-space">{line.num}</span>
                <span
                  className={
                    line.tone === 'lime'
                      ? 'text-lime'
                      : line.tone === 'sky'
                      ? 'text-sky'
                      : 'text-canvas'
                  }
                >
                  {line.code}
                </span>
              </div>
            ))}
          </pre>
        </div>
      </div>
    );
  }

  if (capabilityId === 'healing') {
    return (
      <div className="mt-4 flex flex-col gap-3">
        {/* Transparent Step-by-Step Recovery Flow */}
        <div className={`rounded-xl bg-paper p-3 sm:p-4 ring-1 ring-[var(--hairline)] shadow-sm ${revealClass(1)}`}>
          <div className="flex flex-wrap items-center justify-between gap-2 border-b hairline pb-2">
            <span className="text-[12px] font-bold text-ink">
              Example Locator Investigation Workflow
            </span>
            <span className="rounded bg-cloud px-2 py-0.5 font-mono text-[10px] text-graphite">
              QA Approval Required · Illustrative Example
            </span>
          </div>

          <ul className="mt-3 flex flex-col gap-2">
            {HEALING_STEPS.map((item, idx) => {
              const badgeClass =
                item.tone === 'red'
                  ? 'bg-signal-red-soft text-signal-red'
                  : item.tone === 'lime'
                  ? 'bg-lime-soft text-lime-ink'
                  : 'bg-sky-soft text-sky-ink';
              return (
                <li
                  key={item.step}
                  className={`rounded-lg bg-canvas px-3 py-2 ring-1 ring-[var(--hairline)] ${revealClass(idx + 1)}`}
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
        <div className={`grid grid-cols-1 gap-3 sm:grid-cols-2 ${revealClass(3)}`}>
          <div className="rounded-xl bg-paper p-3 ring-1 ring-[var(--hairline)]">
            <span className="font-mono text-[10px] font-bold text-signal-red">FAILING LOCATOR</span>
            <p className="mt-1 truncate font-mono text-[11px] text-ink">#submit-order-old</p>
            <p className="mt-0.5 text-[10.5px] text-graphite">DOM updated in recent checkout UI change.</p>
          </div>
          <div className="rounded-xl bg-paper p-3 ring-1 ring-[var(--hairline)]">
            <span className="font-mono text-[10px] font-bold text-sky-ink">SUGGESTED ALTERNATIVE</span>
            <p className="mt-1 truncate font-mono text-[11px] text-ink">
              getByRole(&apos;button&apos;, &#123; name: &apos;Complete Purchase&apos; &#125;)
            </p>
            <p className="mt-0.5 text-[10.5px] text-graphite">Presented for QA review before updating suite.</p>
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
          <div className={`rounded-xl bg-paper p-3 sm:p-4 ring-1 ring-[var(--hairline)] shadow-sm ${revealClass(1)}`}>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[12px] font-bold text-ink">API Testing (Sample)</span>
              <span className="rounded bg-lime-soft px-1.5 py-0.5 font-mono text-[10px] font-semibold text-lime-ink">
                200 OK
              </span>
            </div>

            <div className="mt-2.5 rounded-lg bg-midnight p-2.5 font-mono text-[10.5px] text-canvas">
              <div className="flex items-center gap-2">
                <span className="rounded bg-sky-soft px-1.5 py-0.5 text-[10px] font-bold text-sky-ink">POST</span>
                <span className="truncate text-canvas">/api/v1/checkout/apply-promo</span>
              </div>
              <pre className="mt-2 overflow-x-auto text-[10px] text-steel">
{`{ "code": "HEMAT20", "cartTotal": 120 }`}
              </pre>
            </div>

            <ul className="mt-2.5 flex flex-col gap-1.5 font-mono text-[10.5px]">
              <li className="flex items-center justify-between rounded bg-canvas px-2 py-1 ring-1 ring-[var(--hairline)]">
                <span className="text-ink">status === 200</span>
                <span className="font-semibold text-lime-ink">Verified</span>
              </li>
              <li className="flex items-center justify-between rounded bg-canvas px-2 py-1 ring-1 ring-[var(--hairline)]">
                <span className="text-ink">discountedTotal === 96</span>
                <span className="font-semibold text-lime-ink">Verified</span>
              </li>
            </ul>
          </div>

          {/* Performance / Load Testing Panel */}
          <div className={`rounded-xl bg-paper p-3 sm:p-4 ring-1 ring-[var(--hairline)] shadow-sm ${revealClass(2)}`}>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[12px] font-bold text-ink">Performance Testing (Sample)</span>
              <span className="rounded bg-cloud px-1.5 py-0.5 font-mono text-[10px] text-graphite">
                Illustrative Load
              </span>
            </div>

            <div className="mt-2.5 grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-canvas p-2.5 ring-1 ring-[var(--hairline)]">
                <p className="font-mono text-[10px] text-graphite">Virtual Users</p>
                <p className="mt-0.5 text-[15px] font-bold text-ink">40 VUs</p>
              </div>
              <div className="rounded-lg bg-canvas p-2.5 ring-1 ring-[var(--hairline)]">
                <p className="font-mono text-[10px] text-graphite">p95 Latency</p>
                <p className="mt-0.5 text-[15px] font-bold text-sky-ink">295 ms</p>
              </div>
              <div className="rounded-lg bg-canvas p-2.5 ring-1 ring-[var(--hairline)]">
                <p className="font-mono text-[10px] text-graphite">Avg Response</p>
                <p className="mt-0.5 text-[15px] font-bold text-ink">142 ms</p>
              </div>
              <div className="rounded-lg bg-canvas p-2.5 ring-1 ring-[var(--hairline)]">
                <p className="font-mono text-[10px] text-graphite">Throughput / Err</p>
                <p className="mt-0.5 text-[13px] font-bold text-ink">84 r/s · 0.0%</p>
              </div>
            </div>
          </div>
        </div>

        <p className={`rounded-lg bg-paper px-3 py-2 font-mono text-[10px] text-graphite ring-1 ring-[var(--hairline)] ${revealClass(3)}`}>
          Illustrative sample metrics for preview only—actual figures depend on your staging environment and test profile.
        </p>
      </div>
    );
  }

  if (capabilityId === 'execution-reporting') {
    return (
      <div className="mt-4 flex flex-col gap-3">
        {/* Run Summary */}
        <div className={`rounded-xl bg-paper p-3 sm:p-4 ring-1 ring-[var(--hairline)] shadow-sm ${revealClass(1)}`}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-[12px] font-bold text-ink">Sample Run Summary · #142</span>
              <p className="font-mono text-[10px] text-graphite">Checkout Regression Suite (Illustrative)</p>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-[10.5px]">
              <span className="rounded bg-lime-soft px-2 py-0.5 font-semibold text-lime-ink">14 Passed</span>
              <span className="rounded bg-signal-red-soft px-2 py-0.5 font-semibold text-signal-red">1 Failed</span>
            </div>
          </div>

          <div className="mt-2.5 flex items-center justify-between gap-2 rounded-lg bg-canvas px-3 py-2 ring-1 ring-[var(--hairline)]">
            <span className="truncate text-[11.5px] font-semibold text-ink">
              TC-03 · Promo Checkout Confirmation Timeout
            </span>
            <span className="shrink-0 font-mono text-[10px] font-bold text-signal-red">Failed at Step 12</span>
          </div>
        </div>

        {/* Linked Evidence Artifacts */}
        <div className={`rounded-xl bg-paper p-3 sm:p-4 ring-1 ring-[var(--hairline)] shadow-sm ${revealClass(2)}`}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11.5px] font-bold text-ink">Collected Evidence for TC-03</span>
            <span className="font-mono text-[10px] text-sky-ink">Export: HTML / JSON Report</span>
          </div>

          <div className="mt-2.5 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              { title: 'Execution Logs', meta: '402 API mismatch' },
              { title: 'Screenshots', meta: 'checkout-err.png' },
              { title: 'Video Replay', meta: 'run-142.webm · 14s' },
              { title: 'Test Report', meta: '15 checks · Export' },
            ].map((item) => (
              <div key={item.title} className="rounded-lg bg-canvas p-2.5 ring-1 ring-[var(--hairline)]">
                <p className="text-[11px] font-bold text-ink">{item.title}</p>
                <p className="mt-0.5 font-mono text-[10px] text-graphite">{item.meta}</p>
              </div>
            ))}
          </div>
        </div>

        <p className={`text-[10.5px] text-graphite ${revealClass(3)}`}>
          Every failed or passed scenario links directly to its execution trace, media evidence, and shareable test summary.
        </p>
      </div>
    );
  }

  // 07 — collaboration
  return (
    <div className="mt-4 flex flex-col gap-3">
      <div className={`rounded-xl bg-paper p-3 sm:p-4 ring-1 ring-[var(--hairline)] shadow-sm ${revealClass(1)}`}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-[12px] font-bold text-ink">Shared Execution Finding · TC-03</span>
          <span className="rounded bg-cloud px-2 py-0.5 font-mono text-[10px] text-graphite">
            Example Integration Flow
          </span>
        </div>
        <p className="mt-1.5 text-[11.5px] text-graphite">
          QA engineers review execution evidence in TestPilot and selectively share findings to team tools:
        </p>
      </div>

      <div className={`grid grid-cols-1 gap-3 sm:grid-cols-3 ${revealClass(2)}`}>
        <div className="rounded-xl bg-paper p-3 ring-1 ring-[var(--hairline)] shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[12px] font-bold text-ink">Jira Issue</p>
            <span className="rounded bg-sky-soft px-1.5 py-0.5 font-mono text-[10px] font-semibold text-sky-ink">
              Example
            </span>
          </div>
          <p className="mt-1.5 font-mono text-[10.5px] font-semibold text-ink">QA-284 · Draft</p>
          <p className="mt-1 text-[10.5px] text-graphite">
            Attaches failure summary, logs, and screenshot for developer triage.
          </p>
        </div>

        <div className="rounded-xl bg-paper p-3 ring-1 ring-[var(--hairline)] shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[12px] font-bold text-ink">Slack Alert</p>
            <span className="rounded bg-sky-soft px-1.5 py-0.5 font-mono text-[10px] font-semibold text-sky-ink">
              Example
            </span>
          </div>
          <p className="mt-1.5 font-mono text-[10.5px] font-semibold text-ink">#qa-release-alerts</p>
          <p className="mt-1 text-[10.5px] text-graphite">
            Notifies team channel with run verdict and direct report reference.
          </p>
        </div>

        <div className="rounded-xl bg-paper p-3 ring-1 ring-[var(--hairline)] shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[12px] font-bold text-ink">Excel &amp; CSV</p>
            <span className="rounded bg-cloud px-1.5 py-0.5 font-mono text-[10px] font-semibold text-graphite">
              Illustrative
            </span>
          </div>
          <p className="mt-1.5 font-mono text-[10.5px] font-semibold text-ink">Checkout_v3.xlsx</p>
          <p className="mt-1 text-[10.5px] text-graphite">
            Import structured test cases and keep coverage notes aligned across QA.
          </p>
        </div>
      </div>

      <p className={`text-[10.5px] text-graphite ${revealClass(3)}`}>
        Illustrative workspace preview—no external accounts or webhooks are connected on this landing page.
      </p>
    </div>
  );
};
