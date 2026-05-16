import { Gem } from "lucide-react";
import { cn } from "@/lib/utils";

type PointsBadgeProps = {
  points: number;
  target?: number;
  className?: string;
};

export function PointsBadge({ points, target, className }: PointsBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-navy px-3 py-1.5 text-xs font-black text-white",
        className
      )}
    >
      <Gem className="h-3.5 w-3.5 text-gold" />
      {points}
      {target ? ` / ${target}` : ""} pts
    </span>
  );
}
