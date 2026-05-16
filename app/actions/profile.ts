"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

export type ProfileActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

const optionalUrl = z
  .string()
  .trim()
  .max(500, "Profile picture link must be shorter.")
  .optional()
  .transform((value) => value || null)
  .refine((value) => {
    if (!value) return true;
    try {
      const url = new URL(value);
      return url.protocol === "https:";
    } catch {
      return false;
    }
  }, "Use a valid https image link.");

const profileSchema = z.object({
  full_name: z.string().trim().min(2, "Please add your full name.").max(80),
  phone: z.string().trim().max(30, "Phone must be shorter.").optional(),
  city: z.string().trim().max(80, "City must be shorter.").optional(),
  avatar_url: optionalUrl
});

export async function updateProfile(
  _previousState: ProfileActionState,
  formData: FormData
): Promise<ProfileActionState> {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      status: "error",
      message: "Please login again to update your profile."
    };
  }

  const parsed = profileSchema.safeParse({
    full_name: formData.get("full_name"),
    phone: formData.get("phone"),
    city: formData.get("city"),
    avatar_url: formData.get("avatar_url")
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message || "Please check your profile details."
    };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: parsed.data.full_name,
      phone: parsed.data.phone || null,
      city: parsed.data.city || null,
      avatar_url: parsed.data.avatar_url
    })
    .eq("id", user.id);

  if (error) {
    return {
      status: "error",
      message: error.message
    };
  }

  revalidatePath("/profile");
  revalidatePath("/dashboard");
  revalidatePath("/leaderboard");

  return {
    status: "success",
    message: "Profile updated."
  };
}
