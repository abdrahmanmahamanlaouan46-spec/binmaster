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
  // Only process lines that look like they contain multiple merged table rows
  // A merged table line has the pattern: | cell | cell | | cell | cell | | cell | cell |
  // where "| |" indicates the boundary between rows

  const lines = content.split("\n");
  const processed: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    // Only process lines that start with | and contain the row boundary pattern "| |"
    if (!trimmed.startsWith("|") || !trimmed.includes("| |")) {
      processed.push(line);
      continue;
    }

    // Check if this line has the separator row pattern merged with data
    // e.g., | Header | Header | |--------|--------| | data | data |
    // The separator row matches: |[-:]+[-: ]*\|[-:]+[-: ]*\|

    // Count occurrences of "row boundary" patterns: `| ` at the end followed by `|` at the start
    // This is different from a normal cell separator like `| 1 |`

    // Strategy: if a line contains a separator pattern (dashes) AND data after it on the same line,
    // then it's merged and needs splitting.

    const hasSeparator = /\|[\s\-:]+\|/.test(trimmed);
    const hasDataAfterSeparator = hasSeparator &&
      trimmed.indexOf("|-") < trimmed.length - 20; // separator not at the end

    if (hasSeparator && hasDataAfterSeparator) {
      // This line has merged rows - split at row boundaries
      // Replace "| |" patterns (row boundaries) with "|\n|"
      const fixed = trimmed.replace(/\| \|/g, "|\n|");
      processed.push(...fixed.split("\n"));
    } else if (trimmed.includes("| |")) {
      // No separator found but has "| |" - might be merged data rows
      // Check if there are too many pipe groups for a single row
      // A single row typically has 2-6 cells (3-7 pipes)
      const pipeGroups = (trimmed.match(/\|[^|]+\|/g) || []).length;

      // If there are more pipe groups than a typical row, split them
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
 */
export function ChatMarkdownRenderer({ content }: ChatMarkdownRendererProps) {
  const processedContent = useMemo(() => preprocessMarkdown(content), [content]);

  return (
    <div className="chat-markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Table wrapper with horizontal scroll
          table: ({ children }) => (
            <div className="my-3 -mx-1 overflow-x-auto rounded-lg border border-border/60 bg-muted/20 shadow-sm">
              <table className="w-full min-w-[280px] text-[13px] leading-relaxed">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-primary/8 border-b-2 border-primary/15">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="px-3 py-2.5 text-left font-bold text-foreground whitespace-nowrap text-[13px]">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-3 py-2 text-foreground/90 whitespace-nowrap">
              {children}
            </td>
          ),
          tr: ({ children }) => (
            <tr className="border-b border-border/30 last:border-0 even:bg-muted/15 hover:bg-muted/25 transition-colors">
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
            <ul className="my-2 ml-4 space-y-1 list-disc list-outside">
              {children}
            </ul>
          ),
          // Ordered lists (great for step-by-step)
          ol: ({ children }) => (
            <ol className="my-2 ml-4 space-y-1 list-decimal list-outside">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-[13px] leading-relaxed pl-1">
              {children}
            </li>
          ),
          // Paragraphs
          p: ({ children }) => (
            <p className="my-1.5 text-[13px] leading-relaxed first:mt-0 last:mb-0">
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
            <h3 className="text-[14px] font-semibold mt-2 mb-1 text-foreground">
              {children}
            </h3>
          ),
          // Inline code
          code: ({ children }) => (
            <code className="px-1.5 py-0.5 rounded bg-primary/10 text-primary font-mono text-[12px] font-semibold">
              {children}
            </code>
          ),
          // Code blocks
          pre: ({ children }) => (
            <pre className="my-2 p-3 rounded-lg bg-muted/50 border border-border/40 overflow-x-auto text-[12px] leading-relaxed">
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
