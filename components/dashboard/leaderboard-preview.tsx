import Link from "next/link";
import { ArrowRight, Trophy } from "lucide-react";
import type { LeaderboardMember, Profile } from "@/lib/types";
import { getInitials } from "@/lib/utils";
import { PremiumCard } from "@/components/ui/premium-card";
import { StageBadge } from "@/components/ui/stage-badge";

type LeaderboardPreviewProps = {
  members: LeaderboardMember[];
  currentUserId: string;
  weeklyRank: number | null;
};

export function LeaderboardPreview({
  members,
  currentUserId,
  weeklyRank
}: LeaderboardPreviewProps) {
  return (
    <PremiumCard className="h-full">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-brown">Leaderboard Preview</p>
          <h2 className="mt-1 text-xl font-black text-navy">Top Diamond Members</h2>
        </div>
        <div className="rounded-2xl bg-gold/10 p-3 text-gold-dark">
          <Trophy className="h-6 w-6" />
        </div>
      </div>

      <div className="space-y-3">
        {members.length ? (
          members.map((member) => (
            <div
              key={member.user_id}
              className={`flex items-center gap-3 rounded-2xl border p-3 ${
                member.user_id === currentUserId
                  ? "border-gold/40 bg-gold/10"
                  : "border-border-soft bg-background/60"
              }`}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-navy text-xs font-black text-gold">
                #{member.rank}
              </div>
              {member.avatar_url ? (
                <div
                  className="h-10 w-10 shrink-0 rounded-full bg-cover bg-center ring-1 ring-border-soft"
                  style={{ backgroundImage: `url(${member.avatar_url})` }}
                />
              ) : (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-sm font-black text-navy ring-1 ring-border-soft">
                  {getInitials(member.full_name, null)}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-black text-navy">
                  {member.full_name || "Diamond Member"}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <StageBadge
                    stage={member.current_stage as Profile["current_stage"]}
                    className="px-2 py-0.5 text-[10px]"
                  />
                  <span className="text-xs font-bold text-brown">{member.streak} day streak</span>
                </div>
              </div>
              <p className="text-sm font-black text-navy">{member.points}</p>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-border-soft bg-background/60 p-5 text-center">
            <p className="text-sm font-bold text-navy">No weekly scores yet</p>
            <p className="mt-1 text-sm leading-6 text-brown">The first check-ins will light this up.</p>
          </div>
        )}
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-border-soft pt-4">
        <p className="text-sm font-bold text-brown">
          Your rank: <span className="text-navy">{weeklyRank ? `#${weeklyRank}` : "Not ranked yet"}</span>
        </p>
        <Link
          href="/leaderboard"
          className="inline-flex items-center gap-1 text-sm font-black text-gold-dark"
        >
          View
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </PremiumCard>
  );
}
