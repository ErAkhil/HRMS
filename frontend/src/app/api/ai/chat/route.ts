import Anthropic from "@anthropic-ai/sdk";
import { auth } from "@/auth";
import { NextRequest } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const BASE_SYSTEM = `You are Unikove AI, an intelligent HR assistant embedded inside the Unikove HRMS platform. You help employees and managers with:
- HR policies, leave, attendance, and payroll queries
- Performance reviews and goal tracking
- Recruitment and onboarding processes
- Task and project management
- Team analytics and insights

Be concise, professional, and action-oriented. Use markdown formatting (bold headings, bullet lists, tables) to structure longer responses. When you lack specific data, acknowledge it and guide the user to the right module in the platform.`;

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { messages, context } = await req.json() as {
    messages: { role: "user" | "assistant"; content: string }[];
    context?: string;
  };

  const systemPrompt = context ? `${BASE_SYSTEM}\n\n${context}` : BASE_SYSTEM;

  const stream = client.messages.stream({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system: systemPrompt,
    messages,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          if (
            chunk.type === "content_block_delta" &&
            chunk.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(chunk.delta.text));
          }
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
