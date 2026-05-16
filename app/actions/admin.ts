"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { diamondStages } from "@/lib/types";
import { habits } from "@/lib/habits";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated.");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if ((profile as { role?: string } | null)?.role !== "admin") {
    throw new Error("Admin access required.");
  }

  return { supabase, user };
}

const stageSchema = z.enum(diamondStages as [string, ...string[]]);

export async function updateMemberAdmin(formData: FormData) {
  const { supabase, user } = await requireAdmin();
  const memberId = z.string().uuid().parse(formData.get("member_id"));
  const currentStage = stageSchema.parse(formData.get("current_stage"));
  const isActive = formData.get("is_active") === "on";

  const { data: existing } = await supabase
    .from("profiles")
    .select("current_stage")
    .eq("id", memberId)
    .single();

  const { error } = await supabase
    .from("profiles")
    .update({
      current_stage: currentStage,
      is_active: isActive
    })
    .eq("id", memberId);

  if (error) throw new Error(error.message);

  if ((existing as { current_stage?: string } | null)?.current_stage !== currentStage) {
    await supabase.from("stage_history").insert({
      user_id: memberId,
      old_stage: (existing as { current_stage?: string } | null)?.current_stage || null,
      new_stage: currentStage,
      updated_by: user.id,
      notes: "Updated from admin members page"
    });
  }

  revalidatePath("/admin");
  revalidatePath("/admin/members");
  revalidatePath("/dashboard");
}

export async function updateCheckinAdmin(formData: FormData) {
  const { supabase, user } = await requireAdmin();
  const checkinId = z.string().uuid().parse(formData.get("checkin_id"));
  const reason = String(formData.get("reason") || "Admin correction").trim();

  const values = habits.reduce(
    (result, habit) => ({
      ...result,
      [habit.key]: formData.get(habit.key) === "on"
    }),
    {} as Record<string, boolean>
  );

  const { data: before } = await supabase
    .from("daily_checkins")
    .select("user_id,total_points,checkin_date")
    .eq("id", checkinId)
    .single();

  const { data: after, error } = await supabase
    .from("daily_checkins")
    .update({
      ...values,
      notes: String(formData.get("notes") || "").trim() || null
    })
    .eq("id", checkinId)
    .select("user_id,total_points,checkin_date")
    .single();

  if (error) throw new Error(error.message);

  const beforePoints = Number((before as { total_points?: number } | null)?.total_points || 0);
  const afterPoints = Number((after as { total_points?: number } | null)?.total_points || 0);

  if (beforePoints !== afterPoints) {
    await supabase.from("admin_point_adjustments").insert({
      user_id: (after as { user_id: string }).user_id,
      adjusted_by: user.id,
      adjustment_date: (after as { checkin_date: string }).checkin_date,
      points_delta: afterPoints - beforePoints,
      reason
    });
  }

  revalidatePath("/admin");
  revalidatePath("/admin/check-ins");
  revalidatePath("/leaderboard");
  revalidatePath("/dashboard");
}

export async function markReviewReviewed(formData: FormData) {
  const { supabase } = await requireAdmin();
  const reviewId = z.string().uuid().parse(formData.get("review_id"));
  const reviewed = formData.get("reviewed") === "on";

  const { error } = await supabase
    .from("weekly_reviews")
    .update({
      reviewed_at: reviewed ? new Date().toISOString() : null
    })
    .eq("id", reviewId);

  if (error) throw new Error(error.message);

  revalidatePath("/admin");
  revalidatePath("/admin/weekly-reviews");
}
