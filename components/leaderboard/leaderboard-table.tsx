import { Flame, Medal, Trophy } from "lucide-react";
import type { LeaderboardMember, Profile } from "@/lib/types";
import { getInitials } from "@/lib/utils";
import { StageBadge } from "@/components/ui/stage-badge";
import { EmptyState } from "@/components/ui/empty-state";

type LeaderboardTableProps = {
  members: LeaderboardMember[];
  currentUserId: string;
};

export function LeaderboardTable({ members, currentUserId }: LeaderboardTableProps) {
  if (!members.length) {
    return (
      <EmptyState
        title="Leaderboard is warming up"
        description="Once Diamond Members submit check-ins, points will appear here."
      />
    );
  }

  return (
    <div className="space-y-3">
      <div className="space-y-3 md:hidden">
        {members.map((member) => (
          <LeaderboardCard key={member.user_id} member={member} isCurrent={member.user_id === currentUserId} />
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-[22px] border border-border-soft bg-white shadow-sm md:block">
        <table className="w-full border-collapse">
          <thead className="bg-background/80 text-left">
            <tr className="text-xs font-black uppercase tracking-[0.14em] text-brown">
              <th className="px-5 py-4">Rank</th>
              <th className="px-5 py-4">Member</th>
              <th className="px-5 py-4">Stage</th>
              <th className="px-5 py-4 text-right">Points</th>
              <th className="px-5 py-4 text-right">Streak</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => {
              const isCurrent = member.user_id === currentUserId;

              return (
                <tr
                  key={member.user_id}
                  className={isCurrent ? "bg-gold/10" : "border-t border-border-soft"}
                >
                  <td className="px-5 py-4">
                    <RankMark rank={member.rank} />
                  </td>
                  <td className="px-5 py-4">
                    <MemberIdentity member={member} />
                  </td>
                  <td className="px-5 py-4">
                    <StageBadge stage={member.current_stage as Profile["current_stage"]} />
                  </td>
                  <td className="px-5 py-4 text-right text-lg font-black text-navy">{member.points}</td>
                  <td className="px-5 py-4 text-right">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-warning/10 px-3 py-1 text-sm font-black text-warning">
                      <Flame className="h-4 w-4" />
                      {member.streak}d
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function LeaderboardCard({ member, isCurrent }: { member: LeaderboardMember; isCurrent: boolean }) {
  return (
    <div
      className={`premium-shadow rounded-[22px] border p-4 ${
        isCurrent ? "border-gold/45 bg-gold/10" : "border-border-soft bg-white"
      }`}
    >
      <div className="flex items-start gap-3">
        <RankMark rank={member.rank} />
        <div className="min-w-0 flex-1">
          <MemberIdentity member={member} />
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <StageBadge stage={member.current_stage as Profile["current_stage"]} />
            <span className="inline-flex items-center gap-1.5 rounded-full bg-warning/10 px-3 py-1 text-xs font-black text-warning">
              <Flame className="h-3.5 w-3.5" />
              {member.streak} day streak
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black text-navy">{member.points}</p>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-brown">points</p>
        </div>
      </div>
    </div>
  );
}

function MemberIdentity({ member }: { member: LeaderboardMember }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      {member.avatar_url ? (
        <div
          aria-hidden="true"
          className="h-11 w-11 shrink-0 rounded-full object-cover ring-1 ring-border-soft"
          style={{
            backgroundImage: `url(${member.avatar_url})`,
            backgroundPosition: "center",
            backgroundSize: "cover"
          }}
        />
      ) : (
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-black text-gold">
          {getInitials(member.full_name, null)}
        </div>
      )}
      <div className="min-w-0">
        <p className="truncate text-base font-black text-navy">{member.full_name || "Diamond Member"}</p>
        <p className="mt-0.5 text-xs font-bold text-brown">Diamond Member</p>
      </div>
    </div>
  );
}

function RankMark({ rank }: { rank: number }) {
  const isTopThree = rank <= 3;

  return (
    <div
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-sm font-black ${
        isTopThree ? "bg-gold text-white" : "bg-background text-navy"
      }`}
    >
      {rank === 1 ? <Trophy className="h-5 w-5" /> : rank <= 3 ? <Medal className="h-5 w-5" /> : `#${rank}`}
    </div>
  );
}
