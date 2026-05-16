import Link from "next/link";
import { Compass } from "lucide-react";
import { PremiumCard } from "@/components/ui/premium-card";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8">
      <PremiumCard className="max-w-md text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/10 text-gold-dark">
          <Compass className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-black text-navy">Page not found</h1>
        <p className="mt-2 text-sm leading-6 text-brown">
          This Diamond route is not available yet.
        </p>
        <Link
          href="/dashboard"
          className="mt-5 inline-flex items-center justify-center rounded-2xl bg-navy px-5 py-3 text-sm font-black text-white"
        >
          Back to Dashboard
        </Link>
      </PremiumCard>
    </main>
  );
}
