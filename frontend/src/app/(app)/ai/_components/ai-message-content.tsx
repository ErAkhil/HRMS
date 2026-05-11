import React from "react";

export function parseInline(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const re = /\*\*(.*?)\*\*|`([^`]+)`/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let idx = 0;
  while ((match = re.exec(text)) !== null) {
    if (match.index > last) nodes.push(<span key={idx++}>{text.slice(last, match.index)}</span>);
    if (match[1] !== undefined) nodes.push(<strong key={idx++}>{match[1]}</strong>);
    else nodes.push(<code key={idx++} className="bg-gray-2 dark:bg-dark-3 px-1 rounded text-xs">{match[2]}</code>);
    last = match.index + match[0].length;
  }
  if (last < text.length) nodes.push(<span key={idx++}>{text.slice(last)}</span>);
  return nodes;
}

export function MessageContent({ content }: { content: string }) {
  const lines = content.split("\n");
  return (
    <div className="space-y-0.5 text-sm">
      {lines.map((line, i) => {
        if (line.startsWith("### ")) return <p key={i} className="font-bold text-dark dark:text-white mt-2">{line.slice(4)}</p>;
        if (line.startsWith("## ")) return <p key={i} className="font-bold text-dark dark:text-white text-base mt-2">{line.slice(3)}</p>;
        if (line.startsWith("**") && line.endsWith("**") && !line.slice(2, -2).includes("**")) {
          return <p key={i} className="font-semibold text-dark dark:text-white mt-1.5">{line.slice(2, -2)}</p>;
        }
        if (line.startsWith("- ") || line.startsWith("* ")) {
          return <li key={i} className="ml-4 list-disc">{parseInline(line.slice(2))}</li>;
        }
        if (/^\d+\. /.test(line)) {
          return <li key={i} className="ml-4 list-decimal">{parseInline(line.replace(/^\d+\. /, ""))}</li>;
        }
        if (line.startsWith("| ") && line.endsWith(" |")) return null;
        if (/^\|[-| ]+\|$/.test(line)) return null;
        if (!line.trim()) return <div key={i} className="h-1" />;
        return <p key={i}>{parseInline(line)}</p>;
      })}
    </div>
  );
}
