import { useState } from "react";
import { NavContext, Page, Project } from "./context/NavContext";
import type { DemoArtifact, AuditEvent } from "./context/NavContext";
import type { DemoScenario, ExecutionState } from "./demo";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import Dashboard from "./pages/Dashboard";
import Workbench from "./pages/Workbench";
import Login from "./pages/Login";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Tasks from "./pages/Tasks";
import Artifacts from "./pages/Artifacts";
import Approvals from "./pages/Approvals";
import KnowledgeBase from "./pages/KnowledgeBase";
import Documents from "./pages/Documents";
import ResearchNotebooks from "./pages/ResearchNotebooks";
import Notes from "./pages/Notes";
import Agents from "./pages/Agents";
import ModelRouter from "./pages/ModelRouter";
import Models from "./pages/Models";
import ToolRegistry from "./pages/ToolRegistry";
import OfflinePlugins from "./pages/OfflinePlugins";
import CodingWorkspace from "./pages/CodingWorkspace";
import Sandbox from "./pages/Sandbox";
import EngineeringAnalysis from "./pages/EngineeringAnalysis";
import EngineeringDrawings from "./pages/EngineeringDrawings";
import MultimodalWorkspace from "./pages/MultimodalWorkspace";
import PersonalChat from "./pages/PersonalChat";
import SecurityCenter from "./pages/SecurityCenter";
import RBAC from "./pages/RBAC";
import AuditTrail from "./pages/AuditTrail";
import SystemHealth from "./pages/SystemHealth";
import GPU from "./pages/GPU";
import NetworkSecurity from "./pages/NetworkSecurity";
import HelpCenter from "./pages/HelpCenter";
import Settings from "./pages/Settings";

function PageContent({ page }: { page: Page }) {
  switch (page) {
    case "dashboard": return <Dashboard />;
    case "workbench": return <Workbench />;
    case "projects": return <Projects />;
    case "project-detail": return <ProjectDetail />;
    case "tasks": return <Tasks />;
    case "artifacts": return <Artifacts />;
    case "approvals": return <Approvals />;
    case "knowledge-base": return <KnowledgeBase />;
    case "documents": return <Documents />;
    case "collections": return <KnowledgeBase />;
    case "research-notebooks": return <ResearchNotebooks />;
    case "notes": return <Notes />;
    case "agents": return <Agents />;
    case "model-router": return <ModelRouter />;
    case "models": return <Models />;
    case "tool-registry": return <ToolRegistry />;
    case "offline-plugins": return <OfflinePlugins />;
    case "coding-workspace": return <CodingWorkspace />;
    case "sandbox": return <Sandbox />;
    case "engineering-analysis": return <EngineeringAnalysis />;
    case "engineering-drawings": return <EngineeringDrawings />;
    case "multimodal": return <MultimodalWorkspace />;
    case "collaboration": return <PersonalChat />;
    case "personal-chat": return <PersonalChat />;
    case "security-center": return <SecurityCenter />;
    case "rbac": return <RBAC />;
    case "audit-trail": return <AuditTrail />;
    case "system-health": return <SystemHealth />;
    case "gpu-compute": return <GPU />;
    case "network-security": return <NetworkSecurity />;
    case "help-center": return <HelpCenter />;
    case "settings": return <Settings />;
    default: return <Dashboard />;
  }
}

const initialProjects: Project[] = [
  { name: "CDU-4 Inspection Analysis", owner: "Anita Rao", dept: "Process Engineering", status: "Active", progress: 72, tasks: 14, artifacts: 3, cls: "CONFIDENTIAL", agents: ["Engineering Agent", "HSE Agent"], updated: "16 Sep 2026", contributors: ["Anita Rao", "Rajesh Kumar"] },
  { name: "P-102 Pump Maintenance Study", owner: "Rajesh Kumar", dept: "Inspection Engineering", status: "Active", progress: 45, tasks: 9, artifacts: 1, cls: "CONFIDENTIAL", agents: ["HSE/Inspection Agent"], updated: "15 Sep 2026", contributors: ["Rajesh Kumar"] },
  { name: "Vendor Technical Evaluation — CX-4", owner: "Priya Nair", dept: "Procurement", status: "Completed", progress: 100, tasks: 12, artifacts: 5, cls: "INTERNAL", agents: ["Research Agent", "Document Agent"], updated: "14 Sep 2026", contributors: ["Priya Nair", "Suresh Bhat"] },
  { name: "Reformer Unit Optimization", owner: "Suresh Bhat", dept: "Process Engineering", status: "Active", progress: 33, tasks: 6, artifacts: 0, cls: "CONFIDENTIAL", agents: ["Data Analysis Agent", "Engineering Agent"], updated: "16 Sep 2026", contributors: ["Suresh Bhat"] },
  { name: "Pipeline Anomaly Investigation", owner: "Meena Shetty", dept: "HSE", status: "Pending Approval", progress: 88, tasks: 11, artifacts: 2, cls: "RESTRICTED", agents: ["HSE Agent", "Document Agent"], updated: "12 Sep 2026", contributors: ["Meena Shetty"] },
  { name: "Annual Turnaround Planning 2027", owner: "Arvind Rao", dept: "Maintenance", status: "Planning", progress: 12, tasks: 3, artifacts: 0, cls: "INTERNAL", agents: [], updated: "10 Sep 2026", contributors: ["Arvind Rao"] },
];

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [pendingSandboxTask, setPendingSandboxTask] = useState<string | null>(null);

  // Demo execution state
  const [activeScenario, setActiveScenario] = useState<DemoScenario | null>(null);
  const [executionState, setExecutionState] = useState<ExecutionState | null>(null);
  const [demoArtifacts, setDemoArtifacts] = useState<DemoArtifact[]>([]);
  
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([
    { id: "EVT-0847", user: "Anita Rao", query: "Upload CDU-4 inspection report", agent: "Document Agent", model: "Vision Model", tool: "OCR Engine", action: "DOCUMENT_UPLOAD", approval: "—", output: "47 pages indexed", ts: "16 Sep 2026 14:22:03", cls: "CONFIDENTIAL", risk: "Low" },
    { id: "EVT-0848", user: "Document Agent", query: "Extract and chunk report", agent: "Document Agent", model: "—", tool: "PDF Parser", action: "DOCUMENT_PROCESS", approval: "—", output: "1,284 chunks created", ts: "16 Sep 2026 14:22:31", cls: "CONFIDENTIAL", risk: "Low" },
    { id: "EVT-0849", user: "Anita Rao", query: "Compare inspection report with SOP", agent: "HSE Agent", model: "Small LLM", tool: "Hybrid RAG", action: "KNOWLEDGE_QUERY", approval: "—", output: "3 sources retrieved, analysis complete", ts: "16 Sep 2026 14:25:10", cls: "CONFIDENTIAL", risk: "Low" },
    { id: "EVT-0850", user: "HSE Agent", query: "Request approval — management note generation", agent: "Document Agent", model: "Small LLM", tool: "Template Engine", action: "APPROVAL_REQUEST", approval: "Pending", output: "Approval created APR-2024-001", ts: "16 Sep 2026 14:30:45", cls: "CONFIDENTIAL", risk: "Medium" },
    { id: "EVT-0851", user: "Rajesh Kumar", query: "Show all open maintenance tasks for CDU-4", agent: "Data Analysis Agent", model: "No LLM", tool: "PostgreSQL Query Tool", action: "DATABASE_QUERY", approval: "—", output: "8 records returned (read-only)", ts: "16 Sep 2026 14:35:00", cls: "INTERNAL", risk: "Low" },
    { id: "EVT-0852", user: "System", query: "Periodic security scan", agent: "—", model: "—", tool: "Security Scanner", action: "SECURITY_SCAN", approval: "—", output: "No threats detected", ts: "16 Sep 2026 14:00:00", cls: "PUBLIC", risk: "Low" },
  ]);

  const addAuditEvent = (e: Omit<AuditEvent, "id">) => {
    setAuditEvents(prev => [{
      ...e,
      id: `EVT-${(853 + prev.length).toString().padStart(4, '0')}`,
    }, ...prev]);
  };

  const updateProject = (name: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(p => p.name === name ? { ...p, ...updates } : p));
  };

  const resetDemo = () => {
    setActiveScenario(null);
    setExecutionState(null);
    setDemoArtifacts([]);
    setPendingSandboxTask(null);
  };

  // Full-width pages that manage their own layout
  const fullHeightPages: Page[] = [
    "workbench", "coding-workspace", "sandbox", "personal-chat", "research-notebooks",
    "notes", "project-detail",
  ];
  const isFullHeight = fullHeightPages.includes(currentPage);

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <NavContext.Provider value={{
      currentPage, navigate: setCurrentPage, projects, updateProject,
      pendingSandboxTask, setPendingSandboxTask,
      activeScenario, setActiveScenario,
      executionState, setExecutionState,
      demoArtifacts, setDemoArtifacts,
      auditEvents, addAuditEvent,
      resetDemo,
    }}>
      <div className="flex h-screen overflow-hidden" style={{ background: "var(--color-bg)" }}>
        {/* Sidebar */}
        <div 
          onMouseEnter={() => setSidebarCollapsed(false)}
          onMouseLeave={() => setSidebarCollapsed(true)}
          className="h-full z-20 flex-shrink-0"
        >
          <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((v) => !v)} />
        </div>

        {/* Main */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Header */}
          {currentPage !== "workbench" && <Header />}

          {/* Page content */}
          <div className={`flex-1 overflow-hidden ${isFullHeight ? "flex flex-col" : "overflow-y-auto"}`}>
            <PageContent page={currentPage} />
          </div>
        </div>
      </div>
    </NavContext.Provider>
  );
}
