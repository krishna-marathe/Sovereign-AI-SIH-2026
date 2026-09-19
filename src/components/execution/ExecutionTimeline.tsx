import type { ExecutionState } from "../../demo";
import ExecutionStep from "./ExecutionStep";

type Props = {
  state: ExecutionState;
  compact?: boolean;
};

export default function ExecutionTimeline({ state, compact }: Props) {
  const completedCount = state.steps.filter(s => s.status === "completed").length;
  const totalSteps = state.steps.length;

  return (
    <div className={`${compact ? "" : "rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden"}`}>
      {!compact && (
        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Execution Pipeline</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-500">{completedCount}/{totalSteps}</span>
            {state.active && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 font-bold border border-teal-200 animate-pulse">
                RUNNING
              </span>
            )}
          </div>
        </div>
      )}

      <div className={`${compact ? "" : "p-4"} flex flex-col gap-0`}>
        {state.steps.map((step, idx) => (
          <ExecutionStep
            key={idx}
            label={step.label}
            status={step.status}
            durationMs={step.durationMs}
            estimatedMs={step.estimatedMs}
            subSteps={step.subSteps}
            isLast={idx === state.steps.length - 1}
          />
        ))}
      </div>

      {!compact && state.active && (
        <div className="px-4 pb-4">
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-teal-500 transition-all duration-300 ease-linear rounded-full"
              style={{ width: `${state.progress}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}
