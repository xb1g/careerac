"use client";

import { useEffect, useRef, useState } from "react";
import Chat, { type ChatProps } from "@/components/chat";
import { cn } from "@/lib/utils";

type ChatWidgetProps = ChatProps & {
  defaultOpen?: boolean;
  title?: string;
  onOpenChange?: (open: boolean) => void;
};

export default function ChatWidget({
  defaultOpen = true,
  title = "AI Assistant",
  onOpenChange,
  ...chatProps
}: ChatWidgetProps) {
  const [open, setOpen] = useState(defaultOpen);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    onOpenChange?.(open);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label={open ? "Close chat" : "Open chat"}
        aria-expanded={open}
        aria-controls="chat-widget-panel"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full shadow-lg cursor-pointer",
          "bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white",
          "flex items-center justify-center transition-transform hover:scale-105",
          "focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2",
          open && "opacity-0 pointer-events-none scale-90",
        )}
        data-testid="chat-widget-fab"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </button>

      <div
        id="chat-widget-panel"
        ref={panelRef}
        role="dialog"
        aria-label={title}
        aria-hidden={!open}
        data-testid="chat-widget-panel"
        className={cn(
          "fixed z-40 flex flex-col overflow-hidden rounded-2xl border shadow-2xl",
          "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900",
          "transition-[opacity,transform] duration-200 ease-out origin-bottom-right",
          "inset-x-3 bottom-3 top-16 sm:top-auto",
          "sm:inset-auto sm:bottom-6 sm:right-6 sm:w-[380px] sm:h-[600px]",
          "sm:max-h-[calc(100vh-3rem)] sm:max-w-[calc(100vw-3rem)]",
          open
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-95 pointer-events-none",
        )}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {title}
          </h2>
          <button
            type="button"
            aria-label="Minimize chat"
            onClick={() => setOpen(false)}
            data-testid="chat-widget-minimize"
            className="h-8 w-8 rounded-md text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:text-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>

        <div className="flex-1 min-h-0 flex flex-col">
          <Chat {...chatProps} />
        </div>
      </div>
    </>
  );
}
