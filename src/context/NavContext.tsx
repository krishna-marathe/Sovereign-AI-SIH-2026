import { createContext, useContext } from "react";
import type { DemoScenario, ExecutionState } from "../demo";
import type { DemoArtifactTemplate } from "../demo/demoArtifacts";

export type Page =
  | "dashboard"
  | "workbench"
  | "projects"
  | "project-detail"
  | "tasks"
  | "artifacts"
  | "approvals"
  | "knowledge-base"
  | "documents"
  | "collections"
  | "research-notebooks"
  | "notes"
  | "agents"
  | "model-router"
  | "models"
  | "tool-registry"
  | "offline-plugins"
  | "coding-workspace"
  | "sandbox"
  | "engineering-analysis"
  | "engineering-drawings"
  | "collaboration"
  | "personal-chat"
  | "security-center"
  | "rbac"
  | "audit-trail"
  | "system-health"
  | "gpu-compute"
  | "network-security"
  | "settings"
  | "help-center"
  | "multimodal"
  | "verification"
  | "data-query";

export type Project = {
  name: string;
  owner: string;
  dept: string;
  status: string;
  progress: number;
  tasks: number;
  artifacts: number;
  cls: string;
  agents: string[];
  updated: string;
  contributors: string[];
};

export type DemoArtifact = {
  id: string;
  template: DemoArtifactTemplate;
  status: "pending" | "approved" | "rejected";
  approvedBy?: string;
  approvedAt?: string;
  scenarioId: string;
};

export type AuditEvent = {
  id: string;
  user: string;
  query: string;
  agent: string;
  model: string;
  tool: string;
  action: string;
  approval: string;
  output: string;
  ts: string;
  cls: string;
  risk: string;
};

export type NavContextType = {
  currentPage: Page;
  navigate: (page: Page) => void;
  projects: Project[];
  updateProject: (name: string, updates: Partial<Project>) => void;
  pendingSandboxTask: string | null;
  setPendingSandboxTask: (t: string | null) => void;
  // Demo execution state
  activeScenario: DemoScenario | null;
  setActiveScenario: (s: DemoScenario | null) => void;
  executionState: ExecutionState | null;
  setExecutionState: (s: ExecutionState | null) => void;
  demoArtifacts: DemoArtifact[];
  setDemoArtifacts: (a: DemoArtifact[] | ((prev: DemoArtifact[]) => DemoArtifact[])) => void;
  auditEvents: AuditEvent[];
  addAuditEvent: (e: Omit<AuditEvent, "id">) => void;
  resetDemo: () => void;
};

export const NavContext = createContext<NavContextType>({
  currentPage: "dashboard",
  navigate: () => {},
  projects: [],
  updateProject: () => {},
  pendingSandboxTask: null,
  setPendingSandboxTask: () => {},
  activeScenario: null,
  setActiveScenario: () => {},
  executionState: null,
  setExecutionState: () => {},
  demoArtifacts: [],
  setDemoArtifacts: () => {},
  auditEvents: [],
  addAuditEvent: () => {},
  resetDemo: () => {},
});

export const useNav = () => useContext(NavContext);
