export type UserRole = "admin" | "member";

export type DiamondStage =
  | "Starter"
  | "Launch Finisher"
  | "First Win Coach"
  | "Bengal Rising Star"
  | "Bengal Superstar"
  | "Bengal Legend";

export type Profile = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: UserRole;
  current_stage: DiamondStage;
  is_active: boolean;
  joined_at: string;
  created_at: string;
  updated_at: string;
};

export type DailyCheckin = {
  id: string;
  user_id: string;
  checkin_date: string;
  morning_meditation: boolean;
  body_energy: boolean;
  deep_work: boolean;
  content_action: boolean;
  community_action: boolean;
  launch_asset: boolean;
  evening_reflection: boolean;
  total_points: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type WeeklyReview = {
  id: string;
  user_id: string;
  week_start: string;
  biggest_win: string | null;
  struggle: string | null;
  reels_count: number;
  youtube_published: boolean;
  warm_conversations: number;
  launch_asset_built: string | null;
  self_learning: string | null;
  next_week_focus: string | null;
  support_needed: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type LeaderboardMember = {
  rank: number;
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  current_stage: DiamondStage;
  points: number;
  streak: number;
};

export type LeaderboardPeriod = "daily" | "weekly" | "monthly" | "all_time";

export const diamondStages: DiamondStage[] = [
  "Starter",
  "Launch Finisher",
  "First Win Coach",
  "Bengal Rising Star",
  "Bengal Superstar",
  "Bengal Legend"
];

export const stageSummaries: Record<DiamondStage, string> = {
  Starter: "Diamond journey started.",
  "Launch Finisher": "Coach identity, niche, offer, curriculum, community, and launch plan ready.",
  "First Win Coach": "First workshop delivered, first students enrolled, first proof collected.",
  "Bengal Rising Star": "₹1L milestone and repeatable launch rhythm.",
  "Bengal Superstar": "₹10L milestone, scalable community and offer ladder.",
  "Bengal Legend": "₹50L milestone, team, facilitators, leadership ecosystem."
};

export const dailyTargetPoints = 50;
export const weeklyTargetPoints = 350;

export const leaderboardPeriods: Array<{
  key: LeaderboardPeriod;
  label: string;
  description: string;
}> = [
  {
    key: "daily",
    label: "Daily",
    description: "Today’s focused action"
  },
  {
    key: "weekly",
    label: "Weekly",
    description: "This week’s momentum"
  },
  {
    key: "monthly",
    label: "Monthly",
    description: "Current month progress"
  },
  {
    key: "all_time",
    label: "All Time",
    description: "Long-term Diamond growth"
  }
];
