import Link from "next/link";
import { Eye, Gem, LayoutDashboard, ListChecks, ShieldCheck, Trophy } from "lucide-react";
import type { DashboardData } from "@/lib/dashboard";
import type { Profile } from "@/lib/types";
import { MemberDashboard } from "@/components/dashboard/member-dashboard";
import { PremiumCard } from "@/components/ui/premium-card";

const previewProfile: Profile = {
  id: "00000000-0000-0000-0000-000000000001",
  full_name: "RBA Diamond Member",
  email: "member@royalbengalacademy.com",
  phone: null,
  city: null,
  avatar_url: null,
  role: "member",
  current_stage: "Launch Finisher",
  is_active: true,
  joined_at: new Date().toISOString(),
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

const previewDashboardData: DashboardData = {
  todayDateKey: "2026-05-15",
  weekStartDateKey: "2026-05-11",
  todayCheckin: null,
  weeklyCheckins: [],
  monthlyCheckins: [],
  weeklyReview: null,
  weeklyLeaderboard: [
    {
      rank: 1,
      user_id: "00000000-0000-0000-0000-000000000002",
      full_name: "Ananya Coach",
      avatar_url: null,
      current_stage: "First Win Coach",
      points: 320,
      streak: 6
    },
    {
      rank: 2,
      user_id: previewProfile.id,
      full_name: previewProfile.full_name,
      avatar_url: null,
      current_stage: previewProfile.current_stage,
      points: 292,
      streak: 5
    },
    {
      rank: 3,
      user_id: "00000000-0000-0000-0000-000000000003",
      full_name: "Sourav Mentor",
      avatar_url: null,
      current_stage: "Launch Finisher",
      points: 268,
      streak: 4
    }
  ],
  currentStageIndex: 1,
  nextStage: "First Win Coach",
  todayPoints: 38,
  todayPercent: 76,
  weeklyPoints: 292,
  weeklyPercent: 83,
  daysCompletedThisWeek: 5,
  currentStreak: 5,
  monthlyPoints: 820,
  monthlyPercent: 68,
  monthlyTargetPoints: 1200,
  weeklyRank: 2,
  reviewSubmitted: false
};

export default function PreviewPage() {
  return (
    <main className="min-h-screen px-4 py-6 md:px-8">
      <div className="mx-auto max-w-6xl space-y-5">
        <section className="rounded-[28px] bg-navy p-5 text-white shadow-2xl shadow-navy/15 md:p-7">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-[#F8DFA7]">
                <Eye className="h-4 w-4" />
                Public Design Preview
              </div>
              <h1 className="text-3xl font-black leading-tight md:text-4xl">
                RBA Diamond Growth Tracker
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-white/78">
                এটা শুধু design preview. আসল app চালাতে Supabase login setup লাগবে।
              </p>
            </div>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gold px-5 py-3 text-sm font-black text-navy"
            >
              <Gem className="h-4 w-4" />
              Login Page দেখুন
            </Link>
          </div>
        </section>

        <div className="grid gap-3 sm:grid-cols-4">
          <PreviewLink icon={LayoutDashboard} label="Dashboard design" />
          <PreviewLink icon={ListChecks} label="Check-in flow" />
          <PreviewLink icon={Trophy} label="Leaderboard style" />
          <PreviewLink icon={ShieldCheck} label="Admin style" />
        </div>

        <PremiumCard>
          <p className="text-sm font-black uppercase tracking-[0.16em] text-gold-dark">
            Member Dashboard Preview
          </p>
          <p className="mt-2 text-sm leading-6 text-brown">
            নিচে mock data দিয়ে dashboard frontend দেখানো হচ্ছে।
          </p>
        </PremiumCard>

        <MemberDashboard profile={previewProfile} data={previewDashboardData} />
      </div>
    </main>
  );
}

function PreviewLink({ icon: Icon, label }: { icon: typeof Eye; label: string }) {
  return (
    <div className="flex items-center justify-center gap-2 rounded-2xl border border-border-soft bg-white px-4 py-4 text-sm font-black text-navy shadow-sm">
      <Icon className="h-4 w-4 text-gold-dark" />
      {label}
    </div>
  );
}
