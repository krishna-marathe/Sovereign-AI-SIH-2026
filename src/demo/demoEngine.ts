import type { DemoScenario, ExecutionStepDef } from "./demoQueries";
import type { AgentStepGroup } from "./demoAgents";

export type StepStatus = "pending" | "running" | "completed" | "failed";

export type ExecutionStep = {
  label: string;
  status: StepStatus;
  startedAt?: number;
  completedAt?: number;
  durationMs?: number;
  estimatedMs: number;
  subSteps?: string[];
};

export type AgentRunStatus = {
  agentId: string;
  status: StepStatus;
  startedAt?: number;
  completedAt?: number;
};

export type ExecutionState = {
  scenarioId: string;
  active: boolean;
  steps: ExecutionStep[];
  agents: AgentRunStatus[];
  agentPlan: AgentStepGroup[];
  progress: number; // 0-100
  startTime: number;
  estimatedDurationMs: number;
  currentStepIndex: number;
  phase: "routing" | "executing" | "verifying" | "complete";
};

/**
 * Creates a fresh execution state from a demo scenario.
 */
export function createExecutionState(scenario: DemoScenario): ExecutionState {
  const steps: ExecutionStep[] = scenario.executionSteps.map((s) => ({
    label: s.label,
    status: "pending" as StepStatus,
    estimatedMs: s.estimatedMs,
    subSteps: s.subSteps,
  }));

  // Flatten all agents from the plan
  const agentIds = new Set<string>();
  for (const group of scenario.agents.sequential) {
    for (const id of group.agents) {
      agentIds.add(id);
    }
  }

  const agents: AgentRunStatus[] = Array.from(agentIds).map((id) => ({
    agentId: id,
    status: "pending" as StepStatus,
  }));

  return {
    scenarioId: scenario.id,
    active: true,
    steps,
    agents,
    agentPlan: scenario.agents.sequential,
    progress: 0,
    startTime: Date.now(),
    estimatedDurationMs: scenario.durationMs,
    currentStepIndex: 0,
    phase: "routing",
  };
}

/**
 * Advances the execution state by one tick. Returns the updated state.
 * This is pure — it does not mutate the input.
 */
export function tickExecution(state: ExecutionState, stepDefs: ExecutionStepDef[]): ExecutionState {
  const now = Date.now();
  const elapsed = now - state.startTime;
  const progress = Math.min((elapsed / state.estimatedDurationMs) * 100, 100);

  // Calculate which step should be active based on elapsed time
  let cumulativeMs = 0;
  let targetStepIndex = 0;
  for (let i = 0; i < stepDefs.length; i++) {
    cumulativeMs += stepDefs[i].estimatedMs;
    if (elapsed < cumulativeMs) {
      targetStepIndex = i;
      break;
    }
    if (i === stepDefs.length - 1) {
      targetStepIndex = stepDefs.length - 1;
    }
  }

  // Update step statuses
  const steps: ExecutionStep[] = state.steps.map((step, i) => {
    if (i < targetStepIndex) {
      return {
        ...step,
        status: "completed" as StepStatus,
        completedAt: step.completedAt || now,
        durationMs: stepDefs[i].estimatedMs,
      };
    } else if (i === targetStepIndex) {
      return {
        ...step,
        status: "running" as StepStatus,
        startedAt: step.startedAt || now,
      };
    }
    return { ...step, status: "pending" as StepStatus };
  });

  // Update agent statuses based on step progress
  const agentProgress = computeAgentProgress(state.agentPlan, elapsed, state.estimatedDurationMs);
  const agents = state.agents.map((a) => {
    const agentStatus = agentProgress.get(a.agentId);
    if (agentStatus) {
      return { ...a, ...agentStatus };
    }
    return a;
  });

  // Determine phase
  let phase: ExecutionState["phase"] = "routing";
  if (progress >= 95) {
    phase = "complete";
  } else if (targetStepIndex >= steps.length - 2) {
    phase = "verifying";
  } else if (targetStepIndex >= 5) {
    phase = "executing";
  }

  // Check if complete
  const isComplete = elapsed >= state.estimatedDurationMs;

  if (isComplete) {
    return {
      ...state,
      active: false,
      steps: steps.map((s) => ({
        ...s,
        status: "completed" as StepStatus,
        completedAt: s.completedAt || now,
      })),
      agents: agents.map((a) => ({
        ...a,
        status: "completed" as StepStatus,
        completedAt: a.completedAt || now,
      })),
      progress: 100,
      currentStepIndex: steps.length - 1,
      phase: "complete",
    };
  }

  return {
    ...state,
    steps,
    agents,
    progress,
    currentStepIndex: targetStepIndex,
    phase,
  };
}

/**
 * Compute agent statuses based on how far we are through the execution plan.
 */
function computeAgentProgress(
  plan: AgentStepGroup[],
  elapsedMs: number,
  totalMs: number
): Map<string, Partial<AgentRunStatus>> {
  const result = new Map<string, Partial<AgentRunStatus>>();
  const now = Date.now();

  // Distribute the plan across the middle portion of execution (skip first ~20% for routing, last ~10% for finalization)
  const agentStartPct = 0.25;
  const agentEndPct = 0.85;
  const agentWindowMs = (agentEndPct - agentStartPct) * totalMs;
  const agentElapsed = Math.max(0, elapsedMs - agentStartPct * totalMs);

  // Calculate total agent duration
  const totalAgentDuration = plan.reduce((sum, g) => sum + g.durationMs, 0);

  let cumulativeDuration = 0;
  for (const group of plan) {
    const groupStartPct = cumulativeDuration / totalAgentDuration;
    const groupEndPct = (cumulativeDuration + group.durationMs) / totalAgentDuration;
    const groupStartMs = groupStartPct * agentWindowMs;
    const groupEndMs = groupEndPct * agentWindowMs;

    for (const agentId of group.agents) {
      if (agentElapsed >= groupEndMs) {
        result.set(agentId, { status: "completed", completedAt: now });
      } else if (agentElapsed >= groupStartMs) {
        result.set(agentId, { status: "running", startedAt: now });
      } else {
        result.set(agentId, { status: "pending" });
      }
    }

    cumulativeDuration += group.durationMs;
  }

  return result;
}

/**
 * Start an execution timer that calls onTick at 200ms intervals and onComplete when done.
 * Returns a cleanup function.
 */
export function runExecution(
  scenario: DemoScenario,
  onTick: (state: ExecutionState) => void,
  onComplete: (state: ExecutionState) => void
): () => void {
  let state = createExecutionState(scenario);
  onTick(state);

  const interval = setInterval(() => {
    state = tickExecution(state, scenario.executionSteps);
    onTick(state);

    if (!state.active) {
      clearInterval(interval);
      onComplete(state);
    }
  }, 200);

  return () => clearInterval(interval);
}
