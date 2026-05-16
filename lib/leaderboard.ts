import type { SupabaseClient } from "@supabase/supabase-js";
import { leaderboardPeriods, type LeaderboardMember, type LeaderboardPeriod } from "@/lib/types";

export function normalizeLeaderboardPeriod(value?: string | string[]): LeaderboardPeriod {
  const period = Array.isArray(value) ? value[0] : value;
  return leaderboardPeriods.some((item) => item.key === period)
    ? (period as LeaderboardPeriod)
    : "weekly";
}

export async function getLeaderboard(
  supabase: SupabaseClient,
  period: LeaderboardPeriod,
  limit = 500
) {
  const { data, error } = await supabase.rpc("get_leaderboard", {
    period,
    limit_count: limit
  });

  if (error) {
    return {
      members: [] as LeaderboardMember[],
      error: error.message
    };
  }

  return {
    members: ((data || []) as LeaderboardMember[]).map((member) => ({
      ...member,
      rank: Number(member.rank || 0),
      points: Number(member.points || 0),
      streak: Number(member.streak || 0)
    })),
    error: null
  };
}
