import { Download } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getLeaderboard, normalizeLeaderboardPeriod } from "@/lib/leaderboard";
import { leaderboardPeriods } from "@/lib/types";
import { PremiumCard } from "@/components/ui/premium-card";
import { LeaderboardTabs } from "@/components/leaderboard/leaderboard-tabs";
import { LeaderboardTable } from "@/components/leaderboard/leaderboard-table";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

type AdminLeaderboardPageProps = {
  searchParams?: Promise<{
    period?: string;
  }>;
};

export default async function AdminLeaderboardPage({ searchParams }: AdminLeaderboardPageProps) {
  const params = searchParams ? await searchParams : {};
  const activePeriod = normalizeLeaderboardPeriod(params.period);
  const supabase = await createClient();
  const { members, error } = await getLeaderboard(supabase, activePeriod, 1000);
  const periodMeta = leaderboardPeriods.find((period) => period.key === activePeriod);

  return (
    <div className="space-y-5">
      <AdminPageHeader
        title="Leaderboard Export"
        description="Review leaderboard data by period and export CSV for reporting."
      />

      <LeaderboardTabs activePeriod={activePeriod} baseHref="/admin/leaderboard" />

      <PremiumCard>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-black text-gold-dark">{periodMeta?.label} leaderboard</p>
            <h2 className="mt-1 text-2xl font-black text-navy">{members.length} members</h2>
          </div>
          <a
            href={`/admin/leaderboard/export?period=${activePeriod}`}
            className="tap-target inline-flex items-center justify-center gap-2 rounded-2xl bg-navy px-5 py-3 text-sm font-black text-white shadow-lg shadow-navy/10"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </a>
        </div>
        {error ? (
          <div className="mt-4 rounded-2xl border border-warning/25 bg-warning/10 px-4 py-3 text-sm font-bold text-brown">
            {error}
          </div>
        ) : null}
      </PremiumCard>

      <LeaderboardTable members={members} currentUserId="" />
    </div>
  );
}
