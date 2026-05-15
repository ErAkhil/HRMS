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
  employees: [], tasks: [], projects: [], meetings: [],
  courses: [], jobPostings: [], candidates: [], leaves: [], goals: [],
};

export async function globalSearch(query: string): Promise<SearchResults> {
  await requireAuth();

  if (query.trim().length < 2) return EMPTY;

  return api.get<SearchResults>(`/search?q=${encodeURIComponent(query.trim())}`, {
    revalidate: 20,
  });
}
