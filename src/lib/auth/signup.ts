"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

async function handleProfilePictureUpload(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  profilePicture: File
) {
  const fileExt = profilePicture.name.split(".").pop();
  const fileName = `${userId}/profile.${fileExt}`;
  const { error: uploadError } = await supabase.storage.from("profile-pictures").upload(fileName, profilePicture);

  if (uploadError) {
    console.error("Upload error:", uploadError);
    return null;
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("profile-pictures").getPublicUrl(fileName);

  if (!publicUrl) {
    console.error("Failed to get public URL");
    return null;
  }

  return publicUrl;
}

async function createUserProfile(
  supabase: Awaited<ReturnType<typeof createClient>>,
  username: string,
  mobile: string,
  profilePictureUrl?: string | null
) {
  const { error: insertError } = await supabase.from("profile").insert([
    {
      user_name: username,
      phone_no: mobile,
      profile_picture: profilePictureUrl || null,
    },
  ]);

  if (insertError) {
    console.error("Insert profile error:", insertError);
    return false;
  }

  return true;
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const username = formData.get("username") as string;
  const mobile = formData.get("mobile") as string;
  const profilePicture = formData.get("profile_picture") as File;

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: username,
        phone: mobile,
      },
    },
  });

  if (authError) {
    return { error: authError.message };
  }

  if (!authData.user) {
    return { error: "Failed to create user" };
  }

  let profilePictureUrl = null;

  if (profilePicture && profilePicture.size > 0) {
    profilePictureUrl = await handleProfilePictureUpload(supabase, authData.user.id, profilePicture);

    if (profilePictureUrl) {
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          profile_picture_url: profilePictureUrl,
        },
      });

      if (updateError) {
        console.error("Update user error:", updateError);
      }
    }
  }

  const profileCreated = await createUserProfile(supabase, username, mobile, profilePictureUrl);

  if (!profileCreated) {
    return { error: "Failed to create user profile" };
  }

  revalidatePath("/", "layout");
  return { success: true };
}
