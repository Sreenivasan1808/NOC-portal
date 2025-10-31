import React from "react";

/**
 * MultiStepProgress
 * A flexible, accessible multi-step progress bar React component using Tailwind CSS + Framer Motion.
 *
 * Props
 * - steps: Array<{ key: string|number, label?: string, description?: string, icon?: ReactNode }>
 * - currentStep: index (0-based) of the active step
 * - onStepChange?: (index) => void  // called when user clicks a step (if provided)
 * - orientation: 'horizontal' | 'vertical' (default 'horizontal')
 * - size: 'sm' | 'md' | 'lg' (affects spacing & icon sizes)
 * - completedClass, activeClass, pendingClass: optional tailwind class overrides
 * - showNumbers: boolean to show step numbers inside circles
 * - className: wrapper className
 *
 * Example usage:
 * <MultiStepProgress
 *    steps={[{key:1,label:'Start'},{key:2,label:'Design'},{key:3,label:'Build'},{key:4,label:'Deploy'}]}
 *    currentStep={2}
 *    onStepChange={(i)=>console.log(i)}
 * />
 */

const SIZES = {
  sm: {
    circle: "w-6 h-6 text-sm",
    icon: "w-3.5 h-3.5",
    gap: "gap-2",
    label: "text-xs",
  },
  md: {
    circle: "w-8 h-8 text-sm",
    icon: "w-4 h-4",
    gap: "gap-3",
    label: "text-sm",
  },
  lg: {
    circle: "w-10 h-10 text-base",
    icon: "w-5 h-5",
    gap: "gap-4",
    label: "text-base",
  },
};

export default function MultiStepProgress({
  steps = [],
  currentStep = 0,
  onStepChange,
  orientation = "horizontal",
  size = "md",
  completedClass = "bg-primary text-white",
  activeClass = "bg-accent text-white",
  pendingClass = "bg-white text-gray-300 border border-gray-300",
  showNumbers = true,
  className = "",
}) {
  const cfg = SIZES[size] || SIZES.md;

  const isClickable = typeof onStepChange === "function";

  const containerClass =
    orientation === "vertical"
      ? `flex flex-col ${cfg.gap} ${className}`
      : `flex items-center ${cfg.gap} ${className}`;

  return (
    <nav aria-label="Progress" className={containerClass}>
      {steps.map((step, idx) => {
        const state =
          idx < currentStep
            ? "completed"
            : idx === currentStep
            ? "active"
            : "pending";

        const circleClasses =
          state === "completed"
            ? completedClass
            : state === "active"
            ? activeClass
            : pendingClass;

        return (
          <div
            key={step.key ?? idx}
            className={
              orientation === "vertical"
                ? "flex flex-col items-start"
                : "flex flex-col items-center"
            }
          >
            {/* Step circle + click */}
            <div>
              <button
                type="button"
                onClick={() => isClickable && onStepChange(idx)}
                onKeyDown={(e) => {
                  if (!isClickable) return;
                  if (e.key === "Enter" || e.key === " ") onStepChange(idx);
                }}
                aria-current={state === "active" ? "step" : undefined}
                aria-disabled={!isClickable}
                aria-label={
                  step.label
                    ? `Go to step ${idx + 1}: ${step.label}`
                    : `Go to step ${idx + 1}`
                }
                className={`flex flex-col items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300 transition-shadow ${cfg.circle} ${circleClasses}`}
              >
                {step.icon ? (
                  // if an icon node is provided, render it
                  <span
                    className={`${cfg.icon} flex items-center justify-center`}
                    aria-hidden
                  >
                    {step.icon}
                  </span>
                ) : showNumbers ? (
                  <span className="select-none font-medium">{idx + 1}</span>
                ) : (
                  <span className="sr-only">Step {idx + 1}</span>
                )}
              </button>

              {/* Connector for horizontal layout */}
              {idx !== steps.length - 1 && orientation === "horizontal" && (
                <div className="flex-1 px-2 bg-primary">
                  <Connector
                    progress={computeConnectorProgress(idx, currentStep)}
                  />
                </div>
              )}

              {/* Connector for vertical layout */}
              {idx !== steps.length - 1 && orientation === "vertical" && (
                <div className="ml-4 -mt-1">
                  <ConnectorVertical
                    progress={computeConnectorProgress(idx, currentStep)}
                  />
                </div>
              )}
            </div>

            {/* Labels (below for horizontal, right for vertical) */}
            {step.label && orientation === "vertical" && (
              <div className="ml-3">
                <div className={`font-medium ${cfg.label}`}>{step.label}</div>
                {step.description && (
                  <div className="text-xs text-slate-500">
                    {step.description}
                  </div>
                )}
              </div>
            )}

            {step.label && orientation === "horizontal" && (
              <div className="hidden sm:block ml-2">
                <div className={`font-medium ${cfg.label}`}>{step.label}</div>
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}

function computeConnectorProgress(stepIndex, currentStep) {
  // returns 0..1 value used by connector animation
  if (currentStep > stepIndex) return 1;
  if (currentStep === stepIndex) return 0.5;
  return 0;
}

function Connector({ progress = 0 }) {
  return (
    <div className="h-1 w-full bg-gray-300 rounded overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-blue-500 to-green-400"
        style={{ width: `${Math.min(Math.max(progress, 0), 1) * 100}%` }}
      />
    </div>
  );
}

function ConnectorVertical({ progress = 0 }) {
  return (
    <div className="w-[2px] h-10 bg-gray-300 rounded mx-auto overflow-hidden">
      <div
        className="w-full bg-gradient-to-b from-blue-500 to-green-400 origin-top"
        style={{ height: `${Math.min(Math.max(progress, 0), 1) * 100}%` }}
      />
    </div>
  );
}

/* ----------------
   Usage examples (paste into your React page):

import MultiStepProgress from './MultiStepProgress';

export default function Demo(){
  const [step, setStep] = React.useState(1);
  const steps = [
    { key: 'start', label: 'Start' },
    { key: 'design', label: 'Design' },
    { key: 'build', label: 'Build' },
    { key: 'qa', label: 'QA' },
    { key: 'deploy', label: 'Deploy' },
  ];

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <MultiStepProgress
        steps={steps}
        currentStep={step}
        onStepChange={(i)=>setStep(i)}
        size="md"
      />

      <div className="mt-6 flex gap-2">
        <button onClick={()=>setStep(s=>Math.max(0,s-1))} className="px-3 py-1 rounded bg-slate-100">Back</button>
        <button onClick={()=>setStep(s=>Math.min(steps.length-1,s+1))} className="px-3 py-1 rounded bg-slate-800 text-white">Next</button>
      </div>
    </div>
  );
}

   ---------------- */
