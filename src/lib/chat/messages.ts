import { createClient } from "../supabase/client";
import { MessageWithProfile } from "../../components/dashboard/ChatContainer";

export async function fetchMessages(chatId: string): Promise<MessageWithProfile[]> {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("messages")
      .select(
        `
        *,
        profile!inner(
          user_name,
          profile_picture,
          phone_no
        ),
        message_read_status(
          user_id,
          read_at
        )
      `
      )
      .eq("chat_id", chatId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
}

export async function sendMessage(chatId: string, content: string, senderId: string) {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("messages")
      .insert({
        chat_id: chatId,
        content,
        sender_id: senderId,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
}
