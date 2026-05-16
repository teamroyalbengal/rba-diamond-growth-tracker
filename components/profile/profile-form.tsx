"use client";

import { useActionState } from "react";
import { Camera, CheckCircle2, Loader2, MapPin, Phone, UserRound } from "lucide-react";
import { updateProfile, type ProfileActionState } from "@/app/actions/profile";
import type { Profile } from "@/lib/types";

type ProfileFormProps = {
  profile: Profile;
};

const initialState: ProfileActionState = {
  status: "idle",
  message: ""
};

export function ProfileForm({ profile }: ProfileFormProps) {
  const [state, action, isPending] = useActionState(updateProfile, initialState);

  return (
    <form action={action} className="space-y-4">
      <ProfileField
        icon={UserRound}
        label="Full name"
        name="full_name"
        defaultValue={profile.full_name || ""}
        placeholder="Dipannita Das"
        required
      />
      <ProfileField
        icon={MapPin}
        label="City"
        name="city"
        defaultValue={profile.city || ""}
        placeholder="Kolkata"
      />
      <ProfileField
        icon={Phone}
        label="Phone"
        name="phone"
        defaultValue={profile.phone || ""}
        placeholder="Phone number"
      />
      <ProfileField
        icon={Camera}
        label="Profile picture link"
        name="avatar_url"
        defaultValue={profile.avatar_url || ""}
        placeholder="https://example.com/photo.jpg"
      />

      {state.message ? (
        <p
          className={`rounded-2xl px-4 py-3 text-sm font-bold ${
            state.status === "success"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {state.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-navy px-5 py-3.5 text-base font-black text-white shadow-lg shadow-navy/15 transition hover:bg-navy/95 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
      >
        {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle2 className="h-5 w-5" />}
        Save Profile
      </button>
    </form>
  );
}

function ProfileField({
  icon: Icon,
  label,
  name,
  defaultValue,
  placeholder,
  required = false
}: {
  icon: typeof UserRound;
  label: string;
  name: string;
  defaultValue: string;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-2 text-sm font-black text-navy">
        <Icon className="h-4 w-4 text-gold-dark" />
        {label}
      </span>
      <input
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-2xl border border-border-soft bg-background/70 px-4 py-3 text-sm font-bold text-navy outline-none transition focus:border-gold focus:bg-white"
      />
    </label>
  );
}
