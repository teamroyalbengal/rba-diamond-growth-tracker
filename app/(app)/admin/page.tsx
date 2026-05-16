import Link from "next/link";
import {
  AlertCircle,
  BarChart3,
  CalendarCheck2,
  ClipboardList,
  Gem,
  type LucideIcon,
  Star,
  UsersRound
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { addDays, getTodayDateKey, getWeekStartDateKey } from "@/lib/date";
import { diamondStages, type LeaderboardMember, type Profile, type WeeklyReview } from "@/lib/types";
import { getLeaderboard } from "@/lib/leaderboard";
import { PremiumCard } from "@/components/ui/premium-card";
import { StageBadge } from "@/components/ui/stage-badge";
import { AdminStatsCard } from "@/components/admin/admin-stat-card";

export default async function AdminPage() {
  const supabase = await createClient();
  const today = getTodayDateKey();
  const weekStart = getWeekStartDateKey(today);
  const threeDaysAgo = addDays(today, -2);

  const [
    { data: members },
    { data: todayCheckins },
    { data: weekCheckins },
    { data: recentReviews },
    leaderboardResult
  ] = await Promise.all([
    supabase.from("profiles").select("*").order("joined_at", { ascending: false }),
    supabase.from("daily_checkins").select("user_id,total_points").eq("checkin_date", today),
    supabase.from("daily_checkins").select("user_id,checkin_date").gte("checkin_date", weekStart),
    supabase
      .from("weekly_reviews")
      .select("*, profiles(full_name,email,current_stage)")
      .order("created_at", { ascending: false })
      .limit(5),
    getLeaderboard(supabase, "weekly", 5)
  ]);

  const typedMembers = (members || []) as Profile[];
  const activeMembers = typedMembers.filter((member) => member.is_active);
  const activeMemberIds = new Set(activeMembers.map((member) => member.id));
  const todaySubmitters = new Set((todayCheckins || []).map((checkin) => checkin.user_id as string));
  const activeTodaySubmitters = new Set(
    Array.from(todaySubmitters).filter((memberId) => activeMemberIds.has(memberId))
  );
  const weekActiveMembers = new Set((weekCheckins || []).map((checkin) => checkin.user_id as string));
  const recentActiveMembers = new Set(
    ((weekCheckins || []) as Array<{ user_id: string; checkin_date: string }>)
      .filter((checkin) => checkin.checkin_date >= threeDaysAgo)
      .map((checkin) => checkin.user_id)
  );
  const inactiveMembers = activeMembers.filter((member) => !recentActiveMembers.has(member.id));
  const stageDistribution = diamondStages.map((stage) => ({
    stage,
    count: typedMembers.filter((member) => member.current_stage === stage).length
  }));

  return (
    <div className="space-y-5">
      <section className="rounded-[28px] bg-navy p-5 text-white shadow-2xl shadow-navy/15 md:p-7">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-[#F8DFA7]">Admin Dashboard</p>
        <h1 className="mt-3 text-3xl font-black md:text-4xl">RBA Diamond Control Room</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-white/78">
          Track member momentum, stage health, submissions, and support needs.
        </p>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AdminStatsCard label="Total Members" value={typedMembers.length} description="All Diamond profiles" icon={UsersRound} />
        <AdminStatsCard label="Submitted Today" value={activeTodaySubmitters.size} description="Active members who checked in today" icon={CalendarCheck2} />
        <AdminStatsCard label="Not Submitted Today" value={Math.max(activeMembers.length - activeTodaySubmitters.size, 0)} description="Active members pending today" icon={ClipboardList} />
        <AdminStatsCard label="Active This Week" value={weekActiveMembers.size} description="Members with weekly check-ins" icon={BarChart3} />
        <AdminStatsCard label="Inactive Members" value={inactiveMembers.length} description="Missed 3+ days" icon={AlertCircle} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <PremiumCard>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-brown">Weekly Top Performers</p>
              <h2 className="mt-1 text-xl font-black text-navy">Momentum leaders</h2>
            </div>
            <Link href="/admin/leaderboard" className="text-sm font-black text-gold-dark">View all</Link>
          </div>
          <div className="space-y-3">
            {leaderboardResult.members.map((member: LeaderboardMember) => (
              <div key={member.user_id} className="flex items-center justify-between rounded-2xl border border-border-soft bg-background/60 p-3">
                <div>
                  <p className="font-black text-navy">#{member.rank} {member.full_name || "Diamond Member"}</p>
                  <p className="mt-1 text-sm font-bold text-brown">{member.streak} day streak</p>
                </div>
                <p className="text-xl font-black text-navy">{member.points}</p>
              </div>
            ))}
            {!leaderboardResult.members.length ? <p className="text-sm text-brown">No check-ins yet.</p> : null}
          </div>
        </PremiumCard>

        <PremiumCard>
          <p className="text-sm font-bold text-brown">Stage Distribution</p>
          <h2 className="mt-1 text-xl font-black text-navy">Diamond Journey health</h2>
          <div className="mt-4 space-y-3">
            {stageDistribution.map((item) => (
              <div key={item.stage} className="flex items-center justify-between gap-3">
                <StageBadge stage={item.stage} />
                <div className="h-3 flex-1 overflow-hidden rounded-full bg-[#EFE1CA]">
                  <div
                    className="h-full rounded-full bg-gold"
                    style={{ width: `${typedMembers.length ? (item.count / typedMembers.length) * 100 : 0}%` }}
                  />
                </div>
                <span className="w-8 text-right text-sm font-black text-navy">{item.count}</span>
              </div>
            ))}
          </div>
        </PremiumCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <PremiumCard>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-brown">Inactive Members</p>
              <h2 className="mt-1 text-xl font-black text-navy">Members who missed 3+ days</h2>
            </div>
            <Link href="/admin/members" className="text-sm font-black text-gold-dark">Manage</Link>
          </div>
          <div className="space-y-3">
            {inactiveMembers.slice(0, 6).map((member) => (
              <div key={member.id} className="flex items-center justify-between rounded-2xl border border-border-soft bg-background/60 p-3">
                <div>
                  <p className="font-black text-navy">{member.full_name || "Diamond Member"}</p>
                  <p className="text-sm font-bold text-brown">{member.email}</p>
                </div>
                <StageBadge stage={member.current_stage} />
              </div>
            ))}
            {!inactiveMembers.length ? <p className="text-sm text-brown">No inactive members by this rule.</p> : null}
          </div>
        </PremiumCard>

        <PremiumCard>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-brown">Recent Weekly Reviews</p>
              <h2 className="mt-1 text-xl font-black text-navy">Support signals</h2>
            </div>
            <Link href="/admin/weekly-reviews" className="text-sm font-black text-gold-dark">Review</Link>
          </div>
          <div className="space-y-3">
            {((recentReviews || []) as Array<WeeklyReview & { profiles?: Pick<Profile, "full_name" | "email" | "current_stage"> }>).map((review) => (
              <div key={review.id} className="rounded-2xl border border-border-soft bg-background/60 p-3">
                <p className="font-black text-navy">{review.profiles?.full_name || review.profiles?.email || "Diamond Member"}</p>
                <p className="mt-1 text-sm leading-6 text-brown">{review.biggest_win}</p>
              </div>
            ))}
            {!recentReviews?.length ? <p className="text-sm text-brown">No weekly reviews yet.</p> : null}
          </div>
        </PremiumCard>
      </div>

      <div className="grid gap-3 sm:grid-cols-4">
        <AdminLink href="/admin/members" label="Members" icon={UsersRound} />
        <AdminLink href="/admin/check-ins" label="Check-ins" icon={ClipboardList} />
        <AdminLink href="/admin/weekly-reviews" label="Reviews" icon={Star} />
        <AdminLink href="/admin/leaderboard" label="Leaderboard Export" icon={Gem} />
      </div>
    </div>
  );
}

function AdminLink({ href, label, icon: Icon }: { href: string; label: string; icon: LucideIcon }) {
  return (
    <Link href={href} className="flex items-center justify-center gap-2 rounded-2xl border border-border-soft bg-white px-4 py-4 text-sm font-black text-navy shadow-sm">
      <Icon className="h-4 w-4 text-gold-dark" />
      {label}
    </Link>
  );
}
