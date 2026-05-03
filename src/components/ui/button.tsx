import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-[13px] font-semibold transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/15 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:translate-y-0 disabled:opacity-50 dark:focus-visible:ring-white/20 dark:focus-visible:ring-offset-zinc-950 cursor-pointer active:translate-y-0",
  {
    variants: {
      variant: {
        default:
          "border border-zinc-900 bg-zinc-900 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_1px_2px_rgba(24,24,27,0.14)] hover:-translate-y-px hover:bg-zinc-800 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_8px_18px_rgba(24,24,27,0.12)] dark:border-white dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200",
        secondary:
          "border border-zinc-200 bg-white text-zinc-800 shadow-[0_1px_2px_rgba(24,24,27,0.05)] hover:-translate-y-px hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-950 hover:shadow-[0_8px_18px_rgba(24,24,27,0.08)] dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:border-zinc-700 dark:hover:bg-zinc-900",
        ghost:
          "border border-transparent text-zinc-600 hover:-translate-y-px hover:border-zinc-200 hover:bg-white hover:text-zinc-950 hover:shadow-[0_6px_14px_rgba(24,24,27,0.06)] dark:text-zinc-300 dark:hover:border-zinc-800 dark:hover:bg-zinc-900 dark:hover:text-white",
        danger:
          "border border-red-600 bg-red-600 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_1px_2px_rgba(185,28,28,0.16)] hover:-translate-y-px hover:bg-red-700 hover:shadow-[0_8px_18px_rgba(185,28,28,0.16)]",
        outline:
          "border border-zinc-300 bg-transparent text-zinc-800 hover:-translate-y-px hover:border-zinc-400 hover:bg-zinc-50 hover:text-zinc-950 hover:shadow-[0_6px_14px_rgba(24,24,27,0.06)] dark:border-zinc-700 dark:text-zinc-100 dark:hover:border-zinc-600 dark:hover:bg-zinc-900",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-6 text-sm",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={props.disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
