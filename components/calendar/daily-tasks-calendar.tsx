"use client";

import Link from "next/link";
import { useActionState, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Check, ChevronLeft, ChevronRight, Circle, Loader2, Save, Trash2 } from "lucide-react";
import { saveDailyTasks, type DailyTasksActionState } from "@/app/actions/daily-tasks";
import { formatDisplayDate } from "@/lib/date";
import type { DailyTask } from "@/lib/types";
import { PremiumCard } from "@/components/ui/premium-card";
import { PointsBadge } from "@/components/ui/points-badge";
import { SuccessToast } from "@/components/ui/success-toast";
import { cn } from "@/lib/utils";

type DailyTasksCalendarProps = {
  selectedDate: string;
  previousMonthDate: string;
  nextMonthDate: string;
  monthDateKeys: string[];
  tasks: DailyTask[];
};

const initialState: DailyTasksActionState = {
  status: "idle",
  message: ""
};

export function DailyTasksCalendar({
  selectedDate,
  previousMonthDate,
  nextMonthDate,
  monthDateKeys,
  tasks
}: DailyTasksCalendarProps) {
  const selectedTasks = useMemo(
    () => tasks.filter((task) => task.task_date === selectedDate).sort((a, b) => a.task_order - b.task_order),
    [selectedDate, tasks]
  );

  return (
    <div className="grid gap-5 xl:grid-cols-[0.92fr_1.08fr]">
      <PremiumCard>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-gold/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.12em] text-gold-dark">
              <CalendarDays className="h-3.5 w-3.5" />
              Daily Top 3 Tasks Calendar
            </div>
            <h2 className="mt-3 text-2xl font-black text-navy">
              {formatDisplayDate(selectedDate, { month: "long", year: "numeric" })}
            </h2>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/calendar?date=${previousMonthDate}`}
              className="tap-target flex h-11 w-11 items-center justify-center rounded-2xl border border-border-soft bg-white text-navy shadow-sm"
              aria-label="Previous month"
            >
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <Link
              href={`/calendar?date=${nextMonthDate}`}
              className="tap-target flex h-11 w-11 items-center justify-center rounded-2xl border border-border-soft bg-white text-navy shadow-sm"
              aria-label="Next month"
            >
              <ChevronRight className="h-5 w-5" />
            </Link>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-7 gap-1.5 text-center text-xs font-black text-brown">
          {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
            <span key={`${day}-${index}`}>{day}</span>
          ))}
          {monthDateKeys.map((dateKey) => {
            const dayTasks = tasks.filter((task) => task.task_date === dateKey);
            const completed = dayTasks.filter((task) => task.is_completed).length;
            const planned = dayTasks.length;
            const isSelected = dateKey === selectedDate;

            return (
              <Link
                key={dateKey}
                href={`/calendar?date=${dateKey}`}
                className={cn(
                  "relative flex aspect-square min-h-11 items-center justify-center rounded-2xl border text-sm font-black transition",
                  isSelected
                    ? "border-navy bg-navy text-white shadow-lg shadow-navy/10"
                    : "border-border-soft bg-white text-navy hover:border-gold/45 hover:bg-gold/10"
                )}
              >
                {Number(dateKey.slice(8, 10))}
                <span
                  className={cn(
                    "absolute bottom-1.5 h-1.5 w-1.5 rounded-full",
                    planned === 0 && "bg-transparent",
                    planned > 0 && completed === 0 && "bg-warning",
                    completed > 0 && completed < 3 && "bg-gold",
                    completed === 3 && "bg-success"
                  )}
                />
              </Link>
            );
          })}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2 text-xs font-bold text-brown">
          <LegendDot label="Planned" className="bg-warning" />
          <LegendDot label="Partial" className="bg-gold" />
          <LegendDot label="All complete" className="bg-success" />
          <LegendDot label="No tasks" className="bg-transparent ring-1 ring-border-soft" />
        </div>
      </PremiumCard>

      <TaskEditor key={selectedDate} selectedDate={selectedDate} selectedTasks={selectedTasks} />
    </div>
  );
}

function TaskEditor({ selectedDate, selectedTasks }: { selectedDate: string; selectedTasks: DailyTask[] }) {
  const router = useRouter();
  const [state, action, isPending] = useActionState(saveDailyTasks, initialState);
  const [drafts, setDrafts] = useState(() => buildDrafts(selectedTasks));
  const completedCount = drafts.filter((task) => task.title.trim() && task.is_completed).length;
  const taskScore = completedCount * 10;

  useEffect(() => {
    if (state.status === "success") router.refresh();
  }, [router, state.status]);

  function updateDraft(order: number, patch: Partial<TaskDraft>) {
    setDrafts((current) =>
      current.map((task) => (task.task_order === order ? { ...task, ...patch } : task))
    );
  }

  return (
      <form action={action} className="space-y-4">
        <input type="hidden" name="task_date" value={selectedDate} />
        <PremiumCard>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-black text-brown">Selected Day</p>
              <h1 className="mt-1 text-3xl font-black text-navy">{formatDisplayDate(selectedDate)}</h1>
              <p className="mt-2 text-sm leading-6 text-brown">
                Add up to 3 priority tasks. Each completed task gives 10 points.
              </p>
            </div>
            <PointsBadge points={taskScore} target={30} />
          </div>
        </PremiumCard>

        <div className="space-y-3">
          {drafts.map((task) => (
            <PremiumCard key={task.task_order} className={cn(task.is_completed && task.title.trim() ? "border-success/25 bg-success/10" : "")}>
              <input type="hidden" name={`task_${task.task_order}_id`} value={task.id || ""} />
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                <input
                  type="checkbox"
                  name={`task_${task.task_order}_completed`}
                  checked={task.is_completed}
                  onChange={(event) => updateDraft(task.task_order, { is_completed: event.target.checked })}
                  className="sr-only"
                />
                <div className="min-w-0 flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-background text-sm font-black text-brown">
                      {task.task_order}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateDraft(task.task_order, { is_completed: !task.is_completed })}
                      disabled={!task.title.trim()}
                      className={cn(
                        "tap-target inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-2xl px-3 text-sm font-black transition disabled:cursor-not-allowed disabled:opacity-45",
                        task.is_completed && task.title.trim()
                          ? "bg-success text-white shadow-lg shadow-success/10"
                          : "border border-border-soft bg-white text-navy hover:border-success/35 hover:bg-success/10"
                      )}
                    >
                      {task.is_completed && task.title.trim() ? <Check className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                      {task.is_completed && task.title.trim() ? "Completed" : "Mark complete"}
                    </button>
                  </div>
                  <input
                    name={`task_${task.task_order}_title`}
                    value={task.title}
                    onChange={(event) => updateDraft(task.task_order, { title: event.target.value })}
                    maxLength={120}
                    placeholder={`Top task ${task.task_order}`}
                    className="h-12 w-full rounded-2xl border border-border-soft bg-white px-4 text-base font-bold text-navy outline-none transition placeholder:text-brown/45 focus:border-gold"
                  />
                  <textarea
                    name={`task_${task.task_order}_note`}
                    value={task.note}
                    onChange={(event) => updateDraft(task.task_order, { note: event.target.value })}
                    rows={2}
                    maxLength={400}
                    placeholder="Optional note"
                    className="w-full resize-none rounded-2xl border border-border-soft bg-white px-4 py-3 text-sm text-navy outline-none transition placeholder:text-brown/45 focus:border-gold"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => updateDraft(task.task_order, { title: "", note: "", is_completed: false })}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-border-soft bg-white text-brown transition hover:border-warning/30 hover:bg-warning/10 hover:text-warning"
                  aria-label={`Clear task ${task.task_order}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </PremiumCard>
          ))}
        </div>

        {state.message ? (
          <div
            className={cn(
              "rounded-2xl px-4 py-3 text-sm font-bold",
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
          className="tap-target inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-navy px-5 py-3.5 text-base font-black text-white shadow-lg shadow-navy/15 transition hover:bg-navy/95 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
        >
          {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
          Save Top 3 Tasks
        </button>

        {state.status === "success" ? <SuccessToast message={state.message} /> : null}
      </form>
  );
}

type TaskDraft = {
  id?: string;
  task_order: number;
  title: string;
  note: string;
  is_completed: boolean;
};

function buildDrafts(tasks: DailyTask[]): TaskDraft[] {
  return [1, 2, 3].map((order) => {
    const task = tasks.find((item) => item.task_order === order);
    return {
      id: task?.id,
      task_order: order,
      title: task?.title || "",
      note: task?.note || "",
      is_completed: Boolean(task?.is_completed)
    };
  });
}

function LegendDot({ label, className }: { label: string; className: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={cn("h-2.5 w-2.5 rounded-full", className)} />
      {label}
    </span>
  );
}
