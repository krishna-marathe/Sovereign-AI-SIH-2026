import React, { useState, useRef, useEffect } from "react";
import { useNav } from "../context/NavContext";
import type { DemoArtifact } from "../context/NavContext";
import { matchScenario, runExecution, artifactTemplates } from "../demo";
import type { DemoScenario, ExecutionState, EvidenceSource, RetrievalStrategy } from "../demo";
import ExecutionTimeline from "../components/execution/ExecutionTimeline";
import AgentExecution from "../components/execution/AgentExecution";
import RouterVisualization from "../components/execution/RouterVisualization";
import EvidencePanel from "../components/evidence/EvidencePanel";
import DocumentViewer from "../components/evidence/DocumentViewer";
import ArtifactCard from "../components/artifacts/ArtifactCard";
import ApprovalCard from "../components/artifacts/ApprovalCard";
import ModelSelector from "../components/models/ModelSelector";

type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
  meta?: {
    route: string;
    agent?: string;
    model?: string;
    sources?: EvidenceSource[];
    retrievalStrategy?: RetrievalStrategy;
    verified?: boolean;
    executionState?: ExecutionState;
    scenarioId?: string;
  };
  artifact?: {
    scenarioId: string;
    key: string;
  };
};

const routeLabels: Record<string, string> = {
  fast: "⚡ Fast Path · Direct Data Retrieval",
  knowledge: "🔍 Knowledge Path · Hybrid RAG",
  complex: "⚙️ Complex Path · Multi-Agent",
  coding: "💻 Coding Path · Sandbox Environment",
  engineering: "📐 Engineering Path · Analysis & CAD",
};

const routeStyles: Record<string, string> = {
  fast: "bg-teal-50 text-teal-700 border-teal-200",
  knowledge: "bg-blue-50 text-blue-700 border-blue-200",
  complex: "bg-purple-50 text-purple-700 border-purple-200",
  coding: "bg-slate-100 text-slate-700 border-slate-300",
  engineering: "bg-amber-50 text-amber-700 border-amber-200",
};

export default function Workbench() {
  const {
    navigate, projects, setPendingSandboxTask,
    setActiveScenario, demoArtifacts, setDemoArtifacts, resetDemo, addAuditEvent,
  } = useNav();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"auto" | "manual">("auto");
  const [selectedModelId, setSelectedModelId] = useState("qwen3-8b");
  const [leftCollapsed, setLeftCollapsed] = useState(true);
  const [rightCollapsed, setRightCollapsed] = useState(true);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [currentProjectName, setCurrentProjectName] = useState(projects[0]?.name || "CDU-4 Inspection Analysis");
  const [viewingDrawing, setViewingDrawing] = useState(false);
  const [viewingArtifactDocId, setViewingArtifactDocId] = useState<string | null>(null);

  // Active execution
  const [activeExecution, setActiveExecution] = useState<ExecutionState | null>(null);
  const [activeScenarioRef, setActiveScenarioRef] = useState<DemoScenario | null>(null);
  const [rightPanelSources, setRightPanelSources] = useState<EvidenceSource[]>([]);
  const [rightPanelStrategy, setRightPanelStrategy] = useState<RetrievalStrategy | null>(null);

  // Chat history
  const [recentChats, setRecentChats] = useState([
    { id: 1, title: "CDU-4 Inspection Analysis", type: "Project" as const },
    { id: 2, title: "P-102 Pump Assessment", type: "Project" as const },
    { id: 3, title: "Personal Notes — Q3", type: "Personal" as const },
  ]);
  const [showNewChatMenu, setShowNewChatMenu] = useState(false);

  const currentProject = projects.find(p => p.name === currentProjectName) || projects[0];
  const cleanupRef = useRef<(() => void) | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeExecution]);

  useEffect(() => {
    return () => { cleanupRef.current?.(); };
  }, []);

  const handleNewChat = (type: "Project" | "Personal") => {
    const newChat = { id: Date.now(), title: "New " + type + " Chat", type };
    setRecentChats([newChat, ...recentChats]);
    setMessages([]);
    setActiveExecution(null);
    setActiveScenarioRef(null);
    setShowNewChatMenu(false);
  };

  const handleResetDemo = () => {
    setMessages([]);
    setActiveExecution(null);
    setActiveScenarioRef(null);
    setRightPanelSources([]);
    setRightPanelStrategy(null);
    resetDemo();
  };

  const getArtifactStatus = (scenarioId: string): "pending" | "approved" | "rejected" => {
    const art = demoArtifacts.find(a => a.scenarioId === scenarioId);
    return art?.status || "pending";
  };

  const handleApproveArtifact = (scenarioId: string) => {
    setDemoArtifacts((prev: DemoArtifact[]) => {
      const exists = prev.find(a => a.scenarioId === scenarioId);
      if (exists) {
        return prev.map(a => a.scenarioId === scenarioId ? { ...a, status: "approved" as const, approvedBy: "Anita Rao", approvedAt: new Date().toISOString() } : a);
      }
      return prev;
    });
  };

  const handleRejectArtifact = (scenarioId: string) => {
    setDemoArtifacts((prev: DemoArtifact[]) =>
      prev.map(a => a.scenarioId === scenarioId ? { ...a, status: "rejected" as const } : a)
    );
  };

  const handleSend = () => {
    if (!input.trim() || activeExecution?.active) return;

    const userMsg: Message = { id: Date.now(), role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    const queryText = input;
    setInput("");

    // Match scenario
    const scenario = matchScenario(queryText);

    if (!scenario) {
      // Fallback for unmatched queries
      setTimeout(() => {
        const fallbackMsg: Message = {
          id: Date.now(),
          role: "assistant",
          content: "I can help you with that. Could you provide more details about what you need? I support project queries, inspection analysis, risk assessments, engineering calculations, code fixes, and more.\n\nTry asking about:\n• Project status\n• Inspection report comparisons\n• Equipment risk analysis\n• Turnaround planning\n• Vendor evaluations\n• Engineering analysis or drawings\n• Code fixes and debugging",
          meta: { route: "fast", model: "Qwen2.5-Omni-3B", verified: true },
        };
        setMessages(prev => [...prev, fallbackMsg]);
      }, 1500);
      return;
    }

    // Use manual model if manual mode is selected
    const effectiveModel = mode === "manual"
      ? { id: selectedModelId, name: selectedModelId, reason: "Manually selected by user" }
      : scenario.model;

    setActiveScenario(scenario);
    setActiveScenarioRef(scenario);

    // Start execution
    const cleanup = runExecution(
      scenario,
      (state) => {
        setActiveExecution(state);
        if (scenario.route === "knowledge") {
          setRightCollapsed(false);
        }
      },
      (finalState) => {
        setActiveExecution(null);

        // Build the assistant message
        const aiMsg: Message = {
          id: Date.now(),
          role: "assistant",
          content: scenario.finalResponse,
          meta: {
            route: scenario.route,
            agent: scenario.agents.sequential
              .flatMap(g => g.agents)
              .filter((v, i, a) => a.indexOf(v) === i)
              .map(id => {
                const names: Record<string, string> = {
                  planner: "Planner", research: "Research Agent", document: "Document Agent",
                  coding: "Coding Agent", engineering: "Engineering Agent", hse: "HSE/Inspection Agent",
                  "data-analysis": "Data Analysis Agent", risk: "Risk Agent",
                  knowledge: "Knowledge Retrieval Agent", calculation: "Calculation Agent",
                  verification: "Verification Agent",
                };
                return names[id] || id;
              })
              .join(", "),
            model: effectiveModel.name,
            sources: scenario.sources.length > 0 ? scenario.sources : undefined,
            retrievalStrategy: scenario.sources.length > 0 ? scenario.retrievalStrategy : undefined,
            verified: true,
            executionState: finalState,
            scenarioId: scenario.id,
          },
        };

        // Add artifact reference if scenario has one
        if (scenario.artifactKey && artifactTemplates[scenario.artifactKey]) {
          aiMsg.artifact = { scenarioId: scenario.id, key: scenario.artifactKey };

          // Register artifact in global state
          setDemoArtifacts((prev: DemoArtifact[]) => {
            if (prev.find(a => a.scenarioId === scenario.id)) return prev;
            
            const newArtifact = {
              id: `art-${scenario.id}`,
              template: artifactTemplates[scenario.artifactKey!],
              status: "pending" as const,
              scenarioId: scenario.id,
            };
            
            // Add audit event for generation
            addAuditEvent({
              user: "HSE / Inspection Agent",
              query: `Generated artifact: ${newArtifact.template.name}`,
              agent: "HSE Agent",
              model: effectiveModel.name,
              tool: "Artifact Generator",
              action: "ARTIFACT_GENERATED",
              approval: "Pending",
              output: "Artifact successfully generated",
              ts: new Date().toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" }),
              cls: newArtifact.template.classification,
              risk: "Medium",
            });
            
            return [...prev, newArtifact];
          });
        }

        // Set evidence for right panel
        if (scenario.sources.length > 0) {
          setRightPanelSources(scenario.sources);
          setRightPanelStrategy(scenario.retrievalStrategy);
          setRightCollapsed(false);
        }

        setMessages(prev => [...prev, aiMsg]);

        // Update chat history
        setRecentChats(prev => {
          const newChat = { id: Date.now(), title: queryText.slice(0, 40), type: "Project" as const };
          return [newChat, ...prev.slice(0, 4)];
        });
      }
    );

    cleanupRef.current = cleanup;
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-slate-200 flex-shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-slate-500">Project:</span>
          <span className="text-sm font-semibold text-slate-900 truncate max-w-[200px]">{currentProject.name}</span>
          <span className="text-[10px] px-2 py-0.5 rounded-md font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            🔒 {currentProject.cls}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 mr-2">
            <span className="text-xs text-slate-500 mr-2">{currentProject.contributors?.length || 0} contributors</span>
            <div className="flex -space-x-2">
              {currentProject.contributors?.slice(0, 3).map((c, i) => (
                <div
                  key={i}
                  title={c}
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold text-white border-2 border-white shadow-sm"
                  style={{ background: ["#0F766E", "#2563EB", "#7C3AED"][i % 3] }}
                >
                  {c.split(" ").map(n => n[0]).join("")}
                </div>
              ))}
              {currentProject.contributors?.length > 3 && (
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold bg-slate-200 text-slate-600 border-2 border-white shadow-sm">
                  +{currentProject.contributors.length - 3}
                </div>
              )}
            </div>
          </div>
          <div className="h-6 w-px bg-slate-200 mx-1"></div>

          {/* Reset Demo */}
          <button
            onClick={handleResetDemo}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
            title="Reset Demo State"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
            Reset
          </button>

          <button
            onClick={() => navigate("approvals")}
            className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
            title="Approvals"
          >
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="2" width="12" height="12" rx="1.5" stroke="#475569" strokeWidth="1.3" />
              <path d="M5 8l2 2 4-4" stroke="#475569" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            <span
              className="absolute -top-0.5 -right-0.5 text-xs font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-white bg-amber-500 text-white"
              style={{ fontSize: 10 }}
            >
              {demoArtifacts.filter(a => a.status === "pending").length || 2}
            </span>
          </button>

          <button className="flex items-center gap-2 px-2 py-1.5 rounded-full hover:bg-slate-50 transition-colors ml-1" title="User Profile">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shadow-sm bg-teal-600 text-white">
              AR
            </div>
            <span className="text-sm font-medium pr-1 text-slate-900">Anita Rao</span>
          </button>

          <div className="h-6 w-px bg-slate-200 mx-1"></div>
          <button className="text-xs px-3 py-1.5 rounded-lg font-medium text-white bg-teal-600 hover:bg-teal-700 transition-colors shadow-sm" title="Export report">
            Export
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel — Chat History & Project Selector */}
        {!leftCollapsed ? (
          <div className="w-64 bg-white border-r border-slate-200 flex-shrink-0 flex flex-col overflow-y-auto transition-all">
            <div className="flex items-center justify-between px-4 py-4 border-b border-slate-100 bg-slate-50/50 gap-2">
              <select
                value={currentProjectName}
                onChange={(e) => setCurrentProjectName(e.target.value)}
                className="text-sm font-medium text-slate-700 border border-slate-300 rounded-md px-2 py-1.5 outline-none bg-white cursor-pointer w-full truncate shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                title="Select Project"
              >
                {projects.map(p => (
                  <option key={p.name} value={p.name}>{p.name}</option>
                ))}
              </select>
              <button onClick={() => setLeftCollapsed(true)} className="text-slate-400 hover:text-slate-700 transition-colors p-1.5 rounded-md hover:bg-slate-200 flex-shrink-0" title="Close chat history">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
              </button>
            </div>

            <div className="p-4 border-b border-slate-100 relative">
              <button
                onClick={() => setShowNewChatMenu(!showNewChatMenu)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
                title="Start a fresh chat"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
                New Chat
              </button>

              {showNewChatMenu && (
                <div className="absolute top-14 left-4 right-4 bg-white border border-slate-200 shadow-xl rounded-xl p-1 z-20">
                  <button onClick={() => handleNewChat("Project")} className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-teal-50 hover:text-teal-700 font-medium transition-colors">
                    📝 Project Chat
                  </button>
                  <button onClick={() => handleNewChat("Personal")} className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-teal-50 hover:text-teal-700 font-medium transition-colors">
                    🔒 Personal Chat
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
              <div className="text-xs font-bold text-slate-400 tracking-wider uppercase px-2 mb-2 mt-1">Recent Chats</div>
              {recentChats.map((chat, i) => (
                <button key={chat.id} className={`w-full flex flex-col items-start px-3 py-2 rounded-lg transition-colors truncate ${i === 0 ? "bg-slate-100" : "hover:bg-slate-50"}`} title={`Load chat: ${chat.title}`}>
                  <span className={`text-sm truncate w-full text-left ${i === 0 ? "text-slate-900 font-medium" : "text-slate-600"}`}>
                    {chat.title}
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded mt-1 font-bold ${chat.type === "Project" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}`}>
                    {chat.type}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <button
            onClick={() => setLeftCollapsed(false)}
            className="w-12 bg-white border-r border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors"
            title="Open chat history"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        )}

        {/* Center — Chat */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8 flex flex-col">

            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-3xl ${msg.role === "user" ? "order-2" : ""}`}>
                  {msg.role === "assistant" && (
                    <div className="flex items-center gap-2.5 mb-2.5 ml-1">
                      <div className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold bg-teal-600 text-white shadow-sm">
                        AI
                      </div>
                      <span className="text-sm font-semibold text-slate-700">
                        {msg.meta?.agent || "Sovereign AI"}
                        {msg.meta?.model && <span className="text-slate-400 font-normal"> · {msg.meta.model}</span>}
                      </span>
                      {msg.meta?.verified && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-green-100 text-green-700 border border-green-200 uppercase tracking-wider ml-1">
                          ✓ Verified
                        </span>
                      )}
                    </div>
                  )}

                  {/* Router visualization for assistant messages */}
                  {msg.role === "assistant" && msg.meta?.route && msg.meta.scenarioId && (
                    <div className="mb-3">
                      {(() => {
                        const sc = matchScenario(msg.content) || { model: { name: msg.meta.model || "", reason: "" }, complexity: "simple" as const, route: msg.meta.route as any };
                        // Find the actual scenario
                        const found = demoArtifacts.find(a => a.scenarioId === msg.meta!.scenarioId);
                        return (
                          <RouterVisualization
                            route={msg.meta.route as any}
                            modelName={msg.meta.model || ""}
                            modelReason={mode === "manual" ? "Manually selected by user" : "Auto-selected based on query complexity"}
                            complexity={msg.meta.route === "fast" ? "simple" : msg.meta.route === "knowledge" ? "medium" : "complex"}
                          />
                        );
                      })()}
                    </div>
                  )}

                  <div
                    className={`rounded-2xl px-5 py-4 text-sm leading-relaxed shadow-sm ${
                      msg.role === "user"
                        ? "bg-teal-600 text-white rounded-tr-sm"
                        : "bg-white text-slate-800 border border-slate-200 rounded-tl-sm"
                    }`}
                    style={{ whiteSpace: "pre-wrap" }}
                  >
                    {msg.content}
                  </div>

                  {/* Artifact */}
                  {msg.artifact && artifactTemplates[msg.artifact.key] && (
                    <div className="mt-4">
                      <ArtifactCard
                        artifact={artifactTemplates[msg.artifact.key]}
                        status={getArtifactStatus(msg.artifact.scenarioId)}
                        onViewInSandbox={artifactTemplates[msg.artifact.key].type === "CODE" ? () => {
                          const tmpl = artifactTemplates[msg.artifact!.key];
                          if (tmpl.codeContent) {
                            setActiveScenario(activeScenarioRef);
                            setPendingSandboxTask(tmpl.codeContent);
                          }
                          navigate("coding-workspace");
                        } : undefined}
                        onViewDrawing={artifactTemplates[msg.artifact.key].type === "CAD" ? () => setViewingDrawing(true) : undefined}
                        onViewDocument={["PDF", "DOCX", "CSV", "XLSX"].includes(artifactTemplates[msg.artifact.key].type) ? () => setViewingArtifactDocId(msg.artifact!.key) : undefined}
                        onReview={() => navigate("approvals")}
                      />
                    </div>
                  )}

                  {/* Route badge + sources link */}
                  {msg.meta?.route && (
                    <div className="mt-3 flex items-center gap-3 ml-1">
                      <span className={`text-xs px-2.5 py-1 rounded-md font-medium border ${routeStyles[msg.meta.route] || "bg-slate-50 text-slate-700 border-slate-200"}`}>
                        {routeLabels[msg.meta.route] || msg.meta.route}
                      </span>
                      {msg.meta.sources && msg.meta.sources.length > 0 && (
                        <button
                          onClick={() => {
                            setRightPanelSources(msg.meta!.sources!);
                            setRightPanelStrategy(msg.meta!.retrievalStrategy || null);
                            setRightCollapsed(false);
                          }}
                          className="text-xs font-medium text-slate-500 hover:text-teal-600 flex items-center gap-1 transition-colors px-2 py-1 rounded-md hover:bg-teal-50 cursor-pointer"
                          title="View evidence sources"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                          {msg.meta.sources.length} sources
                        </button>
                      )}
                    </div>
                  )}

                  {/* Collapsed execution log */}
                  {msg.meta?.executionState && (
                    <details className="mt-4 rounded-2xl bg-slate-50 border border-slate-100 shadow-inner w-full group overflow-hidden">
                      <summary className="text-xs font-bold text-slate-500 uppercase tracking-wider p-4 cursor-pointer hover:bg-slate-100 transition-colors list-none flex items-center justify-between outline-none">
                        <span className="flex items-center gap-2">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                          Execution Log — {msg.meta.executionState.steps.length} steps
                        </span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 group-open:rotate-180 transition-transform duration-200"><polyline points="6 9 12 15 18 9"></polyline></svg>
                      </summary>
                      <div className="px-4 pb-4 border-t border-slate-100 pt-3">
                        <ExecutionTimeline state={msg.meta.executionState} compact />
                      </div>
                    </details>
                  )}
                </div>
              </div>
            ))}

            {/* Active Execution */}
            {activeExecution?.active && activeScenarioRef && (
              <div className="flex justify-start mb-8">
                <div className="max-w-3xl w-full flex flex-col items-start gap-3">
                  <div className="flex items-center gap-2.5 ml-1">
                    <div className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold bg-teal-600 text-white shadow-sm animate-pulse">
                      AI
                    </div>
                    <span className="text-sm font-semibold text-slate-700">Sovereign AI Processing...</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 font-bold border border-teal-200 animate-pulse">
                      {activeScenarioRef.route.toUpperCase()} PATH
                    </span>
                  </div>

                  {/* Router */}
                  <RouterVisualization
                    route={activeScenarioRef.route}
                    modelName={mode === "manual" ? selectedModelId : activeScenarioRef.model.name}
                    modelReason={mode === "manual" ? "Manually selected" : activeScenarioRef.model.reason}
                    complexity={activeScenarioRef.complexity}
                  />

                  {/* Execution Timeline */}
                  <div className="w-full">
                    <ExecutionTimeline state={activeExecution} />
                  </div>

                  {/* Agent Execution (for complex scenarios) */}
                  {activeScenarioRef.agents.sequential.length > 1 && (
                    <div className="w-full">
                      <AgentExecution
                        agents={activeExecution.agents}
                        plan={activeExecution.agentPlan}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Drawing Modal */}
          {viewingDrawing && (
            <div className="absolute inset-0 z-50 flex items-center justify-center p-8 bg-slate-900/60 backdrop-blur-sm">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl flex flex-col overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">MRPL-CDU4-PID-012-DRAFT</h2>
                    <div className="text-xs text-slate-500 mt-0.5">Engineering Drawing · P&ID — CDU-4 Reflux Pump Circuit</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-3 py-1.5 rounded-lg font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                      ⚠ AI-GENERATED — NOT FOR CONSTRUCTION
                    </span>
                    <button onClick={() => setViewingDrawing(false)} className="text-sm px-4 py-2 rounded-lg font-medium text-white bg-teal-600 hover:bg-teal-700 transition-colors">
                      Close
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-auto bg-slate-100 p-6 flex justify-center items-center">
                  {/* SVG P&ID drawing */}
                  <div className="bg-white rounded-xl shadow-md border border-slate-200 p-4">
                    <svg viewBox="0 0 600 380" className="w-full max-w-[700px]" style={{ border: "1px solid #E2E8F0" }}>
                      <line x1="30" y1="190" x2="120" y2="190" stroke="#0F172A" strokeWidth="2" />
                      <text x="50" y="180" fontSize="9" fill="#475569">Feed</text>
                      <circle cx="145" cy="190" r="22" fill="white" stroke="#0F766E" strokeWidth="1.5" />
                      <line x1="125" y1="190" x2="165" y2="190" stroke="#0F766E" strokeWidth="1.5" />
                      <line x1="145" y1="170" x2="145" y2="210" stroke="#0F766E" strokeWidth="1.5" />
                      <text x="140" y="224" fontSize="9" fill="#0F766E" fontWeight="600">P-102A</text>
                      <line x1="167" y1="190" x2="230" y2="190" stroke="#0F172A" strokeWidth="2" />
                      <polygon points="220,178 240,190 220,202" fill="white" stroke="#2563EB" strokeWidth="1.5" />
                      <line x1="230" y1="178" x2="230" y2="162" stroke="#2563EB" strokeWidth="1.5" />
                      <circle cx="230" cy="158" r="8" fill="white" stroke="#2563EB" strokeWidth="1.5" />
                      <text x="225" y="215" fontSize="9" fill="#2563EB">FV-102</text>
                      <line x1="240" y1="190" x2="320" y2="190" stroke="#0F172A" strokeWidth="2" />
                      <line x1="280" y1="190" x2="280" y2="158" stroke="#0F172A" strokeWidth="1.5" />
                      <circle cx="280" cy="148" r="12" fill="white" stroke="#475569" strokeWidth="1.5" />
                      <text x="274" y="152" fontSize="8" fill="#475569">PI</text>
                      <text x="270" y="136" fontSize="8" fill="#475569">301</text>
                      <rect x="320" y="120" width="80" height="140" rx="4" fill="white" stroke="#0F172A" strokeWidth="2" />
                      <text x="340" y="195" fontSize="9" fill="#0F172A" fontWeight="600">CDU-4</text>
                      <text x="340" y="206" fontSize="8" fill="#475569">Reflux</text>
                      <line x1="400" y1="190" x2="470" y2="190" stroke="#0F172A" strokeWidth="2" />
                      <text x="425" y="180" fontSize="9" fill="#475569">Reflux out</text>
                      <circle cx="145" cy="290" r="22" fill="white" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="4,2" />
                      <line x1="125" y1="290" x2="165" y2="290" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="4,2" />
                      <line x1="145" y1="270" x2="145" y2="310" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="4,2" />
                      <text x="137" y="324" fontSize="9" fill="#94A3B8">P-102B</text>
                      <text x="125" y="335" fontSize="8" fill="#94A3B8">(Standby)</text>
                      <line x1="145" y1="268" x2="145" y2="212" stroke="#475569" strokeWidth="1.5" />
                      <rect x="5" y="5" width="590" height="370" fill="none" stroke="#E2E8F0" strokeWidth="1" />
                      <rect x="5" y="345" width="590" height="30" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />
                      <text x="15" y="364" fontSize="9" fill="#475569" fontWeight="600">MRPL — CDU-4 Reflux Pump Circuit P&amp;ID — Preliminary AI Draft</text>
                      <text x="450" y="364" fontSize="9" fill="#DC2626" fontWeight="600">⚠ NOT FOR CONSTRUCTION</text>
                    </svg>
                    <div className="mt-3 text-center text-xs font-semibold py-2 rounded" style={{ background: "#FEF3C7", color: "#92400E", border: "1px solid #FDE68A" }}>
                      AI-GENERATED — ENGINEERING REVIEW REQUIRED BEFORE USE
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Artifact Document Modal */}
          {viewingArtifactDocId && (
            <DocumentViewer
              documentId={viewingArtifactDocId}
              onClose={() => setViewingArtifactDocId(null)}
            />
          )}

          {/* Input */}
          <div className="flex-shrink-0 px-6 pb-6 pt-2 bg-transparent">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden transition-all focus-within:shadow-md focus-within:border-teal-400">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder="Ask, analyze, create, search, calculate or execute..."
                rows={1}
                className="w-full px-4 py-3 text-sm outline-none resize-none text-slate-700 placeholder-slate-400 bg-transparent min-h-[44px]"
              />
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-50/80 border-t border-slate-100 relative">
                <button
                  onClick={() => setShowAttachMenu(!showAttachMenu)}
                  className="w-7 h-7 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition-colors shrink-0"
                  title="Attach options"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
                </button>

                <div className="flex items-center p-0.5 ml-1 rounded-lg bg-slate-100/80 border border-slate-200 shrink-0">
                  {(["auto", "manual"] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => setMode(m)}
                      className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all capitalize ${
                        mode === m
                          ? "bg-white text-teal-700 shadow-sm"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      {m === "auto" ? "● Auto" : "○ Manual"}
                    </button>
                  ))}
                </div>
                {mode === "manual" && (
                  <select
                    value={selectedModelId}
                    onChange={(e) => setSelectedModelId(e.target.value)}
                    className="text-[10px] border border-slate-300 rounded-lg px-2 py-1 outline-none bg-white text-slate-700 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 shadow-sm max-w-[160px] truncate shrink-0 ml-1"
                  >
                    <option value="qwen3-8b">Qwen3-8B (Reasoning)</option>
                    <option value="qwen25-vl-7b">Qwen2.5-VL-7B (Vision)</option>
                    <option value="internvl3-8b">InternVL3-8B (Industrial)</option>
                    <option value="qwen25-omni-7b">Qwen2.5-Omni-7B</option>
                    <option value="qwen25-omni-3b">Qwen2.5-Omni-3B (Fast)</option>
                    <option value="sovereign-code-7b">Sovereign-Code-7B</option>
                  </select>
                )}

                {showAttachMenu && (
                  <div className="absolute bottom-10 left-3 bg-white border border-slate-200 shadow-lg rounded-xl p-1.5 flex gap-1 z-20">
                    {["Attach", "Voice", "Image", "Agent", "Tools", "Model"].map((btn) => (
                      <button
                        key={btn}
                        onClick={() => setShowAttachMenu(false)}
                        className="text-xs px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium transition-colors"
                        title={btn}
                      >
                        {btn}
                      </button>
                    ))}
                  </div>
                )}
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || activeExecution?.active}
                  className={`ml-auto text-xs px-5 py-1.5 rounded-xl font-semibold transition-all shadow-sm ${
                    input.trim() && !activeExecution?.active
                      ? "bg-teal-600 text-white hover:bg-teal-700 hover:shadow"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed"
                  }`}
                  title="Send message"
                >
                  Send
                </button>
              </div>
            </div>
            <div className="text-center mt-2">
               <span className="text-[9px] text-slate-400 font-medium tracking-wide">AI CAN MAKE MISTAKES. VERIFY IMPORTANT INFORMATION.</span>
            </div>
          </div>
        </div>

        {/* Right Panel — Evidence & Context */}
        {!rightCollapsed ? (
          <div className="w-80 bg-white border-l border-slate-200 flex-shrink-0 overflow-y-auto transition-all relative">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 sticky top-0 bg-white/90 backdrop-blur z-10">
              <span className="text-xs font-bold text-slate-500 tracking-wider uppercase">Context & Evidence</span>
              <button onClick={() => setRightCollapsed(true)} className="text-slate-400 hover:text-slate-700 transition-colors p-1 rounded-md hover:bg-slate-100" title="Close right panel">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>

            {/* Model Selector */}
            <div className="px-5 py-4 border-b border-slate-100">
              <ModelSelector
                mode={mode}
                autoModel={activeScenarioRef?.model}
                selectedModelId={selectedModelId}
                onModelChange={setSelectedModelId}
                onModeChange={setMode}
              />
            </div>

            {/* Project Context */}
            <div className="px-5 py-5 border-b border-slate-100 bg-slate-50/30">
              <div className="text-sm font-semibold text-slate-800 mb-4">Project Context</div>
              <div className="space-y-4">
                {[
                  { label: "Documents", count: `${currentProject.artifacts} files`, icon: "◧", color: "text-blue-500" },
                  { label: "Knowledge", count: "1.2K chunks", icon: "◈", color: "text-purple-500" },
                  { label: "Database", count: "MRPL PostgreSQL", icon: "⬡", color: "text-teal-500" },
                  { label: "Notes", count: "3 notes", icon: "◪", color: "text-amber-500" },
                  { label: "Contributors", count: `${currentProject.contributors?.length || 0} active`, icon: "◯", color: "text-rose-500" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center border border-slate-100 ${item.color}`}>
                      <span className="text-lg">{item.icon}</span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-800">{item.label}</div>
                      <div className="text-xs text-slate-500">{item.count}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Evidence */}
            <div className="px-5 py-5">
              {activeExecution?.active && activeScenarioRef?.route === "knowledge" ? (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="text-sm font-semibold text-slate-800">Context & Evidence</div>
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col gap-4 shadow-sm">
                    <div className="text-xs font-bold text-teal-600 uppercase tracking-wider flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-teal-500 border-t-transparent animate-spin"></div>
                      Scanning Internal Knowledge Base...
                    </div>
                    <div className="flex flex-col gap-2.5 pl-1">
                      <div className="text-xs font-medium text-slate-600 flex items-center gap-2 animate-pulse" style={{ animationDelay: '0ms' }}>
                        <span className="text-[9px] bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded flex items-center justify-center">◉</span> Searching inspection reports...
                      </div>
                      <div className="text-xs font-medium text-slate-600 flex items-center gap-2 animate-pulse" style={{ animationDelay: '200ms' }}>
                        <span className="text-[9px] bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded flex items-center justify-center">◉</span> Searching maintenance SOPs...
                      </div>
                      <div className="text-xs font-medium text-slate-600 flex items-center gap-2 animate-pulse" style={{ animationDelay: '400ms' }}>
                        <span className="text-[9px] bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded flex items-center justify-center">◉</span> Searching engineering limits...
                      </div>
                    </div>
                  </div>
                </div>
              ) : rightPanelSources.length > 0 && rightPanelStrategy ? (
                <EvidencePanel
                  sources={rightPanelSources}
                  retrievalStrategy={rightPanelStrategy}
                />
              ) : (
                <div className="text-center py-8">
                  <div className="text-xs text-slate-400 font-medium">No evidence loaded yet.</div>
                  <div className="text-[10px] text-slate-400 mt-1">Submit a knowledge query to see evidence sources.</div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <button
            onClick={() => setRightCollapsed(false)}
            className="w-12 bg-white border-l border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors"
            title="Open Context & Evidence"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
        )}
      </div>
    </div>
  );
}
