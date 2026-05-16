import {
  BookOpenCheck,
  BriefcaseBusiness,
  Dumbbell,
  HeartHandshake,
  type LucideIcon,
  Moon,
  ScrollText,
  Sunrise
} from "lucide-react";
import type { DailyCheckin } from "@/lib/types";

export type HabitKey =
  | "morning_meditation"
  | "body_energy"
  | "deep_learning"
  | "five_hour_deep_work"
  | "family_time"
  | "goal_card_affirmation"
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
    description: "Start your day with inner clarity.",
    points: 8,
    icon: Sunrise
  },
  {
    key: "body_energy",
    name: "Body Energy",
    category: "Self",
    description: "Walking, exercise, yoga, or body activation.",
    points: 6,
    icon: Dumbbell
  },
  {
    key: "deep_learning",
    name: "Deep Learning",
    category: "Skill",
    description: "Focused learning for your growth.",
    points: 6,
    icon: BookOpenCheck
  },
  {
    key: "five_hour_deep_work",
    name: "5 Hour Deep Work",
    category: "Launch",
    description: "Serious work on your core goals.",
    points: 10,
    icon: BriefcaseBusiness
  },
  {
    key: "family_time",
    name: "Family Time",
    category: "Self",
    description: "Spend meaningful time with family.",
    points: 6,
    icon: HeartHandshake
  },
  {
    key: "goal_card_affirmation",
    name: "Goal Card & Affirmation",
    category: "Self",
    description: "Read goal card and affirm your identity.",
    points: 8,
    icon: ScrollText
  },
  {
    key: "evening_reflection",
    name: "Evening Reflection",
    category: "Self",
    description: "Review your day and reset your mind.",
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
