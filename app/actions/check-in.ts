"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getTodayDateKey } from "@/lib/date";
import { calculateHabitPoints, habits, type HabitKey } from "@/lib/habits";

export type CheckInActionState = {
  status: "idle" | "success" | "error";
  message: string;
  totalPoints: number;
};

const notesSchema = z.string().max(500, "Notes must be under 500 characters.").optional();

export async function saveTodayCheckIn(
  _previousState: CheckInActionState,
  formData: FormData
): Promise<CheckInActionState> {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      status: "error",
      message: "Please login again to submit your progress.",
      totalPoints: 0
    };
  }

  const values = habits.reduce(
    (result, habit) => ({
      ...result,
      [habit.key]: formData.get(habit.key) === "on"
    }),
    {} as Record<HabitKey, boolean>
  );
  const notesResult = notesSchema.safeParse(String(formData.get("notes") || "").trim());

  if (!notesResult.success) {
    return {
      status: "error",
      message: notesResult.error.issues[0]?.message || "Please check your note.",
      totalPoints: calculateHabitPoints(values)
    };
  }

  const totalPoints = calculateHabitPoints(values);
  const todayDateKey = getTodayDateKey();
  const { error } = await supabase.from("daily_checkins").upsert(
    {
      user_id: user.id,
      checkin_date: todayDateKey,
      ...values,
      total_points: totalPoints,
      notes: notesResult.data || null
    },
    {
      onConflict: "user_id,checkin_date"
    }
  );

  if (error) {
    return {
      status: "error",
      message: error.message,
      totalPoints
    };
  }

  revalidatePath("/dashboard");
  revalidatePath("/check-in");
  revalidatePath("/leaderboard");

  return {
    status: "success",
    message: "Great! আজকের progress save হয়ে গেছে.",
    totalPoints
  };
}
