"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { PremiumCard } from "@/components/ui/premium-card";

export default function AppError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-md">
      <PremiumCard className="text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-warning/10 text-warning">
          <AlertTriangle className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-black text-navy">Could not load this page</h1>
        <p className="mt-2 text-sm leading-6 text-brown">
          Please check your connection and try again.
          {error.digest ? ` Reference: ${error.digest}` : ""}
        </p>
        <button
          onClick={reset}
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-2xl bg-navy px-5 py-3 text-sm font-black text-white"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>
      </PremiumCard>
    </div>
  );
}
