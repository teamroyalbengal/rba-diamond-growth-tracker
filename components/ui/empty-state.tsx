import { CircleDashed } from "lucide-react";

export function EmptyState({
  title,
  description
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[22px] border border-dashed border-border-soft bg-white/70 p-6 text-center">
      <CircleDashed className="mx-auto mb-3 h-8 w-8 text-gold-dark" />
      <h3 className="text-base font-semibold text-navy">{title}</h3>
      <p className="mt-1 text-sm leading-6 text-brown">{description}</p>
    </div>
  );
}
