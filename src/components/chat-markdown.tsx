"use client";

import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Variant = "assistant" | "user";

const base = "text-[15px] leading-relaxed";

const variantComponents = (v: Variant): Components => {
  const link =
    v === "user"
      ? "font-medium text-white underline decoration-white/40 underline-offset-2 hover:decoration-white"
      : "font-medium text-blue-600 underline decoration-blue-500/40 underline-offset-2 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300";

  const codeInline =
    v === "user"
      ? "rounded-md bg-white/20 px-1.5 py-0.5 font-mono text-[0.9em] text-white"
      : "rounded-md bg-zinc-100 px-1.5 py-0.5 font-mono text-[0.9em] text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100";

  const preBox =
    v === "user"
      ? "my-3 overflow-x-auto rounded-lg bg-white/15 p-3 text-sm text-white/95"
      : "my-3 overflow-x-auto rounded-lg border border-zinc-200/80 bg-zinc-50 p-3 text-sm text-zinc-800 dark:border-zinc-700/80 dark:bg-zinc-800/50 dark:text-zinc-100";

  return {
    p: ({ children }) => <p className="mb-3 last:mb-0 [&:first-child]:mt-0">{children}</p>,
    ul: ({ children }) => (
      <ul
        className={
          v === "user"
            ? "mb-3 list-disc space-y-1.5 pl-5 text-white/95 last:mb-0 marker:text-white/80"
            : "mb-3 list-disc space-y-1.5 pl-5 text-inherit last:mb-0 marker:text-zinc-500 dark:marker:text-zinc-500"
        }
      >
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol
        className={
          v === "user"
            ? "mb-3 list-decimal space-y-1.5 pl-5 text-white/95 last:mb-0 marker:text-white/80"
            : "mb-3 list-decimal space-y-1.5 pl-5 text-inherit last:mb-0 marker:text-zinc-500"
        }
      >
        {children}
      </ol>
    ),
    li: ({ children }) => <li className="pl-0.5 [&>p]:mb-0">{children}</li>,
    a: ({ href, children, ...rest }) => (
      <a href={href} className={link} rel="noopener noreferrer" target={href?.startsWith("http") ? "_blank" : undefined} {...rest}>
        {children}
      </a>
    ),
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    h1: ({ children }) => <h1 className="mb-2 mt-4 text-lg font-semibold first:mt-0">{children}</h1>,
    h2: ({ children }) => <h2 className="mb-2 mt-3 text-base font-semibold first:mt-0">{children}</h2>,
    h3: ({ children }) => <h3 className="mb-1.5 mt-2.5 text-[15px] font-semibold first:mt-0">{children}</h3>,
    blockquote: ({ children }) => (
      <blockquote
        className={
          v === "user"
            ? "my-3 border-l-2 border-white/40 pl-3 text-white/90 italic"
            : "my-3 border-l-2 border-zinc-300 pl-3 text-zinc-700 italic dark:border-zinc-600 dark:text-zinc-300"
        }
      >
        {children}
      </blockquote>
    ),
    hr: () => <hr className={v === "user" ? "my-4 border-white/25" : "my-4 border-zinc-200 dark:border-zinc-700"} />,
    code: ({ className, children, ...props }) => {
      const isBlock = Boolean(className);
      if (isBlock) {
        return (
          <code className={`${className} text-[13px]`} {...props}>
            {children}
          </code>
        );
      }
      return (
        <code className={codeInline} {...props}>
          {children}
        </code>
      );
    },
    pre: ({ children }) => <pre className={preBox}>{children}</pre>,
    table: ({ children }) => (
      <div className="my-3 w-full overflow-x-auto">
        <table
          className={
            v === "user"
              ? "w-full min-w-[240px] border-collapse text-left text-sm text-white/95"
              : "w-full min-w-[240px] border-collapse text-left text-sm"
          }
        >
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => <thead className={v === "user" ? "border-b border-white/30" : "border-b border-zinc-200 dark:border-zinc-700"}>{children}</thead>,
    th: ({ children }) => (
      <th
        className={
          v === "user" ? "px-2 py-1.5 text-left font-semibold" : "px-2 py-1.5 text-left font-semibold text-zinc-800 dark:text-zinc-200"
        }
      >
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className={v === "user" ? "border-t border-white/20 px-2 py-1.5" : "border-t border-zinc-200 px-2 py-1.5 dark:border-zinc-700"}>
        {children}
      </td>
    ),
  };
};

export function ChatMarkdown({ text, variant }: { text: string; variant: Variant }) {
  return (
    <div className={base}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={variantComponents(variant)}>
        {text}
      </ReactMarkdown>
    </div>
  );
}
