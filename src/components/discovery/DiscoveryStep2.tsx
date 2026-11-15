import React from 'react';
import { TestingChallenge } from './types';
import { ALL_CHALLENGES } from './discoveryEngine';

interface Step2Props {
  selected: TestingChallenge[];
  onChange: (challenges: TestingChallenge[]) => void;
}

const CHALLENGE_DETAILS: Record<TestingChallenge, { category: string; impact: string }> = {
  'Too much repetitive manual work': {
    category: 'VELOCITY',
    impact: 'Repetitive verification slows down weekly release cadence',
  },
  'Creating automation scripts takes too long': {
    category: 'AUTHORING',
    impact: 'Writing locators and regression scripts from scratch is tedious',
  },
  'Maintaining existing automation tests is difficult': {
    category: 'MAINTENANCE',
    impact: 'UI changes break selectors and require constant test repairs',
  },
  'Testing execution takes too much time': {
    category: 'EXECUTION',
    impact: 'Long test runs delay feedback loops and CI/CD pipelines',
  },
  'Reporting and collaboration are inefficient': {
    category: 'ALIGNMENT',
    impact: 'Scattered logs and test artifacts complicate team handoffs',
  },
  'Understanding why tests fail takes too much effort': {
    category: 'TRIAGE',
    impact: 'Diagnosing assertions and debugging flaky errors takes hours',
  },
};

export const DiscoveryStep2: React.FC<Step2Props> = ({ selected, onChange }) => {
  const toggleChallenge = (challenge: TestingChallenge) => {
    if (selected.includes(challenge)) {
      onChange(selected.filter((item) => item !== challenge));
    } else {
      onChange([...selected, challenge]);
    }
  };

  return (
    <div className="space-y-3.5" role="group" aria-label="Testing challenges options">
      <div>
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-[16px] sm:text-[17px] font-bold tracking-tight text-ink" id="step2-title">
            What’s your biggest testing challenge?
          </h3>
          <span className="t-label text-graphite/70 font-mono" style={{ fontSize: '10px' }}>
            MULTI-SELECT
          </span>
        </div>
        <p className="mt-0.5 text-[12.5px] text-graphite" id="step2-desc">
          Identify the bottlenecks that slow down your quality workflows.
        </p>
      </div>

      <div className="space-y-2" aria-labelledby="step2-title" aria-describedby="step2-desc">
        {ALL_CHALLENGES.map((challenge) => {
          const isSelected = selected.includes(challenge);
          const meta = CHALLENGE_DETAILS[challenge];

          return (
            <button
              key={challenge}
              type="button"
              role="checkbox"
              aria-checked={isSelected}
              onClick={() => toggleChallenge(challenge)}
              className={`w-full flex items-center justify-between gap-3 px-3.5 py-2.5 sm:py-3 rounded-xl border text-left transition-all duration-150 cursor-pointer select-none active:scale-[0.995] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky ${
                isSelected
                  ? 'border-sky/50 bg-sky-soft/50 shadow-xs ring-1 ring-sky/20'
                  : 'border-[var(--hairline)] bg-paper hover:border-steel/80 hover:bg-cloud/30'
              }`}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`font-semibold tracking-tight transition-colors ${
                      isSelected ? 'text-sky-ink font-bold' : 'text-ink'
                    }`}
                    style={{ fontSize: '13px' }}
                  >
                    {challenge}
                  </span>
                  <span
                    className={`hidden sm:inline-block font-mono font-medium rounded px-1.5 py-0.2 transition-colors ${
                      isSelected
                        ? 'bg-sky/15 text-sky-ink'
                        : 'bg-cloud text-graphite/70'
                    }`}
                    style={{ fontSize: '9.5px', letterSpacing: '0.05em' }}
                  >
                    {meta.category}
                  </span>
                </div>
                <p
                  className="mt-0.5 text-graphite truncate"
                  style={{ fontSize: '11.5px', lineHeight: 1.35 }}
                >
                  {meta.impact}
                </p>
              </div>

              {/* Checkbox indicator */}
              <span
                className={`size-4.5 rounded-md shrink-0 flex items-center justify-center transition-all duration-150 ${
                  isSelected
                    ? 'bg-sky text-white shadow-xs'
                    : 'border border-[var(--hairline-strong)] bg-canvas'
                }`}
              >
                {isSelected && (
                  <svg className="size-3 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
