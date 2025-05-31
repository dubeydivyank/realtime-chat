import { createClient } from "../supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";

export function subscribeToMessages(chatId: string, onNewMessage: () => void): RealtimeChannel {
  const supabase = createClient();

  const messagesSubscription = supabase
    .channel(`messages-${chatId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `chat_id=eq.${chatId}`,
      },
      () => {
        onNewMessage();
      }
    )
    .subscribe();

  return messagesSubscription;
}

export function subscribeToMessagesAndReadStatus(
  chatId: string,
  onUpdate: () => void
): { messagesChannel: RealtimeChannel; readStatusChannel: RealtimeChannel } {
  const supabase = createClient();

  // Subscribe to new messages
  const messagesChannel = supabase
    .channel(`messages-${chatId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `chat_id=eq.${chatId}`,
      },
      () => {
        onUpdate();
      }
    )
    .subscribe();

  // Subscribe to read status changes for messages in this chat
  const readStatusChannel = supabase
    .channel(`read-status-${chatId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "message_read_status",
      },
      async (payload) => {
        // Check if this read status change is for a message in the current chat
        const { data: messageData } = await supabase
          .from("messages")
          .select("chat_id")
          .eq("id", payload.new.message_id)
          .single();

        if (messageData?.chat_id === chatId) {
          onUpdate();
        }
      }
    )
    .subscribe();

  return { messagesChannel, readStatusChannel };
}

export function subscribeToChatListUpdates(onUpdate: () => void): RealtimeChannel {
  const supabase = createClient();

  const messagesSubscription = supabase
    .channel("messages")
    .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (payload) => {
      console.log(payload);
      onUpdate();
    })
    .on("postgres_changes", { event: "INSERT", schema: "public", table: "message_read_status" }, () => {
      // Also update chat list when read status changes (for read receipts in chat list)
      onUpdate();
    })
    .subscribe();

  return messagesSubscription;
}

export function unsubscribe(subscription: RealtimeChannel): void {
  const supabase = createClient();
  supabase.removeChannel(subscription);
}

export function unsubscribeMultiple(subscriptions: RealtimeChannel[]): void {
  const supabase = createClient();
  subscriptions.forEach((subscription) => {
    supabase.removeChannel(subscription);
  });
}
