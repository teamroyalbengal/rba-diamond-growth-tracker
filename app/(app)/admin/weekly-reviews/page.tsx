import { CalendarDays, CheckCircle2 } from "lucide-react";
import { markReviewReviewed } from "@/app/actions/admin";
import { createClient } from "@/lib/supabase/server";
import { getWeekStartDateKey } from "@/lib/date";
import type { Profile, WeeklyReview } from "@/lib/types";
import { PremiumCard } from "@/components/ui/premium-card";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

type ReviewWithProfile = WeeklyReview & {
  profiles?: Pick<Profile, "full_name" | "email" | "current_stage"> | null;
};

type AdminWeeklyReviewsPageProps = {
  searchParams?: Promise<{
    week?: string;
    q?: string;
  }>;
};

export default async function AdminWeeklyReviewsPage({ searchParams }: AdminWeeklyReviewsPageProps) {
  const params = searchParams ? await searchParams : {};
  const week = params.week || getWeekStartDateKey();
  const q = (params.q || "").trim().toLowerCase();
  const supabase = await createClient();
  const { data: reviews } = await supabase
    .from("weekly_reviews")
    .select("*, profiles(full_name,email,current_stage)")
    .eq("week_start", week)
    .order("created_at", { ascending: false });

  const typedReviews = ((reviews || []) as ReviewWithProfile[]).filter((review) => {
    if (!q) return true;
    return `${review.profiles?.full_name || ""} ${review.profiles?.email || ""}`.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-5">
      <AdminPageHeader
        title="Weekly Reviews"
        description="Review member reflections, filter by week/member, and mark reviewed."
      />

      <PremiumCard>
        <form className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <label>
            <span className="mb-2 block text-sm font-bold text-navy">Week start</span>
            <div className="flex items-center gap-3 rounded-2xl border border-border-soft bg-white px-4 py-3">
              <CalendarDays className="h-5 w-5 text-brown" />
              <input
                type="date"
                name="week"
                defaultValue={week}
                className="min-w-0 flex-1 bg-transparent text-base font-bold text-navy outline-none"
              />
            </div>
          </label>
          <label>
            <span className="mb-2 block text-sm font-bold text-navy">Member search</span>
            <input
              name="q"
              defaultValue={q}
              placeholder="Name or email"
              className="h-[50px] w-full rounded-2xl border border-border-soft bg-white px-4 text-base text-navy outline-none focus:border-gold"
            />
          </label>
          <button className="rounded-2xl bg-navy px-5 py-3 text-sm font-black text-white">Filter</button>
        </form>
      </PremiumCard>

      <div className="space-y-4">
        {typedReviews.map((review) => (
          <PremiumCard key={review.id}>
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-lg font-black text-navy">
                  {review.profiles?.full_name || review.profiles?.email || "Diamond Member"}
                </p>
                <p className="mt-1 text-sm font-bold text-brown">{review.profiles?.email}</p>
              </div>
              <form action={markReviewReviewed} className="flex items-center gap-3">
                <input type="hidden" name="review_id" value={review.id} />
                <label className="flex items-center gap-2 rounded-2xl border border-border-soft bg-background/60 px-4 py-3">
                  <input
                    type="checkbox"
                    name="reviewed"
                    defaultChecked={Boolean(review.reviewed_at)}
                    className="h-4 w-4 accent-[#C4933A]"
                  />
                  <span className="text-sm font-black text-navy">Reviewed</span>
                </label>
                <button className="rounded-2xl bg-navy px-4 py-3 text-sm font-black text-white">Save</button>
              </form>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <ReviewBlock label="Biggest win" value={review.biggest_win} />
              <ReviewBlock label="Struggle" value={review.struggle} />
              <ReviewBlock label="Launch asset" value={review.launch_asset_built} />
              <ReviewBlock label="Self learning" value={review.self_learning} />
              <ReviewBlock label="Next week focus" value={review.next_week_focus} />
              <ReviewBlock label="Support needed" value={review.support_needed || "No specific support requested."} />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Metric label="Reels" value={review.reels_count} />
              <Metric label="Warm conversations" value={review.warm_conversations} />
              <Metric label="YouTube" value={review.youtube_published ? "Yes" : "No"} />
              {review.reviewed_at ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1.5 text-xs font-black text-success">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Reviewed
                </span>
              ) : null}
            </div>
          </PremiumCard>
        ))}
        {!typedReviews.length ? (
          <PremiumCard>
            <p className="text-sm font-bold text-brown">No weekly reviews found for this filter.</p>
          </PremiumCard>
        ) : null}
      </div>
    </div>
  );
}

function ReviewBlock({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="rounded-2xl border border-border-soft bg-background/60 p-4">
      <p className="text-xs font-black uppercase tracking-[0.12em] text-brown">{label}</p>
      <p className="mt-2 text-sm leading-6 text-navy">{value || "-"}</p>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <span className="rounded-full bg-gold/10 px-3 py-1.5 text-xs font-black text-gold-dark">
      {label}: {value}
    </span>
  );
}
