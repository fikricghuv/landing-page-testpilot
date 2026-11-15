import React from 'react';
import { WorkRole } from './types';
import { ALL_WORK_ROLES } from './discoveryEngine';

interface Step3Props {
  selected: WorkRole | null;
  onChange: (role: WorkRole) => void;
}

const ROLE_DETAILS: Record<WorkRole, { code: string; context: string }> = {
  'Individual QA Engineer': {
    code: 'INDIVIDUAL',
    context: 'Hands-on test design, manual execution, and script creation',
  },
  'QA Team': {
    code: 'TEAM',
    context: 'Dedicated testing squad collaborating on end-to-end quality',
  },
  'QA Lead / Manager': {
    code: 'LEAD',
    context: 'Test strategy, coverage metrics, and team-wide QA governance',
  },
  'Software Development Team': {
    code: 'DEV+QA',
    context: 'Engineers authoring and running tests alongside feature code',
  },
};

export const DiscoveryStep3: React.FC<Step3Props> = ({ selected, onChange }) => {
  return (
    <div className="space-y-3.5" role="radiogroup" aria-label="Team work structure">
      <div>
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-[16px] sm:text-[17px] font-bold tracking-tight text-ink" id="step3-title">
            How do you currently work?
          </h3>
          <span className="t-label text-graphite/70 font-mono" style={{ fontSize: '10px' }}>
            SINGLE-SELECT
          </span>
        </div>
        <p className="mt-0.5 text-[12.5px] text-graphite" id="step3-desc">
          Select your primary organization setup to calibrate your recommendation.
        </p>
      </div>

      <div className="space-y-2" aria-labelledby="step3-title" aria-describedby="step3-desc">
        {ALL_WORK_ROLES.map((role) => {
          const isSelected = selected === role;
          const meta = ROLE_DETAILS[role];

          return (
            <button
              key={role}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onChange(role)}
              className={`w-full flex items-center justify-between gap-3 px-3.5 py-3 rounded-xl border text-left transition-all duration-150 cursor-pointer select-none active:scale-[0.995] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky ${
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
                    style={{ fontSize: '13.5px' }}
                  >
                    {role}
                  </span>
                  <span
                    className={`hidden sm:inline-block font-mono font-medium rounded px-1.5 py-0.2 transition-colors ${
                      isSelected
                        ? 'bg-sky/15 text-sky-ink'
                        : 'bg-cloud text-graphite/70'
                    }`}
                    style={{ fontSize: '9.5px', letterSpacing: '0.05em' }}
                  >
                    {meta.code}
                  </span>
                </div>
                <p
                  className="mt-0.5 text-graphite truncate"
                  style={{ fontSize: '12px', lineHeight: 1.35 }}
                >
                  {meta.context}
                </p>
              </div>

              {/* Radio indicator */}
              <span
                className={`size-4.5 rounded-full shrink-0 flex items-center justify-center transition-all duration-150 ${
                  isSelected
                    ? 'border-2 border-sky bg-paper shadow-xs'
                    : 'border border-[var(--hairline-strong)] bg-canvas'
                }`}
              >
                {isSelected && <span className="size-2 rounded-full bg-sky" />}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
