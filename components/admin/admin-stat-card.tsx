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
    <PremiumCard>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-brown">{label}</p>
          <h2 className="mt-2 text-3xl font-black text-navy">{value}</h2>
          <p className="mt-2 text-sm leading-6 text-brown">{description}</p>
        </div>
        <div className="rounded-2xl bg-gold/10 p-3 text-gold-dark">
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </PremiumCard>
  );
}
