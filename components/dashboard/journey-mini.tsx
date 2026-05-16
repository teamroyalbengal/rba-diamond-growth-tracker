import Link from "next/link";
import { ArrowRight, CheckCircle2, Circle, LockKeyhole } from "lucide-react";
import { diamondStages, stageSummaries } from "@/lib/types";
import type { Profile } from "@/lib/types";
import { PremiumCard } from "@/components/ui/premium-card";

type JourneyMiniProps = {
  profile: Profile;
  currentStageIndex: number;
};

export function JourneyMini({ profile, currentStageIndex }: JourneyMiniProps) {
  const nextStage = diamondStages[currentStageIndex + 1] || null;

  return (
    <PremiumCard>
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-brown">Diamond Journey</p>
          <h2 className="mt-1 text-xl font-black text-navy">Current Stage Map</h2>
        </div>
        <Link
          href="/journey"
          className="inline-flex items-center gap-1 text-sm font-black text-gold-dark"
        >
          Open
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="space-y-3">
        {diamondStages.map((stage, index) => {
          const isCompleted = index < currentStageIndex;
          const isCurrent = stage === profile.current_stage;

          return (
            <div key={stage} className="flex items-start gap-3">
              <div
                className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                  isCurrent
                    ? "bg-gold text-white"
                    : isCompleted
                      ? "bg-success/10 text-success"
                      : "bg-background text-brown"
                }`}
              >
                {isCurrent ? (
                  <Circle className="h-4 w-4 fill-current" />
                ) : isCompleted ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <LockKeyhole className="h-4 w-4" />
                )}
              </div>
              <div className="min-w-0 flex-1 border-b border-border-soft pb-3 last:border-b-0 last:pb-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-black text-navy">{stage}</p>
                  {isCurrent ? (
                    <span className="rounded-full bg-gold/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.1em] text-gold-dark">
                      Current
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 text-sm leading-6 text-brown">{stageSummaries[stage]}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 rounded-2xl bg-navy p-4 text-white">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#F8DFA7]">Next Milestone</p>
        <p className="mt-1 text-base font-black">{nextStage || "Leadership Ecosystem"}</p>
      </div>
    </PremiumCard>
  );
}
