"use server";

import { requireAuth } from "@/lib/session";
import { api } from "@/lib/api-client";

export interface WorkflowTrigger {
  readonly type: "leave_request" | "review_scheduled" | "task_created" | "event_occurred";
  readonly condition?: string;
}

export interface WorkflowAction {
  readonly type:
    | "notify_user"
    | "notify_team"
    | "send_email"
    | "create_task"
    | "update_field"
    | "assign_to";
  readonly payload: Record<string, unknown>;
}

export interface WorkflowRule {
  readonly id?: string;
  readonly name: string;
  readonly description?: string;
  readonly trigger: WorkflowTrigger;
  readonly actions: WorkflowAction[];
  readonly isActive: boolean;
}

/**
 * Create a new workflow rule
 */
export async function createWorkflowRule(rule: WorkflowRule): Promise<WorkflowRule> {
  const user = await requireAuth();

  if (!rule.name || rule.name.trim().length === 0) {
    throw new Error("Workflow rule must have a name");
  }

  if (!rule.trigger) {
    throw new Error("Workflow rule must have a trigger");
  }

  if (!rule.actions || rule.actions.length === 0) {
    throw new Error("Workflow rule must have at least one action");
  }

  try {
    return await api.post<WorkflowRule>("/workflows", rule);
  } catch (error) {
    throw new Error("Failed to create workflow rule");
  }
}

/**
 * Update an existing workflow rule
 */
export async function updateWorkflowRule(
  ruleId: string,
  rule: Partial<WorkflowRule>,
): Promise<WorkflowRule> {
  const user = await requireAuth();

  try {
    return await api.put<WorkflowRule>(`/workflows/${ruleId}`, rule);
  } catch (error) {
    throw new Error("Failed to update workflow rule");
  }
}

/**
 * Delete a workflow rule
 */
export async function deleteWorkflowRule(ruleId: string): Promise<void> {
  const user = await requireAuth();

  try {
    await api.delete(`/workflows/${ruleId}`);
  } catch (error) {
    throw new Error("Failed to delete workflow rule");
  }
}

/**
 * Get all workflow rules for organization
 */
export async function getWorkflowRules(): Promise<WorkflowRule[]> {
  const user = await requireAuth();

  try {
    return await api.get<WorkflowRule[]>("/workflows");
  } catch (error) {
    throw new Error("Failed to fetch workflow rules");
  }
}

/**
 * Execute workflow actions for a given trigger
 */
export async function executeWorkflowActions(
  trigger: WorkflowTrigger,
  context: Record<string, unknown>,
): Promise<void> {
  const user = await requireAuth();

  try {
    await api.post("/workflows/execute", {
      trigger,
      context,
    });
  } catch (error) {
    throw new Error("Failed to execute workflow actions");
  }
}
