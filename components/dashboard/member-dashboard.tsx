import Link from "next/link";
import {
  CalendarCheck2,
  CheckCircle2,
  Flame,
  Gem,
  MessageSquareText,
  Sparkles,
  TrendingUp
} from "lucide-react";
import type { DashboardData } from "@/lib/dashboard";
import type { Profile } from "@/lib/types";
import { dailyTargetPoints, stageSummaries, weeklyTargetPoints } from "@/lib/types";
import { PremiumCard } from "@/components/ui/premium-card";
import { ProgressRing } from "@/components/ui/progress-ring";
import { PointsBadge } from "@/components/ui/points-badge";
import { StageBadge } from "@/components/ui/stage-badge";
import { AdminQuickLink } from "@/components/layout/navigation";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { LeaderboardPreview } from "@/components/dashboard/leaderboard-preview";
import { JourneyMini } from "@/components/dashboard/journey-mini";

type MemberDashboardProps = {
  profile: Profile;
  data: DashboardData;
};

export function MemberDashboard({ profile, data }: MemberDashboardProps) {
  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-[28px] bg-navy p-5 text-white shadow-2xl shadow-navy/15 md:p-7">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <StageBadge stage={profile.current_stage} className="border-white/15 bg-white/10 text-[#F8DFA7]" />
            <h1 className="mt-4 text-3xl font-black leading-tight md:text-4xl">
              Welcome back, {profile.full_name || "Diamond Member"}
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-white/78">
              আজকের ছোট্ট action আপনার Diamond journey-কে এগিয়ে নিয়ে যাবে।
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <AdminQuickLink role={profile.role} />
            <Link
              href="/check-in"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gold px-5 py-3 text-sm font-black text-navy shadow-lg shadow-black/10 transition hover:bg-[#D6A64A]"
            >
              <Sparkles className="h-4 w-4" />
              Submit Today’s Growth
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

      <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <PremiumCard className="overflow-hidden">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-bold text-brown">Today’s Growth Score</p>
              <h2 className="mt-2 text-4xl font-black text-navy">
                {data.todayPoints} <span className="text-xl text-brown">/ {dailyTargetPoints}</span>
              </h2>
              <p className="mt-3 text-sm leading-6 text-brown">
                {data.todayCheckin
                  ? "Great! আজকের progress save হয়ে গেছে."
                  : "Today’s check-in is waiting. Keep it under 60 seconds."}
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

          <div className="mt-6 h-3 overflow-hidden rounded-full bg-[#EFE1CA]">
            <div
              className="h-full rounded-full bg-gold transition-all duration-700"
              style={{ width: `${data.todayPercent}%` }}
            />
          </div>

          <Link
            href="/check-in"
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-navy px-5 py-3 text-sm font-black text-white transition hover:bg-navy/95 sm:w-auto"
          >
            <CalendarCheck2 className="h-4 w-4" />
            {data.todayCheckin ? "Edit Today’s Check-in" : "Submit Today’s Check-in"}
          </Link>
        </PremiumCard>

        <PremiumCard>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-brown">Weekly Progress</p>
              <h2 className="mt-2 text-3xl font-black text-navy">
                {data.weeklyPoints} <span className="text-lg text-brown">/ {weeklyTargetPoints}</span>
              </h2>
            </div>
            <div className="rounded-2xl bg-warning/10 p-3 text-warning">
              <Flame className="h-6 w-6" />
            </div>
          </div>

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-[#EFE1CA]">
            <div
              className="h-full rounded-full bg-success transition-all duration-700"
              style={{ width: `${data.weeklyPercent}%` }}
            />
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3">
            <MetricPill label="Days done" value={`${data.daysCompletedThisWeek}/7`} />
            <MetricPill label="Streak" value={`${data.currentStreak}d`} />
            <MetricPill label="Rank" value={data.weeklyRank ? `#${data.weeklyRank}` : "-"} />
          </div>
        </PremiumCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <PremiumCard>
          <p className="text-sm font-bold text-brown">Monthly Progress</p>
          <div className="mt-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-black text-navy">{data.monthlyPoints}</h2>
              <p className="mt-1 text-sm leading-6 text-brown">
                of {data.monthlyTargetPoints} available points
              </p>
            </div>
            <ProgressRing value={data.monthlyPercent} label="Month" size={96} stroke={9} />
          </div>
        </PremiumCard>

        <div className="lg:col-span-2">
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
              className="inline-flex items-center justify-center rounded-2xl bg-navy px-5 py-3 text-sm font-black text-white"
            >
              Submit Review
            </Link>
          </div>
        </PremiumCard>
      ) : null}
    </div>
  );
}

function MetricPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border-soft bg-background/60 p-3 text-center">
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-brown">{label}</p>
      <p className="mt-1 text-xl font-black text-navy">{value}</p>
    </div>
  );
}
