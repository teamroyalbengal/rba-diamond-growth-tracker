import { Suspense } from "react";
import { CheckCircle2, Gem, ShieldCheck, TrendingUp } from "lucide-react";
import { LoginForm } from "@/components/auth/login-form";
import { PremiumCard } from "@/components/ui/premium-card";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8 md:px-8">
      <div className="grid w-full max-w-6xl gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <section className="rba-hero overflow-hidden rounded-[32px] p-6 text-white shadow-2xl shadow-navy/15 sm:p-8 lg:min-h-[620px]">
          <div className="flex h-full flex-col justify-between gap-10">
            <div>
              <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-white/10 text-gold shadow-xl shadow-black/10 ring-1 ring-white/10">
                <Gem className="h-8 w-8" />
              </div>
              <p className="mt-6 text-sm font-black uppercase tracking-[0.22em] text-[#F8DFA7]">
                Royal Bengal Academy
              </p>
              <h1 className="mt-4 max-w-xl text-4xl font-black leading-tight sm:text-5xl">
                Diamond Member Growth Operating System
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-white/78">
                Habit, reflection, journey stage, and accountability in one premium member dashboard.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {["Daily growth", "Journey clarity", "Admin review"].map((item) => (
                <div key={item} className="rounded-2xl border border-white/12 bg-white/10 p-4 backdrop-blur-sm">
                  <CheckCircle2 className="mb-3 h-5 w-5 text-gold" />
                  <p className="text-sm font-black text-white">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-md">
          <div className="mb-7 text-center lg:text-left">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[22px] bg-navy text-gold shadow-xl shadow-navy/15 lg:mx-0">
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
        </section>
      </div>
    </main>
  );
}
