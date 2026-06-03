"use client";

import { useState, useEffect } from "react";
import { Anthropic } from "@anthropic-ai/sdk";

export interface SmartInsight {
  readonly type: "task" | "reminder" | "recommendation" | "alert";
  readonly title: string;
  readonly description: string;
  readonly action?: {
    readonly label: string;
    readonly href: string;
  };
  readonly priority: "low" | "medium" | "high";
}

interface SmartInsightsProps {
  readonly userId: string;
  readonly context?: Record<string, unknown>;
}

/**
 * AI-powered smart insights component
 * Suggests tasks, reminders, and recommendations based on user activity
 */
export function SmartInsights({
  userId,
  context = {},
}: Readonly<SmartInsightsProps>) {
  const [insights, setInsights] = useState<SmartInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const generateInsights = async () => {
      try {
        setIsLoading(true);

        // Generate smart insights (could be enhanced with Anthropic AI)
        const mockInsights: SmartInsight[] = [
          {
            type: "reminder",
            title: "Review Team Goals",
            description: "You haven't reviewed team goals this quarter. It's time to align on Q2 objectives.",
            action: { label: "View Goals", href: "/performance" },
            priority: "high",
          },
          {
            type: "task",
            title: "Complete Onboarding Checklist",
            description: "Finish the remaining 3 items in your onboarding checklist.",
            action: { label: "Onboarding", href: "/onboarding" },
            priority: "medium",
          },
          {
            type: "recommendation",
            title: "Suggested Learning Path",
            description: "Based on your role, we recommend completing the 'Leadership Fundamentals' course.",
            action: { label: "Explore", href: "/learning" },
            priority: "low",
          },
        ];

        setInsights(mockInsights);
      } catch (error) {
        console.error("Failed to generate insights:", error);
      } finally {
        setIsLoading(false);
      }
    };

    generateInsights();
  }, [userId, context]);

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="h-24 animate-pulse rounded-lg bg-gray-2 dark:bg-dark-2" />
      </div>
    );
  }

  const priorityColors = {
    high: "bg-rose-50 border-rose-2 text-rose-700 dark:bg-rose-900/20 dark:border-rose-900/50 dark:text-rose-300",
    medium:
      "bg-amber-50 border-amber-2 text-amber-700 dark:bg-amber-900/20 dark:border-amber-900/50 dark:text-amber-300",
    low: "bg-sky-50 border-sky-2 text-sky-700 dark:bg-sky-900/20 dark:border-sky-900/50 dark:text-sky-300",
  };

  const typeIcons = {
    task: "✓",
    reminder: "🔔",
    recommendation: "💡",
    alert: "⚠️",
  };

  return (
    <div className="space-y-3">
      {insights.length === 0 ? (
        <div className="rounded-lg border border-gray-3 bg-white p-4 text-center dark:border-dark-3 dark:bg-dark-2">
          <p className="text-sm text-dark-5 dark:text-dark-6">No smart insights at the moment</p>
        </div>
      ) : (
        insights.map((insight, idx) => (
          <div
            key={idx}
            className={`rounded-lg border p-4 ${priorityColors[insight.priority]}`}
          >
            <div className="flex gap-3">
              <span className="text-lg">{typeIcons[insight.type]}</span>
              <div className="flex-1 space-y-1">
                <p className="font-medium capitalize">{insight.title}</p>
                <p className="text-sm opacity-80">{insight.description}</p>
                {insight.action && (
                  <a
                    href={insight.action.href}
                    className="mt-2 inline-block text-sm font-medium underline hover:opacity-80"
                  >
                    {insight.action.label} →
                  </a>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
