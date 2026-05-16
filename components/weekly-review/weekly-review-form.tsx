"use client";

import type { InputHTMLAttributes } from "react";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2, Save } from "lucide-react";
import { saveWeeklyReview, type WeeklyReviewActionState } from "@/app/actions/weekly-review";
import type { WeeklyReview } from "@/lib/types";
import { PremiumCard } from "@/components/ui/premium-card";
import { SuccessToast } from "@/components/ui/success-toast";
import { cn } from "@/lib/utils";

type WeeklyReviewFormProps = {
  review: WeeklyReview | null;
};

const initialState: WeeklyReviewActionState = {
  status: "idle",
  message: ""
};

export function WeeklyReviewForm({ review }: WeeklyReviewFormProps) {
  const router = useRouter();
  const [state, action, isPending] = useActionState(saveWeeklyReview, initialState);

  useEffect(() => {
    if (state.status === "success") {
      router.refresh();
    }
  }, [router, state.status]);

  return (
    <form action={action} className="space-y-5">
      <PremiumCard>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-gold-dark">
              Weekly Growth Reflection
            </p>
            <h1 className="mt-2 text-3xl font-black text-navy">এই সপ্তাহের review</h1>
            <p className="mt-2 text-base leading-7 text-brown">
              Capture wins, struggles, launch action, and the support you need from RBA.
            </p>
          </div>
          {review ? (
            <span className="inline-flex items-center gap-2 rounded-full bg-success/10 px-3 py-1.5 text-xs font-black text-success">
              <CheckCircle2 className="h-4 w-4" />
              Submitted this week
            </span>
          ) : null}
        </div>
      </PremiumCard>

      <PremiumCard>
        <div className="grid gap-4">
          <ReviewTextarea
            name="biggest_win"
            label="This week’s biggest win"
            placeholder="এই সপ্তাহে আপনার সবচেয়ে বড় win কী?"
            defaultValue={review?.biggest_win}
          />
          <ReviewTextarea
            name="struggle"
            label="This week’s struggle"
            placeholder="কোথায় আটকে গিয়েছিলেন?"
            defaultValue={review?.struggle}
          />
          <div className="grid gap-4 sm:grid-cols-3">
            <ReviewInput
              name="reels_count"
              label="Reels / short videos"
              type="number"
              min="0"
              defaultValue={String(review?.reels_count ?? 0)}
            />
            <ReviewInput
              name="warm_conversations"
              label="Warm conversations"
              type="number"
              min="0"
              defaultValue={String(review?.warm_conversations ?? 0)}
            />
            <label className="block">
              <span className="text-sm font-bold text-navy">YouTube video?</span>
              <select
                name="youtube_published"
                defaultValue={review?.youtube_published ? "yes" : "no"}
                className="mt-2 h-[50px] w-full rounded-2xl border border-border-soft bg-white px-4 text-base font-bold text-navy outline-none focus:border-gold"
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </label>
          </div>
          <ReviewTextarea
            name="launch_asset_built"
            label="What launch asset did you build?"
            placeholder="Offer, curriculum, workshop outline, landing page, WhatsApp script..."
            defaultValue={review?.launch_asset_built}
          />
          <ReviewTextarea
            name="self_learning"
            label="What did you learn about yourself?"
            placeholder="আপনার mindset, discipline, communication, fear, clarity..."
            defaultValue={review?.self_learning}
          />
          <ReviewTextarea
            name="next_week_focus"
            label="Next week’s focus"
            placeholder="Next week কোন one thing-এ focus করবেন?"
            defaultValue={review?.next_week_focus}
          />
          <ReviewTextarea
            name="support_needed"
            label="Support needed from RBA"
            placeholder="Coach support, content feedback, offer clarity, accountability..."
            defaultValue={review?.support_needed}
            required={false}
          />
        </div>

        {state.message ? (
          <div
            className={cn(
              "mt-5 rounded-2xl px-4 py-3 text-sm font-bold",
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
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-navy px-5 py-3.5 text-base font-black text-white shadow-lg shadow-navy/15 transition hover:bg-navy/95 disabled:opacity-70 sm:w-auto"
        >
          {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
          {review ? "Update Weekly Review" : "Submit Weekly Review"}
        </button>
      </PremiumCard>
      {state.status === "success" ? <SuccessToast message={state.message} /> : null}
    </form>
  );
}

function ReviewTextarea({
  name,
  label,
  placeholder,
  defaultValue,
  required = true
}: {
  name: string;
  label: string;
  placeholder: string;
  defaultValue?: string | null;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-navy">{label}</span>
      <textarea
        name={name}
        required={required}
        rows={3}
        maxLength={1200}
        placeholder={placeholder}
        defaultValue={defaultValue || ""}
        className="mt-2 w-full resize-none rounded-2xl border border-border-soft bg-white px-4 py-3 text-base text-navy outline-none transition placeholder:text-brown/45 focus:border-gold"
      />
    </label>
  );
}

function ReviewInput({
  name,
  label,
  defaultValue,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-navy">{label}</span>
      <input
        name={name}
        defaultValue={defaultValue}
        className="mt-2 h-[50px] w-full rounded-2xl border border-border-soft bg-white px-4 text-base font-bold text-navy outline-none focus:border-gold"
        {...props}
      />
    </label>
  );
}
