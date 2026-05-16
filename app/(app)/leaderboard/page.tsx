import { redirect } from "next/navigation";
import { Crown, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getLeaderboard, normalizeLeaderboardPeriod } from "@/lib/leaderboard";
import { leaderboardPeriods } from "@/lib/types";
import { PremiumCard } from "@/components/ui/premium-card";
import { LeaderboardTabs } from "@/components/leaderboard/leaderboard-tabs";
import { LeaderboardTable } from "@/components/leaderboard/leaderboard-table";

type LeaderboardPageProps = {
  searchParams?: Promise<{
    period?: string;
  }>;
};

export default async function LeaderboardPage({ searchParams }: LeaderboardPageProps) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const params = searchParams ? await searchParams : {};
  const activePeriod = normalizeLeaderboardPeriod(params.period);
  const periodMeta = leaderboardPeriods.find((period) => period.key === activePeriod);
  const { members, error } = await getLeaderboard(supabase, activePeriod);
  const currentMember = members.find((member) => member.user_id === user.id);

  return (
    <div className="space-y-5">
      <section className="rounded-[28px] bg-navy p-5 text-white shadow-2xl shadow-navy/15 md:p-7">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-[#F8DFA7]">
              <Crown className="h-4 w-4" />
              Friendly Momentum Board
            </div>
            <h1 className="text-3xl font-black leading-tight md:text-4xl">
              Diamond Growth Leaderboard
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-white/78">
              Celebrate consistency, learn from momentum, and keep your own journey moving.
            </p>
          </div>
          <div className="rounded-2xl bg-white/10 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#F8DFA7]">Your Rank</p>
            <p className="mt-1 text-2xl font-black">{currentMember ? `#${currentMember.rank}` : "Not ranked"}</p>
          </div>
        </div>
      </section>

      <LeaderboardTabs activePeriod={activePeriod} />

      <PremiumCard>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-black text-gold-dark">{periodMeta?.label || "Weekly"} View</p>
            <h2 className="mt-1 text-2xl font-black text-navy">{periodMeta?.description}</h2>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-success/10 px-3 py-1.5 text-xs font-black text-success">
            <Sparkles className="h-3.5 w-3.5" />
            Growth, not comparison
          </div>
        </div>
        {error ? (
          <div className="mt-4 rounded-2xl border border-warning/25 bg-warning/10 px-4 py-3 text-sm font-bold text-brown">
            {error}
          </div>
        ) : null}
      </PremiumCard>

      <LeaderboardTable members={members} currentUserId={user.id} />
    </div>
  );
}
