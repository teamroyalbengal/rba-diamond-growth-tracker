import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type AdminPageHeaderProps = {
  title: string;
  description: string;
};

export function AdminPageHeader({ title, description }: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-sm font-black uppercase tracking-[0.16em] text-gold-dark">Admin Panel</p>
        <h1 className="mt-2 text-3xl font-black text-navy">{title}</h1>
        <p className="mt-2 max-w-2xl text-base leading-7 text-brown">{description}</p>
      </div>
      <Link
        href="/admin"
        className="tap-target inline-flex items-center justify-center gap-2 rounded-2xl border border-border-soft bg-white px-4 py-3 text-sm font-black text-navy shadow-sm transition hover:border-gold/35"
      >
        <ArrowLeft className="h-4 w-4" />
        Admin Home
      </Link>
    </div>
  );
}
