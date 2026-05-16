import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getDashboardData } from "@/lib/dashboard";
import type { Profile } from "@/lib/types";
import { MemberDashboard } from "@/components/dashboard/member-dashboard";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/login");
  const typedProfile = profile as Profile;
  const dashboardData = await getDashboardData(supabase, typedProfile);

  return <MemberDashboard profile={typedProfile} data={dashboardData} />;
}
