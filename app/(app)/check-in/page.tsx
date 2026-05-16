import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getTodayDateKey } from "@/lib/date";
import type { DailyCheckin } from "@/lib/types";
import { HabitCheckInForm } from "@/components/check-in/habit-check-in-form";

export default async function CheckInPage() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const todayDateKey = getTodayDateKey();
  const { data: todayCheckin } = await supabase
    .from("daily_checkins")
    .select("*")
    .eq("user_id", user.id)
    .eq("checkin_date", todayDateKey)
    .maybeSingle();

  return (
    <div className="mx-auto max-w-5xl">
      <HabitCheckInForm todayCheckin={(todayCheckin || null) as DailyCheckin | null} />
    </div>
  );
}
