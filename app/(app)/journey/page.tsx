import { CheckCircle2, Flag, Gem, LockKeyhole, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { diamondStages, stageSummaries } from "@/lib/types";
import type { Profile } from "@/lib/types";
import { PremiumCard } from "@/components/ui/premium-card";

export default async function JourneyPage() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single();

  const typedProfile = profile as Profile | null;
  const currentIndex = diamondStages.indexOf(typedProfile?.current_stage || "Starter");
  const progressPercent = Math.round(((currentIndex + 1) / diamondStages.length) * 100);

  return (
    <div className="space-y-5 md:space-y-6">
      <section className="rba-hero overflow-hidden rounded-[30px] p-5 text-white shadow-2xl shadow-navy/15 md:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-[#F8DFA7]">
              <Gem className="h-4 w-4" />
              Diamond Journey
            </div>
            <h1 className="mt-4 text-3xl font-black leading-tight sm:text-4xl">
              Your Royal Bengal growth roadmap
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-white/78">
              Current stage is admin-approved. Use this map to see where you are and what comes next.
            </p>
          </div>
          <div className="rounded-2xl border border-white/12 bg-white/10 p-4 backdrop-blur-sm">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#F8DFA7]">Journey Progress</p>
            <p className="mt-1 text-3xl font-black">{progressPercent}%</p>
          </div>
        </div>
      </section>

      <PremiumCard>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-black text-brown">Current Stage</p>
            <h2 className="mt-1 text-2xl font-black text-navy">
              {typedProfile?.current_stage || "Starter"}
            </h2>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-[#EFE1CA] sm:w-64">
            <div className="h-full rounded-full bg-gold" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      </PremiumCard>

      <div className="relative grid gap-4 lg:grid-cols-2">
        {diamondStages.map((stage, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <PremiumCard
              key={stage}
              className={isCurrent ? "border border-gold/40 bg-gold/10" : undefined}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`mt-0.5 rounded-2xl p-3 ring-1 ring-border-soft ${
                    isCurrent
                      ? "bg-gold text-white"
                      : isCompleted
                        ? "bg-success/10 text-success"
                        : "bg-white text-gold-dark"
                  }`}
                >
                  {isCompleted || isCurrent ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <LockKeyhole className="h-5 w-5" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-gold-dark">
                    {isCurrent ? "Current" : isCompleted ? "Completed" : "Locked"}
                  </p>
                  <h2 className="mt-1 text-xl font-black text-navy">{stage}</h2>
                  <p className="mt-2 text-sm leading-6 text-brown">{stageSummaries[stage]}</p>
                  {isCurrent ? (
                    <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-black text-gold-dark ring-1 ring-border-soft">
                      <Sparkles className="h-3.5 w-3.5" />
                      Focus stage
                    </div>
                  ) : null}
                  {index === currentIndex + 1 ? (
                    <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-navy px-3 py-1.5 text-xs font-black text-white">
                      <Flag className="h-3.5 w-3.5 text-gold" />
                      Next milestone
                    </div>
                  ) : null}
                </div>
              </div>
            </PremiumCard>
          );
        })}
      </div>
    </div>
  );
}
