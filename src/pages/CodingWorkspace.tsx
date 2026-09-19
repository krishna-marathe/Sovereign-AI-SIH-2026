import { useState, useRef, useEffect } from "react";
import { useNav } from "../context/NavContext";
import { artifactTemplates } from "../demo";

const files = [
  { name: "main.py", type: "python", size: "4.2 KB" },
  { name: "analysis.py", type: "python", size: "8.1 KB" },
  { name: "utils.py", type: "python", size: "2.3 KB" },
  { name: "tests/", type: "folder", size: "" },
  { name: "  test_analysis.py", type: "python", size: "3.8 KB" },
  { name: "  test_utils.py", type: "python", size: "1.9 KB" },
  { name: "requirements.txt", type: "text", size: "0.3 KB" },
];

const timelineSteps = [
  "Repository Analysis",
  "Bug Detection",
  "Code Modification",
  "Sandbox Execution",
  "Running Tests",
  "Error Detection",
  "AI Fix",
  "Retest",
  "Verified"
];

export default function CodingWorkspace() {
  const { navigate, setPendingSandboxTask, activeScenario } = useNav();
  
  // Use artifact code if available, else fallback
  const fallbackCode = `import pandas as pd\nimport numpy as np\n\ndef analyze():\n    pass`;
  const initialCode = activeScenario?.artifactKey && artifactTemplates[activeScenario.artifactKey]?.codeContent 
    ? artifactTemplates[activeScenario.artifactKey].codeContent! 
    : fallbackCode;

  const [activeFile, setActiveFile] = useState("analysis.py");
  const [terminalTab, setTerminalTab] = useState("Tests");
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "ai", text: "Coding Agent initialized. Repository context loaded. I can analyze code, generate tests, fix errors, and run the sandbox." }
  ]);
  const [isRunning, setIsRunning] = useState(false);
  const [termLines, setTermLines] = useState<string[]>([]);
  const [testStats, setTestStats] = useState("");
  const [activeTabContent, setActiveTabContent] = useState(initialCode);
  
  // Animation state for timeline
  const [timelineProgress, setTimelineProgress] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-run timeline animation if coding scenario is active
  useEffect(() => {
    if (activeScenario && activeScenario.route === "coding") {
      setMessages([
        { role: "ai", text: "Repository analysis complete.\nFound off-by-one error in threshold comparison on line 34.\nFix applied: Changed `>` to `>=`.\nCode is ready for review and sandbox testing." }
      ]);
      setTimelineProgress(timelineSteps.length); // mark all as done
      setTestStats("All 12 tests passed ✓\n\ntest_vibration_threshold PASSED\ntest_exceedance_calculation PASSED\ntest_edge_cases PASSED\n...");
    }
  }, [activeScenario]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const runTests = () => {
    if (isRunning) return;
    setIsRunning(true);
    setTerminalTab("Terminal");
    setTermLines(["$ python -m pytest tests/ -v"]);
    setTestStats("");
    
    let step = 0;
    const testLines = [
      "collected 12 items\n",
      "tests/test_analysis.py::test_vibration_threshold PASSED    [ 8%]",
      "tests/test_analysis.py::test_exceedance_calculation PASSED  [16%]",
      "tests/test_analysis.py::test_edge_cases PASSED             [25%]",
      "tests/test_utils.py::test_data_loading PASSED              [33%]",
      "tests/test_utils.py::test_normalization PASSED             [41%]",
      "tests/test_utils.py::test_export_formats PASSED            [50%]",
      "...",
      "============================== 12 passed in 1.34s =============================="
    ];

    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (step < testLines.length) {
        setTermLines(prev => [...prev, testLines[step]]);
        step++;
      } else {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsRunning(false);
        setTestStats("All 12 tests passed ✓\n\ntest_vibration_threshold PASSED\ntest_exceedance_calculation PASSED\ntest_edge_cases PASSED\n...");
      }
    }, 400);
  };

  const send = () => {
    if (!chatInput.trim() || isRunning) return;
    setMessages([...messages, { role: "user", text: chatInput }]);
    setChatInput("");
    setIsRunning(true);
    setTimelineProgress(0);
    
    // Simulate pipeline progression
    const steps = timelineSteps.length;
    let currentStep = 0;
    
    const progressInterval = setInterval(() => {
      currentStep++;
      setTimelineProgress(currentStep);
      
      if (currentStep === 5) { // Running tests phase
        runTests();
      }
      
      if (currentStep >= steps) {
        clearInterval(progressInterval);
        setMessages(prev => [...prev, { role: "ai", text: "Analysis and test execution complete. Code has been verified in sandbox." }]);
        setIsRunning(false);
      }
    }, 1200);
  };

  const handleOpenSandbox = () => {
    setPendingSandboxTask(activeTabContent);
    navigate("sandbox");
  };

  return (
    <div className="flex flex-col h-full" style={{ background: "#0F172A" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b flex-shrink-0" style={{ background: "#1E293B", borderColor: "#334155" }}>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate("workbench")}
            className="w-8 h-8 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 flex items-center justify-center transition-colors"
            title="Back to Workbench"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </button>
          <span className="text-sm font-semibold" style={{ color: "#F1F5F9" }}>Coding Workspace</span>
          <span className="text-xs px-2 py-0.5 rounded font-medium" style={{ background: "#0F766E", color: "white", fontSize: 10 }}>CDU-4 Analysis Repo</span>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <button onClick={handleOpenSandbox} className="flex items-center gap-1.5 text-xs px-4 py-1.5 rounded font-medium transition-colors hover:bg-slate-700 shadow-sm" style={{ background: "#1E3A5F", color: "#93C5FD", fontSize: 11 }}>
             Open in Sandbox
          </button>
          <button onClick={runTests} disabled={isRunning} className="flex items-center gap-1.5 text-xs px-4 py-1.5 rounded font-medium transition-colors shadow-sm disabled:opacity-50" style={{ background: "#064E3B", color: "#6EE7B7", fontSize: 11 }}>
            {isRunning ? <div className="w-3 h-3 border-2 border-emerald-200 border-t-transparent rounded-full animate-spin"></div> : "▶"} 
            {isRunning ? "Running..." : "Run Tests"}
          </button>
        </div>
      </div>

      {/* Execution Timeline */}
      <div className="flex items-center gap-2 px-4 py-2 overflow-x-auto flex-shrink-0 hide-scrollbar" style={{ background: "#1E293B", borderBottom: "1px solid #334155" }}>
        {timelineSteps.map((step, i) => {
          const isDone = i < timelineProgress;
          const isRunningStep = i === timelineProgress && isRunning;
          return (
            <div key={step} className="flex items-center gap-1.5 flex-shrink-0">
              <div
                className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs transition-colors duration-300`}
                style={{
                  background: isDone ? "#064E3B" : isRunningStep ? "#1E3A5F" : "#0F172A",
                  color: isDone ? "#6EE7B7" : isRunningStep ? "#93C5FD" : "#475569",
                  border: isRunningStep ? "1px solid #3B82F6" : "1px solid transparent",
                  fontSize: 11,
                }}
              >
                {isDone ? "✓" : isRunningStep ? "◌" : "·"} {step}
              </div>
              {i < timelineSteps.length - 1 && <span style={{ color: "#334155" }}>→</span>}
            </div>
          );
        })}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* File Explorer */}
        <div className="w-48 border-r flex flex-col flex-shrink-0" style={{ background: "#1E293B", borderColor: "#334155" }}>
          <div className="px-3 py-2 text-xs font-semibold" style={{ color: "#64748B", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Explorer
          </div>
          {files.map((f) => (
            <button
              key={f.name}
              onClick={() => !f.name.endsWith("/") && setActiveFile(f.name.trim())}
              className="w-full text-left px-3 py-1.5 text-xs hover:bg-slate-700 transition-colors"
              style={{
                color: activeFile === f.name.trim() ? "#6EE7B7" : f.type === "folder" ? "#94A3B8" : "#CBD5E1",
                background: activeFile === f.name.trim() ? "#0F2937" : "transparent",
                fontSize: 12,
              }}
            >
              {f.name}
            </button>
          ))}
        </div>

        {/* Editor */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b flex-shrink-0" style={{ background: "#1E293B", borderColor: "#334155" }}>
            {["main.py", "analysis.py"].map((t) => (
              <button
                key={t}
                onClick={() => setActiveFile(t)}
                className="px-4 py-2 text-xs border-r"
                style={{
                  borderColor: "#334155",
                  background: activeFile === t ? "#0F172A" : "transparent",
                  color: activeFile === t ? "#F1F5F9" : "#64748B",
                  borderTop: activeFile === t ? "1px solid #0F766E" : "1px solid transparent",
                }}
              >
                {t}
              </button>
            ))}
          </div>
          {/* Code */}
          <div className="flex-1 overflow-auto p-4 relative bg-[#0d1117]">
            <textarea 
              value={activeFile === "analysis.py" ? activeTabContent : "# Select analysis.py to see changes"} 
              onChange={(e) => setActiveTabContent(e.target.value)}
              className="absolute inset-0 w-full h-full p-4 bg-transparent outline-none resize-none font-mono text-xs leading-relaxed"
              style={{ color: "#c9d1d9", fontSize: 12 }}
              spellCheck={false}
            />
          </div>

          {/* Terminal */}
          <div className="border-t flex-shrink-0 flex flex-col" style={{ borderColor: "#334155", height: 220 }}>
            <div className="flex border-b bg-[#1E293B]" style={{ borderColor: "#334155" }}>
              {["Terminal", "Tests", "Problems"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTerminalTab(t)}
                  className="px-4 py-2 text-xs font-medium"
                  style={{ color: terminalTab === t ? "#F1F5F9" : "#64748B", borderBottom: terminalTab === t ? "1px solid #0F766E" : "1px solid transparent" }}
                >
                  {t === "Tests" ? "✓ Tests" : t}
                </button>
              ))}
            </div>
            <div className="p-3 overflow-y-auto h-full flex flex-col gap-1 bg-[#0d1117]">
              {terminalTab === "Terminal" ? (
                termLines.length === 0 ? (
                  <div style={{ color: "#64748B", fontFamily: "var(--font-mono)", fontSize: 11 }}>Ready. Press Run Tests to execute.</div>
                ) : (
                  termLines.map((line, i) => (
                    <div key={i} style={{ color: line.includes("PASSED") ? "#86EFAC" : line.includes("error") ? "#F87171" : "#c9d1d9", fontFamily: "var(--font-mono)", fontSize: 11 }}>{line}</div>
                  ))
                )
              ) : (
                <pre className="text-xs" style={{ color: "#86EFAC", fontFamily: "var(--font-mono)", fontSize: 11, lineHeight: 1.6 }}>
                  {testStats || "Run tests to see results."}
                </pre>
              )}
              {isRunning && terminalTab === "Terminal" && (
                <div className="flex items-center mt-1">
                  <span className="text-xs text-blue-400 font-mono">_</span>
                  <span className="w-1.5 h-3 ml-0.5 animate-pulse bg-blue-400" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Coding Agent Chat */}
        <div className="w-80 border-l flex flex-col flex-shrink-0" style={{ background: "#1E293B", borderColor: "#334155" }}>
          <div className="px-4 py-3 border-b flex items-center gap-2" style={{ borderColor: "#334155" }}>
            <div className="w-6 h-6 rounded flex items-center justify-center text-xs font-semibold shadow-sm" style={{ background: "#0F766E", color: "white", fontSize: 10 }}>CA</div>
            <span className="text-sm font-semibold" style={{ color: "#F1F5F9" }}>Coding Agent</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className="rounded-lg px-3 py-2 text-xs shadow-sm max-w-[90%]"
                  style={{
                    background: msg.role === "user" ? "#0F766E" : "#0F172A",
                    color: msg.role === "user" ? "white" : "#CBD5E1",
                    whiteSpace: "pre-wrap",
                    fontSize: 11,
                    lineHeight: 1.5,
                    border: msg.role === "ai" ? "1px solid #334155" : "none",
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isRunning && (
              <div className="flex justify-start">
                <div className="rounded-lg px-3 py-2 bg-[#0F172A] border border-[#334155] shadow-sm flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "150ms" }}></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "300ms" }}></div>
                </div>
              </div>
            )}
          </div>
          <div className="p-3 border-t bg-[#0F172A]" style={{ borderColor: "#334155" }}>
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") send(); }}
                placeholder="Ask the coding agent to edit..."
                className="flex-1 px-3 py-2 rounded-lg text-xs outline-none focus:ring-1 focus:ring-teal-500"
                style={{ background: "#1E293B", border: "1px solid #334155", color: "#F1F5F9", fontSize: 11 }}
              />
              <button 
                onClick={send} 
                disabled={isRunning || !chatInput.trim()}
                className="w-8 h-8 rounded-lg flex items-center justify-center font-medium shadow-sm transition-colors disabled:opacity-50" 
                style={{ background: "#0F766E", color: "white" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
