import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getWeekStartDateKey } from "@/lib/date";
import type { WeeklyReview } from "@/lib/types";
import { WeeklyReviewForm } from "@/components/weekly-review/weekly-review-form";

export default async function WeeklyReviewPage() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: review } = await supabase
    .from("weekly_reviews")
    .select("*")
    .eq("user_id", user.id)
    .eq("week_start", getWeekStartDateKey())
    .maybeSingle();

  return (
    <div className="mx-auto max-w-4xl">
      <WeeklyReviewForm review={(review || null) as WeeklyReview | null} />
    </div>
  );
}
