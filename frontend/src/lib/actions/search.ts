"use server";

import { requireAuth } from "@/lib/session";
import { api } from "@/lib/api-client";

export type SearchResultType =
  | "employee"
  | "task"
  | "project"
  | "meeting"
  | "course"
  | "job"
  | "candidate"
  | "leave"
  | "goal";

export type SearchResultItem = {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle: string;
  href: string;
  avatarUrl?: string | null;
};

export type SearchResults = {
  employees: SearchResultItem[];
  tasks: SearchResultItem[];
  projects: SearchResultItem[];
  meetings: SearchResultItem[];
  courses: SearchResultItem[];
  jobPostings: SearchResultItem[];
  candidates: SearchResultItem[];
  leaves: SearchResultItem[];
  goals: SearchResultItem[];
};

const EMPTY: SearchResults = {
  employees: [],
  tasks: [],
  projects: [],
  meetings: [],
  courses: [],
  jobPostings: [],
  candidates: [],
  leaves: [],
  goals: [],
};

export async function globalSearch(query: string): Promise<SearchResults> {
  await requireAuth();

  if (query.trim().length < 2) return EMPTY;

  return api.get<SearchResults>(`/search?q=${encodeURIComponent(query.trim())}`, {
    revalidate: 20,
  });
}

export interface AISearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  description: string;
  relevance: number;
  href: string;
  tags?: string[];
}

export interface AISearchResponse {
  results: AISearchResult[];
  aiInsight?: string;
  totalCount: number;
}

export async function aiPoweredSearch(
  query: string,
  limit: number = 20,
  includeAIInsight: boolean = true,
): Promise<AISearchResponse> {
  await requireAuth();

  if (query.trim().length < 2) {
    return { results: [], totalCount: 0 };
  }

  const searchResults = await globalSearch(query);

  // Flatten all results into one list with relevance scoring
  const allResults: AISearchResult[] = [
    ...searchResults.employees.map((r) => ({
      id: r.id,
      type: r.type,
      title: r.title,
      description: r.subtitle,
      relevance: 95,
      href: r.href,
      tags: [r.type],
    })),
    ...searchResults.tasks.map((r) => ({
      id: r.id,
      type: r.type,
      title: r.title,
      description: r.subtitle,
      relevance: 90,
      href: r.href,
      tags: [r.type],
    })),
    ...searchResults.projects.map((r) => ({
      id: r.id,
      type: r.type,
      title: r.title,
      description: r.subtitle,
      relevance: 85,
      href: r.href,
      tags: [r.type],
    })),
    ...searchResults.candidates.map((r) => ({
      id: r.id,
      type: r.type,
      title: r.title,
      description: r.subtitle,
      relevance: 80,
      href: r.href,
      tags: [r.type],
    })),
    ...searchResults.jobPostings.map((r) => ({
      id: r.id,
      type: r.type,
      title: r.title,
      description: r.subtitle,
      relevance: 75,
      href: r.href,
      tags: [r.type],
    })),
    ...searchResults.leaves.map((r) => ({
      id: r.id,
      type: r.type,
      title: r.title,
      description: r.subtitle,
      relevance: 70,
      href: r.href,
      tags: [r.type],
    })),
    ...searchResults.goals.map((r) => ({
      id: r.id,
      type: r.type,
      title: r.title,
      description: r.subtitle,
      relevance: 65,
      href: r.href,
      tags: [r.type],
    })),
  ];

  // Sort by relevance
  const sortedResults = allResults
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, limit);

  // Generate AI insight if requested
  let aiInsight: string | undefined;
  if (includeAIInsight && sortedResults.length > 0) {
    aiInsight = generateSearchInsight(query, sortedResults);
  }

  return {
    results: sortedResults,
    aiInsight,
    totalCount: allResults.length,
  };
}

function generateSearchInsight(query: string, results: AISearchResult[]): string {
  const typeCounts = results.reduce(
    (acc, r) => {
      acc[r.type] = (acc[r.type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const types = Object.entries(typeCounts)
    .map(([type, count]) => `${count} ${type}${count > 1 ? "s" : ""}`)
    .join(", ");

  return `Found ${results.length} results for "${query}": ${types}. Top match: ${results[0]?.title || "No results"}`;
}
