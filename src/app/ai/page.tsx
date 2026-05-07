"use client";

import { useState, useRef, useEffect } from "react";

type Message = {
  id: number;
  role: "user" | "ai";
  content: string;
};

const INITIAL_MESSAGES: Message[] = [
  {
    id: 1,
    role: "user",
    content: "What is the attendance policy for remote employees?",
  },
  {
    id: 2,
    role: "ai",
    content: `Here's a summary of Unikove's **remote employee attendance policy**:

**Core Working Hours**
- Remote employees must be available during **core hours: 10:00 AM – 3:00 PM** (local time zone) on all working days.
- Full availability is expected during scheduled team meetings and 1:1s.

**Daily Check-in Requirements**
- Log into the HRMS attendance module each morning before **10:30 AM**.
- Mark status as "Working From Home" to ensure accurate headcount tracking.
- Unplanned absences must be reported by **9:00 AM** via the leave module or Slack.

**Productivity Expectations**
- Performance is measured by **output and deliverables**, not hours tracked.
- Weekly status updates are required in the project management tool by Friday 5 PM.

**Exceptions & Flexibility**
- Employees in different time zones may request a **modified core hours agreement** through HR.
- Approved flexible schedules must be documented in the employee profile.

Need help applying for a WFH day or updating your schedule? I can guide you through that.`,
  },
  {
    id: 3,
    role: "user",
    content: "Can you summarize last month's payroll?",
  },
  {
    id: 4,
    role: "ai",
    content: `Here's the **April 2026 Payroll Summary**:

**Total Payroll:** $1,892,400
**Employees Processed:** 244 (4 on unpaid leave)

**Breakdown by Component**
| Component | Amount |
|-----------|--------|
| Base Salaries | $1,513,920 |
| Allowances | $189,240 |
| Overtime | $56,770 |
| Benefits | $132,470 |

**Department-wise Highlights**
- **Engineering** — $786,000 (largest, 41.5%)
- **Sales** — $544,000 (+3.2% due to commissions)
- **HR & Operations** — $219,000

**Notable Items**
- 3 salary revisions processed (effective Apr 1)
- Q2 performance bonus disbursement: **$42,800** to 12 employees
- Tax withholdings: **$378,480** submitted to authorities on Apr 30

The next payroll run is scheduled for **May 31, 2026**. Would you like me to generate a detailed PDF report?`,
  },
];

const CONVERSATIONS = [
  "How do I apply for leave?",
  "Attendance policy summary",
  "Q2 performance report",
  "Employee onboarding checklist",
  "Payroll deduction breakdown",
];

const SUGGESTIONS = [
  { icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z", label: "Summarize my Q2 performance" },
  { icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4", label: "Show pending leave approvals" },
  { icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2", label: "Generate onboarding checklist" },
  { icon: "M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z", label: "Draft a policy update announcement" },
];

function formatMessage(content: string) {
  const lines = content.split("\n");
  return lines.map((line, i) => {
    if (line.startsWith("**") && line.endsWith("**") && !line.slice(2, -2).includes("**")) {
      return <p key={i} className="font-semibold text-dark dark:text-white mt-2 mb-0.5">{line.slice(2, -2)}</p>;
    }
    if (line.startsWith("- ")) {
      const text = line.slice(2).replace(/\*\*(.*?)\*\*/g, (_, m) => `<strong>${m}</strong>`);
      return <li key={i} className="ml-4 list-disc text-sm" dangerouslySetInnerHTML={{ __html: text }} />;
    }
    if (line.startsWith("| ") && line.endsWith(" |")) {
      return null;
    }
    if (line.match(/^\|[-| ]+\|$/)) return null;
    const formatted = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    return line.trim() ? (
      <p key={i} className="text-sm" dangerouslySetInnerHTML={{ __html: formatted }} />
    ) : (
      <div key={i} className="h-1" />
    );
  });
}

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [activeConv, setActiveConv] = useState(0);
  const [showWelcome, setShowWelcome] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function send(text?: string) {
    const msg = (text ?? input).trim();
    if (!msg) return;
    setShowWelcome(false);
    const userMsg: Message = { id: Date.now(), role: "user", content: msg };
    const aiMsg: Message = {
      id: Date.now() + 1,
      role: "ai",
      content: `I've received your message: **"${msg}"**\n\nI'm processing your request. Based on our HR records and policies, here's what I found:\n\n- This feature is fully integrated with your Unikove HRMS profile.\n- All relevant data has been retrieved from the system.\n- For detailed analysis, please visit the appropriate module.\n\nIs there anything else I can help you with?`,
    };
    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setInput("");
  }

  return (
    <div className="flex h-[calc(100vh-160px)] overflow-hidden rounded-xl shadow-card">
      {/* Sidebar */}
      <div className="w-60 shrink-0 border-r border-gray-3 bg-white dark:border-dark-3 dark:bg-dark-2 flex flex-col">
        <div className="p-4 border-b border-gray-3 dark:border-dark-3">
          <div className="flex items-center gap-2 mb-3">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white"
              style={{ background: "linear-gradient(135deg, #4F46E5, #8B5CF6)" }}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-dark dark:text-white">AI Assistant</span>
          </div>
          <button
            onClick={() => { setShowWelcome(true); setActiveConv(-1); }}
            className="w-full rounded-lg bg-primary-600 px-3 py-2 text-sm font-semibold text-white hover:bg-primary-700"
          >
            + New Conversation
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          <p className="px-2 py-1 text-xs font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6">Recent</p>
          {CONVERSATIONS.map((conv, idx) => (
            <button
              key={idx}
              onClick={() => { setActiveConv(idx); setShowWelcome(false); }}
              className={`w-full rounded-lg px-3 py-2.5 text-left text-xs transition-colors mb-0.5 ${
                activeConv === idx
                  ? "bg-primary-600/10 text-primary-600 dark:text-primary-400"
                  : "text-dark-5 dark:text-dark-6 hover:bg-gray-1 dark:hover:bg-dark-3"
              }`}
            >
              <div className="flex items-start gap-2">
                <svg className="mt-0.5 h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <span className="line-clamp-2">{conv}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat */}
      <div className="flex flex-1 flex-col bg-gray-1 dark:bg-[#111827] overflow-hidden">
        {/* Chat Header */}
        <div className="border-b border-gray-3 dark:border-dark-3 bg-white dark:bg-dark-2 px-5 py-3.5 flex items-center gap-3 shrink-0">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl text-white shrink-0"
            style={{ background: "linear-gradient(135deg, #4F46E5, #8B5CF6)" }}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-dark dark:text-white">Unikove AI</p>
            <p className="text-xs text-dark-5 dark:text-dark-6">Powered by Unikove AI · Always learning</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-xs text-emerald-500">Online</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {showWelcome && (
            <div className="flex flex-col items-center justify-center h-full py-10">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-2xl text-white mb-4"
                style={{ background: "linear-gradient(135deg, #4F46E5, #8B5CF6)" }}
              >
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-dark dark:text-white mb-1">Hello, John! 👋</h2>
              <p className="text-sm text-dark-5 dark:text-dark-6 mb-8">How can I help you today?</p>
              <div className="grid grid-cols-2 gap-3 w-full max-w-lg">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => send(s.label)}
                    className="rounded-xl bg-white dark:bg-dark-2 p-4 text-left border border-gray-3 dark:border-dark-3 hover:border-primary-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-all"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-900/20 mb-2">
                      <svg className="h-4 w-4 text-indigo-600 dark:text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={s.icon} />
                      </svg>
                    </div>
                    <p className="text-xs font-medium text-dark dark:text-white">{s.label}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {!showWelcome && messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              {msg.role === "ai" && (
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-white mt-0.5"
                  style={{ background: "linear-gradient(135deg, #4F46E5, #8B5CF6)" }}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
              )}
              <div
                className={`max-w-[70%] rounded-xl px-4 py-3 ${
                  msg.role === "user"
                    ? "bg-primary-600 text-white rounded-tr-sm"
                    : "bg-white dark:bg-dark-2 border-l-4 border-indigo-500 rounded-tl-sm shadow-sm dark:border dark:border-dark-3"
                }`}
              >
                {msg.role === "user" ? (
                  <p className="text-sm text-white">{msg.content}</p>
                ) : (
                  <div className="text-dark dark:text-white space-y-0.5">
                    {formatMessage(msg.content)}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input Bar */}
        <div className="border-t border-gray-3 dark:border-dark-3 bg-white dark:bg-dark-2 p-4 shrink-0">
          <div className="flex items-end gap-2 rounded-xl border border-gray-3 dark:border-dark-3 bg-gray-1 dark:bg-dark-3 px-3 py-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder="Ask anything about HR, payroll, attendance, policies..."
              rows={1}
              className="flex-1 resize-none bg-transparent text-sm text-dark dark:text-white placeholder-dark-5 dark:placeholder-dark-6 outline-none"
            />
            <div className="flex items-center gap-1.5 shrink-0">
              <button className="rounded-lg p-1.5 text-dark-5 hover:bg-gray-2 dark:text-dark-6 dark:hover:bg-dark-2">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </button>
              <button
                onClick={() => send()}
                className="rounded-lg bg-primary-600 p-1.5 text-white hover:bg-primary-700 disabled:opacity-50"
                disabled={!input.trim()}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
          <p className="mt-2 text-center text-xs text-dark-5 dark:text-dark-6">
            Unikove AI may occasionally make mistakes. Verify important decisions with HR.
          </p>
        </div>
      </div>
    </div>
  );
}
