import React, { useRef, useState, useEffect } from 'react';
import { useScrollReveal } from '../../../hooks/useScrollReveal';

export const Problem: React.FC = () => {
  const { ref: headerRef, isRevealed: headerRevealed } = useScrollReveal<HTMLDivElement>();
  const routeRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLElement>(null);
  const [routeInView, setRouteInView] = useState(false);
  const [quoteInView, setQuoteInView] = useState(false);

  useEffect(() => {
    const routeEl = routeRef.current;
    const quoteEl = quoteRef.current;

    const routeObs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRouteInView(true);
        }
      },
      { threshold: 0.25 }
    );

    const quoteObs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setQuoteInView(true);
        }
      },
      { threshold: 0.3 }
    );

    if (routeEl) routeObs.observe(routeEl);
    if (quoteEl) quoteObs.observe(quoteEl);

    return () => {
      routeObs.disconnect();
      quoteObs.disconnect();
    };
  }, []);

  const routeNodes = [
    { num: '01', label: 'Import or Explore' },
    { num: '02', label: 'Generate Tests' },
    { num: '03', label: 'Execute' },
    { num: '04', label: 'Analyze' },
    { num: '05', label: 'Report', highlight: true }
  ];

  return (
    <section aria-labelledby="problem-title" className="relative pb-20 pt-24 sm:pb-24 sm:pt-32 lg:pb-32 lg:pt-44" id="problem">
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-12">
        <div ref={headerRef}>
          <p className="t-label scroll-reveal flex items-center gap-2.5 text-graphite" data-revealed={headerRevealed}>
            <svg aria-hidden="true" className="size-3 shrink-0" viewBox="0 0 12 12">
              <rect fill="var(--color-sky)" height="6" opacity="1" rx="1.6" width="6" x="0" y="0" />
              <rect fill="var(--color-sky)" height="6" opacity="0.55" rx="1.6" width="6" x="6" y="6" />
            </svg>
            <span className="text-ink">01</span>
            <span aria-hidden="true" className="h-px w-6 bg-current opacity-40"></span>
            <span>THE QA CHALLENGE</span>
          </p>

          <h2
            className="t-h2 scroll-reveal mt-6 max-w-[32ch]"
            data-revealed={headerRevealed}
            id="problem-title"
            style={{ transitionDelay: '60ms' }}
          >
            Your QA team should spend more time improving quality, not repeating the same testing tasks.
          </h2>

          <p
            className="scroll-reveal mt-5 max-w-[70ch] text-[16px] leading-relaxed text-graphite"
            data-revealed={headerRevealed}
            style={{ transitionDelay: '120ms' }}
          >
            Seiring bertambahnya fitur dan kompleksitas aplikasi, pekerjaan QA ikut berkembang. Namun, banyak waktu masih dihabiskan untuk menulis skrip, mengelola skenario, memperbaiki automation, dan menginvestigasi kegagalan secara manual.
          </p>
        </div>

        <div className="mt-12 grid gap-6 border-t hairline pt-8 sm:grid-cols-2 lg:grid-cols-4 lg:mt-16">
          <div className="rounded-2xl border hairline bg-cloud/30 p-5">
            <span className="t-label mb-2 block text-ink">
              Problem 01 — Repetitive Test Automation
            </span>
            <p className="text-[14px] leading-relaxed text-graphite">
              Mengubah test case dari Excel atau dokumen menjadi skrip automation membutuhkan waktu dan usaha. Semakin besar cakupan pengujian, semakin besar pula pekerjaan yang harus dikelola tim QA.
            </p>
          </div>
          <div className="rounded-2xl border hairline bg-cloud/30 p-5">
            <span className="t-label mb-2 block text-ink">
              Problem 02 — Fragile Automation Maintenance
            </span>
            <p className="text-[14px] leading-relaxed text-graphite">
              Perubahan antarmuka aplikasi dapat membuat locator lama tidak lagi berfungsi. Tim QA harus menginvestasikan waktu untuk mencari penyebab kegagalan dan memperbarui automation.
            </p>
          </div>
          <div className="rounded-2xl border hairline bg-cloud/30 p-5">
            <span className="t-label mb-2 block text-ink">
              Problem 03 — Fragmented Testing Workflow
            </span>
            <p className="text-[14px] leading-relaxed text-graphite">
              Functional testing, API testing, dan performance testing sering dilakukan menggunakan alur kerja dan tools yang berbeda. Hasilnya tersebar, sementara proses analisis dan pelaporan menjadi kurang efisien.
            </p>
          </div>
          <div className="rounded-2xl border hairline bg-cloud/30 p-5">
            <span className="t-label mb-2 block text-ink">
              Problem 04 — Limited Visibility into Test Results
            </span>
            <p className="text-[14px] leading-relaxed text-graphite">
              Hasil pengujian tidak cukup hanya berupa Passed atau Failed. QA membutuhkan log, screenshot, video, dan informasi teknis untuk memahami apa yang sebenarnya terjadi.
            </p>
          </div>
        </div>

        <div className="mt-20 grid gap-6 lg:mt-28">
          <div>
            <h3 className="text-[20px] font-bold text-ink">
              From Repetitive Testing to a More Connected QA Workflow
            </h3>
          </div>

          {/* Traditional QA */}
          <div className="rounded-[22px] bg-paper p-5 ring-1 ring-[var(--hairline)] sm:p-7">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <p className="t-label text-space">Traditional Workflow</p>
              <p className="flex items-center gap-1.5 text-[12px] text-graphite">
                <svg aria-hidden="true" className="size-3.5" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                </svg>
                Repetitive and maintenance-heavy
              </p>
            </div>
            <ol className="mt-5 flex flex-wrap items-center gap-2 sm:gap-3">
              <li className="flex items-center gap-2 sm:gap-3">
                <span className="rounded-full bg-cloud px-3.5 py-2 text-[13.5px] font-medium text-arsenic sm:px-4">
                  Write Scripts
                </span>
                <span aria-hidden="true" className="h-px w-4 border-t border-dashed border-steel sm:w-8"></span>
              </li>
              <li className="flex items-center gap-2 sm:gap-3">
                <span className="rounded-full bg-cloud px-3.5 py-2 text-[13.5px] font-medium text-arsenic sm:px-4">
                  Execute Tests
                </span>
                <span aria-hidden="true" className="h-px w-4 border-t border-dashed border-steel sm:w-8"></span>
              </li>
              <li className="flex items-center gap-2 sm:gap-3">
                <span className="rounded-full bg-cloud px-3.5 py-2 text-[13.5px] font-medium text-arsenic sm:px-4">
                  Fix Broken Locators
                </span>
                <span aria-hidden="true" className="h-px w-4 border-t border-dashed border-steel sm:w-8"></span>
              </li>
              <li className="flex items-center gap-2 sm:gap-3">
                <span className="rounded-full bg-cloud px-3.5 py-2 text-[13.5px] font-medium text-arsenic sm:px-4">
                  Investigate Failures
                </span>
                <span aria-hidden="true" className="h-px w-4 border-t border-dashed border-steel sm:w-8"></span>
              </li>
              <li className="flex items-center gap-2 sm:gap-3">
                <span className="rounded-full bg-cloud px-3.5 py-2 text-[13.5px] font-medium text-arsenic sm:px-4">
                  Prepare Reports
                </span>
              </li>
            </ol>
          </div>

          {/* TestPilot Connected Workflow */}
          <div ref={routeRef} className="relative overflow-hidden rounded-[22px] bg-ink p-5 text-canvas sm:p-7" data-route="true">
            <div aria-hidden="true" className="pattern-dots-dark absolute inset-0 opacity-70"></div>
            <div className="relative">
              <p className="t-label flex items-center gap-2 text-sky">
                <svg aria-hidden="true" className="size-3 shrink-0" viewBox="0 0 12 12">
                  <rect fill="var(--color-sky)" height="6" opacity="1" rx="1.6" width="6" x="0" y="0" />
                  <rect fill="var(--color-sky)" height="6" opacity="0.55" rx="1.6" width="6" x="6" y="6" />
                </svg>
                With TestPilot
              </p>
              <div className="relative mt-5">
                <span aria-hidden="true" className="absolute left-0 right-0 top-1/2 hidden h-px -translate-y-1/2 bg-[var(--hairline-dark)] md:block"></span>
                <span
                  aria-hidden="true"
                  className="absolute left-0 right-0 top-1/2 hidden h-[2px] -translate-y-1/2 origin-left bg-sky md:block transition-transform duration-1000 ease-[var(--ease-out-expo)]"
                  data-route-line="true"
                  style={{ transform: routeInView ? 'translate(0%, -50%) scaleX(1)' : 'translate(0%, -50%) scaleX(0)' }}
                />
                <ol className="relative flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  {routeNodes.map((node, i) => (
                    <li
                      key={node.num}
                      data-route-node="true"
                      className={`w-fit rounded-full px-3.5 py-2 text-[13.5px] font-semibold sm:px-4 transition-all duration-700 ease-[var(--ease-out-expo)] ${node.highlight
                        ? 'bg-lime text-ink'
                        : 'bg-phantom text-canvas ring-1 ring-[var(--hairline-dark)]'
                        }`}
                      style={{
                        opacity: routeInView ? 1 : 0,
                        transform: routeInView ? 'translateY(0)' : 'translateY(12px)',
                        transitionDelay: `${i * 120}ms`
                      }}
                    >
                      <span className="mr-2 font-mono text-[10px] text-space">
                        {node.num}
                      </span>
                      {node.label}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* Quote figure with dynamic scan underline */}
        <figure ref={quoteRef} className="mt-24 grid gap-10 lg:mt-36 lg:grid-cols-12 lg:items-end" data-quote="true">
          <blockquote className="lg:col-span-9 space-y-2">
            <h5 className="text-[clamp(2rem,4.4vw,4.25rem)] font-semibold leading-[1.06] tracking-[-0.035em] text-space">
              Your team&apos;s time is valuable.
            </h5>
            <p className="text-[clamp(2rem,4.4vw,4.25rem)] font-semibold leading-[1.06] tracking-[-0.035em] text-ink">
              Let TestPilot help reduce{' '}
              <span className="relative inline-block">
                repetitive work
                <span
                  aria-hidden="true"
                  className="absolute -bottom-1 left-0 h-[5px] w-full origin-left bg-[repeating-linear-gradient(90deg,var(--color-sky)_0_10px,transparent_10px_14px)] transition-transform duration-1000 ease-[var(--ease-out-expo)]"
                  data-scan="true"
                  style={{
                    transform: quoteInView ? 'scaleX(1)' : 'scaleX(0)',
                    transitionDelay: '300ms'
                  }}
                />
              </span>
              .
            </p>
          </blockquote>
          <figcaption className="lg:col-span-3">
            <ol aria-label="Connected QA Workflow" className="space-y-2 font-mono text-[11.5px] uppercase tracking-wider text-graphite">
              <li className="flex items-center gap-3">
                <span className="grid size-5 place-items-center rounded-[5px] text-[10px] bg-cloud">1</span>
                Import or Explore
              </li>
              <li className="flex items-center gap-3">
                <span className="grid size-5 place-items-center rounded-[5px] text-[10px] bg-cloud">2</span>
                Generate Tests
              </li>
              <li className="flex items-center gap-3">
                <span className="grid size-5 place-items-center rounded-[5px] text-[10px] bg-cloud">3</span>
                Execute
              </li>
              <li className="flex items-center gap-3 text-ink">
                <span className="grid size-5 place-items-center rounded-[5px] text-[10px] bg-sky text-white">4</span>
                Analyze & Report
                <span className="ml-auto rounded bg-ink px-1.5 py-0.5 text-[10px] text-canvas">TestPilot</span>
              </li>
            </ol>
          </figcaption>
        </figure>
      </div>
    </section>
  );
};
