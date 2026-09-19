import { useState } from "react";
import { useNav } from "../context/NavContext";

const riskColors: Record<string, { bg: string; color: string }> = {
  Low: { bg: "#DCFCE7", color: "#15803D" },
  Medium: { bg: "#FEF3C7", color: "#92400E" },
  High: { bg: "#FEE2E2", color: "#991B1B" },
};

const clsColors: Record<string, { bg: string; color: string }> = {
  CONFIDENTIAL: { bg: "#FEF3C7", color: "#92400E" },
  INTERNAL: { bg: "#DBEAFE", color: "#1E40AF" },
  RESTRICTED: { bg: "#FEE2E2", color: "#991B1B" },
  PUBLIC: { bg: "#F0FDF4", color: "#15803D" },
};

export default function AuditTrail() {
  const { auditEvents } = useNav();
  const [search, setSearch] = useState("");
  const [filterUser, setFilterUser] = useState("All");
  const [filterRisk, setFilterRisk] = useState("All");

  const filtered = auditEvents.filter((e) => {
    const matchSearch = e.query.toLowerCase().includes(search.toLowerCase()) || e.user.toLowerCase().includes(search.toLowerCase());
    const matchUser = filterUser === "All" || e.user === filterUser;
    const matchRisk = filterRisk === "All" || e.risk === filterRisk;
    return matchSearch && matchUser && matchRisk;
  });

  return (
    <div className="flex-1 overflow-y-auto" style={{ background: "var(--color-bg-secondary)" }}>
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold" style={{ color: "var(--color-text-primary)" }}>Audit Trail</h1>
            <p className="text-sm mt-0.5" style={{ color: "var(--color-text-muted)" }}>Every action logged and tamper-proof · 1,847 events today</p>
          </div>
          <button className="text-xs px-4 py-2 rounded border font-medium" style={{ borderColor: "var(--color-border)", color: "var(--color-teal)" }}>
            Export (Authorized Users)
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-5">
          <div className="relative">
            <input
              type="text"
              placeholder="Search audit events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-4 py-2 text-sm rounded border outline-none w-64"
              style={{ borderColor: "var(--color-border)", fontSize: 13 }}
            />
            <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 opacity-40" width="13" height="13" viewBox="0 0 16 16" fill="none">
              <circle cx="7" cy="7" r="5.5" stroke="#0F172A" strokeWidth="1.5" />
              <path d="M11.5 11.5L14.5 14.5" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <select
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value)}
            className="text-xs border rounded px-2 py-2 outline-none"
            style={{ borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}
          >
            <option value="All">All Users</option>
            <option>Anita Rao</option>
            <option>Rajesh Kumar</option>
          </select>
          <select
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value)}
            className="text-xs border rounded px-2 py-2 outline-none"
            style={{ borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}
          >
            <option value="All">All Risk Levels</option>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
          <input
            type="date"
            defaultValue="2026-09-16"
            className="text-xs border rounded px-2 py-2 outline-none"
            style={{ borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded border overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                {["Event ID", "Timestamp", "User", "Action", "Agent / Tool", "Output", "Risk", "Classification"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: "var(--color-text-muted)", background: "var(--color-surface-subtle)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((e, i) => (
                <tr key={e.id} className="hover:bg-slate-50 transition-colors" style={{ borderBottom: i < filtered.length - 1 ? "1px solid var(--color-border)" : "none" }}>
                  <td className="px-4 py-3 font-mono text-xs" style={{ color: "var(--color-text-muted)" }}>{e.id}</td>
                  <td className="px-4 py-3 text-xs font-mono whitespace-nowrap" style={{ color: "var(--color-text-muted)" }}>{e.ts}</td>
                  <td className="px-4 py-3 text-xs font-medium" style={{ color: "var(--color-text-primary)" }}>{e.user}</td>
                  <td className="px-4 py-3">
                    <div className="text-xs font-medium" style={{ color: "var(--color-text-primary)", fontSize: 12 }}>{e.action}</div>
                    <div className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>{e.query}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-xs" style={{ color: "var(--color-text-secondary)" }}>{e.agent}</div>
                    <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>{e.tool}</div>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: "var(--color-text-secondary)" }}>{e.output}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-1.5 py-0.5 rounded font-medium" style={{ background: riskColors[e.risk].bg, color: riskColors[e.risk].color, fontSize: 10 }}>{e.risk}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-1.5 py-0.5 rounded font-medium" style={{ background: clsColors[e.cls]?.bg || "#F1F5F9", color: clsColors[e.cls]?.color || "#475569", fontSize: 10 }}>{e.cls}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
