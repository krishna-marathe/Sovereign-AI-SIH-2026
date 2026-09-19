export type DemoModel = {
  id: string;
  name: string;
  displayName: string;
  type: "reasoning" | "vision" | "omni" | "speech" | "embedding" | "reranking" | "code";
  vram: string;
  latency: string;
  status: "active" | "standby" | "loading";
  gpu: string;
  localExecution: boolean;
  description: string;
};

export const demoModels: DemoModel[] = [
  {
    id: "qwen3-8b",
    name: "Qwen3-8B",
    displayName: "Reasoning Model (Qwen3-8B)",
    type: "reasoning",
    vram: "8 GB / 12 GB",
    latency: "1.8s avg",
    status: "active",
    gpu: "NVIDIA A100 — Node 1",
    localExecution: true,
    description: "General reasoning, summarization, and analysis",
  },
  {
    id: "qwen25-vl-7b",
    name: "Qwen2.5-VL-7B",
    displayName: "Vision Model (Qwen2.5-VL-7B)",
    type: "vision",
    vram: "7 GB / 12 GB",
    latency: "2.1s avg",
    status: "active",
    gpu: "NVIDIA A100 — Node 1",
    localExecution: true,
    description: "Document analysis, image understanding, and visual QA",
  },
  {
    id: "internvl3-8b",
    name: "InternVL3-8B",
    displayName: "Industrial Vision (InternVL3-8B)",
    type: "vision",
    vram: "8 GB / 12 GB",
    latency: "2.4s avg",
    status: "active",
    gpu: "NVIDIA A100 — Node 2",
    localExecution: true,
    description: "Complex industrial reasoning and multimodal analysis",
  },
  {
    id: "qwen25-omni-7b",
    name: "Qwen2.5-Omni-7B",
    displayName: "Omni Model (Qwen2.5-Omni-7B)",
    type: "omni",
    vram: "7 GB / 12 GB",
    latency: "2.5s avg",
    status: "active",
    gpu: "NVIDIA A100 — Node 2",
    localExecution: true,
    description: "Multimodal voice + vision + text processing",
  },
  {
    id: "qwen25-omni-3b",
    name: "Qwen2.5-Omni-3B",
    displayName: "Lightweight Omni (Qwen2.5-Omni-3B)",
    type: "omni",
    vram: "3 GB / 12 GB",
    latency: "0.8s avg",
    status: "active",
    gpu: "NVIDIA A100 — Node 1",
    localExecution: true,
    description: "Fast lightweight queries and simple data lookups",
  },
  {
    id: "sovereign-code-7b",
    name: "Sovereign-Code-7B",
    displayName: "Code Model (Sovereign-Code-7B)",
    type: "code",
    vram: "7 GB / 12 GB",
    latency: "2.0s avg",
    status: "active",
    gpu: "NVIDIA A100 — Node 2",
    localExecution: true,
    description: "Code generation, analysis, debugging, and testing",
  },
  {
    id: "whisper-large-v3",
    name: "Whisper large-v3",
    displayName: "Speech Model (Whisper large-v3)",
    type: "speech",
    vram: "3 GB / 12 GB",
    latency: "Real-time",
    status: "active",
    gpu: "NVIDIA A100 — Node 1",
    localExecution: true,
    description: "Speech transcription and voice input",
  },
  {
    id: "bge-m3",
    name: "BGE-M3",
    displayName: "Embedding Model (BGE-M3)",
    type: "embedding",
    vram: "2 GB / 12 GB",
    latency: "45ms avg",
    status: "active",
    gpu: "NVIDIA A100 — Node 1",
    localExecution: true,
    description: "Text embedding for semantic search",
  },
  {
    id: "bge-reranker-v2",
    name: "BGE-Reranker-v2",
    displayName: "Reranker (BGE-Reranker-v2)",
    type: "reranking",
    vram: "1 GB / 12 GB",
    latency: "30ms avg",
    status: "active",
    gpu: "NVIDIA A100 — Node 1",
    localExecution: true,
    description: "Result reranking for improved retrieval quality",
  },
];

export function getModelById(id: string): DemoModel | undefined {
  return demoModels.find((m) => m.id === id);
}

export function getModelsByType(type: DemoModel["type"]): DemoModel[] {
  return demoModels.filter((m) => m.type === type);
}
