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

export function subscribeToChatListUpdates(onUpdate: () => void): RealtimeChannel {
  const supabase = createClient();

  const messagesSubscription = supabase
    .channel("messages")
    .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (payload) => {
      console.log(payload);
      onUpdate();
    })
    .subscribe();

  return messagesSubscription;
}

export function unsubscribe(subscription: RealtimeChannel): void {
  const supabase = createClient();
  supabase.removeChannel(subscription);
}
