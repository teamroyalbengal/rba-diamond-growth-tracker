import { LoadingState } from "@/components/ui/loading-state";

export default function RootLoading() {
  return (
    <main className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-md">
        <LoadingState label="Preparing your Diamond workspace..." />
      </div>
    </main>
  );
}
