import { createClient } from "../supabase/client";
import { ChatWithDetails } from "../../components/dashboard/ChatList";

export async function fetchChats(currentUserId: string): Promise<ChatWithDetails[]> {
  const supabase = createClient();

  try {
    // Get all chat IDs where user is a member
    const { data: userChatMembers, error: chatsError } = await supabase
      .from("chat_members")
      .select("chat_id")
      .eq("user_id", currentUserId);

    if (chatsError) throw chatsError;

    if (!userChatMembers || userChatMembers.length === 0) {
      return [];
    }

    // Get chat details for all chat IDs
    const chatIds = userChatMembers.map((member) => member.chat_id);
    const { data: chatsData, error: chatDetailsError } = await supabase.from("chats").select("*").in("id", chatIds);

    if (chatDetailsError) throw chatDetailsError;

    const chatDetails = await Promise.all(
      (chatsData || []).map(async (chat) => {
        // Get all participants with phone_no - using left join to see missing profiles
        const { data: participants } = await supabase
          .from("chat_members")
          .select(
            `
            user_id,
            profile(
              id,
              user_name,
              profile_picture,
              phone_no
            )
          `
          )
          .eq("chat_id", chat.id);

        // Get last message - handle case where no messages exist
        const { data: lastMessageData } = await supabase
          .from("messages")
          .select("id, content, created_at, sender_id")
          .eq("chat_id", chat.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        let lastMessage = null;
        if (lastMessageData) {
          // Get the sender's profile
          const { data: senderProfile } = await supabase
            .from("profile")
            .select("user_name")
            .eq("id", lastMessageData.sender_id)
            .single();

          // Check if the last message has been read by others (only relevant if current user sent it)
          let isReadByOthers = false;
          if (lastMessageData.sender_id === currentUserId) {
            const { data: readStatus } = await supabase
              .from("message_read_status")
              .select("user_id")
              .eq("message_id", lastMessageData.id)
              .neq("user_id", currentUserId)
              .limit(1);

            isReadByOthers = Boolean(readStatus && readStatus.length > 0);
          }

          lastMessage = {
            id: lastMessageData.id,
            content: lastMessageData.content,
            created_at: lastMessageData.created_at,
            sender_name: senderProfile?.user_name || "Unknown",
            sender_id: lastMessageData.sender_id,
            is_read_by_others: isReadByOthers,
          };
        }

        // Calculate real unread count
        // get all messages in this chat not sent by current user
        const { data: allMessages } = await supabase
          .from("messages")
          .select("id")
          .eq("chat_id", chat.id)
          .neq("sender_id", currentUserId);

        let unread_count = 0;

        if (allMessages && allMessages.length > 0) {
          // Get message IDs that have been read by current user
          const { data: readMessages } = await supabase
            .from("message_read_status")
            .select("message_id")
            .eq("user_id", currentUserId)
            .in(
              "message_id",
              allMessages.map((msg) => msg.id)
            );

          const readMessageIds = new Set(readMessages?.map((r) => r.message_id) || []);
          unread_count = allMessages.filter((msg) => !readMessageIds.has(msg.id)).length;
        }

        return {
          id: chat.id,
          name: chat.name,
          is_group: chat.is_group,
          updated_at: chat.updated_at,
          participants:
            participants
              ?.filter(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (p: any) => p.profile !== null
              )
              .map(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (p: any) => ({
                  id: p.profile.id,
                  user_name: p.profile.user_name,
                  profile_picture: p.profile.profile_picture,
                  phone_no: p.profile.phone_no,
                })
              ) || [],
          last_message: lastMessage,
          unread_count,
        };
      })
    );

    // Sort by latest message timestamp, fallback to chat updated_at if no messages
    chatDetails.sort((a, b) => {
      const aTime = a.last_message?.created_at
        ? new Date(a.last_message.created_at).getTime()
        : new Date(a.updated_at).getTime();
      const bTime = b.last_message?.created_at
        ? new Date(b.last_message.created_at).getTime()
        : new Date(b.updated_at).getTime();
      return bTime - aTime;
    });

    return chatDetails;
  } catch (error) {
    console.error("Error fetching chats:", error);
    throw error;
  }
}

export async function convertTempChatToPermanent(currentUserId: string, targetUserId: string): Promise<string> {
  const supabase = createClient();

  try {
    // Check if chat already exists in database
    const { data: existingChat, error: searchError } = await supabase
      .from("chat_members")
      .select(
        `
        chat_id,
        chats!inner(*)
      `
      )
      .eq("user_id", currentUserId);

    if (searchError) throw searchError;

    // Check if any of these chats are direct chats with the target user
    for (const member of existingChat || []) {
      const { data: otherMembers } = await supabase
        .from("chat_members")
        .select("user_id")
        .eq("chat_id", member.chat_id)
        .neq("user_id", currentUserId);

      if (otherMembers?.length === 1 && otherMembers[0].user_id === targetUserId) {
        return member.chat_id;
      }
    }

    // Get the target user's profile
    const { data: targetUserProfile } = await supabase
      .from("profile")
      .select("user_name")
      .eq("id", targetUserId)
      .single();

    // Create new chat if none exists
    const { data: newChat, error: chatError } = await supabase
      .from("chats")
      .insert({
        name: targetUserProfile?.user_name || "Chat",
        is_group: false,
      })
      .select()
      .single();

    if (chatError) throw chatError;

    // Add both users as members
    const { error: membersError } = await supabase.from("chat_members").insert([
      { chat_id: newChat.id, user_id: currentUserId, role: "member" },
      { chat_id: newChat.id, user_id: targetUserId, role: "member" },
    ]);

    if (membersError) throw membersError;

    return newChat.id;
  } catch (error) {
    console.error("Error converting temporary chat to permanent:", error);
    throw error;
  }
}

export async function markMessagesAsRead(chatId: string, userId: string) {
  try {
    const supabase = createClient();

    // Get all unread messages in this chat
    const { data: messages } = await supabase
      .from("messages")
      .select("id")
      .eq("chat_id", chatId)
      .neq("sender_id", userId);

    if (!messages?.length) return;

    // Mark all as read
    const readStatuses = messages.map((msg) => ({
      message_id: msg.id,
      user_id: userId,
    }));

    const { error } = await supabase.from("message_read_status").upsert(readStatuses, {
      onConflict: "message_id,user_id",
    });

    if (error) {
      console.error("Error upserting read statuses:", error);
    }
  } catch (error) {
    console.error("Error marking messages as read:", error);
  }
}
