import { useState, useEffect } from "react";
import type { StepStatus } from "../../demo";

type Props = {
  label: string;
  status: StepStatus;
  durationMs?: number;
  estimatedMs?: number;
  isLast?: boolean;
  subSteps?: string[];
};

export default function ExecutionStep({ label, status, durationMs, estimatedMs, isLast, subSteps }: Props) {
  const [activeSubStep, setActiveSubStep] = useState(-1);

  useEffect(() => {
    if (status === "running" && subSteps && subSteps.length > 0) {
      const stepDuration = estimatedMs || durationMs || 3000;
      const intervalMs = stepDuration / (subSteps.length + 1); // +1 to allow time for the final checkmark state before step completes
      let current = 0;
      setActiveSubStep(0);
      const interval = setInterval(() => {
        current++;
        if (current <= subSteps.length) {
          setActiveSubStep(current);
        }
      }, intervalMs);
      return () => clearInterval(interval);
    } else if (status === "completed") {
      setActiveSubStep(subSteps ? subSteps.length : -1);
    }
  }, [status, subSteps, durationMs, estimatedMs]);

  return (
    <div className="flex items-start gap-3">
      {/* Status icon + connecting line */}
      <div className="flex flex-col items-center flex-shrink-0">
        {status === "completed" ? (
          <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center border border-emerald-200">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
        ) : status === "running" ? (
          <div className="w-5 h-5 rounded-full border-2 border-slate-200 border-t-teal-500 animate-spin flex-shrink-0"></div>
        ) : status === "failed" ? (
          <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center border border-red-200">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="3" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </div>
        ) : (
          <div className="w-5 h-5 rounded-full border-2 border-slate-200 flex-shrink-0"></div>
        )}
        {!isLast && (
          <div className={`w-0.5 h-full min-h-[20px] mt-0.5 ${status === "completed" ? "bg-emerald-200" : "bg-slate-200"}`}></div>
        )}
      </div>

      {/* Label + duration */}
      <div className="flex-1 min-w-0 -mt-0.5 pb-2">
        <span className={`text-[13px] leading-tight ${
          status === "running" ? "font-semibold text-slate-800" :
          status === "completed" ? "text-slate-500" :
          status === "failed" ? "text-red-600 font-medium" :
          "text-slate-400"
        }`}>
          {label}
        </span>
        {status === "completed" && durationMs && (
          <span className="text-[10px] text-slate-400 ml-2">{durationMs < 1000 ? `${durationMs}ms` : `${(durationMs / 1000).toFixed(1)}s`}</span>
        )}
        
        {/* Sub-steps */}
        {subSteps && (status === "running" || status === "completed") && (
          <div className="mt-1.5 ml-1 space-y-1">
            {subSteps.map((sub, i) => {
              if (status === "running" && i > activeSubStep) return null;
              const isCompleted = status === "completed" || i < activeSubStep;
              const isRunning = status === "running" && i === activeSubStep;
              return (
                <div key={i} className={`flex items-center gap-1.5 text-[11px] ${isCompleted ? 'text-slate-500' : isRunning ? 'text-teal-600 font-medium animate-pulse' : ''}`}>
                  {isCompleted ? (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-emerald-500"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  ) : (
                    <span className="w-2.5 flex justify-center">●</span>
                  )}
                  {sub}
                </div>
              );
            })}
            {(status === "completed" || (status === "running" && activeSubStep >= subSteps.length)) && (
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-medium mt-1.5">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Artifact generated
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
