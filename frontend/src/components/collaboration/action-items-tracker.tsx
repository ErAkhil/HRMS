"use client";

import { useState } from "react";
import { createTask } from "@/lib/actions/tasks";

interface ActionItem {
  readonly id: string;
  readonly task: string;
  readonly owner?: string;
  readonly dueDate?: Date;
  readonly completed: boolean;
}

interface ActionItemsTrackerProps {
  readonly initialItems?: ActionItem[];
  readonly onItemsChange?: (items: ActionItem[]) => void;
}

export function ActionItemsTracker({
  initialItems = [],
  onItemsChange,
}: Readonly<ActionItemsTrackerProps>) {
  const [items, setItems] = useState<ActionItem[]>(initialItems);
  const [newItem, setNewItem] = useState("");
  const [assignee, setAssignee] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.trim()) return;

    setIsLoading(true);
    try {
      // Create as task
      const item: ActionItem = {
        id: crypto.randomUUID(),
        task: newItem,
        owner: assignee,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        completed: false,
      };

      const updatedItems = [...items, item];
      setItems(updatedItems);
      onItemsChange?.(updatedItems);
      setNewItem("");
      setAssignee("");
    } catch (error) {
      console.error("Failed to add action item:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleItem = (id: string) => {
    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item,
    );
    setItems(updatedItems);
    onItemsChange?.(updatedItems);
  };

  const deleteItem = (id: string) => {
    const updatedItems = items.filter((item) => item.id !== id);
    setItems(updatedItems);
    onItemsChange?.(updatedItems);
  };

  const completedCount = items.filter((i) => i.completed).length;
  const completionRate = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* Stats */}
      {items.length > 0 && (
        <div className="rounded-lg bg-sky-50 p-3 dark:bg-sky-900/20">
          <div className="flex items-center justify-between">
            <span className="text-sm text-sky-700 dark:text-sky-300">
              {completedCount} of {items.length} completed
            </span>
            <span className="text-sm font-medium text-sky-600 dark:text-sky-400">
              {completionRate}%
            </span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-sky-200 dark:bg-sky-900/40">
            <div
              className="h-full bg-sky-600 transition-all"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
      )}

      {/* Add Item Form */}
      <form onSubmit={handleAddItem} className="space-y-2">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Add action item..."
          className="w-full rounded-lg border border-gray-3 bg-white px-3 py-2 text-sm outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white"
        />

        <div className="flex gap-2">
          <input
            type="text"
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            placeholder="Assign to (optional)"
            className="flex-1 rounded-lg border border-gray-3 bg-white px-3 py-2 text-sm outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white"
          />
          <button
            type="submit"
            disabled={isLoading || !newItem.trim()}
            className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
          >
            Add
          </button>
        </div>
      </form>

      {/* Items List */}
      {items.length > 0 && (
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-3 rounded-lg border border-gray-3 bg-white p-3 dark:border-dark-3 dark:bg-dark-2"
            >
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => toggleItem(item.id)}
                className="mt-0.5 rounded"
              />

              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm ${
                    item.completed
                      ? "line-through text-dark-5 dark:text-dark-6"
                      : "text-dark dark:text-white"
                  }`}
                >
                  {item.task}
                </p>
                {item.owner && (
                  <p className="mt-1 text-xs text-dark-5 dark:text-dark-6">
                    Assigned to: <span className="font-medium">{item.owner}</span>
                  </p>
                )}
              </div>

              <button
                onClick={() => deleteItem(item.id)}
                className="shrink-0 text-rose-600 hover:text-rose-700 dark:text-rose-400"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {items.length === 0 && (
        <div className="rounded-lg border border-dashed border-gray-3 bg-gray-1 p-4 text-center dark:border-dark-3 dark:bg-dark-3">
          <p className="text-sm text-dark-5 dark:text-dark-6">No action items yet</p>
        </div>
      )}
    </div>
  );
}
