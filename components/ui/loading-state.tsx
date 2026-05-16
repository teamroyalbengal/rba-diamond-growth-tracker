export function LoadingState({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex min-h-40 items-center justify-center rounded-[22px] border border-border-soft bg-white/70 p-6 text-sm font-medium text-brown">
      {label}
    </div>
  );
}
