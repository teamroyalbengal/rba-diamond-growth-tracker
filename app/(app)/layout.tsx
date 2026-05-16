import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";
import {
  BottomNavigation,
  DesktopSidebar,
  MobileTopBar
} from "@/components/layout/navigation";

export default async function ProtectedAppLayout({
  children
}: {
  children: ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen pb-24 md:pb-0">
      <DesktopSidebar profile={profile as Profile} />
      <MobileTopBar profile={profile as Profile} />
      <main className="mx-auto w-full max-w-7xl px-4 py-5 md:ml-72 md:px-8 md:py-8">
        {children}
      </main>
      <BottomNavigation />
    </div>
  );
}
