import type { ExecutionRoute } from "../../demo";

type Props = {
  route: ExecutionRoute;
  modelName: string;
  modelReason: string;
  complexity: "simple" | "medium" | "complex";
};

const routeConfig: Record<ExecutionRoute, { label: string; icon: string; color: string; bg: string; border: string }> = {
  fast: { label: "Fast Path", icon: "⚡", color: "text-teal-700", bg: "bg-teal-50", border: "border-teal-200" },
  knowledge: { label: "Knowledge Path", icon: "🔍", color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200" },
  complex: { label: "Complex Path", icon: "⚙️", color: "text-purple-700", bg: "bg-purple-50", border: "border-purple-200" },
  coding: { label: "Coding Path", icon: "💻", color: "text-slate-700", bg: "bg-slate-50", border: "border-slate-300" },
  engineering: { label: "Engineering Path", icon: "📐", color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200" },
};

const complexityConfig: Record<string, { label: string; color: string; bg: string }> = {
  simple: { label: "Simple", color: "text-emerald-700", bg: "bg-emerald-50" },
  medium: { label: "Medium", color: "text-blue-700", bg: "bg-blue-50" },
  complex: { label: "Complex", color: "text-purple-700", bg: "bg-purple-50" },
};

export default function RouterVisualization({ route, modelName, modelReason, complexity }: Props) {
  const rc = routeConfig[route];
  const cc = complexityConfig[complexity];

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="px-3 py-2 border-b border-slate-100 bg-slate-50/50">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Adaptive Router Decision</span>
      </div>
      <div className="px-3 py-2.5 flex flex-wrap items-center gap-2">
        {/* Complexity */}
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${cc.bg} ${cc.color} border border-current/10`}>
          {cc.label}
        </span>
        <span className="text-slate-300 text-xs">→</span>
        {/* Route */}
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${rc.bg} ${rc.color} ${rc.border} border`}>
          {rc.icon} {rc.label}
        </span>
        <span className="text-slate-300 text-xs">→</span>
        {/* Model */}
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
          {modelName}
        </span>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-green-50 text-green-700 border border-green-200 flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
          LOCAL MODEL
        </span>
      </div>
      <div className="px-3 pb-2 flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-slate-400">Selection reason:</span>
          <span className="text-[10px] text-slate-600 italic">{modelReason}</span>
        </div>
      </div>
      <div className="px-3 py-2 bg-slate-50 border-t border-slate-100 flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold text-slate-500">NETWORK EGRESS:</span>
          <span className="text-[10px] font-bold text-slate-700 bg-slate-200 px-1.5 py-0.5 rounded">BLOCKED</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold text-slate-500">DATA:</span>
          <span className="text-[10px] font-bold text-amber-800 bg-amber-100 border border-amber-200 px-1.5 py-0.5 rounded">CONFIDENTIAL</span>
        </div>
      </div>
    </div>
  );
}
