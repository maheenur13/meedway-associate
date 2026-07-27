import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const fieldClass =
  "w-full rounded-[10px] border border-line bg-paper px-4 py-3 text-[15px] text-ink placeholder:text-ink-mute/60 outline-none transition-all duration-200 hover:border-line-2 focus:border-accent focus:bg-paper-2 focus:ring-4 focus:ring-accent/10";

/** Labelled form field wrapper with optional required marker + error text. */
export function Field({
  label,
  htmlFor,
  required,
  error,
  className,
  children,
}: {
  label: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={htmlFor} className="text-[13px] font-medium text-ink-soft">
        {label}
        {required && <span className="ml-0.5 text-accent">*</span>}
      </label>
      {children}
      {error && <span className="text-xs text-danger">{error}</span>}
    </div>
  );
}
