import type { AgentExecutionPlan } from "./demoAgents";
import type { DemoArtifactTemplate } from "./demoArtifacts";

export type ExecutionRoute = "fast" | "knowledge" | "complex" | "coding" | "engineering";

export type EvidenceSource = {
  documentId: string;
  filename: string;
  fileType: "PDF" | "DOCX" | "CSV" | "XLSX" | "DWG";
  page: number;
  version: string;
  classification: "INTERNAL" | "CONFIDENTIAL" | "RESTRICTED";
  owner: string;
  relevance: number;
  retrievalMethod: "BM25" | "Vector" | "BM25 + Vector" | "SQL" | "Multimodal";
  snippet: string;
};

export type RetrievalStrategy = {
  keywordSearch: boolean;
  semanticSearch: boolean;
  postgresql: boolean;
  reranking: boolean;
  permissionFiltering: boolean;
};

export type ExecutionStepDef = {
  label: string;
  estimatedMs: number;
  canFail?: boolean;
  subSteps?: string[];
};

export type DemoScenario = {
  id: string;
  trigger: string[];
  category: string;
  route: ExecutionRoute;
  complexity: "simple" | "medium" | "complex";
  model: {
    id: string;
    name: string;
    reason: string;
  };
  agents: AgentExecutionPlan;
  executionSteps: ExecutionStepDef[];
  durationMs: number;
  sources: EvidenceSource[];
  retrievalStrategy: RetrievalStrategy;
  finalResponse: string;
  artifact?: DemoArtifactTemplate;
  artifactKey?: string;
  approvalRequired: boolean;
  nextAction: string;
};

export const demoScenarios: DemoScenario[] = [
  // ─── 1. Project Status ────────────────────────────────────────────
  {
    id: "project-status",
    trigger: ["project status", "current status", "project alpha", "status of cdu", "how is the project", "project progress"],
    category: "Project Management",
    route: "fast",
    complexity: "simple",
    model: {
      id: "qwen25-omni-3b",
      name: "Qwen2.5-Omni-3B",
      reason: "Simple data lookup — lightweight model sufficient",
    },
    agents: {
      sequential: [
        { type: "single", agents: ["research"], durationMs: 2000 },
      ],
    },
    executionSteps: [
      { label: "Request Received", estimatedMs: 300 },
      { label: "Intent Detection — Project Query", estimatedMs: 500 },
      { label: "Complexity Analysis — Simple", estimatedMs: 400 },
      { label: "Adaptive Router — Fast Path", estimatedMs: 300 },
      { label: "Model Selection — Qwen2.5-Omni-3B", estimatedMs: 300 },
      { label: "Direct Database Query", estimatedMs: 1500 },
      { label: "Response Generation", estimatedMs: 700 },
    ],
    durationMs: 5000,
    sources: [],
    retrievalStrategy: {
      keywordSearch: false,
      semanticSearch: false,
      postgresql: true,
      reranking: false,
      permissionFiltering: true,
    },
    finalResponse: "**CDU-4 Inspection Analysis** is currently **72% complete**.\n\n• **14 of 19 tasks** completed\n• **3 artifacts** generated (2 pending approval)\n• **Active agents:** Engineering Agent, HSE Agent\n• **Contributors:** Anita Rao, Rajesh Kumar\n• **Classification:** CONFIDENTIAL\n• **Estimated completion:** 18 October 2026\n\nNext milestone: Complete vibration trending analysis (due 22 Sep 2026).",
    approvalRequired: false,
    nextAction: "View project details",
  },

  // ─── 2. Inspection Report vs SOP Comparison ────────────────────────
  {
    id: "sop-comparison",
    trigger: ["compare", "inspection report", "sop", "p-102 inspection", "compare report", "sop comparison"],
    category: "Compliance & Inspection",
    route: "knowledge",
    complexity: "medium",
    model: {
      id: "qwen3-8b",
      name: "Qwen3-8B",
      reason: "Document comparison requires reasoning capabilities",
    },
    agents: {
      sequential: [
        { type: "single", agents: ["planner"], durationMs: 1000 },
        { type: "parallel", agents: ["hse", "knowledge"], durationMs: 4000 },
        { type: "single", agents: ["verification"], durationMs: 2000 },
      ],
    },
    executionSteps: [
      { label: "Request Received", estimatedMs: 300 },
      { label: "Intent Detection", estimatedMs: 600 },
      { label: "Adaptive Router", estimatedMs: 500 },
      { label: "Knowledge Retrieval", estimatedMs: 2500 },
      { label: "Inspection Agent", estimatedMs: 3000 },
      { label: "Verification", estimatedMs: 1500 },
      {
        label: "Artifact Generation",
        estimatedMs: 3000,
        subSteps: [
          "Preparing report...",
          "Compiling evidence...",
          "Applying source references...",
          "Generating SOP Compliance Report..."
        ]
      },
    ],
    durationMs: 11400,
    sources: [
      {
        documentId: "doc-inspection-aug2026",
        filename: "P-102 Inspection Report — August 2026",
        fileType: "PDF",
        page: 4,
        version: "1.0",
        classification: "CONFIDENTIAL",
        owner: "Anita Rao",
        relevance: 0.96,
        retrievalMethod: "BM25 + Vector",
        snippet: "Vibration reading at DE bearing: 8.2 mm/s RMS — exceeds ACTION threshold of 7.1 mm/s by 15.5%",
      },
      {
        documentId: "doc-sop-p102",
        filename: "Inspection SOP — Pump P-102",
        fileType: "PDF",
        page: 5,
        version: "3.2",
        classification: "CONFIDENTIAL",
        owner: "Rajesh Kumar",
        relevance: 0.94,
        retrievalMethod: "BM25 + Vector",
        snippet: "ACTION threshold: 7.1 mm/s RMS. When exceeded, immediate isolation and maintenance work order required.",
      },
      {
        documentId: "doc-vibration-limits",
        filename: "MRPL Equipment Vibration Limits",
        fileType: "PDF",
        page: 3,
        version: "2.1",
        classification: "INTERNAL",
        owner: "Suresh Bhat",
        relevance: 0.87,
        retrievalMethod: "Vector",
        snippet: "Zone C (Alert): 7.1 – 11.0 mm/s. Requires root cause investigation and planned corrective action within 30 days.",
      },
    ],
    retrievalStrategy: {
      keywordSearch: true,
      semanticSearch: true,
      postgresql: false,
      reranking: true,
      permissionFiltering: true,
    },
    finalResponse: "Based on hybrid retrieval across **3 sources**:\n\n**Inspection Report (Aug 2026):**\n• Vibration at bearing DE: **8.2 mm/s** (threshold: 7.1 mm/s) — **15.5% exceedance**\n• Seal leakage detected at mechanical seal\n• Historical trend: 5.4 → 6.8 → 8.2 mm/s (progressive degradation)\n\n**SOP Rev 3.2 Deviations:**\n1. ⚠ **Vibration exceedance** — Immediate isolation required per Section 6.3\n2. ⚠ **Seal inspection overdue** — 250 days vs 180-day interval (68 days overdue)\n\n**Assessment:** Two critical deviations from SOP identified. Recommend initiating Priority HIGH maintenance work order immediately.",
    artifactKey: "sop-comparison",
    approvalRequired: true,
    nextAction: "Generate maintenance work order",
  },

  // ─── 3. Maintenance Deviation Detection ────────────────────────────
  {
    id: "deviation-detection",
    trigger: ["deviation", "maintenance deviation", "detect deviation", "non-compliance", "compliance check"],
    category: "Maintenance & Compliance",
    route: "knowledge",
    complexity: "medium",
    model: {
      id: "qwen3-8b",
      name: "Qwen3-8B",
      reason: "Pattern matching across maintenance records requires reasoning",
    },
    agents: {
      sequential: [
        { type: "single", agents: ["planner"], durationMs: 800 },
        { type: "parallel", agents: ["hse", "knowledge", "data-analysis"], durationMs: 4500 },
        { type: "single", agents: ["verification"], durationMs: 1500 },
      ],
    },
    executionSteps: [
      { label: "Request Received", estimatedMs: 300 },
      { label: "Intent Detection — Deviation Analysis", estimatedMs: 600 },
      { label: "Complexity Analysis — Medium", estimatedMs: 500 },
      { label: "Adaptive Router — Knowledge Path", estimatedMs: 400 },
      { label: "Model Selection — Qwen3-8B", estimatedMs: 300 },
      { label: "Retrieving Maintenance Records", estimatedMs: 2000 },
      { label: "Cross-referencing SOP Requirements", estimatedMs: 2500 },
      { label: "Deviation Pattern Analysis", estimatedMs: 2500 },
      { label: "Verification — 3 Deviations Confirmed", estimatedMs: 1500 },
      { label: "Response Generation", estimatedMs: 900 },
    ],
    durationMs: 12000,
    sources: [
      {
        documentId: "doc-sop-p102",
        filename: "Inspection SOP — Pump P-102",
        fileType: "PDF",
        page: 8,
        version: "3.2",
        classification: "CONFIDENTIAL",
        owner: "Rajesh Kumar",
        relevance: 0.95,
        retrievalMethod: "BM25 + Vector",
        snippet: "Mechanical seal inspection shall be conducted at intervals not exceeding 6 months.",
      },
      {
        documentId: "doc-maintenance-log",
        filename: "CDU-4 Maintenance Log 2026",
        fileType: "XLSX",
        page: 1,
        version: "—",
        classification: "INTERNAL",
        owner: "Arvind Rao",
        relevance: 0.91,
        retrievalMethod: "SQL",
        snippet: "Last seal inspection: WO-2025-0891, 19 Dec 2025. Next due: 18 Jun 2026. Current date: 16 Sep 2026 — 90 days overdue.",
      },
      {
        documentId: "doc-inspection-aug2026",
        filename: "P-102 Inspection Report — August 2026",
        fileType: "PDF",
        page: 7,
        version: "1.0",
        classification: "CONFIDENTIAL",
        owner: "Anita Rao",
        relevance: 0.89,
        retrievalMethod: "Vector",
        snippet: "Active leakage at primary mechanical seal face. Flush fluid flow rate: 1.2 L/min (spec: 1.5-2.0 L/min).",
      },
    ],
    retrievalStrategy: {
      keywordSearch: true,
      semanticSearch: true,
      postgresql: true,
      reranking: true,
      permissionFiltering: true,
    },
    finalResponse: "**3 maintenance deviations** detected against SOP Rev 3.2:\n\n1. 🔴 **CRITICAL — Vibration Exceedance**\n   Current: 8.2 mm/s | Threshold: 7.1 mm/s | Exceedance: 15.5%\n   Required action: Immediate isolation per Section 6.3\n\n2. 🟠 **MAJOR — Seal Inspection Overdue**\n   Last inspection: 19 Dec 2025 (250 days ago)\n   Required interval: 180 days | Overdue by: 68 days\n\n3. 🟡 **MINOR — Flush Fluid Flow Below Specification**\n   Current: 1.2 L/min | Required: 1.5–2.0 L/min\n\nCorrective Action Plan has been generated as an artifact for review.",
    artifactKey: "deviation-report",
    approvalRequired: true,
    nextAction: "Review corrective action plan",
  },

  // ─── 4. Equipment Risk Analysis ────────────────────────────────────
  {
    id: "risk-analysis",
    trigger: ["risk analysis", "equipment risk", "risk assessment", "pump risk", "failure risk", "analyze risk"],
    category: "Risk & Safety",
    route: "complex",
    complexity: "complex",
    model: {
      id: "qwen3-8b",
      name: "Qwen3-8B",
      reason: "Multi-factor risk assessment requires advanced reasoning",
    },
    agents: {
      sequential: [
        { type: "single", agents: ["planner"], durationMs: 1000 },
        { type: "parallel", agents: ["engineering", "hse", "data-analysis", "risk"], durationMs: 8000 },
        { type: "single", agents: ["document"], durationMs: 3000 },
        { type: "single", agents: ["verification"], durationMs: 2000 },
      ],
    },
    executionSteps: [
      { label: "Request Received", estimatedMs: 300 },
      { label: "Intent Detection — Risk Assessment", estimatedMs: 700 },
      { label: "Complexity Analysis — Complex", estimatedMs: 600 },
      { label: "Adaptive Router — Complex Path (Multi-Agent)", estimatedMs: 500 },
      { label: "Model Selection — Qwen3-8B", estimatedMs: 300 },
      { label: "Planner — Task Decomposition", estimatedMs: 1500 },
      { label: "Engineering Agent — Vibration Analysis", estimatedMs: 3000 },
      { label: "HSE Agent — SOP Compliance Check", estimatedMs: 2500 },
      { label: "Data Analysis Agent — Historical Trending", estimatedMs: 2500 },
      { label: "Risk Agent — FMEA Score Calculation", estimatedMs: 2000 },
      { label: "Document Agent — Report Generation", estimatedMs: 2000 },
      { label: "Verification — All Findings Cross-checked", estimatedMs: 1500 },
      { label: "Final Response Assembly", estimatedMs: 600 },
    ],
    durationMs: 18000,
    sources: [
      {
        documentId: "doc-inspection-aug2026",
        filename: "P-102 Inspection Report — August 2026",
        fileType: "PDF",
        page: 12,
        version: "1.0",
        classification: "CONFIDENTIAL",
        owner: "Anita Rao",
        relevance: 0.97,
        retrievalMethod: "BM25 + Vector",
        snippet: "Risk Level: HIGH. Combination of bearing vibration exceedance and seal leakage indicates elevated risk of catastrophic failure.",
      },
      {
        documentId: "doc-sop-p102",
        filename: "Inspection SOP — Pump P-102",
        fileType: "PDF",
        page: 14,
        version: "3.2",
        classification: "CONFIDENTIAL",
        owner: "Rajesh Kumar",
        relevance: 0.93,
        retrievalMethod: "BM25",
        snippet: "Upon detection of ACTION-level threshold exceedance: Notify Shift Supervisor within 30 minutes, generate Priority HIGH work order.",
      },
      {
        documentId: "doc-vibration-limits",
        filename: "MRPL Equipment Vibration Limits",
        fileType: "PDF",
        page: 6,
        version: "2.1",
        classification: "INTERNAL",
        owner: "Suresh Bhat",
        relevance: 0.85,
        retrievalMethod: "Vector",
        snippet: "Trend analysis shall identify rate-of-change and predict Zone C/D entry dates for proactive maintenance scheduling.",
      },
      {
        documentId: "doc-maintenance-log",
        filename: "CDU-4 Maintenance Log 2026",
        fileType: "XLSX",
        page: 1,
        version: "—",
        classification: "INTERNAL",
        owner: "Arvind Rao",
        relevance: 0.82,
        retrievalMethod: "SQL",
        snippet: "Vibration trend: 5.4 mm/s (Jan 2025) → 6.8 mm/s (Aug 2025) → 8.2 mm/s (Aug 2026). Rate: +1.4 mm/s per year.",
      },
    ],
    retrievalStrategy: {
      keywordSearch: true,
      semanticSearch: true,
      postgresql: true,
      reranking: true,
      permissionFiltering: true,
    },
    finalResponse: "**Equipment Risk Assessment — Pump P-102A**\n\n**Risk Level: HIGH** (Score: 12/25)\n• Probability: 4/5 (Likely within 6 months)\n• Consequence: 3/5 (Major — unplanned outage, safety risk)\n\n**Key Risk Factors:**\n1. Bearing vibration at 8.2 mm/s — 15.5% above ACTION threshold\n2. Mechanical seal leakage — overdue inspection by 68 days\n3. Progressive degradation trend over 3 inspection cycles\n4. Similar failure pattern to P-205 incident (2023)\n\n**Recommended Actions:**\n• Immediate: Switch to P-102B standby\n• Within 7 days: Planned shutdown for bearing replacement\n• Within 14 days: Complete seal overhaul\n• Estimated downtime: 72 hours\n\nRisk Assessment report has been generated for approval.",
    artifactKey: "risk-assessment",
    approvalRequired: true,
    nextAction: "Review and approve risk assessment",
  },

  // ─── 5. Turnaround Planning ────────────────────────────────────────
  {
    id: "turnaround-planning",
    trigger: ["turnaround", "turnaround plan", "annual turnaround", "shutdown plan", "planned shutdown"],
    category: "Planning & Scheduling",
    route: "complex",
    complexity: "complex",
    model: {
      id: "qwen3-8b",
      name: "Qwen3-8B",
      reason: "Complex planning with resource optimization requires advanced reasoning",
    },
    agents: {
      sequential: [
        { type: "single", agents: ["planner"], durationMs: 1500 },
        { type: "parallel", agents: ["research", "engineering", "data-analysis"], durationMs: 8000 },
        { type: "single", agents: ["document"], durationMs: 4000 },
        { type: "single", agents: ["verification"], durationMs: 2500 },
      ],
    },
    executionSteps: [
      { label: "Request Received", estimatedMs: 300 },
      { label: "Intent Detection — Planning Request", estimatedMs: 700 },
      { label: "Complexity Analysis — Complex", estimatedMs: 600 },
      { label: "Adaptive Router — Complex Path (Multi-Agent)", estimatedMs: 500 },
      { label: "Model Selection — Qwen3-8B", estimatedMs: 400 },
      { label: "Planner — Scope Definition", estimatedMs: 2000 },
      { label: "Research Agent — Historical Turnaround Data", estimatedMs: 3000 },
      { label: "Engineering Agent — Equipment Assessment", estimatedMs: 3000 },
      { label: "Data Analysis Agent — Resource Optimization", estimatedMs: 3000 },
      { label: "Document Agent — Plan Document Generation", estimatedMs: 4000 },
      { label: "Critical Path Analysis", estimatedMs: 2000 },
      { label: "Verification — Budget & Timeline Validated", estimatedMs: 2000 },
      { label: "Final Response Assembly", estimatedMs: 500 },
    ],
    durationMs: 22000,
    sources: [
      {
        documentId: "doc-turnaround-plan",
        filename: "Annual Turnaround Plan 2027 — CDU-4",
        fileType: "PDF",
        page: 1,
        version: "0.3-DRAFT",
        classification: "RESTRICTED",
        owner: "Arvind Rao",
        relevance: 0.98,
        retrievalMethod: "BM25 + Vector",
        snippet: "Estimated duration: 28 days. Critical path: Column internals → HX bundle replacement → Catalyst changeout.",
      },
      {
        documentId: "doc-turnaround-plan",
        filename: "Annual Turnaround Plan 2027 — CDU-4",
        fileType: "PDF",
        page: 12,
        version: "0.3-DRAFT",
        classification: "RESTRICTED",
        owner: "Arvind Rao",
        relevance: 0.92,
        retrievalMethod: "BM25",
        snippet: "Personnel: 180 contract + 45 MRPL. Estimated cost: ₹42.5 Cr (±15%). 342 blinds identified.",
      },
    ],
    retrievalStrategy: {
      keywordSearch: true,
      semanticSearch: true,
      postgresql: true,
      reranking: true,
      permissionFiltering: true,
    },
    finalResponse: "**CDU-4 Annual Turnaround Plan 2027 — Summary**\n\n**Duration:** 28 days (Target: Q1 2027)\n**Estimated Cost:** ₹42.5 Cr (±15%)\n\n**Critical Path:**\n1. Shutdown & Isolation (Days 1-7)\n2. Column Internals Inspection (Days 8-12)\n3. HX Bundle Replacement (Days 10-16)\n4. Catalyst Changeout (Days 14-20)\n5. Reassembly & Testing (Days 19-25)\n6. Startup & Commissioning (Days 26-28)\n\n**Resource Requirements:**\n• Personnel: 225 total (180 contract + 45 MRPL)\n• Equipment: 2x 100T mobile cranes, 1x 250T crawler\n• Permits: 250 (85 hot work, 120 cold work, 45 confined space)\n\nComprehensive turnaround plan document has been generated for review.",
    artifactKey: "turnaround-plan",
    approvalRequired: true,
    nextAction: "Review turnaround plan and approve budget",
  },

  // ─── 6. Vendor Evaluation ──────────────────────────────────────────
  {
    id: "vendor-evaluation",
    trigger: ["vendor", "vendor evaluation", "supplier", "procurement", "vendor comparison", "heat exchanger vendor"],
    category: "Procurement",
    route: "knowledge",
    complexity: "medium",
    model: {
      id: "qwen3-8b",
      name: "Qwen3-8B",
      reason: "Comparative analysis across vendor proposals requires reasoning",
    },
    agents: {
      sequential: [
        { type: "single", agents: ["planner"], durationMs: 800 },
        { type: "parallel", agents: ["research", "document"], durationMs: 5000 },
        { type: "single", agents: ["verification"], durationMs: 1500 },
      ],
    },
    executionSteps: [
      { label: "Request Received", estimatedMs: 300 },
      { label: "Intent Detection — Vendor Analysis", estimatedMs: 600 },
      { label: "Complexity Analysis — Medium", estimatedMs: 500 },
      { label: "Adaptive Router — Knowledge Path", estimatedMs: 400 },
      { label: "Model Selection — Qwen3-8B", estimatedMs: 300 },
      { label: "Retrieving Vendor Proposals", estimatedMs: 2000 },
      { label: "Technical Compliance Scoring", estimatedMs: 3000 },
      { label: "Cost-Benefit Analysis", estimatedMs: 2500 },
      { label: "Verification — Scores Validated", estimatedMs: 1500 },
      { label: "Response Generation", estimatedMs: 900 },
    ],
    durationMs: 12000,
    sources: [
      {
        documentId: "doc-vendor-eval",
        filename: "Vendor Technical Evaluation — CX-4 Heat Exchanger",
        fileType: "PDF",
        page: 8,
        version: "2.0",
        classification: "CONFIDENTIAL",
        owner: "Priya Nair",
        relevance: 0.97,
        retrievalMethod: "BM25 + Vector",
        snippet: "Vendor A (Alfa Laval): 92% compliance. Vendor B (GEA Group): 87%. Vendor C (SPX Flow): 78%.",
      },
      {
        documentId: "doc-vendor-eval",
        filename: "Vendor Technical Evaluation — CX-4 Heat Exchanger",
        fileType: "PDF",
        page: 1,
        version: "2.0",
        classification: "CONFIDENTIAL",
        owner: "Priya Nair",
        relevance: 0.90,
        retrievalMethod: "Vector",
        snippet: "Evaluation criteria: technical compliance, delivery schedule, warranty terms, and total cost of ownership.",
      },
    ],
    retrievalStrategy: {
      keywordSearch: true,
      semanticSearch: true,
      postgresql: false,
      reranking: true,
      permissionFiltering: true,
    },
    finalResponse: "**Vendor Technical Evaluation — CX-4 Heat Exchanger**\n\n**Recommendation: Vendor A (Alfa Laval)** ✓\n\n| Vendor | Compliance | Cost | Delivery | Score |\n|--------|-----------|------|----------|-------|\n| Alfa Laval | 92% | ₹1.85 Cr | 16 weeks | **A** |\n| GEA Group | 87% | ₹1.78 Cr | 18 weeks | B+ |\n| SPX Flow | 78% | ₹1.62 Cr | 14 weeks | B- |\n\n**Key Differentiators:**\n• Alfa Laval meets all critical material specifications\n• GEA deviates on tube material (SA-179 vs specified SA-213)\n• SPX Flow has multiple pressure rating deviations\n• Cost differential within 5% — technical compliance prioritized\n\nEvaluation report generated for procurement approval.",
    artifactKey: "vendor-evaluation",
    approvalRequired: true,
    nextAction: "Submit to procurement committee",
  },

  // ─── 7. Engineering Analysis ───────────────────────────────────────
  {
    id: "engineering-analysis",
    trigger: ["engineering analysis", "vibration analysis", "bearing analysis", "structural analysis", "analyze pump", "engineering assessment"],
    category: "Engineering",
    route: "engineering",
    complexity: "complex",
    model: {
      id: "internvl3-8b",
      name: "InternVL3-8B",
      reason: "Industrial engineering analysis requires specialized vision-language model",
    },
    agents: {
      sequential: [
        { type: "single", agents: ["planner"], durationMs: 1000 },
        { type: "parallel", agents: ["engineering", "calculation", "knowledge"], durationMs: 6000 },
        { type: "single", agents: ["risk"], durationMs: 3000 },
        { type: "single", agents: ["document"], durationMs: 2500 },
        { type: "single", agents: ["verification"], durationMs: 2000 },
      ],
    },
    executionSteps: [
      { label: "Request Received", estimatedMs: 300 },
      { label: "Intent Detection — Engineering Analysis", estimatedMs: 700 },
      { label: "Complexity Analysis — Complex", estimatedMs: 600 },
      { label: "Adaptive Router — Engineering Path", estimatedMs: 500 },
      { label: "Model Selection — InternVL3-8B", estimatedMs: 400 },
      { label: "Loading Inspection Data + Historical Data + SOP", estimatedMs: 2000 },
      { label: "Engineering Agent — Vibration Analysis", estimatedMs: 3000 },
      { label: "Calculation Agent — Threshold Verification", estimatedMs: 2000 },
      { label: "Knowledge Agent — Standards Lookup", estimatedMs: 2000 },
      { label: "Risk Agent — Risk Scoring", estimatedMs: 2500 },
      { label: "Document Agent — Report Generation", estimatedMs: 2000 },
      { label: "Verification — Calculations Cross-checked", estimatedMs: 1500 },
      { label: "Final Response Assembly", estimatedMs: 500 },
    ],
    durationMs: 18000,
    sources: [
      {
        documentId: "doc-inspection-aug2026",
        filename: "P-102 Inspection Report — August 2026",
        fileType: "PDF",
        page: 4,
        version: "1.0",
        classification: "CONFIDENTIAL",
        owner: "Anita Rao",
        relevance: 0.97,
        retrievalMethod: "BM25 + Vector",
        snippet: "Vertical radial vibration at DE bearing: 8.2 mm/s RMS. Historical trend: 5.4 → 6.8 → 8.2 mm/s over 3 cycles.",
      },
      {
        documentId: "doc-sop-p102",
        filename: "Inspection SOP — Pump P-102",
        fileType: "PDF",
        page: 5,
        version: "3.2",
        classification: "CONFIDENTIAL",
        owner: "Rajesh Kumar",
        relevance: 0.94,
        retrievalMethod: "BM25 + Vector",
        snippet: "ACTION threshold: 7.1 mm/s RMS. TRIP threshold: 11.2 mm/s. Zone C per ISO 10816-3 classification.",
      },
      {
        documentId: "doc-vibration-limits",
        filename: "MRPL Equipment Vibration Limits",
        fileType: "PDF",
        page: 3,
        version: "2.1",
        classification: "INTERNAL",
        owner: "Suresh Bhat",
        relevance: 0.88,
        retrievalMethod: "Vector",
        snippet: "Zone C (Alert): 7.1 – 11.0 mm/s. Root cause investigation and planned corrective action within 30 days required.",
      },
    ],
    retrievalStrategy: {
      keywordSearch: true,
      semanticSearch: true,
      postgresql: true,
      reranking: true,
      permissionFiltering: true,
    },
    finalResponse: "**Engineering Analysis — P-102 Vibration Assessment**\n\n**Current Status:** Zone C (Alert) per ISO 10816-3\n\n| Parameter | Value | Threshold | Status |\n|-----------|-------|-----------|--------|\n| DE Bearing Vibration | 8.2 mm/s | 7.1 mm/s | ⚠ EXCEEDED |\n| Seal Condition | Leaking | No leakage | 🔴 CRITICAL |\n| Tray Corrosion (14-18) | Grade 3/5 | Grade 2/5 | ⚠ ELEVATED |\n\n**Trend Analysis:**\n• Rate of degradation: +1.4 mm/s per year\n• Projected Zone D entry: ~6 months at current rate\n• Similar to P-205 pre-failure pattern (2023)\n\n**Recommendation:** Immediate planned maintenance intervention.\n\n⚠ **AI-GENERATED — ENGINEERING REVIEW REQUIRED**\nThis analysis is not a certified engineering assessment.",
    artifactKey: "engineering-report",
    approvalRequired: true,
    nextAction: "Route to engineering review",
  },

  // ─── 8. Engineering Drawing Generation ─────────────────────────────
  {
    id: "engineering-drawing",
    trigger: ["drawing", "generate drawing", "p&id", "schematic", "pid", "engineering drawing", "cad"],
    category: "Engineering Design",
    route: "engineering",
    complexity: "complex",
    model: {
      id: "internvl3-8b",
      name: "InternVL3-8B",
      reason: "Drawing generation requires industrial vision-language capabilities",
    },
    agents: {
      sequential: [
        { type: "single", agents: ["planner"], durationMs: 1000 },
        { type: "single", agents: ["engineering"], durationMs: 6000 },
        { type: "single", agents: ["calculation"], durationMs: 3000 },
        { type: "single", agents: ["verification"], durationMs: 3000 },
      ],
    },
    executionSteps: [
      { label: "Request Received", estimatedMs: 300 },
      { label: "Intent Detection — Drawing Generation", estimatedMs: 700 },
      { label: "Complexity Analysis — Complex", estimatedMs: 600 },
      { label: "Adaptive Router — Engineering Path", estimatedMs: 500 },
      { label: "Model Selection — InternVL3-8B", estimatedMs: 400 },
      { label: "Requirements Parsing", estimatedMs: 1500 },
      { label: "Engineering Agent — Structured Specification", estimatedMs: 3000 },
      { label: "Drawing Generation — P&ID Layout", estimatedMs: 4000 },
      { label: "Standards Validation — ISA 5.1", estimatedMs: 2500 },
      { label: "Symbol & Annotation Verification", estimatedMs: 2000 },
      { label: "Verification — Specification Compliance", estimatedMs: 2500 },
      { label: "Final Drawing Assembly", estimatedMs: 2000 },
    ],
    durationMs: 20000,
    sources: [],
    retrievalStrategy: {
      keywordSearch: false,
      semanticSearch: false,
      postgresql: false,
      reranking: false,
      permissionFiltering: true,
    },
    finalResponse: "**Engineering Drawing Generated**\n\n**Drawing No:** MRPL-CDU4-PID-012-DRAFT\n**Type:** P&ID (Piping & Instrumentation Diagram)\n**Standard:** ISA 5.1\n\n**Equipment:**\n• P-102A (Primary pump)\n• P-102B (Standby pump)\n• FV-102, FV-103 (Control valves)\n• PI-301, PI-302 (Pressure indicators)\n• FI-102 (Flow indicator)\n\n⚠ **AI-GENERATED PRELIMINARY DRAFT**\nThis drawing is NOT certified for construction or operational use. It must be reviewed, validated, and approved by a qualified engineer before any use.\n\nClick \"View Drawing\" to preview the generated schematic.",
    artifactKey: "engineering-drawing",
    approvalRequired: true,
    nextAction: "Route to engineer for review and certification",
  },

  // ─── 9. Coding / Repository Fix ────────────────────────────────────
  {
    id: "coding-fix",
    trigger: ["code", "fix", "bug", "repository", "coding", "threshold validation", "debug", "sandbox", "testcase"],
    category: "Software Development",
    route: "coding",
    complexity: "complex",
    model: {
      id: "sovereign-code-7b",
      name: "Sovereign-Code-7B",
      reason: "Code analysis and generation requires specialized code model",
    },
    agents: {
      sequential: [
        { type: "single", agents: ["planner"], durationMs: 1000 },
        { type: "single", agents: ["coding"], durationMs: 10000 },
        { type: "single", agents: ["verification"], durationMs: 3000 },
      ],
    },
    executionSteps: [
      { label: "Request Received", estimatedMs: 300 },
      { label: "Intent Detection — Code Fix Request", estimatedMs: 600 },
      { label: "Complexity Analysis — Complex", estimatedMs: 500 },
      { label: "Adaptive Router — Coding Path", estimatedMs: 400 },
      { label: "Model Selection — Sovereign-Code-7B", estimatedMs: 300 },
      { label: "Repository Analysis — 3 Python files, 2 test files", estimatedMs: 2000 },
      { label: "Bug Detection — Off-by-one in threshold comparison", estimatedMs: 2500 },
      { label: "Code Modification — Fixed >= comparison", estimatedMs: 2000 },
      { label: "Sandbox Execution — Isolated environment", estimatedMs: 2000 },
      { label: "Running Tests — 12 test cases", estimatedMs: 2500 },
      { label: "Error Detection — Edge case at threshold boundary", estimatedMs: 1500, canFail: true },
      { label: "AI Fix Applied — Boundary condition handled", estimatedMs: 1500 },
      { label: "Retest — All 12 tests passing", estimatedMs: 1500 },
      { label: "Verification — Code quality validated", estimatedMs: 1000 },
    ],
    durationMs: 18000,
    sources: [],
    retrievalStrategy: {
      keywordSearch: false,
      semanticSearch: false,
      postgresql: false,
      reranking: false,
      permissionFiltering: false,
    },
    finalResponse: "**Code Fix Completed ✓**\n\n**Repository:** pump-analysis (CDU-4)\n**Files Modified:** 1 (analysis.py)\n**Tests:** 12/12 passing\n\n**Bug Found:**\nLine 34 in `check_anomalies()` — threshold comparison used `>` instead of `>=`, missing edge case where vibration exactly equals the SOP threshold of 7.1 mm/s.\n\n**Fix Applied:**\n```python\n# Before (bug)\nif row[\"vibration_mms\"] > self.threshold:\n\n# After (fixed)\nif row[\"vibration_mms\"] >= self.threshold:\n```\n\n**Test Results:**\n✓ test_vibration_threshold — PASSED\n✓ test_exceedance_calculation — PASSED\n✓ test_edge_cases — PASSED (boundary at 7.1 mm/s)\n✓ 9 additional tests — ALL PASSED\n\nCode is ready for review. Click \"Open in Coding Workspace\" to inspect the changes.",
    artifactKey: "coding-output",
    approvalRequired: true,
    nextAction: "Open in Coding Workspace for review",
  },

  // ─── 10. Multimodal Inspection Document Analysis ───────────────────
  {
    id: "multimodal-analysis",
    trigger: ["multimodal", "image analysis", "photo", "inspection photo", "thermal", "visual inspection", "photograph"],
    category: "Multimodal Analysis",
    route: "complex",
    complexity: "complex",
    model: {
      id: "qwen25-vl-7b",
      name: "Qwen2.5-VL-7B",
      reason: "Multimodal document analysis requires vision-language model",
    },
    agents: {
      sequential: [
        { type: "single", agents: ["planner"], durationMs: 1000 },
        { type: "parallel", agents: ["engineering", "hse", "knowledge"], durationMs: 7000 },
        { type: "single", agents: ["risk"], durationMs: 2500 },
        { type: "single", agents: ["document"], durationMs: 2500 },
        { type: "single", agents: ["verification"], durationMs: 2000 },
      ],
    },
    executionSteps: [
      { label: "Request Received", estimatedMs: 300 },
      { label: "Intent Detection — Multimodal Analysis", estimatedMs: 700 },
      { label: "Complexity Analysis — Complex", estimatedMs: 600 },
      { label: "Adaptive Router — Complex Path (Multi-Agent)", estimatedMs: 500 },
      { label: "Model Selection — Qwen2.5-VL-7B", estimatedMs: 400 },
      { label: "Document Ingestion — 3 PDFs, 12 photos, 2 thermal images", estimatedMs: 2500 },
      { label: "Engineering Agent — Visual Defect Detection", estimatedMs: 3000 },
      { label: "HSE Agent — Safety Assessment", estimatedMs: 2500 },
      { label: "Knowledge Agent — Historical Comparison", estimatedMs: 2000 },
      { label: "Risk Agent — Combined Risk Scoring", estimatedMs: 2000 },
      { label: "Document Agent — Consolidated Report", estimatedMs: 2000 },
      { label: "Verification — Cross-modal Validation", estimatedMs: 1500 },
      { label: "Final Response Assembly", estimatedMs: 500 },
    ],
    durationMs: 18000,
    sources: [
      {
        documentId: "doc-inspection-aug2026",
        filename: "P-102 Inspection Report — August 2026",
        fileType: "PDF",
        page: 4,
        version: "1.0",
        classification: "CONFIDENTIAL",
        owner: "Anita Rao",
        relevance: 0.95,
        retrievalMethod: "Multimodal",
        snippet: "Visual and sensor data correlated: bearing housing thermal anomaly (ΔT 12°C) aligns with vibration exceedance pattern.",
      },
      {
        documentId: "doc-sop-p102",
        filename: "Inspection SOP — Pump P-102",
        fileType: "PDF",
        page: 8,
        version: "3.2",
        classification: "CONFIDENTIAL",
        owner: "Rajesh Kumar",
        relevance: 0.88,
        retrievalMethod: "BM25 + Vector",
        snippet: "Visual inspection checklist: seal face leakage, corrosion indicators, thermal patterns, alignment markers.",
      },
    ],
    retrievalStrategy: {
      keywordSearch: true,
      semanticSearch: true,
      postgresql: false,
      reranking: true,
      permissionFiltering: true,
    },
    finalResponse: "**Multimodal Inspection Analysis — CDU-4 Equipment**\n\n**Sources Analyzed:**\n• 3 PDF inspection reports\n• 12 inspection photographs\n• 2 thermal imaging captures\n• 1 ultrasonic thickness survey\n\n**Findings:**\n\n| Finding | Source | Severity |\n|---------|--------|----------|\n| Corrosion on Trays 14-18 | Photography | ⚠ Grade 3/5 |\n| Thermal anomaly at bearing | Thermal imaging | 🔴 ΔT = 12°C |\n| Wall thickness adequate | UT survey | ✓ 6.2mm (min 5.0mm) |\n| Seal face leakage | Photography | 🔴 Active leakage |\n\n**Cross-Modal Correlation:**\nThermal anomaly at bearing housing correlates with vibration exceedance — consistent with progressive bearing degradation pattern.\n\n**Risk Level: MEDIUM-HIGH**\nRecommendation: Schedule tray replacement during next turnaround; immediate bearing maintenance.\n\nConsolidated multimodal report generated for review.",
    artifactKey: "multimodal-report",
    approvalRequired: true,
    nextAction: "Review multimodal analysis report",
  },
];

/**
 * Deterministic scenario matcher — finds the first scenario whose trigger keywords
 * match the user input. Returns null if no match.
 */
export function matchScenario(input: string): DemoScenario | null {
  const lower = input.toLowerCase().trim();
  for (const scenario of demoScenarios) {
    for (const trigger of scenario.trigger) {
      if (lower.includes(trigger)) {
        return scenario;
      }
    }
  }
  return null;
}
