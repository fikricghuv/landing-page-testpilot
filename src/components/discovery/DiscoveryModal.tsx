import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useDiscovery } from './DiscoveryContext';
import { DiscoverySelections, HelpTopic, TestingChallenge, WorkRole } from './types';
import { generateRecommendations } from './discoveryEngine';
import { DiscoveryStep1 } from './DiscoveryStep1';
import { DiscoveryStep2 } from './DiscoveryStep2';
import { DiscoveryStep3 } from './DiscoveryStep3';
import { DiscoveryResults } from './DiscoveryResults';

const INITIAL_SELECTIONS: DiscoverySelections = {
  helpTopics: [],
  challenges: [],
  workRole: null,
};

const STEP_NAMES = [
  'Scope of Testing',
  'Primary Bottlenecks',
  'Team Structure',
  'Recommendations',
];

const FLOW_STEPS = [
  { step: 1, label: 'Scope' },
  { step: 2, label: 'Bottlenecks' },
  { step: 3, label: 'Team' },
];

export const DiscoveryModal: React.FC = () => {
  const { isOpen, closeDiscovery } = useDiscovery();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [selections, setSelections] = useState<DiscoverySelections>(INITIAL_SELECTIONS);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const dialogRef = useRef<HTMLDivElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  // Capture trigger focus on open, return focus on close
  useEffect(() => {
    if (isOpen) {
      previousActiveElementRef.current = document.activeElement as HTMLElement | null;
      // Focus modal on next frame
      requestAnimationFrame(() => {
        dialogRef.current?.focus();
      });
    } else if (previousActiveElementRef.current) {
      previousActiveElementRef.current.focus();
      previousActiveElementRef.current = null;
    }
  }, [isOpen]);

  const resetForm = useCallback(() => {
    setCurrentStep(1);
    setSelections(INITIAL_SELECTIONS);
    setShowExitConfirm(false);
  }, []);

  const hasUnsavedProgress = useMemo(() => {
    return (
      currentStep > 1 &&
      (selections.helpTopics.length > 0 ||
        selections.challenges.length > 0 ||
        selections.workRole !== null)
    );
  }, [currentStep, selections]);

  const handleRequestClose = useCallback(() => {
    if (currentStep < 4 && hasUnsavedProgress) {
      setShowExitConfirm(true);
    } else {
      closeDiscovery();
      setShowExitConfirm(false);
    }
  }, [currentStep, hasUnsavedProgress, closeDiscovery]);

  const handleForceClose = useCallback(() => {
    resetForm();
    closeDiscovery();
  }, [resetForm, closeDiscovery]);

  // Validation per step
  const canContinue = useMemo(() => {
    if (currentStep === 1) return selections.helpTopics.length > 0;
    if (currentStep === 2) return selections.challenges.length > 0;
    if (currentStep === 3) return selections.workRole !== null;
    return true;
  }, [currentStep, selections]);

  const handleNext = useCallback(() => {
    if (!canContinue) return;
    if (currentStep < 4) {
      setCurrentStep((prev) => (prev + 1) as 1 | 2 | 3 | 4);
    }
  }, [canContinue, currentStep]);

  const handleBack = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3 | 4);
    }
  }, [currentStep]);

  // Keyboard navigation & Focus Trapping
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape
      if (e.key === 'Escape') {
        if (showExitConfirm) {
          setShowExitConfirm(false);
        } else {
          handleRequestClose();
        }
        return;
      }

      // Enter to advance if valid
      if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
        const target = e.target as HTMLElement;
        if (target.tagName !== 'BUTTON' && canContinue && currentStep < 4) {
          e.preventDefault();
          handleNext();
          return;
        }
      }

      // Focus Trap inside dialog
      if (e.key === 'Tab' && dialogRef.current) {
        const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, showExitConfirm, handleRequestClose, canContinue, currentStep, handleNext]);

  if (!isOpen) return null;

  const recommendations = generateRecommendations(selections);
  const progressPercent = currentStep === 4 ? 100 : Math.round((currentStep / 3) * 100);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="tp-discovery-title"
      style={{ zIndex: 120 }}
      className="fixed inset-0 flex items-center justify-center p-3 sm:p-4 bg-midnight/70 backdrop-blur-md animate-fade-in overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleRequestClose();
        }
      }}
    >
      {/* Screen Reader Step Announcement */}
      <div className="sr-only" aria-live="polite" role="status">
        {currentStep < 4
          ? `Step ${currentStep} of 3: ${STEP_NAMES[currentStep - 1]}`
          : 'Discovery recommendations loaded'}
      </div>

      <div
        ref={dialogRef}
        tabIndex={-1}
        style={{ maxWidth: '600px', maxHeight: '80vh' }}
        className="relative flex flex-col w-full rounded-[22px] bg-paper border border-[var(--hairline-strong)] shadow-[0_24px_56px_-12px_rgba(15,23,42,0.35)] overflow-hidden my-auto focus:outline-none"
      >
        {/* Subtle Top Progress Bar */}
        <div className="h-0.5 w-full bg-cloud shrink-0 overflow-hidden">
          <div
            className="h-full bg-sky transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Clean, High-Precision Header */}
        <div className="border-b border-[var(--hairline)] px-5 sm:px-6 py-3.5 bg-paper flex items-center justify-between gap-4 shrink-0">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="size-1.5 rounded-full bg-sky animate-pulse-dot shrink-0" />
              <span
                className="t-label font-bold text-sky-ink tracking-wider uppercase font-mono"
                style={{ fontSize: '10px' }}
              >
                {currentStep < 4 ? `STEP 0${currentStep} OF 03` : 'TAILORED BLUEPRINT'}
              </span>
              <span className="text-steel font-mono hidden xs:inline" style={{ fontSize: '10px' }}>/</span>
              <span className="text-graphite font-medium truncate hidden xs:inline" style={{ fontSize: '11px' }}>
                {currentStep === 1 && 'Testing Scope'}
                {currentStep === 2 && 'Primary Bottlenecks'}
                {currentStep === 3 && 'Team & Role'}
                {currentStep === 4 && 'Recommended Workspace'}
              </span>
            </div>
            <h2
              id="tp-discovery-title"
              className="text-[16px] sm:text-[17px] font-bold tracking-tight text-ink truncate"
            >
              Discover Your QA Workflow
            </h2>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Micro Connected Progress Stepper */}
            <div
              className="hidden sm:flex items-center gap-1.5"
              role="progressbar"
              aria-valuenow={currentStep}
              aria-valuemin={1}
              aria-valuemax={4}
            >
              {FLOW_STEPS.map((s, idx) => {
                const isCompleted = currentStep > s.step;
                const isActive = currentStep === s.step;

                return (
                  <React.Fragment key={s.step}>
                    <button
                      type="button"
                      disabled={!isCompleted}
                      onClick={() => {
                        if (isCompleted) {
                          setCurrentStep(s.step as 1 | 2 | 3);
                        }
                      }}
                      title={isCompleted ? `Return to Step ${s.step}: ${s.label}` : `Step ${s.step}: ${s.label}`}
                      className={`flex items-center justify-center size-5 rounded-full font-mono text-[10px] font-bold transition-all duration-200 select-none ${
                        isCompleted
                          ? 'bg-sky text-white cursor-pointer hover:bg-sky-ink shadow-xs'
                          : isActive
                          ? 'bg-sky-soft text-sky-ink border border-sky/40 ring-2 ring-sky/20 cursor-default'
                          : 'bg-cloud text-graphite/40 border border-[var(--hairline)] cursor-default'
                      }`}
                    >
                      {isCompleted ? (
                        <svg className="size-2.5 stroke-[3]" viewBox="0 0 16 16" fill="none" stroke="currentColor">
                          <path d="M3.5 8.5L6.5 11.5L12.5 4.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        s.step
                      )}
                    </button>

                    {idx < FLOW_STEPS.length - 1 && (
                      <div className="w-3.5 h-0.5 bg-cloud rounded-full overflow-hidden shrink-0">
                        <div
                          className="h-full bg-sky transition-all duration-400 ease-out"
                          style={{ width: currentStep > s.step ? '100%' : '0%' }}
                        />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Circular Hairline Close Button */}
            <button
              type="button"
              aria-label="Close discovery modal"
              onClick={handleRequestClose}
              className="size-7 sm:size-8 rounded-full border border-[var(--hairline)] bg-paper hover:bg-cloud hover:text-ink text-graphite flex items-center justify-center transition-colors cursor-pointer shrink-0"
            >
              <svg className="size-3.5 sm:size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Single Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-4">
          {currentStep === 1 && (
            <DiscoveryStep1
              selected={selections.helpTopics}
              onChange={(topics: HelpTopic[]) =>
                setSelections((prev) => ({ ...prev, helpTopics: topics }))
              }
            />
          )}

          {currentStep === 2 && (
            <DiscoveryStep2
              selected={selections.challenges}
              onChange={(challenges: TestingChallenge[]) =>
                setSelections((prev) => ({ ...prev, challenges }))
              }
            />
          )}

          {currentStep === 3 && (
            <DiscoveryStep3
              selected={selections.workRole}
              onChange={(role: WorkRole) =>
                setSelections((prev) => ({ ...prev, workRole: role }))
              }
            />
          )}

          {currentStep === 4 && (
            <DiscoveryResults
              selections={selections}
              result={recommendations}
              onClose={closeDiscovery}
              onStartOver={resetForm}
            />
          )}
        </div>

        {/* Action Footer (Steps 1 to 3) */}
        {currentStep < 4 && (
          <div className="border-t border-[var(--hairline)] px-5 sm:px-6 py-3 bg-cloud/20 flex items-center justify-between gap-3 shrink-0">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 h-9 text-[12.5px] font-medium transition-colors cursor-pointer shrink-0 ${
                currentStep === 1
                  ? 'opacity-0 pointer-events-none'
                  : 'text-graphite hover:text-ink hover:bg-cloud border border-transparent hover:border-[var(--hairline)]'
              }`}
            >
              <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={!canContinue}
              className="group/btn inline-flex items-center justify-center gap-1.5 rounded-full font-semibold transition-all active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40 whitespace-nowrap bg-ink text-canvas hover:bg-sky hover:text-white shadow-[inset_0_-1px_0_rgb(255_255_255/0.08)] h-9 px-5 py-1.5 text-[13px] cursor-pointer shrink-0"
            >
              <span>{currentStep === 3 ? 'View Architecture Blueprint' : 'Continue'}</span>
              <svg
                className="size-3.5 transition-transform group-hover/btn:translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}

        {/* Exit Confirmation Dialog */}
        {showExitConfirm && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-paper/95 backdrop-blur-md p-5 text-center animate-fade-in">
            <div className="max-w-xs">
              <h4 className="text-[15px] font-semibold text-ink">Leave discovery questionnaire?</h4>
              <p className="mt-1 text-[12px] text-graphite leading-relaxed">
                Your selections will be discarded if you close this window now.
              </p>
              <div className="mt-4 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowExitConfirm(false)}
                  className="rounded-full bg-ink px-4 py-1.5 text-[12px] font-semibold text-canvas hover:bg-arsenic transition-colors cursor-pointer"
                >
                  Keep Going
                </button>
                <button
                  type="button"
                  onClick={handleForceClose}
                  className="rounded-full border border-[var(--hairline-strong)] px-4 py-1.5 text-[12px] font-semibold text-graphite hover:text-signal-red hover:border-signal-red/30 transition-colors cursor-pointer"
                >
                  Discard
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
