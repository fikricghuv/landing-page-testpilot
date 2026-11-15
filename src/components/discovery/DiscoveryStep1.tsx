import React from 'react';
import { HelpTopic } from './types';
import { ALL_HELP_TOPICS } from './discoveryEngine';

interface Step1Props {
  selected: HelpTopic[];
  onChange: (topics: HelpTopic[]) => void;
}

const TOPIC_DETAILS: Record<HelpTopic, { code: string; desc: string }> = {
  'Manual Testing': {
    code: 'MANUAL',
    desc: 'Exploratory testing, test cases, and manual web verification',
  },
  'Automation Testing': {
    code: 'AUTOMATION',
    desc: 'End-to-end regression suites, test authoring, and maintenance',
  },
  'API Testing': {
    code: 'API',
    desc: 'Endpoint validation, schema testing, and integration contracts',
  },
  'Performance Testing': {
    code: 'PERF',
    desc: 'Load simulation, latency benchmarks, and bottleneck detection',
  },
  'Test Management & Reporting': {
    code: 'MGMT',
    desc: 'Execution tracking, test run dashboards, and team collaboration',
  },
};

export const DiscoveryStep1: React.FC<Step1Props> = ({ selected, onChange }) => {
  const toggleTopic = (topic: HelpTopic) => {
    if (selected.includes(topic)) {
      onChange(selected.filter((item) => item !== topic));
    } else {
      onChange([...selected, topic]);
    }
  };

  return (
    <div className="space-y-3.5" role="group" aria-label="Testing scope options">
      <div>
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-[16px] sm:text-[17px] font-bold tracking-tight text-ink" id="step1-title">
            What do you need help with?
          </h3>
          <span className="t-label text-graphite/70 font-mono" style={{ fontSize: '10px' }}>
            MULTI-SELECT
          </span>
        </div>
        <p className="mt-0.5 text-[12.5px] text-graphite" id="step1-desc">
          Select all testing disciplines that apply to your current workflow.
        </p>
      </div>

      <div className="space-y-2" aria-labelledby="step1-title" aria-describedby="step1-desc">
        {ALL_HELP_TOPICS.map((topic) => {
          const isSelected = selected.includes(topic);
          const meta = TOPIC_DETAILS[topic];

          return (
            <button
              key={topic}
              type="button"
              role="checkbox"
              aria-checked={isSelected}
              onClick={() => toggleTopic(topic)}
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
                    style={{ fontSize: '13.5px' }}
                  >
                    {topic}
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
                  {meta.desc}
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
