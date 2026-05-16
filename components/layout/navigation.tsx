import Link from "next/link";
import {
  BarChart3,
  ClipboardCheck,
  Gem,
  Home,
  Map,
  MessageSquareText,
  Trophy,
  UserRound
} from "lucide-react";
import { cn, getInitials } from "@/lib/utils";
import type { Profile } from "@/lib/types";
import { LogoutButton } from "@/components/layout/logout-button";

const memberNav = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/check-in", label: "Check-in", icon: ClipboardCheck },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/journey", label: "Journey", icon: Map },
  { href: "/weekly-review", label: "Review", icon: MessageSquareText }
];

type NavigationProps = {
  profile: Profile;
};

export function DesktopSidebar({ profile }: NavigationProps) {
  return (
    <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-border-soft bg-white/70 px-5 py-6 backdrop-blur-xl md:block">
      <div className="flex h-full flex-col">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-navy text-gold">
            <Gem className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-gold-dark">RBA</p>
            <p className="text-base font-black text-navy">Diamond Tracker</p>
          </div>
        </Link>

        <nav className="mt-8 space-y-2">
          {memberNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-brown transition hover:bg-gold/10 hover:text-navy"
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto space-y-4">
          <Link
            href="/profile"
            className="flex items-center gap-3 rounded-2xl border border-border-soft bg-background/70 p-3"
          >
            {profile.avatar_url ? (
              <div
                className="h-10 w-10 shrink-0 rounded-full bg-cover bg-center ring-1 ring-border-soft"
                style={{ backgroundImage: `url(${profile.avatar_url})` }}
              />
            ) : (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-black text-gold">
                {getInitials(profile.full_name, profile.email)}
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-navy">
                {profile.full_name || "Diamond Member"}
              </p>
              <p className="truncate text-xs font-medium text-brown">{profile.email}</p>
            </div>
          </Link>
          <LogoutButton />
        </div>
      </div>
    </aside>
  );
}

export function BottomNavigation() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border-soft bg-white/90 px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 backdrop-blur-xl md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
        {memberNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl px-1 text-[11px] font-bold text-brown transition hover:bg-gold/10 hover:text-navy"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className="max-w-full truncate">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}

export function MobileTopBar({ profile }: NavigationProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-border-soft bg-background/88 px-4 py-3 backdrop-blur-xl md:hidden">
      <div className="mx-auto flex max-w-md items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-[16px] bg-navy text-gold">
            <Gem className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-gold-dark">RBA</p>
            <p className="text-sm font-black text-navy">Diamond Tracker</p>
          </div>
        </Link>
        <Link
          href="/profile"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-black text-navy shadow-sm ring-1 ring-border-soft"
        >
          {profile.avatar_url ? (
            <span
              className="h-full w-full rounded-full bg-cover bg-center"
              style={{ backgroundImage: `url(${profile.avatar_url})` }}
            />
          ) : (
            getInitials(profile.full_name, profile.email)
          )}
        </Link>
      </div>
    </header>
  );
}

export function AdminQuickLink({ role }: { role: Profile["role"] }) {
  if (role !== "admin") return null;

  return (
    <Link
      href="/admin"
      className="inline-flex items-center gap-2 rounded-2xl border border-gold/25 bg-gold/10 px-4 py-3 text-sm font-bold text-brown"
    >
      <BarChart3 className="h-4 w-4" />
      Admin Panel
    </Link>
  );
}
