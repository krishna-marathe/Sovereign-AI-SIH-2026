import { useState } from "react";
import { useNav, Page } from "../context/NavContext";

type NavItem = {
  label: string;
  page: Page;
  icon: string;
};

type NavGroup = {
  group: string;
  items: NavItem[];
};

const navGroups: NavGroup[] = [
  {
    group: "HOME",
    items: [
      { label: "Dashboard", page: "dashboard", icon: "⊞" },
      { label: "Workbench", page: "workbench", icon: "⬡" },
    ],
  },
  {
    group: "WORK",
    items: [
      { label: "Projects", page: "projects", icon: "◫" },
      { label: "Tasks", page: "tasks", icon: "◻" },
      { label: "Artifacts", page: "artifacts", icon: "⬚" },
      { label: "Approvals", page: "approvals", icon: "✓" },
    ],
  },
  {
    group: "KNOWLEDGE",
    items: [
      { label: "Knowledge Base", page: "knowledge-base", icon: "◈" },
      { label: "Documents", page: "documents", icon: "◧" },
      { label: "Research Notebooks", page: "research-notebooks", icon: "◉" },
      { label: "Notes", page: "notes", icon: "◪" },
    ],
  },
  {
    group: "AI",
    items: [
      { label: "Agents", page: "agents", icon: "◎" },
      { label: "Model Router", page: "model-router", icon: "◈" },
      { label: "Models", page: "models", icon: "▣" },
      { label: "Tool Registry", page: "tool-registry", icon: "⬡" },
      { label: "Offline Plugins", page: "offline-plugins", icon: "⬟" },
    ],
  },
  {
    group: "DEVELOPMENT",
    items: [
      { label: "Coding Workspace", page: "coding-workspace", icon: "⌨" },
      { label: "Sandbox", page: "sandbox", icon: "⬜" },
    ],
  },
  {
    group: "ENGINEERING",
    items: [
      { label: "Engineering Analysis", page: "engineering-analysis", icon: "△" },
      { label: "Engineering Drawings", page: "engineering-drawings", icon: "⊡" },
      { label: "Multimodal AI", page: "multimodal", icon: "◫" },
    ],
  },
  {
    group: "COLLABORATION",
    items: [
      { label: "Personal Chat", page: "personal-chat", icon: "◯" },
    ],
  },
  {
    group: "SECURITY & OPS",
    items: [
      { label: "Security Center", page: "security-center", icon: "⊠" },
      { label: "RBAC & Access", page: "rbac", icon: "◩" },
      { label: "Audit Trail", page: "audit-trail", icon: "▤" },
      { label: "System Health", page: "system-health", icon: "◈" },
      { label: "GPU / Compute", page: "gpu-compute", icon: "▦" },
      { label: "Network Security", page: "network-security", icon: "⊟" },
    ],
  },
  {
    group: "SYSTEM",
    items: [
      { label: "Settings", page: "settings", icon: "◎" },
      { label: "Help Center", page: "help-center", icon: "?" },
    ],
  },
];

export default function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const { currentPage, navigate } = useNav();
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(["HOME", "WORK", "KNOWLEDGE", "AI"])
  );

  const toggleGroup = (group: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(group)) next.delete(group);
      else next.add(group);
      return next;
    });
  };

  return (
    <aside
      className="flex flex-col h-full border-r bg-white transition-all duration-300 ease-in-out"
      style={{
        width: collapsed ? 72 : 260,
        minWidth: collapsed ? 72 : 260,
        borderColor: "var(--color-border)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-4 h-16 border-b"
        style={{ borderColor: "var(--color-border)" }}
      >
        <button
          onClick={onToggle}
          className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-slate-100 flex-shrink-0 transition-colors"
          title="Toggle sidebar"
        >
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
            <rect x="1" y="3" width="14" height="1.5" rx="0.75" fill="var(--color-teal)" />
            <rect x="1" y="7.25" width="14" height="1.5" rx="0.75" fill="var(--color-teal)" />
            <rect x="1" y="11.5" width="14" height="1.5" rx="0.75" fill="var(--color-teal)" />
          </svg>
        </button>
        {!collapsed && (
          <div className="overflow-hidden flex-1">
            <div className="font-semibold text-sm leading-tight text-slate-900 truncate">
              Sovereign AI Workbench
            </div>
            <div className="text-xs text-slate-500 mt-0.5 truncate">
              MRPL • Secure Internal
            </div>
          </div>
        )}
      </div>

      {/* Sovereign status */}
      {!collapsed && (
        <div className="mx-4 mt-4 mb-2 px-3 py-2.5 rounded-lg bg-green-50/50 border border-green-200">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-600 shadow-[0_0_8px_rgba(22,163,74,0.6)]"></div>
            <span className="text-xs font-medium text-green-700">Sovereign Mode Active</span>
          </div>
        </div>
      )}
      {collapsed && (
        <div className="flex justify-center mt-4 mb-2">
          <div className="w-2 h-2 rounded-full bg-green-600 shadow-[0_0_8px_rgba(22,163,74,0.6)]"></div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2 px-3 space-y-1">
        {navGroups.map((group) => (
          <div key={group.group} className="mb-2">
            {!collapsed && (
              <button
                onClick={() => toggleGroup(group.group)}
                className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-slate-50 rounded-md transition-colors group"
              >
                <span className="text-[11px] font-semibold tracking-wider text-slate-500 group-hover:text-slate-700 transition-colors">
                  {group.group}
                </span>
                <span className="text-xs text-slate-400 group-hover:text-slate-600 transition-colors">
                  {expandedGroups.has(group.group) ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  ) : (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                  )}
                </span>
              </button>
            )}
            <div className={`${!collapsed && "mt-1 space-y-0.5"}`}>
              {(collapsed || expandedGroups.has(group.group)) &&
                group.items.map((item) => {
                  const active = currentPage === item.page;
                  return (
                    <button
                      key={item.page}
                      onClick={() => navigate(item.page)}
                      title={collapsed ? item.label : undefined}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-all duration-200 rounded-md ${
                        active 
                          ? "bg-teal-50/80 text-teal-700" 
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      } ${collapsed ? "justify-center" : ""}`}
                    >
                      <span
                        className={`flex-shrink-0 text-sm w-5 text-center transition-colors ${
                          active ? "text-teal-600" : "text-slate-400"
                        }`}
                      >
                        {item.icon}
                      </span>
                      {!collapsed && (
                        <span className={`text-sm truncate transition-all ${active ? "font-medium" : "font-normal"}`}>
                          {item.label}
                        </span>
                      )}
                    </button>
                  );
                })}
            </div>
          </div>
        ))}
      </nav>

      {/* User profile */}
      {!collapsed && (
        <div className="px-4 py-4 border-t border-slate-200 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold bg-teal-600 text-white shadow-sm flex-shrink-0">
              AR
            </div>
            <div className="overflow-hidden flex-1">
              <div className="text-sm font-medium text-slate-900 truncate">
                Anita Rao
              </div>
              <div className="text-xs text-slate-500 truncate mt-0.5">
                Process Engineer
              </div>
            </div>
            <span className="text-[10px] px-2 py-1 rounded-md font-medium flex-shrink-0 bg-amber-100 text-amber-800 border border-amber-200">
              CONF
            </span>
          </div>
        </div>
      )}
      {collapsed && (
        <div className="px-2 py-4 border-t border-slate-200 flex justify-center bg-slate-50/50">
           <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold bg-teal-600 text-white shadow-sm flex-shrink-0 cursor-pointer" title="Anita Rao">
              AR
            </div>
        </div>
      )}
    </aside>
  );
}
