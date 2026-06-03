import Groq from "groq-sdk";
import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth } from "@/auth";
import { NextRequest } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const gemini = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;
const FAST_FETCH_TIMEOUT_MS = 400;
const MAX_CONTEXT_MESSAGES = 8;
const RAG_CACHE_TTL_MS = 300_000;
// Primary: llama-3.3-70b-versatile. Switch to llama-3.1-8b-instant for higher free-tier limits.
const DEFAULT_AI_MODEL = process.env.AI_MODEL ?? "llama-3.3-70b-versatile";
const FALLBACK_AI_MODEL = "claude-3-5-haiku-latest";
const ragCache = new Map<string, { expiresAt: number; data: unknown }>();

const BASE_SYSTEM = `You are Monja AI, an intelligent HR assistant embedded inside the Monja HRMS platform. You help employees and managers with:
- HR policies, leave, attendance, and payroll queries
- Performance reviews and goal tracking
- Recruitment and onboarding processes
- Task and project management
- Team analytics and insights

Be concise, professional, and action-oriented. Use markdown formatting (bold headings, bullet lists, tables) to structure longer responses. Always include relevant links when mentioning specific modules or reports. When you have real data injected by the system, use it directly in your response with proper formatting and numerical values.

CRITICAL RULES — never break these:
1. NEVER claim to have submitted, approved, cancelled, or performed any action unless you actually called a tool and received a success response.
2. If a tool call fails, report the exact error — do not say the action succeeded.
3. If no tool exists for a requested action, say so clearly and give the direct link to do it manually.`;

const ROLE_INSTRUCTIONS: Record<string, string> = {
  SUPER_ADMIN: "You are talking to a Super Admin. You may discuss all system-level data, organization management, billing, and all HR data. Provide comprehensive admin-level answers.",
  HR_ADMIN: "You are talking to an HR Administrator. You may discuss all employee data, payroll, leave approvals, recruitment, and org-wide reports. Provide detailed HR management answers.",
  MANAGER: "You are talking to a Manager. You may discuss their team members' data, team leave requests, performance reviews for direct reports, and team analytics. Do NOT reveal data about employees outside their team.",
  EMPLOYEE: "You are talking to an Employee. You may only discuss their own personal data: their payslips, leave balances, attendance, tasks, and goals. Do NOT reveal any other employee's data. If asked about others, politely explain you can only help with their own information.",
};

type QueryType = 'payroll' | 'leave' | 'attendance' | 'tasks' | 'insights' | 'employees' | 'departments' | 'unknown';

interface QueryDetectionResult {
  type: QueryType;
  month?: number;
  year?: number;
  timeframe?: string;
}

type PayrollSummaryData = {
  month: number;
  year: number;
  totalGross: number;
  totalNet: number;
  totalDeductions: number;
  employeeCount: number;
  status: string;
};

type InsightsData = {
  hasData: boolean;
  latestTotal: number;
  avgSalary: number;
  headcount: number;
  latestNet: number;
  deptCosts?: Array<{ dept: string; count: number; grossTotal: number }>;
};

type LeaveSummaryData = {
  pendingCount: number;
  approvedCount: number;
  totalCount: number;
};

type AttendanceSummaryData = {
  present: number;
  absent: number;
  late: number;
  attendanceRate?: number;
};

type TaskSummaryData = {
  pending: number;
  overdue: number;
  completedToday: number;
};

// Month mapping for detection
const MONTHS: Record<string, number> = {
  january: 1, february: 2, march: 3, april: 4, may: 5, june: 6,
  july: 7, august: 8, september: 9, october: 10, november: 11, december: 12,
  jan: 1, feb: 2, mar: 3, apr: 4, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
};

// Comprehensive query detection
function detectQueryType(message: string): QueryDetectionResult {
  const lowerMessage = message.toLowerCase();
  
  // Payroll queries
  if (/payroll|payout|salary|gross.*pay|net.*pay|total.*pay|disburs/i.test(message)) {
    return parseMonthYear(lowerMessage, 'payroll');
  }
  
  // Leave queries
  if (/leave|vacation|days off|leave balance|leave pending|leave request|absent/i.test(message)) {
    return parseMonthYear(lowerMessage, 'leave');
  }
  
  // Attendance queries
  if (/attendance|present|absent|on time|late|early|clock in|punch|check in|attendance rate/i.test(message)) {
    return parseMonthYear(lowerMessage, 'attendance');
  }
  
  // Task queries
  if (/task|todo|pending.*task|overdue|assignment|project|work/i.test(message)) {
    return { type: 'tasks', timeframe: extractTimeframe(lowerMessage) };
  }
  
  // Insights/Analytics queries
  if (/insight|trend|report|analytics|performance|stat|metric|dashboard|overview|summary/i.test(message)) {
    return parseMonthYear(lowerMessage, 'insights');
  }
  
  // Employee/Team queries
  if (/employee|team|headcount|roster|staff|member|colleague/i.test(message)) {
    return { type: 'employees' };
  }
  
  // Department queries
  if (/department|dept|team cost|cost breakdown|payroll.*department|department.*payroll/i.test(message)) {
    return parseMonthYear(lowerMessage, 'departments');
  }
  
  return { type: 'unknown' };
}

function parseMonthYear(message: string, type: QueryType): QueryDetectionResult {
  let month: number | undefined;
  let year: number | undefined;
  
  // Find month
  for (const [monthName, monthNum] of Object.entries(MONTHS)) {
    if (message.includes(monthName)) {
      month = monthNum;
      break;
    }
  }
  
  // Find year
  const yearRegex = /\b(202\d)\b/;
  const yearMatch = yearRegex.exec(message);
  if (yearMatch) {
    year = Number.parseInt(yearMatch[1], 10);
  }
  
  // Defaults
  if (!month) month = new Date().getMonth() + 1;
  if (!year) year = new Date().getFullYear();
  
  return { type, month, year };
}

function extractTimeframe(message: string): string {
  if (/today|today/.test(message)) return 'today';
  if (/this week|this week/.test(message)) return 'week';
  if (/this month|this month/.test(message)) return 'month';
  if (/pending|overdue/.test(message)) return 'pending';
  return 'all';
}

async function fetchJsonFast<T>(url: string, token: string): Promise<T | null> {
  const now = Date.now();
  const cached = ragCache.get(url);
  if (cached && cached.expiresAt > now) {
    return cached.data as T;
  }

  try {
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(FAST_FETCH_TIMEOUT_MS),
      cache: "no-store",
    });
    if (!response.ok) return null;

    const data = (await response.json()) as T;
    ragCache.set(url, { expiresAt: now + RAG_CACHE_TTL_MS, data });
    return data;
  } catch {
    return null;
  }
}

// Data fetching helpers
async function fetchPayrollData(month: number, year: number, apiUrl: string, token: string) {
  return fetchJsonFast<PayrollSummaryData>(`${apiUrl}/payroll/summary/${year}/${month}`, token);
}

async function fetchInsightsData(apiUrl: string, token: string) {
  return fetchJsonFast<InsightsData>(`${apiUrl}/payroll/insights`, token);
}

async function fetchLeaveData(apiUrl: string, token: string) {
  return fetchJsonFast<LeaveSummaryData>(`${apiUrl}/leave/summary`, token);
}

async function fetchAttendanceData(month: number, year: number, apiUrl: string, token: string) {
  return fetchJsonFast<AttendanceSummaryData>(`${apiUrl}/attendance/summary?month=${month}&year=${year}`, token);
}

async function fetchTaskData(apiUrl: string, token: string) {
  return fetchJsonFast<TaskSummaryData>(`${apiUrl}/tasks/summary`, token);
}

// Format data for AI context
function formatPayrollData(data: PayrollSummaryData): string {
  if (!data) return '';
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return `
## Payroll Summary - ${monthNames[data.month - 1]} ${data.year}
- **Total Gross Payout**: ₹${data.totalGross?.toLocaleString('en-IN') || '0'}
- **Total Net Payout**: ₹${data.totalNet?.toLocaleString('en-IN') || '0'}
- **Total Deductions**: ₹${data.totalDeductions?.toLocaleString('en-IN') || '0'}
- **Employee Count**: ${data.employeeCount || '0'}
- **Status**: ${data.status || 'N/A'}
[View detailed payroll report](/payroll/reports)`;
}

function formatInsightsData(data: InsightsData): string {
  if (!data?.hasData) return '';
  const deptBreakdown = data.deptCosts?.length
    ? "\n### Department-wise Breakdown\n" +
      data.deptCosts
        .slice(0, 5)
        .map((d) => `- **${d.dept}**: ${d.count} employees, ₹${d.grossTotal?.toLocaleString('en-IN') || '0'}`)
        .join("\n")
    : "";

  return `
## HR Insights Summary
- **Total Payroll**: ₹${data.latestTotal?.toLocaleString('en-IN') || '0'}
- **Avg Salary**: ₹${data.avgSalary?.toLocaleString('en-IN') || '0'}
- **Headcount**: ${data.headcount || '0'}
- **Net Payout**: ₹${data.latestNet?.toLocaleString('en-IN') || '0'}
${deptBreakdown}
[View full analytics dashboard](/dashboard)`;
}

function formatLeaveData(data: LeaveSummaryData): string {
  if (!data) return '';
  return `
## Leave Summary
- **Pending Approvals**: ${data.pendingCount || '0'}
- **Approved This Month**: ${data.approvedCount || '0'}
- **Total Requests**: ${data.totalCount || '0'}
[View leave management](/leave/approvals)`;
}

function formatAttendanceData(data: AttendanceSummaryData): string {
  if (!data) return '';
  return `
## Attendance Summary - ${new Date().toLocaleDateString()}
- **Present**: ${data.present || '0'}
- **Absent**: ${data.absent || '0'}
- **Late**: ${data.late || '0'}
- **Attendance Rate**: ${data.attendanceRate ? `${(data.attendanceRate * 100).toFixed(1)}%` : 'N/A'}
[View attendance records](/attendance)`;
}

function formatTaskData(data: TaskSummaryData): string {
  if (!data) return '';
  return `
## Task Summary
- **Total Pending**: ${data.pending || '0'}
- **Overdue**: ${data.overdue || '0'}
- **Completed Today**: ${data.completedToday || '0'}
[View all tasks](/tasks)`;
}


function buildSystemPrompt(roleInstruction: string, enhancedContext: string): string {
  const parts = [BASE_SYSTEM, roleInstruction];
  if (enhancedContext) {
    parts.push(enhancedContext);
  }
  return parts.join("\n\n");
}

// Short-circuit Claude for simple personal data lookups already present in the context string.
// Context is fetched once at page load and contains the user's live attendance, tasks, and leave balance.
const LEAVE_BALANCE_RE = /leave balance|how many.*leave|leave remaining|days of leave/i;
const TASK_RE = /pending tasks?|how many tasks?|tasks? pending|overdue tasks?/i;
const ATTENDANCE_TODAY_RE = /today.*attendance|am i checked in|am i clocked in|check.?in status|attendance today/i;

function tryContextLookup(message: string, context: string): string | null {
  if (!context) return null;

  if (LEAVE_BALANCE_RE.test(message)) {
    const match = /Annual leave remaining:\s*([^\n]+)/i.exec(context);
    if (match) {
      return `Your annual leave remaining is **${match[1].trim()}**.\n\n[Manage leave →](/leave)`;
    }
  }

  if (TASK_RE.test(message)) {
    const pendingMatch = /Pending tasks:\s*(\d+)/i.exec(context);
    const overdueMatch = /Overdue tasks:\s*(\d+)/i.exec(context);
    if (pendingMatch) {
      const overdue = overdueMatch?.[1] ?? "0";
      const overdueNote = Number(overdue) > 0 ? `, **${overdue} overdue**` : "";
      return `You have **${pendingMatch[1]} pending tasks**${overdueNote}.\n\n[View tasks →](/tasks)`;
    }
  }

  if (ATTENDANCE_TODAY_RE.test(message)) {
    const match = /Attendance:\s*([^\n]+)/i.exec(context);
    if (match) {
      return `Your attendance today: **${match[1].trim()}**.\n\n[View attendance →](/attendance)`;
    }
  }

  return null;
}

function detectSmallTalk(text: string): boolean {
  const normalized = text.trim().toLowerCase();
  if (!normalized) return false;

  return /^(hi|hello|hey|yo|hii+|heyy+|good morning|good afternoon|good evening|thanks|thank you)[!.?]*$/.test(normalized);
}

function getSmallTalkResponse(userName?: string): string {
  const name = userName?.trim() ? ` ${userName.trim()}` : "";
  return `Hi${name}! I am ready. Ask me anything about payroll, leave, attendance, tasks, or reports and I will fetch live data if available.`;
}

async function resolveDataContext(
  queryDetection: QueryDetectionResult,
  apiUrl: string,
  token: string,
): Promise<string> {
  switch (queryDetection.type) {
    case 'payroll': {
      if (!queryDetection.month || !queryDetection.year) return "";
      const payrollData = await fetchPayrollData(queryDetection.month, queryDetection.year, apiUrl, token);
      return payrollData ? formatPayrollData(payrollData) : "";
    }
    case 'insights': {
      const insightsData = await fetchInsightsData(apiUrl, token);
      return insightsData ? formatInsightsData(insightsData) : "";
    }
    case 'leave': {
      const leaveData = await fetchLeaveData(apiUrl, token);
      return leaveData ? formatLeaveData(leaveData) : "";
    }
    case 'attendance': {
      if (!queryDetection.month || !queryDetection.year) return "";
      const attendanceData = await fetchAttendanceData(queryDetection.month, queryDetection.year, apiUrl, token);
      return attendanceData ? formatAttendanceData(attendanceData) : "";
    }
    case 'tasks': {
      const taskData = await fetchTaskData(apiUrl, token);
      return taskData ? formatTaskData(taskData) : "";
    }
    default:
      return "";
  }
}

const TEXT_HEADERS = { "Content-Type": "text/plain; charset=utf-8" };
const encoder = new TextEncoder();

async function fetchServerContext(token: string, apiUrl: string): Promise<string> {
  try {
    const res = await fetch(`${apiUrl}/ai-context`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(FAST_FETCH_TIMEOUT_MS),
      cache: "no-store",
    });
    return res.ok ? await res.text() : "";
  } catch {
    return "";
  }
}

function groqReadable(stream: AsyncIterable<Groq.Chat.Completions.ChatCompletionChunk>): ReadableStream {
  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content ?? "";
          if (text) controller.enqueue(encoder.encode(text));
        }
      } finally {
        controller.close();
      }
    },
  });
}

function claudeReadable(stream: ReturnType<typeof anthropic.messages.stream>): ReadableStream {
  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(chunk.delta.text));
          }
        }
      } finally {
        controller.close();
      }
    },
  });
}

// ── Tool use ─────────────────────────────────────────────────────────────────

const LEAVE_ACTION_RE = /\b(apply|submit|request|take|book)\s+(a\s+)?(leave|day\s+off|vacation|sick\s+day)\b/i;

const LEAVE_TOOL = {
  type: "function",
  function: {
    name: "submit_leave_request",
    description: "Submit a real leave application in the HRMS system. Only call this when the user explicitly asks to apply or request leave.",
    parameters: {
      type: "object",
      properties: {
        leaveType: {
          type: "string",
          enum: ["ANNUAL", "SICK", "CASUAL", "MATERNITY", "PATERNITY", "UNPAID", "OTHER"],
          description: "Type of leave. Default to ANNUAL if not specified.",
        },
        startDate: {
          type: "string",
          description: "Start date in YYYY-MM-DD format. Resolve relative terms (today, tomorrow, next Monday) using the current date in the system context.",
        },
        endDate: {
          type: "string",
          description: "End date in YYYY-MM-DD format. Same as startDate for a single day.",
        },
        reason: {
          type: "string",
          description: "Reason for leave. If not specified by user, use 'Personal reasons'.",
        },
      },
      required: ["leaveType", "startDate", "endDate", "reason"],
    },
  },
};

async function executeLeaveSubmission(
  args: { leaveType: string; startDate: string; endDate: string; reason: string },
  token: string,
  apiUrl: string,
): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${apiUrl}/leave/requests`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(args),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({})) as { message?: string };
      return { success: false, message: err.message ?? `Failed with status ${res.status}` };
    }
    return { success: true, message: "Leave request submitted successfully and is pending approval." };
  } catch {
    return { success: false, message: "Network error — could not reach the server." };
  }
}

async function handleWithTools(
  systemPrompt: string,
  messages: { role: "user" | "assistant"; content: string }[],
  token: string,
  apiUrl: string,
): Promise<ReadableStream> {
  // Phase 1: non-streaming call with tools so Groq can decide what to call
  const response = await groq.chat.completions.create({
    model: DEFAULT_AI_MODEL,
    max_tokens: 500,
    stream: false,
    tools: [LEAVE_TOOL],
    tool_choice: "auto",
    messages: [{ role: "system", content: systemPrompt }, ...messages],
  });

  const choice = response.choices[0];

  // No tool call → return the text response directly
  if (choice.finish_reason !== "tool_calls" || !choice.message.tool_calls?.length) {
    const text = choice.message.content ?? "";
    return new ReadableStream({
      start(controller) { controller.enqueue(encoder.encode(text)); controller.close(); },
    });
  }

  // Phase 2: execute the tool
  const toolCall = choice.message.tool_calls[0];
  const args = JSON.parse(toolCall.function.arguments) as {
    leaveType: string; startDate: string; endDate: string; reason: string;
  };
  const result = await executeLeaveSubmission(args, token, apiUrl);

  // Phase 3: stream the final response with tool result included
  const finalStream = await groq.chat.completions.create({
    model: DEFAULT_AI_MODEL,
    max_tokens: 500,
    stream: true,
    messages: [
      { role: "system", content: systemPrompt },
      ...messages,
      { role: "assistant", content: choice.message.content ?? null, tool_calls: choice.message.tool_calls },
      { role: "tool" as const, tool_call_id: toolCall.id, content: JSON.stringify(result) },
    ],
  });

  return groqReadable(finalStream);
}

// ─────────────────────────────────────────────────────────────────────────────

async function streamAI(systemPrompt: string, messages: { role: "user" | "assistant"; content: string }[]): Promise<ReadableStream> {
  try {
    const stream = await groq.chat.completions.create({
      model: DEFAULT_AI_MODEL,
      max_tokens: 500,
      stream: true,
      messages: [{ role: "system", content: systemPrompt }, ...messages],
    });
    return groqReadable(stream);
  } catch (err) {
    const isRateLimit = err instanceof Groq.APIError && (err.status === 429 || err.status === 503);
    if (!isRateLimit) throw err;
  }

  // Groq rate-limited — fallback to Gemini if available
  if (gemini) {
    try {
      const model = gemini.getGenerativeModel({ model: "gemini-1.5-flash" });
      const systemAndMessages = [
        { role: "user" as const, parts: [{ text: systemPrompt }] },
        ...messages.map((m) => ({
          role: m.role === "user" ? ("user" as const) : ("model" as const),
          parts: [{ text: m.content }],
        })),
      ];
      const result = await model.generateContentStream({
        contents: systemAndMessages,
        generationConfig: { maxOutputTokens: 500 },
      });
      
      // Create a readable stream from Gemini's response
      return new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of result.stream) {
              const text = chunk.text?.() ?? chunk.text ?? "";
              if (text) controller.enqueue(encoder.encode(text));
            }
          } finally {
            controller.close();
          }
        },
      });
    } catch {
      // Gemini failed, continue to Claude fallback
    }
  }

  // Ultimate fallback to Claude Haiku
  return claudeReadable(anthropic.messages.stream({
    model: FALLBACK_AI_MODEL,
    max_tokens: 500,
    system: systemPrompt,
    messages,
  }));
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return new Response("Unauthorized", { status: 401 });

  const { messages, context } = await req.json() as {
    messages: { role: "user" | "assistant"; content: string }[];
    context?: string;
  };
  const recentMessages = messages.slice(-MAX_CONTEXT_MESSAGES);
  const lastUserMessage = [...recentMessages].reverse().find((m) => m.role === "user")?.content || "";

  if (detectSmallTalk(lastUserMessage)) {
    return new Response(getSmallTalkResponse(session.user.name ?? undefined), { headers: TEXT_HEADERS });
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? process.env.API_URL;
  const token = session.accessToken;
  const roleInstruction = ROLE_INSTRUCTIONS[session.user.role] ?? ROLE_INSTRUCTIONS.EMPLOYEE;

  // If page loaded while backend was down, re-fetch context server-side now
  const resolvedContext = context || (token && apiUrl ? await fetchServerContext(token, apiUrl) : "");

  const directAnswer = tryContextLookup(lastUserMessage, resolvedContext);
  if (directAnswer) return new Response(directAnswer, { headers: TEXT_HEADERS });

  let fetchedContext = "";
  const canFetchData = ["HR_ADMIN", "SUPER_ADMIN", "MANAGER"].includes(session.user.role);
  if (canFetchData && token && apiUrl) {
    try {
      fetchedContext = await resolveDataContext(detectQueryType(lastUserMessage), apiUrl, token);
    } catch { /* Fail gracefully */ }
  }

  const systemParts = [buildSystemPrompt(roleInstruction, resolvedContext)];
  if (fetchedContext) systemParts.push(fetchedContext);
  const fullSystemPrompt = systemParts.join("\n\n");

  // Route action queries through tool use so actions are real, not hallucinated
  const isAction = LEAVE_ACTION_RE.test(lastUserMessage);
  const readable = isAction && token && apiUrl
    ? await handleWithTools(fullSystemPrompt, recentMessages, token, apiUrl)
    : await streamAI(fullSystemPrompt, recentMessages);

  return new Response(readable, { headers: TEXT_HEADERS });
}
