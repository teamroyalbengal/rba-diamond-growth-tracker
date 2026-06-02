import Link from "next/link";
import {
  CalendarCheck2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Gem,
  MessageSquareText,
  Sparkles,
  Target,
  TrendingUp
} from "lucide-react";
import type { DashboardData } from "@/lib/dashboard";
import type { Profile } from "@/lib/types";
import {
  dailyTargetPoints,
  habitTargetPoints,
  stageSummaries,
  taskTargetPoints
} from "@/lib/types";
import { PremiumCard } from "@/components/ui/premium-card";
import { ProgressRing } from "@/components/ui/progress-ring";
import { PointsBadge } from "@/components/ui/points-badge";
import { StageBadge } from "@/components/ui/stage-badge";
import { AdminQuickLink } from "@/components/layout/navigation";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { GrowthTrendCard } from "@/components/dashboard/growth-trend-card";
import { LeaderboardPreview } from "@/components/dashboard/leaderboard-preview";
import { JourneyMini } from "@/components/dashboard/journey-mini";

type MemberDashboardProps = {
  profile: Profile;
  data: DashboardData;
};

export function MemberDashboard({ profile, data }: MemberDashboardProps) {
  return (
    <div className="space-y-5 md:space-y-6">
      <section className="rba-hero overflow-hidden rounded-[30px] p-5 text-white shadow-2xl shadow-navy/15 md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <StageBadge stage={profile.current_stage} className="border-white/15 bg-white/10 text-[#F8DFA7]" />
            <h1 className="mt-5 text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
              Welcome back, {profile.full_name || "Diamond Member"}
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-white/78">
              আজকের focused action আপনার Diamond journey-কে আরও stable, visible, আর measurable করে।
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <HeroMetric label="Today" value={`${data.todayPoints}/${dailyTargetPoints}`} />
              <HeroMetric label="Streak" value={`${data.currentStreak}d`} />
              <HeroMetric label="Rank" value={data.weeklyRank ? `#${data.weeklyRank}` : "-"} />
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <AdminQuickLink role={profile.role} />
            <Link
              href="/check-in"
              className="tap-target inline-flex items-center justify-center gap-2 rounded-2xl bg-gold px-5 py-3 text-sm font-black text-navy shadow-lg shadow-black/10 transition hover:bg-[#D6A64A]"
            >
              <Sparkles className="h-4 w-4" />
              Submit Today’s Growth
            </Link>
            <Link
              href="/calendar"
              className="tap-target inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-black text-white shadow-lg shadow-black/10 transition hover:bg-white/15"
            >
              <CalendarDays className="h-4 w-4 text-gold" />
              Top 3 Tasks
            </Link>
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <DashboardCard
          label="Current Stage"
          value={profile.current_stage}
          description={stageSummaries[profile.current_stage]}
          icon={Gem}
          tone="gold"
        />
        <DashboardCard
          label="Next Milestone"
          value={data.nextStage || "Legacy Growth"}
          description={
            data.nextStage
              ? stageSummaries[data.nextStage]
              : "Keep building your leadership ecosystem with steady action."
          }
          icon={TrendingUp}
          tone="green"
        />
        <DashboardCard
          label="Weekly Review"
          value={data.reviewSubmitted ? "Submitted" : "Pending"}
          description={
            data.reviewSubmitted
              ? "এই সপ্তাহের reflection save হয়ে গেছে."
              : "Submit this week’s reflection to stay accountable."
          }
          icon={MessageSquareText}
          tone={data.reviewSubmitted ? "green" : "amber"}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.88fr_1.12fr]">
        <PremiumCard className="overflow-hidden">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-gold/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.12em] text-gold-dark">
                <Target className="h-3.5 w-3.5" />
                Today’s Growth Score
              </div>
              <h2 className="mt-3 text-5xl font-black tracking-tight text-navy">
                {data.todayPoints} <span className="text-xl text-brown">/ {dailyTargetPoints}</span>
              </h2>
              <p className="mt-3 text-sm leading-6 text-brown">
                Habit score and Top 3 task score now combine into your daily growth score.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <PointsBadge points={data.todayPoints} target={dailyTargetPoints} />
                {data.todayCheckin ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1.5 text-xs font-black text-success">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Submitted
                  </span>
                ) : null}
              </div>
            </div>
            <ProgressRing value={data.todayPercent} label="Today" />
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <ScoreSplit label="Habit Score" value={data.todayHabitPoints} target={habitTargetPoints} />
            <ScoreSplit label="Top 3 Task Score" value={data.todayTaskPoints} target={taskTargetPoints} />
          </div>

          <div className="mt-6 h-3 overflow-hidden rounded-full bg-[#EFE1CA]">
            <div
              className="h-full rounded-full bg-gold transition-all duration-700"
              style={{ width: `${data.todayPercent}%` }}
            />
          </div>

          <Link
            href="/check-in"
            className="tap-target mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-navy px-5 py-3 text-sm font-black text-white transition hover:bg-navy/95 sm:w-auto"
          >
            <CalendarCheck2 className="h-4 w-4" />
            {data.todayCheckin ? "Edit Today’s Check-in" : "Submit Today’s Check-in"}
          </Link>
        </PremiumCard>

        <GrowthTrendCard
          trend={data.growthTrend}
          average={data.growthAverage}
          bestDay={data.growthBestDay}
          missedDays={data.growthMissedDays}
          insight={data.growthInsight}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[0.78fr_1.22fr]">
        <PremiumCard>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-black text-brown">Today’s Top 3 Tasks</p>
              <h2 className="mt-1 text-xl font-black text-navy">{data.todayTaskPoints}/30 task score</h2>
            </div>
            <Link href="/calendar" className="rounded-2xl bg-gold/10 px-3 py-2 text-xs font-black text-gold-dark">
              Open
            </Link>
          </div>
          <div className="mt-4 space-y-2">
            {[1, 2, 3].map((order) => {
              const task = data.todayTasks.find((item) => item.task_order === order);

              return (
                <div key={order} className="flex items-center gap-3 rounded-2xl border border-border-soft bg-white/66 p-3">
                  <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-black ${task?.is_completed ? "bg-success text-white" : "bg-background text-brown"}`}>
                    {task?.is_completed ? <CheckCircle2 className="h-4 w-4" /> : order}
                  </span>
                  <p className="min-w-0 flex-1 truncate text-sm font-bold text-navy">
                    {task?.title || `Plan task ${order}`}
                  </p>
                </div>
              );
            })}
          </div>
        </PremiumCard>

        <div>
          <LeaderboardPreview
            members={data.weeklyLeaderboard}
            currentUserId={profile.id}
            weeklyRank={data.weeklyRank}
          />
        </div>
      </div>

      <JourneyMini profile={profile} currentStageIndex={data.currentStageIndex} />

      {!data.reviewSubmitted ? (
        <PremiumCard className="border border-warning/25 bg-warning/10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-black text-warning">Weekly Review Reminder</p>
              <h2 className="mt-1 text-xl font-black text-navy">Reflection pending this week</h2>
              <p className="mt-2 text-sm leading-6 text-brown">
                এই সপ্তাহের সবচেয়ে বড় win, struggle, আর next focus capture করুন।
              </p>
            </div>
            <Link
              href="/weekly-review"
              className="tap-target inline-flex items-center justify-center gap-2 rounded-2xl bg-navy px-5 py-3 text-sm font-black text-white"
            >
              Open Review
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </PremiumCard>
      ) : null}
    </div>
  );
}

function HeroMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/12 bg-white/10 px-4 py-3 backdrop-blur-sm">
      <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#F8DFA7]">{label}</p>
      <p className="mt-1 text-xl font-black text-white">{value}</p>
    </div>
  );
}

function ScoreSplit({ label, value, target }: { label: string; value: number; target: number }) {
  const percent = Math.min(100, Math.round((value / target) * 100));

  return (
    <div className="rounded-2xl border border-border-soft bg-white/70 p-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-black uppercase tracking-[0.12em] text-brown">{label}</p>
        <p className="text-sm font-black text-navy">
          {value}/{target}
        </p>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#EFE1CA]">
        <div className="h-full rounded-full bg-gold transition-all duration-700" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
