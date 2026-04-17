"use client";

import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Renders Leah's streaming output as markdown with the editorial
 * component map. No `prose` class — we style every element directly
 * so it stays consistent with the rest of the site.
 *
 * Usage: <LeahMarkdown>{text}</LeahMarkdown>
 */

const components: Components = {
  // Paragraph — default body text, tight leading
  p: ({ children, ...props }) => (
    <p
      className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap"
      {...props}
    >
      {children}
    </p>
  ),

  // Strong — champagne highlight, used for dates + reference codes
  strong: ({ children, ...props }) => (
    <strong className="font-medium text-champagne" {...props}>
      {children}
    </strong>
  ),

  // Emphasis — italic, editorial display font
  em: ({ children, ...props }) => (
    <em className="italic font-display" {...props}>
      {children}
    </em>
  ),

  // Links — underline-draw pattern, opens external in new tab
  a: ({ children, href, ...props }) => {
    const external = href?.startsWith("http");
    return (
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className="text-link !text-[13px] !tracking-normal normal-case text-champagne hover:text-cream"
        {...props}
      >
        {children}
      </a>
    );
  },

  // Unordered list — em-dash markers, tight spacing
  ul: ({ children, ...props }) => (
    <ul
      className="my-2 space-y-1.5 text-sm text-foreground/90 list-none"
      {...props}
    >
      {children}
    </ul>
  ),

  // Ordered list — champagne numerals
  ol: ({ children, ...props }) => (
    <ol
      className="my-2 space-y-1.5 text-sm text-foreground/90 list-none [counter-reset:leah]"
      {...props}
    >
      {children}
    </ol>
  ),

  // List item — champagne em-dash marker for ul, numeral for ol
  li: ({ children, ...props }) => (
    <li
      className="relative pl-5 before:absolute before:left-0 before:top-0 before:text-champagne/70 before:content-['—'] leading-relaxed"
      {...props}
    >
      {children}
    </li>
  ),

  // Inline code
  code: ({ children, className, ...props }) => {
    const isBlock = className?.includes("language-");
    if (isBlock) {
      return (
        <code
          className="block my-2 p-3 rounded-sm border border-champagne/20 bg-surface/60 font-mono text-xs text-foreground/85 overflow-x-auto"
          {...props}
        >
          {children}
        </code>
      );
    }
    return (
      <code
        className="rounded-sm border border-champagne/20 bg-surface/60 px-1.5 py-0.5 font-mono text-[12px] text-champagne"
        {...props}
      >
        {children}
      </code>
    );
  },

  // Code block wrapper (pre) — already handled via code above
  pre: ({ children, ...props }) => (
    <pre className="my-2 overflow-x-auto" {...props}>
      {children}
    </pre>
  ),

  // Blockquote — hairline left rule, italic editorial
  blockquote: ({ children, ...props }) => (
    <blockquote
      className="my-2 border-l border-champagne/40 pl-4 font-display italic text-foreground/80"
      {...props}
    >
      {children}
    </blockquote>
  ),

  // Headings — strip down (shouldn't appear in Leah output but safe defaults)
  h1: ({ children }) => (
    <p className="font-display text-base text-foreground/95 font-medium mt-2">
      {children}
    </p>
  ),
  h2: ({ children }) => (
    <p className="font-display text-base text-foreground/95 font-medium mt-2">
      {children}
    </p>
  ),
  h3: ({ children }) => (
    <p className="font-display text-sm text-foreground/95 font-medium mt-2">
      {children}
    </p>
  ),

  // Horizontal rule — champagne hairline
  hr: () => <hr className="my-3 border-0 h-px bg-champagne/20" />,
};

export function LeahMarkdown({ children }: { children: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {children}
    </ReactMarkdown>
  );
}
