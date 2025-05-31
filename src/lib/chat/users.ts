import { createClient } from "../supabase/client";
import { Profile } from "../../app/types/database";

export async function searchUsers(query: string, currentUserId: string): Promise<Profile[]> {
  if (!query.trim()) {
    return [];
  }

  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("profile")
      .select("*")
      .neq("id", currentUserId)
      .or(`user_name.ilike.%${query}%,phone_no.ilike.%${query}%`)
      .limit(10);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error searching users:", error);
    throw error;
  }
}
