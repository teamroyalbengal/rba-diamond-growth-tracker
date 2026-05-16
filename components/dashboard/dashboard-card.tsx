import type { ElementType } from "react";
import { PremiumCard } from "@/components/ui/premium-card";
import { cn } from "@/lib/utils";

type DashboardCardProps = {
  label: string;
  value: string;
  description: string;
  icon: ElementType;
  tone?: "gold" | "green" | "navy" | "amber";
};

const toneClasses = {
  gold: "bg-gold/10 text-gold-dark",
  green: "bg-success/10 text-success",
  navy: "bg-navy/10 text-navy",
  amber: "bg-warning/10 text-warning"
};

export function DashboardCard({
  label,
  value,
  description,
  icon: Icon,
  tone = "gold"
}: DashboardCardProps) {
  return (
    <PremiumCard className="relative overflow-hidden">
      <div className="pointer-events-none absolute right-0 top-0 h-20 w-20 rounded-bl-[40px] bg-gold/5" />
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-black text-brown">{label}</p>
          <h2 className="mt-2 truncate text-2xl font-black text-navy">{value}</h2>
        </div>
        <div className={cn("relative rounded-2xl p-3 shadow-sm", toneClasses[tone])}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-brown">{description}</p>
    </PremiumCard>
  );
}
