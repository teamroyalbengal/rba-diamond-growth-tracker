import { Suspense } from "react";
import { Gem, ShieldCheck, TrendingUp } from "lucide-react";
import { LoginForm } from "@/components/auth/login-form";
import { PremiumCard } from "@/components/ui/premium-card";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="mb-7 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[22px] bg-navy text-gold shadow-xl shadow-navy/15">
            <Gem className="h-8 w-8" />
          </div>
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-gold-dark">
            Royal Bengal Academy
          </p>
          <h1 className="mt-3 text-3xl font-black leading-tight text-navy">
            RBA Diamond Growth Tracker
          </h1>
          <p className="mt-3 text-base leading-7 text-brown">
            Diamond is not only learning. Diamond is trackable growth.
          </p>
        </div>

        <PremiumCard className="p-5 sm:p-6">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-navy">Welcome back</h2>
            <p className="mt-1 text-sm leading-6 text-brown">
              আজকের action track করুন, journey এগিয়ে নিন।
            </p>
          </div>
          <Suspense>
            <LoginForm />
          </Suspense>
        </PremiumCard>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-border-soft bg-white/65 p-4">
            <ShieldCheck className="mb-2 h-5 w-5 text-success" />
            <p className="text-sm font-semibold text-navy">Secure member login</p>
          </div>
          <div className="rounded-2xl border border-border-soft bg-white/65 p-4">
            <TrendingUp className="mb-2 h-5 w-5 text-gold-dark" />
            <p className="text-sm font-semibold text-navy">Growth-first system</p>
          </div>
        </div>
      </div>
    </main>
  );
}
