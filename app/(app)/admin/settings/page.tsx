import { habits } from "@/lib/habits";
import { PremiumCard } from "@/components/ui/premium-card";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-5">
      <AdminPageHeader
        title="Settings"
        description="Habit names and points are hardcoded for MVP, with this structure ready for future editing."
      />

      <PremiumCard>
        <p className="text-sm font-bold text-brown">Daily Habit Scoring</p>
        <h1 className="mt-1 text-2xl font-black text-navy">50-point Diamond ritual</h1>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {habits.map((habit) => {
            const Icon = habit.icon;

            return (
              <div key={habit.key} className="flex items-start gap-3 rounded-2xl border border-border-soft bg-white/66 p-4">
                <div className="rounded-2xl bg-gold/10 p-3 text-gold-dark">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-black text-navy">{habit.name}</p>
                  <p className="mt-1 text-sm leading-6 text-brown">{habit.description}</p>
                  <p className="mt-2 text-xs font-black uppercase tracking-[0.12em] text-gold-dark">
                    {habit.category} · {habit.points} points
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </PremiumCard>
    </div>
  );
}
