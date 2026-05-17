import { redirect } from "next/navigation";
import { CalendarCheck2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import {
  addDays,
  getMonthDateKeys,
  getMonthEndDateKey,
  getMonthStartDateKey,
  getTodayDateKey
} from "@/lib/date";
import type { DailyTask } from "@/lib/types";
import { DailyTasksCalendar } from "@/components/calendar/daily-tasks-calendar";

type CalendarPageProps = {
  searchParams?: Promise<{
    date?: string;
  }>;
};

export default async function CalendarPage({ searchParams }: CalendarPageProps) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const params = searchParams ? await searchParams : {};
  const selectedDate = normalizeDateParam(params.date) || getTodayDateKey();
  const monthStart = getMonthStartDateKey(selectedDate);
  const monthEnd = getMonthEndDateKey(selectedDate);
  const { data: tasks } = await supabase
    .from("daily_tasks")
    .select("*")
    .eq("user_id", user.id)
    .gte("task_date", monthStart)
    .lte("task_date", monthEnd)
    .order("task_date", { ascending: true })
    .order("task_order", { ascending: true });

  return (
    <div className="space-y-5">
      <section className="rba-hero overflow-hidden rounded-[30px] p-5 text-white shadow-2xl shadow-navy/15 md:p-8">
        <div className="flex max-w-3xl flex-col gap-3">
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.16em] text-[#F8DFA7] ring-1 ring-white/10">
            <CalendarCheck2 className="h-4 w-4" />
            Daily Top 3 Tasks
          </div>
          <h1 className="text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
            Calendar + Top 3 Growth Tasks
          </h1>
          <p className="max-w-2xl text-base leading-7 text-white/78">
            প্রতিদিনের ৩টা priority task plan করুন, complete করুন, আর 30 task points earn করুন।
          </p>
        </div>
      </section>

      <DailyTasksCalendar
        selectedDate={selectedDate}
        previousMonthDate={addDays(monthStart, -1)}
        nextMonthDate={addDays(monthEnd, 1)}
        monthDateKeys={getMonthDateKeys(selectedDate)}
        tasks={(tasks || []) as DailyTask[]}
      />
    </div>
  );
}

function normalizeDateParam(value?: string) {
  return value && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : null;
}
