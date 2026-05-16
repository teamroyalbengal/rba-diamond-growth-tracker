"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getWeekStartDateKey } from "@/lib/date";

export type WeeklyReviewActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

const weeklyReviewSchema = z.object({
  biggest_win: z.string().trim().min(2, "Please add this week’s biggest win.").max(1200),
  struggle: z.string().trim().min(2, "Please add this week’s struggle.").max(1200),
  reels_count: z.coerce.number().int().min(0).max(500),
  youtube_published: z.enum(["yes", "no"]),
  warm_conversations: z.coerce.number().int().min(0).max(1000),
  launch_asset_built: z.string().trim().min(2, "Please add the launch asset you built.").max(1200),
  self_learning: z.string().trim().min(2, "Please add what you learned about yourself.").max(1200),
  next_week_focus: z.string().trim().min(2, "Please add next week’s focus.").max(1200),
  support_needed: z.string().trim().max(1200).optional()
});

export async function saveWeeklyReview(
  _previousState: WeeklyReviewActionState,
  formData: FormData
): Promise<WeeklyReviewActionState> {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      status: "error",
      message: "Please login again to submit your review."
    };
  }

  const parsed = weeklyReviewSchema.safeParse({
    biggest_win: formData.get("biggest_win"),
    struggle: formData.get("struggle"),
    reels_count: formData.get("reels_count"),
    youtube_published: formData.get("youtube_published"),
    warm_conversations: formData.get("warm_conversations"),
    launch_asset_built: formData.get("launch_asset_built"),
    self_learning: formData.get("self_learning"),
    next_week_focus: formData.get("next_week_focus"),
    support_needed: formData.get("support_needed")
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message || "Please review the form."
    };
  }

  const weekStart = getWeekStartDateKey();
  const { error } = await supabase.from("weekly_reviews").upsert(
    {
      user_id: user.id,
      week_start: weekStart,
      ...parsed.data,
      youtube_published: parsed.data.youtube_published === "yes",
      support_needed: parsed.data.support_needed || null
    },
    {
      onConflict: "user_id,week_start"
    }
  );

  if (error) {
    return {
      status: "error",
      message: error.message
    };
  }

  revalidatePath("/weekly-review");
  revalidatePath("/dashboard");
  revalidatePath("/admin/weekly-reviews");

  return {
    status: "success",
    message: "Weekly reflection submitted. RBA support team can now review it."
  };
}
