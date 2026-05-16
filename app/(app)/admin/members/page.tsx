import { Search } from "lucide-react";
import { updateMemberAdmin } from "@/app/actions/admin";
import { createClient } from "@/lib/supabase/server";
import { diamondStages, type Profile } from "@/lib/types";
import { PremiumCard } from "@/components/ui/premium-card";
import { StageBadge } from "@/components/ui/stage-badge";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

type AdminMembersPageProps = {
  searchParams?: Promise<{
    q?: string;
  }>;
};

export default async function AdminMembersPage({ searchParams }: AdminMembersPageProps) {
  const params = searchParams ? await searchParams : {};
  const q = (params.q || "").trim();
  const safeQuery = q.replaceAll("%", "").replaceAll(",", " ").replaceAll("*", " ");
  const supabase = await createClient();
  let query = supabase.from("profiles").select("*").order("joined_at", { ascending: false });

  if (q) {
    query = query.or(`full_name.ilike.%${safeQuery}%,email.ilike.%${safeQuery}%,phone.ilike.%${safeQuery}%`);
  }

  const { data: members } = await query;
  const typedMembers = (members || []) as Profile[];

  return (
    <div className="space-y-5">
      <AdminPageHeader
        title="Members"
        description="Search Diamond Members, assign journey stage, and manage active status."
      />

      <PremiumCard>
        <form className="flex gap-3">
          <div className="flex min-h-14 flex-1 items-center gap-3 rounded-2xl border border-border-soft bg-white px-4 py-3 shadow-sm focus-within:border-gold focus-within:shadow-md">
            <Search className="h-5 w-5 text-brown" />
            <input
              name="q"
              defaultValue={q}
              placeholder="Search name, email, or phone"
              className="min-w-0 flex-1 bg-transparent text-base text-navy outline-none placeholder:text-brown/45"
            />
          </div>
          <button className="tap-target rounded-2xl bg-navy px-5 py-3 text-sm font-black text-white shadow-lg shadow-navy/10">Search</button>
        </form>
      </PremiumCard>

      <div className="space-y-3">
        {typedMembers.map((member) => (
          <PremiumCard key={member.id}>
            <form action={updateMemberAdmin} className="grid gap-4 xl:grid-cols-[1fr_240px_170px_auto] xl:items-center">
              <input type="hidden" name="member_id" value={member.id} />
              <div className="min-w-0">
                <p className="truncate text-lg font-black text-navy">{member.full_name || "Diamond Member"}</p>
                <p className="mt-1 truncate text-sm font-bold text-brown">{member.email}</p>
                <div className="mt-3">
                  <StageBadge stage={member.current_stage} />
                </div>
              </div>
              <label>
                <span className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-brown">Stage</span>
                <select
                  name="current_stage"
                  defaultValue={member.current_stage}
                  className="h-[52px] w-full rounded-2xl border border-border-soft bg-white px-3 text-sm font-bold text-navy shadow-sm outline-none focus:border-gold"
                >
                  {diamondStages.map((stage) => (
                    <option key={stage} value={stage}>
                      {stage}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex min-h-[52px] items-center gap-3 rounded-2xl border border-border-soft bg-white/66 px-4 py-3">
                <input
                  type="checkbox"
                  name="is_active"
                  defaultChecked={member.is_active}
                  className="h-5 w-5 accent-[#C4933A]"
                />
                <span className="text-sm font-black text-navy">Active</span>
              </label>
              <button className="tap-target rounded-2xl bg-navy px-5 py-3 text-sm font-black text-white shadow-lg shadow-navy/10">
                Save
              </button>
            </form>
          </PremiumCard>
        ))}
        {!typedMembers.length ? (
          <PremiumCard>
            <p className="text-sm font-bold text-brown">No members found.</p>
          </PremiumCard>
        ) : null}
      </div>
    </div>
  );
}
