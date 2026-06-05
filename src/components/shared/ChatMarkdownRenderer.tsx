"use client";

import React, { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ChatMarkdownRendererProps {
  content: string;
}

/**
 * Pre-processes AI response to fix markdown tables.
 * Handles two cases:
 * 1. Tables with proper newlines (no changes needed)
 * 2. Tables where all rows are on a single line (needs splitting)
 */
function preprocessMarkdown(content: string): string {
  const lines = content.split("\n");
  const processed: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed.startsWith("|") || !trimmed.includes("| |")) {
      processed.push(line);
      continue;
    }

    const hasSeparator = /\|[\s\-:]+\|/.test(trimmed);
    const hasDataAfterSeparator = hasSeparator &&
      trimmed.indexOf("|-") < trimmed.length - 20;

    if (hasSeparator && hasDataAfterSeparator) {
      const fixed = trimmed.replace(/\| \|/g, "|\n|");
      processed.push(...fixed.split("\n"));
    } else if (trimmed.includes("| |")) {
      const pipeGroups = (trimmed.match(/\|[^|]+\|/g) || []).length;

      if (pipeGroups > 7) {
        const fixed = trimmed.replace(/\| \|/g, "|\n|");
        processed.push(...fixed.split("\n"));
      } else {
        processed.push(line);
      }
    } else {
      processed.push(line);
    }
  }

  return processed.join("\n");
}

/**
 * Custom markdown renderer optimized for AI chat messages.
 * Renders tables, bold, lists, code, etc. with proper responsive styling.
 * Tables are ultra-readable with large text, generous padding, and horizontal scroll.
 */
export function ChatMarkdownRenderer({ content }: ChatMarkdownRendererProps) {
  const processedContent = useMemo(() => preprocessMarkdown(content), [content]);

  return (
    <div className="chat-markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Table wrapper with horizontal scroll — NEVER breaks layout
          table: ({ children }) => (
            <div className="my-3 -mx-2 overflow-x-auto rounded-xl border border-border/60 bg-muted/15 shadow-sm scrollbar-thin">
              <table className="w-full min-w-[320px] text-sm leading-relaxed border-collapse">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-primary/10 border-b-2 border-primary/20">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="px-4 py-3 text-left font-bold text-foreground whitespace-nowrap text-sm tracking-wide">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-2.5 text-foreground/90 whitespace-nowrap text-sm">
              {children}
            </td>
          ),
          tr: ({ children }) => (
            <tr className="border-b border-border/25 last:border-0 even:bg-muted/20 hover:bg-primary/5 transition-colors">
              {children}
            </tr>
          ),
          // Bold text — accent color for key results
          strong: ({ children }) => (
            <strong className="font-bold text-primary">
              {children}
            </strong>
          ),
          // Unordered lists
          ul: ({ children }) => (
            <ul className="my-2 ml-5 space-y-1 list-disc list-outside">
              {children}
            </ul>
          ),
          // Ordered lists (great for step-by-step)
          ol: ({ children }) => (
            <ol className="my-2 ml-5 space-y-1 list-decimal list-outside">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-sm leading-relaxed pl-1">
              {children}
            </li>
          ),
          // Paragraphs
          p: ({ children }) => (
            <p className="my-1.5 text-sm leading-relaxed first:mt-0 last:mb-0">
              {children}
            </p>
          ),
          // Headings
          h1: ({ children }) => (
            <h1 className="text-base font-bold mt-3 mb-1.5 text-foreground">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-[15px] font-bold mt-2.5 mb-1 text-foreground">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-sm font-semibold mt-2 mb-1 text-foreground">
              {children}
            </h3>
          ),
          // Inline code
          code: ({ children }) => (
            <code className="px-1.5 py-0.5 rounded bg-primary/10 text-primary font-mono text-[13px] font-semibold">
              {children}
            </code>
          ),
          // Code blocks
          pre: ({ children }) => (
            <pre className="my-2 p-3 rounded-lg bg-muted/50 border border-border/40 overflow-x-auto text-[13px] leading-relaxed">
              {children}
            </pre>
          ),
          // Blockquotes (tips, important notes)
          blockquote: ({ children }) => (
            <blockquote className="my-2 pl-3 border-l-3 border-primary/40 bg-primary/5 py-2 pr-2 rounded-r-lg">
              {children}
            </blockquote>
          ),
          // Horizontal rule
          hr: () => (
            <hr className="my-3 border-border/40" />
          ),
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
}
