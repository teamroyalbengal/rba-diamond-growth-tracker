import { CalendarDays } from "lucide-react";
import { updateCheckinAdmin } from "@/app/actions/admin";
import { createClient } from "@/lib/supabase/server";
import { getTodayDateKey } from "@/lib/date";
import { habits } from "@/lib/habits";
import type { DailyCheckin, Profile } from "@/lib/types";
import { PremiumCard } from "@/components/ui/premium-card";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

type CheckInWithProfile = DailyCheckin & {
  profiles?: Pick<Profile, "full_name" | "email" | "current_stage"> | null;
};

type AdminCheckInsPageProps = {
  searchParams?: Promise<{
    date?: string;
  }>;
};

export default async function AdminCheckInsPage({ searchParams }: AdminCheckInsPageProps) {
  const params = searchParams ? await searchParams : {};
  const selectedDate = params.date || getTodayDateKey();
  const supabase = await createClient();
  const { data: checkins } = await supabase
    .from("daily_checkins")
    .select("*, profiles(full_name,email,current_stage)")
    .eq("checkin_date", selectedDate)
    .order("total_points", { ascending: false });

  const typedCheckins = (checkins || []) as CheckInWithProfile[];

  return (
    <div className="space-y-5">
      <AdminPageHeader
        title="Daily Check-ins"
        description="Filter by date, review submissions, and correct habit records when needed."
      />

      <PremiumCard>
        <form className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="flex-1">
            <span className="mb-2 block text-sm font-bold text-navy">Check-in date</span>
            <div className="flex items-center gap-3 rounded-2xl border border-border-soft bg-white px-4 py-3">
              <CalendarDays className="h-5 w-5 text-brown" />
              <input
                type="date"
                name="date"
                defaultValue={selectedDate}
                className="min-w-0 flex-1 bg-transparent text-base font-bold text-navy outline-none"
              />
            </div>
          </label>
          <button className="rounded-2xl bg-navy px-5 py-3 text-sm font-black text-white">
            Filter
          </button>
        </form>
      </PremiumCard>

      <div className="space-y-3">
        {typedCheckins.map((checkin) => (
          <PremiumCard key={checkin.id}>
            <form action={updateCheckinAdmin} className="space-y-4">
              <input type="hidden" name="checkin_id" value={checkin.id} />
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-lg font-black text-navy">
                    {checkin.profiles?.full_name || checkin.profiles?.email || "Diamond Member"}
                  </p>
                  <p className="mt-1 text-sm font-bold text-brown">{checkin.profiles?.email}</p>
                </div>
                <div className="rounded-2xl bg-gold/10 px-4 py-2 text-right">
                  <p className="text-2xl font-black text-navy">{checkin.total_points}</p>
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-gold-dark">points</p>
                </div>
              </div>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {habits.map((habit) => (
                  <label key={habit.key} className="flex items-center gap-2 rounded-2xl border border-border-soft bg-background/60 px-3 py-2">
                    <input
                      type="checkbox"
                      name={habit.key}
                      defaultChecked={Boolean(checkin[habit.key])}
                      className="h-4 w-4 accent-[#C4933A]"
                    />
                    <span className="text-xs font-bold text-navy">{habit.name}</span>
                  </label>
                ))}
              </div>
              <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                <input
                  name="notes"
                  defaultValue={checkin.notes || ""}
                  placeholder="Admin note or member note"
                  className="rounded-2xl border border-border-soft bg-white px-4 py-3 text-sm text-navy outline-none focus:border-gold"
                />
                <input
                  name="reason"
                  placeholder="Correction reason"
                  className="rounded-2xl border border-border-soft bg-white px-4 py-3 text-sm text-navy outline-none focus:border-gold"
                />
              </div>
              <button className="rounded-2xl bg-navy px-5 py-3 text-sm font-black text-white">
                Save Correction
              </button>
            </form>
          </PremiumCard>
        ))}
        {!typedCheckins.length ? (
          <PremiumCard>
            <p className="text-sm font-bold text-brown">No check-ins submitted for this date.</p>
          </PremiumCard>
        ) : null}
      </div>
    </div>
  );
}
