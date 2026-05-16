import { CheckCircle2, LockKeyhole } from "lucide-react";
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

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-3xl font-black text-navy">Your Diamond Journey</h1>
        <p className="mt-2 text-base leading-7 text-brown">
          Stage automation comes later. For MVP, admin assigns the current stage.
        </p>
      </div>
      <div className="space-y-3">
        {diamondStages.map((stage, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <PremiumCard
              key={stage}
              className={isCurrent ? "border border-gold/40 bg-gold/10" : undefined}
            >
              <div className="flex items-start gap-4">
                <div className="mt-0.5 rounded-2xl bg-white p-3 text-gold-dark ring-1 ring-border-soft">
                  {isCompleted || isCurrent ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <LockKeyhole className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-gold-dark">
                    {isCurrent ? "Current" : isCompleted ? "Completed" : "Locked"}
                  </p>
                  <h2 className="mt-1 text-xl font-black text-navy">{stage}</h2>
                  <p className="mt-2 text-sm leading-6 text-brown">{stageSummaries[stage]}</p>
                </div>
              </div>
            </PremiumCard>
          );
        })}
      </div>
    </div>
  );
}
