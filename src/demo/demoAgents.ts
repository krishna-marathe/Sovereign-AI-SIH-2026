export type DemoAgent = {
  id: string;
  name: string;
  icon: string;
  description: string;
  capabilities: string[];
  status: "available" | "busy" | "offline";
};

export const demoAgents: DemoAgent[] = [
  {
    id: "planner",
    name: "Planner",
    icon: "📋",
    description: "Decomposes complex tasks into sub-tasks and orchestrates agent execution",
    capabilities: ["Task decomposition", "Agent orchestration", "Dependency resolution"],
    status: "available",
  },
  {
    id: "research",
    name: "Research Agent",
    icon: "🔍",
    description: "Retrieves and synthesizes information from knowledge bases and documents",
    capabilities: ["Hybrid RAG", "Semantic search", "Document retrieval", "Citation generation"],
    status: "available",
  },
  {
    id: "document",
    name: "Document Agent",
    icon: "📄",
    description: "Processes, analyzes, and generates documents in multiple formats",
    capabilities: ["Document parsing", "Report generation", "Template filling", "Format conversion"],
    status: "available",
  },
  {
    id: "coding",
    name: "Coding Agent",
    icon: "💻",
    description: "Writes, reviews, debugs, and tests code in isolated sandbox environments",
    capabilities: ["Code generation", "Bug detection", "Unit testing", "Repository analysis"],
    status: "available",
  },
  {
    id: "engineering",
    name: "Engineering Agent",
    icon: "⚙️",
    description: "Performs engineering calculations, structural analysis, and equipment assessments",
    capabilities: ["Stress analysis", "Vibration analysis", "Risk assessment", "SOP compliance"],
    status: "available",
  },
  {
    id: "hse",
    name: "HSE/Inspection Agent",
    icon: "🛡️",
    description: "Health, Safety & Environment inspection analysis and compliance checking",
    capabilities: ["Inspection analysis", "SOP comparison", "Deviation detection", "Safety assessment"],
    status: "available",
  },
  {
    id: "data-analysis",
    name: "Data Analysis Agent",
    icon: "📊",
    description: "Analyzes structured data, generates statistics, and identifies trends",
    capabilities: ["Statistical analysis", "Trend detection", "Anomaly detection", "Data visualization"],
    status: "available",
  },
  {
    id: "risk",
    name: "Risk Agent",
    icon: "⚠️",
    description: "Assesses risk levels, generates risk matrices, and recommends mitigations",
    capabilities: ["Risk scoring", "FMEA analysis", "Mitigation planning", "Historical comparison"],
    status: "available",
  },
  {
    id: "knowledge",
    name: "Knowledge Retrieval Agent",
    icon: "📚",
    description: "Manages knowledge base queries and retrieval across vector and keyword indexes",
    capabilities: ["BM25 search", "Vector search", "Reranking", "Permission filtering"],
    status: "available",
  },
  {
    id: "calculation",
    name: "Calculation Agent",
    icon: "🔢",
    description: "Performs engineering calculations with unit validation and verification",
    capabilities: ["Unit conversion", "Formula evaluation", "Result verification", "Standards lookup"],
    status: "available",
  },
  {
    id: "verification",
    name: "Verification Agent",
    icon: "✅",
    description: "Verifies outputs against evidence, standards, and calculations",
    capabilities: ["Evidence verification", "Calculation check", "SOP compliance", "Permission validation"],
    status: "available",
  },
];

export type AgentExecutionPlan = {
  sequential: AgentStepGroup[];
};

export type AgentStepGroup = {
  type: "single" | "parallel";
  agents: string[]; // agent ids
  durationMs: number;
};

export function getAgentById(id: string): DemoAgent | undefined {
  return demoAgents.find((a) => a.id === id);
}
