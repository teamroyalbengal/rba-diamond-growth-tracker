import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type SuccessToastProps = {
  message: string;
  className?: string;
};

export function SuccessToast({ message, className }: SuccessToastProps) {
  return (
    <div
      className={cn(
        "fixed inset-x-4 bottom-24 z-50 mx-auto flex max-w-md items-center gap-3 rounded-2xl bg-navy px-4 py-3 text-sm font-bold text-white shadow-2xl shadow-navy/25 md:bottom-6",
        className
      )}
      role="status"
      aria-live="polite"
    >
      <Sparkles className="h-5 w-5 shrink-0 text-gold" />
      {message}
    </div>
  );
}
