"use client";

import { useState, useEffect } from "react";
import { aiPoweredSearch, type AISearchResult } from "@/lib/actions/search";
import Link from "next/link";

interface AdvancedSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdvancedSearchModal({ isOpen, onClose }: Readonly<AdvancedSearchModalProps>) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AISearchResult[]>([]);
  const [aiInsight, setAiInsight] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length < 2) {
        setResults([]);
        setAiInsight(undefined);
        setHasSearched(false);
        return;
      }

      setIsLoading(true);
      setHasSearched(true);
      try {
        const response = await aiPoweredSearch(query, 15, true);
        setResults(response.results);
        setAiInsight(response.aiInsight);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const typeColors: Record<string, string> = {
    employee: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300",
    task: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    project: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
    job: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    candidate: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
    leave: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
    goal: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white shadow-lg dark:bg-dark-2">
        <div className="space-y-4 p-6">
          {/* Search Input */}
          <div className="relative">
            <svg
              className="absolute left-3 top-3.5 h-5 w-5 text-dark-5 dark:text-dark-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              autoFocus
              type="text"
              placeholder="Search employees, tasks, documents, policies..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-3 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white dark:placeholder-dark-6"
            />
          </div>

          {/* AI Insight */}
          {aiInsight && (
            <div className="rounded-lg bg-gradient-ai p-3 text-sm text-white">
              <p className="font-medium">💡 AI Insight:</p>
              <p className="mt-1 text-white/80">{aiInsight}</p>
            </div>
          )}

          {/* Results */}
          <div className="max-h-96 overflow-y-auto">
            {isLoading && (
              <div className="py-8 text-center text-dark-5 dark:text-dark-6">
                <p>Searching...</p>
              </div>
            )}

            {!isLoading && hasSearched && results.length === 0 && (
              <div className="py-8 text-center text-dark-5 dark:text-dark-6">
                <p>No results found for &quot;{query}&quot;</p>
              </div>
            )}

            {!isLoading && results.length > 0 && (
              <div className="space-y-2">
                {results.map((result) => (
                  <Link
                    key={`${result.type}-${result.id}`}
                    href={result.href}
                    onClick={onClose}
                    className="group flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-gray-1 dark:hover:bg-dark-3"
                  >
                    {/* Type Badge */}
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${typeColors[result.type] || "bg-gray-100 text-gray-600"}`}
                    >
                      {result.type}
                    </span>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-dark group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400">
                        {result.title}
                      </p>
                      <p className="truncate text-xs text-dark-5 dark:text-dark-6">
                        {result.description}
                      </p>
                    </div>

                    {/* Relevance Indicator */}
                    <div className="shrink-0 flex items-center gap-1">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-gray-3 dark:bg-dark-3">
                        <div
                          className="h-full rounded-full bg-primary-600"
                          style={{ width: `${result.relevance}%` }}
                        />
                      </div>
                      <span className="text-xs text-dark-5 dark:text-dark-6">
                        {result.relevance}%
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {!hasSearched && (
              <div className="py-8 text-center text-dark-5 dark:text-dark-6">
                <p>Start typing to search</p>
              </div>
            )}
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full rounded-lg border border-gray-3 bg-white py-2 text-sm font-medium text-dark hover:bg-gray-1 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:hover:bg-dark-3"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
}
