"use client";

import type { FormEvent } from "react";
import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2, LockKeyhole, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");

    startTransition(async () => {
      try {
        const supabase = createClient();
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (signInError) {
          setError(signInError.message);
          return;
        }

        router.replace(searchParams.get("next") || "/dashboard");
        router.refresh();
      } catch {
        setError("Supabase is not configured yet. Add your project URL and anon key.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-navy">Email</span>
        <span className="flex items-center gap-3 rounded-2xl border border-border-soft bg-white px-4 py-3 focus-within:border-gold">
          <Mail className="h-5 w-5 text-brown" />
          <input
            required
            name="email"
            type="email"
            autoComplete="email"
            placeholder="member@royalbengalacademy.com"
            className="min-w-0 flex-1 bg-transparent text-base text-navy outline-none placeholder:text-brown/45"
          />
        </span>
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-navy">Password</span>
        <span className="flex items-center gap-3 rounded-2xl border border-border-soft bg-white px-4 py-3 focus-within:border-gold">
          <LockKeyhole className="h-5 w-5 text-brown" />
          <input
            required
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Enter password"
            className="min-w-0 flex-1 bg-transparent text-base text-navy outline-none placeholder:text-brown/45"
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="rounded-full p-1.5 text-brown transition hover:bg-gold/10"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </span>
      </label>

      {error ? (
        <div className="rounded-2xl border border-warning/25 bg-warning/10 px-4 py-3 text-sm font-medium text-brown">
          {error}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-navy px-5 py-3.5 text-base font-bold text-white shadow-lg shadow-navy/15 transition hover:bg-navy/95 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
        Login to Diamond Tracker
      </button>
    </form>
  );
}
