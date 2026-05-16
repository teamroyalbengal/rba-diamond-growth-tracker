import type { SupabaseClient } from "@supabase/supabase-js";
import {
  dailyTargetPoints,
  diamondStages,
  type DailyCheckin,
  type LeaderboardMember,
  type Profile,
  type WeeklyReview,
  weeklyTargetPoints
} from "@/lib/types";
import {
  countDaysInclusive,
  getCurrentWeekDateKeys,
  getMonthEndDateKey,
  getMonthStartDateKey,
  getTodayDateKey,
  getWeekStartDateKey
} from "@/lib/date";

export type DashboardData = {
  todayDateKey: string;
  weekStartDateKey: string;
  todayCheckin: DailyCheckin | null;
  weeklyCheckins: DailyCheckin[];
  monthlyCheckins: DailyCheckin[];
  weeklyReview: WeeklyReview | null;
  weeklyLeaderboard: LeaderboardMember[];
  currentStageIndex: number;
  nextStage: Profile["current_stage"] | null;
  todayPoints: number;
  todayPercent: number;
  weeklyPoints: number;
  weeklyPercent: number;
  daysCompletedThisWeek: number;
  currentStreak: number;
  monthlyPoints: number;
  monthlyPercent: number;
  monthlyTargetPoints: number;
  weeklyRank: number | null;
  reviewSubmitted: boolean;
};

export async function getDashboardData(
  supabase: SupabaseClient,
  profile: Profile
): Promise<DashboardData> {
  const todayDateKey = getTodayDateKey();
  const weekStartDateKey = getWeekStartDateKey(todayDateKey);
  const monthStartDateKey = getMonthStartDateKey(todayDateKey);
  const monthEndDateKey = getMonthEndDateKey(todayDateKey);

  const [{ data: checkins }, { data: weeklyReview }, { data: leaderboard }] = await Promise.all([
    supabase
      .from("daily_checkins")
      .select("*")
      .eq("user_id", profile.id)
      .gte("checkin_date", monthStartDateKey)
      .lte("checkin_date", monthEndDateKey)
      .order("checkin_date", { ascending: false }),
    supabase
      .from("weekly_reviews")
      .select("id,user_id,week_start,created_at,updated_at")
      .eq("user_id", profile.id)
      .eq("week_start", weekStartDateKey)
      .maybeSingle(),
    supabase.rpc("get_weekly_leaderboard", { limit_count: 25 })
  ]);

  const typedCheckins = (checkins || []) as DailyCheckin[];
  const weeklyCheckins = typedCheckins.filter((checkin) => checkin.checkin_date >= weekStartDateKey);
  const todayCheckin =
    typedCheckins.find((checkin) => checkin.checkin_date === todayDateKey) || null;
  const weekDateKeys = new Set(getCurrentWeekDateKeys(todayDateKey));
  const currentStageIndex = diamondStages.indexOf(profile.current_stage);
  const nextStage = diamondStages[currentStageIndex + 1] || null;
  const todayPoints = todayCheckin?.total_points || 0;
  const weeklyPoints = weeklyCheckins.reduce((sum, checkin) => sum + checkin.total_points, 0);
  const monthlyPoints = typedCheckins.reduce((sum, checkin) => sum + checkin.total_points, 0);
  const monthElapsedDays = countDaysInclusive(monthStartDateKey, todayDateKey);
  const monthlyTargetPoints = monthElapsedDays * dailyTargetPoints;
  const typedLeaderboard = ((leaderboard || []) as LeaderboardMember[]).map((member) => ({
    ...member,
    points: Number(member.points || 0),
    streak: Number(member.streak || 0),
    rank: Number(member.rank || 0)
  }));

  return {
    todayDateKey,
    weekStartDateKey,
    todayCheckin,
    weeklyCheckins,
    monthlyCheckins: typedCheckins,
    weeklyReview: (weeklyReview || null) as WeeklyReview | null,
    weeklyLeaderboard: typedLeaderboard.slice(0, 5),
    currentStageIndex,
    nextStage,
    todayPoints,
    todayPercent: Math.round((todayPoints / dailyTargetPoints) * 100),
    weeklyPoints,
    weeklyPercent: Math.min(100, Math.round((weeklyPoints / weeklyTargetPoints) * 100)),
    daysCompletedThisWeek: weeklyCheckins.filter((checkin) => weekDateKeys.has(checkin.checkin_date))
      .length,
    currentStreak: calculateStreak(typedCheckins, todayDateKey),
    monthlyPoints,
    monthlyPercent: Math.min(100, Math.round((monthlyPoints / monthlyTargetPoints) * 100)),
    monthlyTargetPoints,
    weeklyRank: typedLeaderboard.find((member) => member.user_id === profile.id)?.rank || null,
    reviewSubmitted: Boolean(weeklyReview)
  };
}

function calculateStreak(checkins: DailyCheckin[], todayDateKey: string) {
  const completedDates = new Set(
    checkins.filter((checkin) => checkin.total_points > 0).map((checkin) => checkin.checkin_date)
  );

  let cursor = todayDateKey;
  let streak = 0;

  while (completedDates.has(cursor)) {
    streak += 1;
    const date = new Date(`${cursor}T00:00:00+05:30`);
    date.setUTCDate(date.getUTCDate() - 1);
    cursor = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).format(date);
  }

  return streak;
}
