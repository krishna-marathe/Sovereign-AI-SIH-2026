import { demoModels } from "../../demo";
import type { DemoModel } from "../../demo";

type Props = {
  mode: "auto" | "manual";
  autoModel?: { id: string; name: string; reason: string };
  selectedModelId: string;
  onModelChange: (id: string) => void;
  onModeChange: (mode: "auto" | "manual") => void;
};

export default function ModelSelector({ mode, autoModel, selectedModelId, onModelChange, onModeChange }: Props) {
  const selectedModel = demoModels.find(m => m.id === selectedModelId);
  const displayModel = mode === "auto" && autoModel ? demoModels.find(m => m.id === autoModel.id) : selectedModel;

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="px-3 py-2 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Model Selection</span>
        <div className="flex items-center p-0.5 rounded-lg bg-slate-100 border border-slate-200">
          {(["auto", "manual"] as const).map((m) => (
            <button
              key={m}
              onClick={() => onModeChange(m)}
              className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all capitalize ${
                mode === m
                  ? "bg-white text-teal-700 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {m === "auto" ? "● Auto" : "○ Manual"}
            </button>
          ))}
        </div>
      </div>

      <div className="p-3">
        {mode === "manual" ? (
          <select
            value={selectedModelId}
            onChange={(e) => onModelChange(e.target.value)}
            className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-2 outline-none bg-white text-slate-700 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 shadow-sm"
          >
            {demoModels.filter(m => m.type !== "embedding" && m.type !== "reranking").map((m) => (
              <option key={m.id} value={m.id}>{m.displayName}</option>
            ))}
          </select>
        ) : autoModel ? (
          <div className="text-xs text-slate-600">
            <div className="font-semibold text-slate-800 mb-1">{autoModel.name}</div>
            <div className="text-slate-500 italic text-[11px]">{autoModel.reason}</div>
          </div>
        ) : (
          <div className="text-xs text-slate-400 italic">Model will be selected automatically</div>
        )}

        {displayModel && (
          <div className="mt-2.5 pt-2.5 border-t border-slate-100 flex flex-wrap gap-1.5">
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-100">
              ● Local Execution
            </span>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200">
              GPU: {displayModel.gpu.split("—")[0].trim()}
            </span>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200">
              VRAM: {displayModel.vram}
            </span>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200">
              Latency: {displayModel.latency}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
