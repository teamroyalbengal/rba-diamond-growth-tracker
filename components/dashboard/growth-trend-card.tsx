import { TrendingUp } from "lucide-react";
import type { GrowthTrendDay } from "@/lib/dashboard";
import { dailyTargetPoints } from "@/lib/types";
import { PremiumCard } from "@/components/ui/premium-card";

type GrowthTrendCardProps = {
  trend: GrowthTrendDay[];
  average: number;
  bestDay: number;
  missedDays: number;
  insight: string;
};

export function GrowthTrendCard({
  trend,
  average,
  bestDay,
  missedDays,
  insight
}: GrowthTrendCardProps) {
  const chartWidth = 640;
  const chartHeight = 190;
  const padding = 22;
  const todayScore = trend[trend.length - 1]?.totalPoints || 0;
  const points = trend.map((day, index) => {
    const x = padding + (index * (chartWidth - padding * 2)) / Math.max(trend.length - 1, 1);
    const percent = Math.min(day.totalPoints / dailyTargetPoints, 1);
    const y = chartHeight - padding - percent * (chartHeight - padding * 2);
    return { ...day, x, y };
  });
  const path = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
  const areaPath = `${path} L ${chartWidth - padding} ${chartHeight - padding} L ${padding} ${chartHeight - padding} Z`;
  const averageY = chartHeight - padding - (average / dailyTargetPoints) * (chartHeight - padding * 2);

  return (
    <PremiumCard className="overflow-hidden">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-gold/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.12em] text-gold-dark">
            <TrendingUp className="h-3.5 w-3.5" />
            Last 7 Days Growth Pattern
          </div>
          <h2 className="mt-3 text-2xl font-black text-navy">Momentum Graph</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-brown">{insight}</p>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center sm:min-w-[260px]">
          <MiniStat label="Today" value={`${todayScore}/80`} />
          <MiniStat label="7-Day Avg" value={`${average}/80`} />
          <MiniStat label="Best Day" value={`${bestDay}/80`} />
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-[24px] border border-border-soft bg-white/70 p-2.5 sm:p-3">
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="h-48 w-full sm:h-56" role="img" aria-label="Last 7 days growth graph">
          <defs>
            <linearGradient id="growthArea" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#C4933A" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#C4933A" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          {[0, 20, 40, 60, 80].map((value) => {
            const y = chartHeight - padding - (value / dailyTargetPoints) * (chartHeight - padding * 2);
            return (
              <g key={value}>
                <line x1={padding} x2={chartWidth - padding} y1={y} y2={y} stroke="#EADCC5" strokeDasharray="4 7" />
                <text x={0} y={y + 4} className="fill-brown text-[11px] font-bold">
                  {value}
                </text>
              </g>
            );
          })}
          <path d={areaPath} fill="url(#growthArea)" />
          <line
            x1={padding}
            x2={chartWidth - padding}
            y1={averageY}
            y2={averageY}
            stroke="#0F766E"
            strokeDasharray="8 8"
            strokeOpacity="0.38"
          />
          <path d={path} fill="none" stroke="#C4933A" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5" />
          {points.map((point) => (
            <g key={point.dateKey}>
              <circle
                cx={point.x}
                cy={point.y}
                r="7"
                className={point.totalPoints >= 60 ? "fill-success" : point.totalPoints === 0 ? "fill-warning" : "fill-gold"}
                stroke="#fff"
                strokeWidth="4"
              />
              <text x={point.x} y={chartHeight - 4} textAnchor="middle" className="fill-brown text-[12px] font-black">
                {point.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-black text-brown">
        <span className="rounded-full bg-success/10 px-3 py-1.5 text-success">Average line</span>
        <span className="rounded-full bg-warning/10 px-3 py-1.5 text-warning">{missedDays} missed days</span>
      </div>
    </PremiumCard>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-20 rounded-2xl border border-border-soft bg-white px-3 py-2 shadow-sm">
      <p className="text-[10px] font-black uppercase tracking-[0.12em] text-brown">{label}</p>
      <p className="mt-1 text-base font-black text-navy">{value}</p>
    </div>
  );
}
