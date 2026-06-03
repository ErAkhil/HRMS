"use client";

import { useState } from "react";
import { createWorkflowRule, deleteWorkflowRule, type WorkflowRule } from "@/lib/actions/workflows";

export function WorkflowBuilder() {
  const [rules, setRules] = useState<WorkflowRule[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<WorkflowRule>({
    name: "",
    description: "",
    trigger: { type: "leave_request" },
    actions: [{ type: "notify_user", payload: {} }],
    isActive: true,
  });

  const handleAddRule = async () => {
    if (!formData.name.trim()) {
      alert("Please enter a workflow name");
      return;
    }

    try {
      const result = await createWorkflowRule(formData);
      setRules([...rules, { ...formData, id: result.id }]);
      setFormData({
        name: "",
        description: "",
        trigger: { type: "leave_request" },
        actions: [{ type: "notify_user", payload: {} }],
        isActive: true,
      });
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to create workflow:", error);
      alert(error instanceof Error ? error.message : "Failed to create workflow");
    }
  };

  const handleDeleteRule = async (ruleId: string) => {
    if (!confirm("Delete this workflow?")) return;

    try {
      await deleteWorkflowRule(ruleId);
      setRules(rules.filter((r) => r.id !== ruleId));
    } catch (error) {
      console.error("Failed to delete workflow:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-dark dark:text-white">Automation Rules</h3>
        <button
          onClick={() => setIsOpen(true)}
          className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          + New Rule
        </button>
      </div>

      {/* Rules List */}
      <div className="space-y-3">
        {rules.length === 0 ? (
          <div className="rounded-lg border border-gray-3 bg-white p-4 text-center dark:border-dark-3 dark:bg-dark-2">
            <p className="text-sm text-dark-5 dark:text-dark-6">No automation rules yet</p>
          </div>
        ) : (
          rules.map((rule) => (
            <div
              key={rule.id}
              className="rounded-lg border border-gray-3 bg-white p-4 dark:border-dark-3 dark:bg-dark-2"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-dark dark:text-white">{rule.name}</h4>
                  <p className="text-sm text-dark-5 dark:text-dark-6">{rule.description}</p>
                  <div className="mt-3 space-y-1">
                    <p className="text-xs text-dark-5 dark:text-dark-6">
                      Trigger: <span className="font-mono">{rule.trigger.type}</span>
                    </p>
                    <p className="text-xs text-dark-5 dark:text-dark-6">
                      Actions: <span className="font-mono">{rule.actions.length} action(s)</span>
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDeleteRule(rule.id!)}
                    className="text-sm text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Rule Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-lg space-y-4 rounded-xl bg-white p-6 dark:bg-dark-2">
            <h3 className="text-lg font-semibold text-dark dark:text-white">Create Automation Rule</h3>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-dark dark:text-white">
                Rule Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Notify manager on leave"
                className="mt-1 w-full rounded-lg border border-gray-3 bg-white px-3 py-2 text-sm outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white"
              />
            </div>

            {/* Trigger */}
            <div>
              <label className="block text-sm font-medium text-dark dark:text-white">
                When
              </label>
              <select
                value={formData.trigger.type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    trigger: { type: e.target.value as any },
                  })
                }
                className="mt-1 w-full rounded-lg border border-gray-3 bg-white px-3 py-2 text-sm outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white"
              >
                <option value="leave_request">Leave request submitted</option>
                <option value="review_scheduled">Review scheduled</option>
                <option value="task_created">Task created</option>
                <option value="event_occurred">Event occurred</option>
              </select>
            </div>

            {/* Action */}
            <div>
              <label className="block text-sm font-medium text-dark dark:text-white">
                Then
              </label>
              <select
                value={formData.actions[0]?.type || "notify_user"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    actions: [{ type: e.target.value as any, payload: {} }],
                  })
                }
                className="mt-1 w-full rounded-lg border border-gray-3 bg-white px-3 py-2 text-sm outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white"
              >
                <option value="notify_user">Notify user</option>
                <option value="notify_team">Notify team</option>
                <option value="send_email">Send email</option>
                <option value="create_task">Create task</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 rounded-lg border border-gray-3 bg-white px-4 py-2 text-sm font-medium text-dark hover:bg-gray-1 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:hover:bg-dark-3"
              >
                Cancel
              </button>
              <button
                onClick={handleAddRule}
                className="flex-1 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
              >
                Create Rule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
