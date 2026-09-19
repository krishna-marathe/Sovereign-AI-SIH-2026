import type { AgentRunStatus } from "../../demo";
import type { AgentStepGroup } from "../../demo/demoAgents";
import { getAgentById } from "../../demo";

type Props = {
  agents: AgentRunStatus[];
  plan: AgentStepGroup[];
};

export default function AgentExecution({ agents, plan }: Props) {
  const getAgent = (id: string) => {
    const def = getAgentById(id);
    const status = agents.find(a => a.agentId === id);
    return { def, status };
  };

  return (
    <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
        <span className="text-sm">🤖</span>
        <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Agent Execution</span>
      </div>

      <div className="p-4">
        {plan.map((group, groupIdx) => (
          <div key={groupIdx}>
            {/* Group of agents */}
            <div className={`${group.type === "parallel" ? "flex flex-wrap gap-2" : ""}`}>
              {group.agents.map((agentId) => {
                const { def, status } = getAgent(agentId);
                if (!def) return null;

                const s = status?.status || "pending";

                return (
                  <div
                    key={agentId}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border transition-all ${
                      s === "completed"
                        ? "bg-emerald-50 border-emerald-200"
                        : s === "running"
                        ? "bg-blue-50 border-blue-200 shadow-sm"
                        : "bg-slate-50 border-slate-200"
                    } ${group.type === "parallel" ? "flex-1 min-w-[140px]" : "mb-1"}`}
                  >
                    {/* Status indicator */}
                    {s === "completed" ? (
                      <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      </div>
                    ) : s === "running" ? (
                      <div className="w-4 h-4 rounded-full border-2 border-slate-200 border-t-blue-500 animate-spin flex-shrink-0"></div>
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-slate-200 flex-shrink-0"></div>
                    )}

                    <span className="text-xs flex-shrink-0">{def.icon}</span>
                    <span className={`text-xs font-medium truncate ${
                      s === "running" ? "text-blue-800" : s === "completed" ? "text-emerald-700" : "text-slate-500"
                    }`}>
                      {def.name}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Connector between groups */}
            {groupIdx < plan.length - 1 && (
              <div className="flex justify-center py-1">
                <div className="w-0.5 h-3 bg-slate-200"></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
