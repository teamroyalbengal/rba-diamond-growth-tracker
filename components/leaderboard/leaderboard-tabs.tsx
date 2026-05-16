import Link from "next/link";
import { leaderboardPeriods, type LeaderboardPeriod } from "@/lib/types";
import { cn } from "@/lib/utils";

type LeaderboardTabsProps = {
  activePeriod: LeaderboardPeriod;
  baseHref?: string;
};

export function LeaderboardTabs({ activePeriod, baseHref = "/leaderboard" }: LeaderboardTabsProps) {
  return (
    <div className="grid grid-cols-4 gap-2 rounded-[22px] border border-border-soft bg-white/75 p-2 shadow-sm">
      {leaderboardPeriods.map((period) => {
        const isActive = period.key === activePeriod;

        return (
          <Link
            key={period.key}
            href={`${baseHref}?period=${period.key}`}
            className={cn(
              "rounded-2xl px-2 py-3 text-center text-xs font-black transition sm:text-sm",
              isActive ? "bg-navy text-white shadow-lg shadow-navy/10" : "text-brown hover:bg-gold/10"
            )}
          >
            {period.label}
          </Link>
        );
      })}
    </div>
  );
}
