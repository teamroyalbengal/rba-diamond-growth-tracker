import type { ElementType } from "react";
import { PremiumCard } from "@/components/ui/premium-card";

type AdminStatsCardProps = {
  label: string;
  value: string | number;
  description: string;
  icon: ElementType;
};

export function AdminStatsCard({ label, value, description, icon: Icon }: AdminStatsCardProps) {
  return (
    <PremiumCard className="relative overflow-hidden">
      <div className="pointer-events-none absolute right-0 top-0 h-20 w-20 rounded-bl-[40px] bg-gold/5" />
      <div className="flex items-start justify-between gap-4">
        <div className="relative">
          <p className="text-sm font-black text-brown">{label}</p>
          <h2 className="mt-2 text-4xl font-black tracking-tight text-navy">{value}</h2>
          <p className="mt-2 text-sm leading-6 text-brown">{description}</p>
        </div>
        <div className="relative rounded-2xl bg-gold/10 p-3 text-gold-dark shadow-sm">
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </PremiumCard>
  );
}
