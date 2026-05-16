import { LogOut } from "lucide-react";
import { signOut } from "@/app/actions/auth";

export function LogoutButton() {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-border-soft bg-white px-4 py-3 text-sm font-bold text-navy transition hover:border-gold/50 hover:bg-gold/10 md:justify-start"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </button>
    </form>
  );
}
