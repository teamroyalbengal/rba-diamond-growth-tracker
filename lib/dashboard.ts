import type { SupabaseClient } from "@supabase/supabase-js";
import {
  dailyTargetPoints,
  diamondStages,
  type DailyCheckin,
  type DailyTask,
  type LeaderboardMember,
  type Profile,
  type WeeklyReview,
  weeklyTargetPoints
} from "@/lib/types";
import {
  countDaysInclusive,
  addDays,
  getCurrentWeekDateKeys,
  getMonthEndDateKey,
  getMonthStartDateKey,
  getRecentDateKeys,
  getTodayDateKey,
  getWeekStartDateKey
} from "@/lib/date";

export type GrowthTrendDay = {
  dateKey: string;
  label: string;
  habitPoints: number;
  taskPoints: number;
  totalPoints: number;
  missed: boolean;
};

export type DashboardData = {
  todayDateKey: string;
  weekStartDateKey: string;
  todayCheckin: DailyCheckin | null;
  weeklyCheckins: DailyCheckin[];
  monthlyCheckins: DailyCheckin[];
  todayTasks: DailyTask[];
  weeklyTasks: DailyTask[];
  monthlyTasks: DailyTask[];
  weeklyReview: WeeklyReview | null;
  weeklyLeaderboard: LeaderboardMember[];
  growthTrend: GrowthTrendDay[];
  growthAverage: number;
  growthBestDay: number;
  growthMissedDays: number;
  growthInsight: string;
  currentStageIndex: number;
  nextStage: Profile["current_stage"] | null;
  todayPoints: number;
  todayHabitPoints: number;
  todayTaskPoints: number;
  todayPercent: number;
  weeklyPoints: number;
  weeklyHabitPoints: number;
  weeklyTaskPoints: number;
  weeklyPercent: number;
  daysCompletedThisWeek: number;
  currentStreak: number;
  monthlyPoints: number;
  monthlyHabitPoints: number;
  monthlyTaskPoints: number;
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
  const recentStartDateKey = addDays(todayDateKey, -6);
  const weekStartDateKey = getWeekStartDateKey(todayDateKey);
  const monthStartDateKey = getMonthStartDateKey(todayDateKey);
  const monthEndDateKey = getMonthEndDateKey(todayDateKey);
  const queryStartDateKey = recentStartDateKey < monthStartDateKey ? recentStartDateKey : monthStartDateKey;

  const [{ data: checkins }, { data: tasks }, { data: weeklyReview }, { data: leaderboard }] = await Promise.all([
    supabase
      .from("daily_checkins")
      .select("*")
      .eq("user_id", profile.id)
      .gte("checkin_date", queryStartDateKey)
      .lte("checkin_date", monthEndDateKey)
      .order("checkin_date", { ascending: false }),
    supabase
      .from("daily_tasks")
      .select("*")
      .eq("user_id", profile.id)
      .gte("task_date", queryStartDateKey)
      .lte("task_date", monthEndDateKey)
      .order("task_date", { ascending: false })
      .order("task_order", { ascending: true }),
    supabase
      .from("weekly_reviews")
      .select("id,user_id,week_start,created_at,updated_at")
      .eq("user_id", profile.id)
      .eq("week_start", weekStartDateKey)
      .maybeSingle(),
    supabase.rpc("get_weekly_leaderboard", { limit_count: 25 })
  ]);

  const typedCheckins = (checkins || []) as DailyCheckin[];
  const typedTasks = (tasks || []) as DailyTask[];
  const weeklyCheckins = typedCheckins.filter((checkin) => checkin.checkin_date >= weekStartDateKey);
  const weeklyTasks = typedTasks.filter((task) => task.task_date >= weekStartDateKey);
  const monthlyCheckins = typedCheckins.filter((checkin) => checkin.checkin_date >= monthStartDateKey);
  const monthlyTasks = typedTasks.filter((task) => task.task_date >= monthStartDateKey);
  const todayCheckin =
    typedCheckins.find((checkin) => checkin.checkin_date === todayDateKey) || null;
  const todayTasks = typedTasks
    .filter((task) => task.task_date === todayDateKey)
    .sort((a, b) => a.task_order - b.task_order);
  const weekDateKeys = new Set(getCurrentWeekDateKeys(todayDateKey));
  const currentStageIndex = diamondStages.indexOf(profile.current_stage);
  const nextStage = diamondStages[currentStageIndex + 1] || null;
  const todayHabitPoints = todayCheckin?.total_points || 0;
  const todayTaskPoints = calculateTaskPoints(todayTasks);
  const todayPoints = todayHabitPoints + todayTaskPoints;
  const weeklyHabitPoints = weeklyCheckins.reduce((sum, checkin) => sum + checkin.total_points, 0);
  const weeklyTaskPoints = calculateTaskPoints(weeklyTasks);
  const weeklyPoints = weeklyHabitPoints + weeklyTaskPoints;
  const monthlyHabitPoints = monthlyCheckins.reduce((sum, checkin) => sum + checkin.total_points, 0);
  const monthlyTaskPoints = calculateTaskPoints(monthlyTasks);
  const monthlyPoints = monthlyHabitPoints + monthlyTaskPoints;
  const monthElapsedDays = countDaysInclusive(monthStartDateKey, todayDateKey);
  const monthlyTargetPoints = monthElapsedDays * dailyTargetPoints;
  const growthTrend = buildGrowthTrend(typedCheckins, typedTasks, todayDateKey);
  const growthAverage = Math.round(
    growthTrend.reduce((sum, day) => sum + day.totalPoints, 0) / Math.max(growthTrend.length, 1)
  );
  const growthBestDay = Math.max(...growthTrend.map((day) => day.totalPoints), 0);
  const growthMissedDays = growthTrend.filter((day) => day.missed).length;
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
    monthlyCheckins,
    todayTasks,
    weeklyTasks,
    monthlyTasks,
    weeklyReview: (weeklyReview || null) as WeeklyReview | null,
    weeklyLeaderboard: typedLeaderboard.slice(0, 5),
    growthTrend,
    growthAverage,
    growthBestDay,
    growthMissedDays,
    growthInsight: getGrowthInsight(growthTrend),
    currentStageIndex,
    nextStage,
    todayPoints,
    todayHabitPoints,
    todayTaskPoints,
    todayPercent: Math.round((todayPoints / dailyTargetPoints) * 100),
    weeklyPoints,
    weeklyHabitPoints,
    weeklyTaskPoints,
    weeklyPercent: Math.min(100, Math.round((weeklyPoints / weeklyTargetPoints) * 100)),
    daysCompletedThisWeek: countCompletedDays(weeklyCheckins, weeklyTasks, weekDateKeys),
    currentStreak: calculateStreak(typedCheckins, typedTasks, todayDateKey),
    monthlyPoints,
    monthlyHabitPoints,
    monthlyTaskPoints,
    monthlyPercent: Math.min(100, Math.round((monthlyPoints / monthlyTargetPoints) * 100)),
    monthlyTargetPoints,
    weeklyRank: typedLeaderboard.find((member) => member.user_id === profile.id)?.rank || null,
    reviewSubmitted: Boolean(weeklyReview)
  };
}

function calculateTaskPoints(tasks: DailyTask[]) {
  return tasks.reduce((sum, task) => sum + (task.is_completed ? task.points : 0), 0);
}

function buildGrowthTrend(checkins: DailyCheckin[], tasks: DailyTask[], todayDateKey: string) {
  return getRecentDateKeys(7, todayDateKey).map((dateKey) => {
    const checkin = checkins.find((item) => item.checkin_date === dateKey);
    const dayTasks = tasks.filter((task) => task.task_date === dateKey);
    const habitPoints = checkin?.total_points || 0;
    const taskPoints = calculateTaskPoints(dayTasks);
    const totalPoints = habitPoints + taskPoints;

    return {
      dateKey,
      label: dateKey === todayDateKey ? "Today" : new Date(`${dateKey}T00:00:00+05:30`).toLocaleDateString("en-IN", {
        weekday: "short"
      }),
      habitPoints,
      taskPoints,
      totalPoints,
      missed: totalPoints === 0
    };
  });
}

function getGrowthInsight(growthTrend: GrowthTrendDay[]) {
  const today = growthTrend[growthTrend.length - 1];
  const yesterday = growthTrend[growthTrend.length - 2];
  const missedDays = growthTrend.filter((day) => day.missed).length;

  if (today && yesterday && today.totalPoints > yesterday.totalPoints) {
    return "Strong comeback! Your score improved from yesterday.";
  }

  if (missedDays >= 2) {
    return `Your progress dropped for ${missedDays} days. Restart with today's Top 3 tasks.`;
  }

  if (yesterday?.missed) {
    return "You missed yesterday. Complete today's Top 3 tasks to restart momentum.";
  }

  if (growthTrend.filter((day) => day.totalPoints >= 60).length >= 4) {
    return "Great momentum! You are consistent this week.";
  }

  return "Complete habits and Top 3 tasks today to move the graph upward.";
}

function countCompletedDays(checkins: DailyCheckin[], tasks: DailyTask[], weekDateKeys: Set<string>) {
  const completedDates = new Set(
    checkins.filter((checkin) => checkin.total_points > 0).map((checkin) => checkin.checkin_date)
  );

  tasks.forEach((task) => {
    if (task.is_completed) completedDates.add(task.task_date);
  });

  return Array.from(completedDates).filter((dateKey) => weekDateKeys.has(dateKey)).length;
}

function calculateStreak(checkins: DailyCheckin[], tasks: DailyTask[], todayDateKey: string) {
  const completedDates = new Set(
    checkins.filter((checkin) => checkin.total_points > 0).map((checkin) => checkin.checkin_date)
  );

  tasks.forEach((task) => {
    if (task.is_completed) completedDates.add(task.task_date);
  });

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
