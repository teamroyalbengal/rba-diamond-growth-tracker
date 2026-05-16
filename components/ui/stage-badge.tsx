import { Sparkles } from "lucide-react";
import type { DiamondStage } from "@/lib/types";
import { cn } from "@/lib/utils";

type StageBadgeProps = {
  stage: DiamondStage;
  className?: string;
};

export function StageBadge({ stage, className }: StageBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-gold/25 bg-gold/10 px-3 py-1 text-xs font-semibold text-brown",
        className
      )}
    >
      <Sparkles className="h-3.5 w-3.5 text-gold-dark" />
      {stage}
    </span>
  );
}
