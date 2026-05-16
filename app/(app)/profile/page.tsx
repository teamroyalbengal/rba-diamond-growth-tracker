import type { ElementType } from "react";
import { redirect } from "next/navigation";
import { Mail, MapPin, Phone, Shield, UserRound } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";
import { getInitials } from "@/lib/utils";
import { PremiumCard } from "@/components/ui/premium-card";
import { StageBadge } from "@/components/ui/stage-badge";
import { LogoutButton } from "@/components/layout/logout-button";
import { ProfileForm } from "@/components/profile/profile-form";

export default async function ProfilePage() {
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

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <PremiumCard>
        <div className="flex items-center gap-4">
          {typedProfile.avatar_url ? (
            <div
              className="h-20 w-20 shrink-0 rounded-[26px] bg-cover bg-center shadow-sm ring-1 ring-border-soft"
              style={{ backgroundImage: `url(${typedProfile.avatar_url})` }}
            />
          ) : (
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[26px] bg-navy text-2xl font-black text-gold">
              {getInitials(typedProfile.full_name, typedProfile.email)}
            </div>
          )}
          <div className="min-w-0">
            <h1 className="truncate text-3xl font-black text-navy">
              {typedProfile.full_name || "Diamond Member"}
            </h1>
            <div className="mt-2">
              <StageBadge stage={typedProfile.current_stage} />
            </div>
          </div>
        </div>
      </PremiumCard>

      <PremiumCard>
        <h2 className="mb-4 text-xl font-black text-navy">Profile Details</h2>
        <div className="space-y-3">
          <ProfileRow icon={Mail} label="Email" value={typedProfile.email || "Not added"} />
          <ProfileRow icon={MapPin} label="City" value={typedProfile.city || "Not added"} />
          <ProfileRow icon={Phone} label="Phone" value={typedProfile.phone || "Not added"} />
          <ProfileRow icon={Shield} label="Role" value={typedProfile.role} />
          <ProfileRow icon={UserRound} label="Status" value={typedProfile.is_active ? "Active" : "Inactive"} />
        </div>
      </PremiumCard>

      <PremiumCard>
        <h2 className="mb-4 text-xl font-black text-navy">Edit Profile</h2>
        <ProfileForm profile={typedProfile} />
      </PremiumCard>

      <LogoutButton />
    </div>
  );
}

function ProfileRow({
  icon: Icon,
  label,
  value
}: {
  icon: ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border-soft bg-background/60 p-4">
      <Icon className="h-5 w-5 text-gold-dark" />
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-brown">{label}</p>
        <p className="mt-1 text-sm font-bold text-navy">{value}</p>
      </div>
    </div>
  );
}
