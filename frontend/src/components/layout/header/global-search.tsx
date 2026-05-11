"use client";

import { useState, useRef, useEffect, useTransition, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { globalSearch, type SearchResultItem, type SearchResults } from "@/lib/actions/search";

const EMPTY: SearchResults = {
  employees: [], tasks: [], projects: [], meetings: [],
  courses: [], jobPostings: [], candidates: [], leaves: [], goals: [],
};

function hasAny(r: SearchResults) {
  return (
    r.employees.length > 0 || r.tasks.length > 0 || r.projects.length > 0 ||
    r.meetings.length > 0 || r.courses.length > 0 || r.jobPostings.length > 0 ||
    r.candidates.length > 0 || r.leaves.length > 0 || r.goals.length > 0
  );
}

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export function GlobalSearch() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults>(EMPTY);
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  // ⌘K / Ctrl+K to focus
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Close on outside click
  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

  const runSearch = useCallback((q: string) => {
    if (q.trim().length < 2) {
      setResults(EMPTY);
      setOpen(false);
      return;
    }
    startTransition(async () => {
      try {
        const res = await globalSearch(q);
        setResults(res);
        setOpen(true);
      } catch {
        setResults(EMPTY);
        setOpen(false);
      }
    });
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runSearch(val), 280);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    }
  }

  function navigate(href: string) {
    setOpen(false);
    setQuery("");
    setResults(EMPTY);
    router.push(href);
  }

  const noResults = query.trim().length >= 2 && !isPending && !hasAny(results);

  return (
    <div ref={containerRef} className="relative mx-auto w-full max-w-md">
      <label className="relative flex items-center">
        <span className="sr-only">Search</span>
        {isPending ? (
          <svg className="pointer-events-none absolute left-3 size-4 animate-spin text-primary-600" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          <svg className="pointer-events-none absolute left-3 size-4 text-dark-5 dark:text-dark-6" viewBox="0 0 24 24" fill="none">
            <path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
        <input
          ref={inputRef}
          type="search"
          placeholder="Search employees, meetings, tasks..."
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => { if (hasAny(results)) setOpen(true); }}
          className="h-9 w-full rounded-lg border border-gray-3 bg-gray-2 pl-9 pr-16 text-sm outline-none transition-colors placeholder:text-dark-5 focus:border-primary-600 focus:bg-white focus:ring-2 focus:ring-primary-100 dark:border-dark-3 dark:bg-dark-3 dark:placeholder:text-dark-6 dark:focus:border-primary-600 dark:focus:bg-dark-2 dark:focus:ring-primary-900/30"
        />
        <kbd className="pointer-events-none absolute right-3 hidden items-center gap-1 rounded border border-gray-3 bg-white px-1.5 py-0.5 text-[10px] font-medium text-dark-5 dark:border-dark-3 dark:bg-dark-3 dark:text-dark-6 sm:flex">
          <span>⌘</span>K
        </kbd>
      </label>

      {(open || noResults) && (
        <div className="absolute left-0 right-0 top-11 z-50 overflow-hidden rounded-xl border border-gray-3 bg-white shadow-lg dark:border-dark-3 dark:bg-dark-2">
          {noResults ? (
            <p className="px-4 py-3 text-sm text-dark-5 dark:text-dark-6">No results for &quot;{query}&quot;</p>
          ) : (
            <div className="max-h-[26rem] overflow-y-auto py-1">
              {results.employees.length > 0 && (
                <Section label="Employees">
                  {results.employees.map((r) => <EmployeeRow key={r.id} item={r} onNavigate={navigate} />)}
                </Section>
              )}
              {results.meetings.length > 0 && (
                <Section label="Meetings">
                  {results.meetings.map((r) => <GenericRow key={r.id} item={r} onNavigate={navigate} icon={<MeetingIcon />} />)}
                </Section>
              )}
              {results.tasks.length > 0 && (
                <Section label="Tasks">
                  {results.tasks.map((r) => <GenericRow key={r.id} item={r} onNavigate={navigate} icon={<TaskIcon />} />)}
                </Section>
              )}
              {results.projects.length > 0 && (
                <Section label="Projects">
                  {results.projects.map((r) => <GenericRow key={r.id} item={r} onNavigate={navigate} icon={<ProjectIcon />} />)}
                </Section>
              )}
              {results.goals.length > 0 && (
                <Section label="Goals">
                  {results.goals.map((r) => <GenericRow key={r.id} item={r} onNavigate={navigate} icon={<GoalIcon />} />)}
                </Section>
              )}
              {results.courses.length > 0 && (
                <Section label="Courses">
                  {results.courses.map((r) => <GenericRow key={r.id} item={r} onNavigate={navigate} icon={<CourseIcon />} />)}
                </Section>
              )}
              {results.leaves.length > 0 && (
                <Section label="Leave Requests">
                  {results.leaves.map((r) => <GenericRow key={r.id} item={r} onNavigate={navigate} icon={<LeaveIcon />} />)}
                </Section>
              )}
              {results.jobPostings.length > 0 && (
                <Section label="Job Postings">
                  {results.jobPostings.map((r) => <GenericRow key={r.id} item={r} onNavigate={navigate} icon={<JobIcon />} />)}
                </Section>
              )}
              {results.candidates.length > 0 && (
                <Section label="Candidates">
                  {results.candidates.map((r) => <GenericRow key={r.id} item={r} onNavigate={navigate} icon={<CandidateIcon />} />)}
                </Section>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-dark-5 dark:text-dark-6">
        {label}
      </p>
      {children}
    </div>
  );
}

function EmployeeRow({ item, onNavigate }: { item: SearchResultItem; onNavigate: (href: string) => void }) {
  return (
    <button
      type="button"
      onClick={() => onNavigate(item.href)}
      className="flex w-full items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-gray-1 dark:hover:bg-dark-3"
    >
      {item.avatarUrl ? (
        <Image src={item.avatarUrl} alt={item.title} width={28} height={28} className="size-7 shrink-0 rounded-full object-cover" />
      ) : (
        <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary-100 text-[10px] font-bold text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
          {getInitials(item.title)}
        </div>
      )}
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-dark dark:text-white">{item.title}</p>
        <p className="truncate text-xs text-dark-5 dark:text-dark-6">{item.subtitle}</p>
      </div>
    </button>
  );
}

function GenericRow({ item, onNavigate, icon }: { item: SearchResultItem; onNavigate: (href: string) => void; icon: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={() => onNavigate(item.href)}
      className="flex w-full items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-gray-1 dark:hover:bg-dark-3"
    >
      <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gray-2 text-dark-5 dark:bg-dark-3 dark:text-dark-6">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-dark dark:text-white">{item.title}</p>
        <p className="truncate text-xs capitalize text-dark-5 dark:text-dark-6">{item.subtitle.toLowerCase()}</p>
      </div>
    </button>
  );
}

function MeetingIcon() {
  return (
    <svg className="size-3.5" viewBox="0 0 24 24" fill="none">
      <path d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TaskIcon() {
  return (
    <svg className="size-3.5" viewBox="0 0 24 24" fill="none">
      <path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ProjectIcon() {
  return (
    <svg className="size-3.5" viewBox="0 0 24 24" fill="none">
      <path d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GoalIcon() {
  return (
    <svg className="size-3.5" viewBox="0 0 24 24" fill="none">
      <path d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CourseIcon() {
  return (
    <svg className="size-3.5" viewBox="0 0 24 24" fill="none">
      <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LeaveIcon() {
  return (
    <svg className="size-3.5" viewBox="0 0 24 24" fill="none">
      <path d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-3.75h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function JobIcon() {
  return (
    <svg className="size-3.5" viewBox="0 0 24 24" fill="none">
      <path d="M20.25 14.15v4.073a2.25 2.25 0 01-2.183 2.25 17.954 17.954 0 01-4.067 0 2.25 2.25 0 01-2.183-2.25v-4.073M20.25 14.15a2.25 2.25 0 00.75-1.661V6.375a2.25 2.25 0 00-2.25-2.25h-13.5A2.25 2.25 0 003 6.375v6.114c0 .64.261 1.233.75 1.661M20.25 14.15l-6.75-4.5M3.75 14.15l6.75-4.5m0 0l1.5 1.5 1.5-1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CandidateIcon() {
  return (
    <svg className="size-3.5" viewBox="0 0 24 24" fill="none">
      <path d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
