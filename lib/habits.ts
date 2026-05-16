import {
  BookOpenCheck,
  Dumbbell,
  type LucideIcon,
  MessageCircleMore,
  Moon,
  PenLine,
  Rocket,
  Sunrise
} from "lucide-react";
import type { DailyCheckin } from "@/lib/types";

export type HabitKey =
  | "morning_meditation"
  | "body_energy"
  | "deep_work"
  | "content_action"
  | "community_action"
  | "launch_asset"
  | "evening_reflection";

export type Habit = {
  key: HabitKey;
  name: string;
  category: "Self" | "Skill" | "Launch";
  description: string;
  points: number;
  icon: LucideIcon;
};

export const habits: Habit[] = [
  {
    key: "morning_meditation",
    name: "Morning Meditation",
    category: "Self",
    description: "Start calm, focused, and intentional.",
    points: 8,
    icon: Sunrise
  },
  {
    key: "body_energy",
    name: "Body Energy",
    category: "Self",
    description: "Move, walk, stretch, or train your body.",
    points: 6,
    icon: Dumbbell
  },
  {
    key: "deep_work",
    name: "Deep Learning / Deep Work",
    category: "Skill",
    description: "Build mastery with focused learning or creation.",
    points: 8,
    icon: BookOpenCheck
  },
  {
    key: "content_action",
    name: "Content Creation Action",
    category: "Launch",
    description: "Post, script, record, write, or publish.",
    points: 8,
    icon: PenLine
  },
  {
    key: "community_action",
    name: "Community / Lead Action",
    category: "Launch",
    description: "Start conversations and nurture warm leads.",
    points: 6,
    icon: MessageCircleMore
  },
  {
    key: "launch_asset",
    name: "Launch Asset Building",
    category: "Launch",
    description: "Build offer, curriculum, page, workshop, or funnel asset.",
    points: 8,
    icon: Rocket
  },
  {
    key: "evening_reflection",
    name: "Evening Reflection",
    category: "Self",
    description: "Review the day and choose tomorrow’s next action.",
    points: 6,
    icon: Moon
  }
];

export function calculateHabitPoints(values: Record<HabitKey, boolean>) {
  return habits.reduce((sum, habit) => sum + (values[habit.key] ? habit.points : 0), 0);
}

export function getHabitValuesFromCheckin(checkin: DailyCheckin | null): Record<HabitKey, boolean> {
  return habits.reduce(
    (values, habit) => ({
      ...values,
      [habit.key]: Boolean(checkin?.[habit.key])
    }),
    {} as Record<HabitKey, boolean>
  );
}
