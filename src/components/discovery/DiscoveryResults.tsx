import React from 'react';
import { DiscoverySelections, RecommendationResult, RecommendedFeature } from './types';
import { navigateTo } from '../../utils/navigation';

interface ResultsProps {
  selections: DiscoverySelections;
  result: RecommendationResult;
  onClose: () => void;
  onStartOver: () => void;
}

const FeatureIcon: React.FC<{ type: RecommendedFeature['iconType'] }> = ({ type }) => {
  switch (type) {
    case 'discovery':
      return (
        <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="9" />
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
        </svg>
      );
    case 'automation':
      return (
        <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
          <line x1="10" y1="19" x2="14" y2="5" />
        </svg>
      );
    case 'healing':
      return (
        <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case 'api':
      return (
        <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
          <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
          <line x1="6" y1="6" x2="6.01" y2="6" />
          <line x1="6" y1="18" x2="6.01" y2="18" />
        </svg>
      );
    case 'performance':
      return (
        <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        </svg>
      );
    case 'reporting':
      return (
        <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      );
    case 'collaboration':
      return (
        <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    default:
      return (
        <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 14 14" />
        </svg>
      );
  }
};

export const DiscoveryResults: React.FC<ResultsProps> = ({
  selections,
  result,
  onClose,
  onStartOver,
}) => {
  const handleExploreDemo = () => {
    onClose();
    setTimeout(() => {
      navigateTo('/', 'demo');
    }, 100);
  };

  return (
    <div className="space-y-4">
      {/* Blueprint Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-lime-soft px-2.5 py-0.5 border border-lime/30">
          <span className="size-1.5 rounded-full bg-lime" />
          <span className="t-label font-mono font-bold tracking-wider text-lime-ink" style={{ fontSize: '10px' }}>
            TAILORED QA BLUEPRINT
          </span>
        </div>
        <h3 className="mt-2 text-[17px] sm:text-[18px] font-bold tracking-tight text-ink leading-snug">
          {result.headline}
        </h3>
        <p className="mt-1 text-[12.5px] text-graphite leading-relaxed">
          {result.summary}
        </p>
      </div>

      {/* Technical Metadata Strip */}
      <div className="flex flex-wrap items-center gap-1.5 py-1.5 px-3 rounded-lg bg-cloud/50 border border-[var(--hairline)] font-mono text-[11px] text-graphite">
        <span className="text-arsenic font-semibold">PROFILE:</span>
        <span className="font-semibold text-sky-ink bg-paper px-1.5 py-0.5 rounded border border-[var(--hairline)]">
          {selections.workRole || 'Team'}
        </span>
        <span className="text-steel">/</span>
        <span className="text-ink font-medium">
          {selections.helpTopics.join(', ')}
        </span>
      </div>

      {/* Recommended Feature Architecture */}
      <div className="space-y-2.5">
        {result.features.map((feature) => (
          <div
            key={feature.id}
            className="flex flex-col gap-1.5 rounded-xl border border-[var(--hairline)] bg-paper p-3 transition-colors hover:border-steel/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
          >
            {/* Top row */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="size-6 rounded-md bg-cloud/80 border border-[var(--hairline)] text-sky-ink flex items-center justify-center shrink-0">
                  <FeatureIcon type={feature.iconType} />
                </span>
                <h4 className="text-[13px] font-semibold text-ink truncate">
                  {feature.title}
                </h4>
              </div>
              <span
                className="t-label font-mono font-semibold text-sky-ink bg-sky-soft/80 border border-sky/20 px-2 py-0.5 rounded shrink-0"
                style={{ fontSize: '9.5px' }}
              >
                {feature.badge}
              </span>
            </div>

            {/* Description */}
            <p className="text-[12px] text-graphite leading-relaxed pl-8">
              {feature.description}
            </p>

            {/* Technical Attribution Note */}
            {feature.matchedBecause && (
              <div className="pl-8 pt-1 flex items-center gap-1.5 text-[10.5px] font-mono text-arsenic/75">
                <span className="text-sky font-bold">↳</span>
                <span className="text-graphite font-normal">Matched to:</span>
                <span className="font-semibold text-ink">{feature.matchedBecause}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Strategic Architect Insight Callout */}
      {result.roleInsight && (
        <div className="rounded-xl border border-[var(--hairline)] bg-canvas/60 p-3.5 border-l-4 border-l-sky">
          <div className="flex items-center gap-2 mb-1">
            <span className="t-label font-bold text-sky-ink tracking-wider uppercase font-mono" style={{ fontSize: '10px' }}>
              Architect Insight
            </span>
            <span className="text-steel font-mono" style={{ fontSize: '10px' }}>•</span>
            <span className="text-[11px] text-graphite font-medium">
              Calibrated for {selections.workRole || 'QA Teams'}
            </span>
          </div>
          <p className="text-[12px] text-arsenic leading-relaxed font-normal" style={{ textWrap: 'pretty' }}>
            {result.roleInsight}
          </p>
        </div>
      )}

      {/* Modal Actions */}
      <div className="pt-2.5 flex items-center justify-between gap-3 border-t border-[var(--hairline)] shrink-0">
        <button
          type="button"
          onClick={onStartOver}
          className="inline-flex items-center justify-center rounded-full border border-[var(--hairline-strong)] bg-paper px-4 py-2 h-9 text-[12.5px] font-semibold text-graphite hover:text-ink hover:border-ink transition-colors cursor-pointer shrink-0 whitespace-nowrap"
        >
          Start Over
        </button>

        <button
          type="button"
          onClick={handleExploreDemo}
          className="group/btn inline-flex items-center justify-center gap-1.5 rounded-full bg-ink px-5 py-2 h-9 text-[13px] font-semibold text-canvas shadow-[inset_0_-1px_0_rgb(255_255_255/0.08)] hover:bg-sky hover:text-white transition-all cursor-pointer shrink-0 whitespace-nowrap"
        >
          <span>Explore Interactive Demo</span>
          <svg
            className="size-3.5 transition-transform group-hover/btn:translate-x-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};
