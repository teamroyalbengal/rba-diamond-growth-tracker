import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getLeaderboard, normalizeLeaderboardPeriod } from "@/lib/leaderboard";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if ((profile as { role?: string } | null)?.role !== "admin") {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const period = normalizeLeaderboardPeriod(request.nextUrl.searchParams.get("period") || undefined);
  const { members } = await getLeaderboard(supabase, period, 5000);
  const rows = [
    ["rank", "member_name", "stage", "points", "streak"],
    ...members.map((member) => [
      String(member.rank),
      member.full_name || "Diamond Member",
      member.current_stage,
      String(member.points),
      String(member.streak)
    ])
  ];
  const csv = rows.map((row) => row.map(escapeCsv).join(",")).join("\n");

  return new NextResponse(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="rba-${period}-leaderboard.csv"`
    }
  });
}

function escapeCsv(value: string) {
  if (/[",\n]/.test(value)) {
    return `"${value.replaceAll('"', '""')}"`;
  }

  return value;
}
