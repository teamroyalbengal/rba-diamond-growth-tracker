"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Save, Sparkles } from "lucide-react";
import { saveTodayCheckIn, type CheckInActionState } from "@/app/actions/check-in";
import { calculateHabitPoints, getHabitValuesFromCheckin, habits, type HabitKey } from "@/lib/habits";
import { habitTargetPoints, type DailyCheckin } from "@/lib/types";
import { PremiumCard } from "@/components/ui/premium-card";
import { ProgressRing } from "@/components/ui/progress-ring";
import { SuccessToast } from "@/components/ui/success-toast";
import { cn } from "@/lib/utils";

type HabitCheckInFormProps = {
  todayCheckin: DailyCheckin | null;
};

const initialState: CheckInActionState = {
  status: "idle",
  message: "",
  totalPoints: 0
};

export function HabitCheckInForm({ todayCheckin }: HabitCheckInFormProps) {
  const router = useRouter();
  const [state, action, isPending] = useActionState(saveTodayCheckIn, {
    ...initialState,
    totalPoints: todayCheckin?.total_points || 0
  });
  const [values, setValues] = useState(() => getHabitValuesFromCheckin(todayCheckin));
  const [notes, setNotes] = useState(todayCheckin?.notes || "");
  const totalPoints = useMemo(() => calculateHabitPoints(values), [values]);
  const completedCount = Object.values(values).filter(Boolean).length;
  const scorePercent = Math.round((totalPoints / habitTargetPoints) * 100);

  useEffect(() => {
    if (state.status === "success") {
      router.refresh();
    }
  }, [router, state.status]);

  function toggleHabit(key: HabitKey) {
    setValues((current) => ({
      ...current,
      [key]: !current[key]
    }));
  }

  return (
    <form action={action} className="space-y-5">
      <section className="rba-hero overflow-hidden rounded-[30px] p-5 text-white shadow-2xl shadow-navy/15 md:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-[#F8DFA7]">
              আজকের Habit Check-in
            </p>
            <h1 className="mt-2 text-3xl font-black leading-tight text-white sm:text-4xl">
              Today’s Growth Score
            </h1>
            <p className="mt-2 max-w-2xl text-base leading-7 text-white/78">
              Tick only what you completed today. Keep it honest, simple, and under 60 seconds.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-black text-white ring-1 ring-white/10">
                {completedCount}/7 habits
              </span>
              <span className="rounded-full bg-gold px-3 py-1.5 text-xs font-black text-navy">
                {totalPoints}/{habitTargetPoints} points
              </span>
              {todayCheckin ? (
                <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-black text-[#F8DFA7] ring-1 ring-white/10">
                  Editing today
                </span>
              ) : null}
            </div>
          </div>
          <ProgressRing value={scorePercent} label="Score" className="rounded-full bg-white/10 p-2" />
        </div>
      </section>

      <div className="grid gap-3 md:grid-cols-2">
        {habits.map((habit) => {
          const Icon = habit.icon;
          const checked = values[habit.key];

          return (
            <label
              key={habit.key}
              className={cn(
                "premium-shadow flex cursor-pointer items-start gap-3 rounded-[24px] border bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-xl",
                checked
                  ? "border-gold/45 bg-gold/10"
                  : "border-border-soft hover:border-gold/35 hover:bg-white"
              )}
            >
              <input
                type="checkbox"
                name={habit.key}
                checked={checked}
                onChange={() => toggleHabit(habit.key)}
                className="sr-only"
              />
              <span
                className={cn(
                  "mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl",
                  checked ? "bg-gold text-white" : "bg-background text-gold-dark"
                )}
              >
                <Icon className="h-6 w-6" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-start justify-between gap-3">
                  <span>
                    <span className="block text-base font-black text-navy">{habit.name}</span>
                    <span className="mt-1 block text-sm leading-6 text-brown">{habit.description}</span>
                  </span>
                  <span className="shrink-0 rounded-full bg-navy px-2.5 py-1 text-xs font-black text-white">
                    {habit.points} pts
                  </span>
                </span>
                <span className="mt-3 inline-flex rounded-full bg-white px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-brown ring-1 ring-border-soft">
                  {habit.category}
                </span>
              </span>
              <span
                className={cn(
                  "mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border",
                  checked ? "border-gold bg-gold text-white" : "border-border-soft bg-white"
                )}
              >
                {checked ? <Check className="h-4 w-4" /> : null}
              </span>
            </label>
          );
        })}
      </div>

      <PremiumCard>
        <label className="block">
          <span className="text-sm font-bold text-navy">Short note optional</span>
          <textarea
            name="notes"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={3}
            maxLength={500}
            placeholder="আজকের biggest action বা reflection..."
            className="mt-2 w-full resize-none rounded-2xl border border-border-soft bg-white px-4 py-3 text-base text-navy outline-none transition placeholder:text-brown/45 focus:border-gold"
          />
        </label>

        {state.message ? (
          <div
            className={cn(
              "mt-4 rounded-2xl px-4 py-3 text-sm font-bold",
              state.status === "success"
                ? "border border-success/20 bg-success/10 text-success"
                : "border border-warning/25 bg-warning/10 text-brown"
            )}
          >
            {state.message}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isPending}
          className="tap-target mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-navy px-5 py-3.5 text-base font-black text-white shadow-lg shadow-navy/15 transition hover:bg-navy/95 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
        >
          {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : state.status === "success" ? <Sparkles className="h-5 w-5" /> : <Save className="h-5 w-5" />}
          {todayCheckin ? "Update Today’s Progress" : "Submit Today’s Progress"}
        </button>
      </PremiumCard>

      {state.status === "success" ? (
        <SuccessToast message={state.message} />
      ) : null}
    </form>
  );
}
