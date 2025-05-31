"use client";
import { User } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import { ChatHeader } from "./ChatHeader";
import { ChatList } from "./ChatList";
import { ChatInterface } from "./ChatInterface";
import { ChatSidebar } from "./ChatSidebar";
import { Message, Profile } from "../../app/types/database";
import {
  fetchMessages,
  sendMessage,
  convertTempChatToPermanent,
  subscribeToMessagesAndReadStatus,
  unsubscribeMultiple,
} from "../../lib/chat";
import { markMessagesAsRead } from "../../lib/chat/chats";

interface ChatContainerProps {
  user: User;
}

export interface TransformedMessages {
  id: string;
  content: string;
  sender: string;
  sender_id: string;
  sender_profile_picture: string;
  sender_phone: string;
  timestamp: string;
  isOwn: boolean;
  isRead: boolean;
}

export interface MessageWithProfile extends Message {
  profile: {
    user_name: string;
    profile_picture: string;
    phone_no: string;
  };
  message_read_status: Array<{
    user_id: string;
    read_at: string;
  }>;
}

export function ChatContainer({ user }: ChatContainerProps) {
  const currentUserId = user.id;
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageWithProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [isTemporaryChat, setIsTemporaryChat] = useState(false);
  const [selectedUserProfile, setSelectedUserProfile] = useState<Profile | null>(null);
  const [targetUserId, setTargetUserId] = useState<string | null>(null);
  const [refreshChatList, setRefreshChatList] = useState(0);

  const handleRefreshChatList = () => {
    setRefreshChatList((prev) => prev + 1);
  };

  const fetchChatMessages = async (chatId: string) => {
    setLoading(true);
    try {
      const data = await fetchMessages(chatId);
      setMessages(data || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChatSelect = async (chatId: string, userProfile: Profile) => {
    if (userProfile) {
      setSelectedUserProfile(userProfile);
    }

    setSelectedChatId(chatId);

    // Check if this is a temporary chat
    if (chatId.startsWith("temp_")) {
      setIsTemporaryChat(true);
      // Extract target user ID from temp chat ID
      const parts = chatId.split("_");
      setTargetUserId(parts[parts.length - 1]);
      setMessages([]); // Clear messages for temp chats
    } else {
      setIsTemporaryChat(false);
      setTargetUserId(null);
      fetchChatMessages(chatId);

      // Mark messages as read when chat is selected
      try {
        await markMessagesAsRead(chatId, currentUserId);
        // Refresh chat list to update unread counts
        handleRefreshChatList();
      } catch (error) {
        console.error("Error marking messages as read:", error);
      }
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!selectedChatId || !content.trim()) return;

    try {
      let actualChatId = selectedChatId;

      // If it's a temporary chat, convert it to permanent first
      if (isTemporaryChat && targetUserId) {
        actualChatId = await convertTempChatToPermanent(currentUserId, targetUserId);
        setSelectedChatId(actualChatId);
        setIsTemporaryChat(false);
        setTargetUserId(null);
        // Trigger chat list refresh after creating permanent chat
        handleRefreshChatList();
      }

      // Send the message
      await sendMessage(actualChatId, content, currentUserId);

      // Refresh messages
      fetchChatMessages(actualChatId);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Subscribe to new messages for the selected chat
  useEffect(() => {
    if (!selectedChatId || isTemporaryChat) return;

    const { messagesChannel, readStatusChannel } = subscribeToMessagesAndReadStatus(selectedChatId, () => {
      // Fetch the new message with profile data
      fetchChatMessages(selectedChatId);
      // Also refresh chat list to update unread counts for other chats
      handleRefreshChatList();
    });

    return () => {
      unsubscribeMultiple([messagesChannel, readStatusChannel]);
    };
  }, [selectedChatId, isTemporaryChat]);

  // Transform messages for ChatInterface component
  const transformedMessages: TransformedMessages[] = messages.map((message) => {
    let isRead = false;

    if (message.sender_id === currentUserId) {
      // For own messages, check if OTHER users have read the message
      // For now, we'll check if ANY other user has read it (in group chats, this might need refinement)
      isRead = message.message_read_status?.some((status) => status.user_id !== currentUserId) || false;
    } else {
      // For received messages, check if current user has read the message
      isRead = message.message_read_status?.some((status) => status.user_id === currentUserId) || false;
    }

    return {
      id: message.id,
      content: message.content,
      sender: message.profile.user_name,
      sender_phone: message.profile.phone_no,
      sender_id: message.sender_id,
      sender_profile_picture: message.profile.profile_picture,
      timestamp: new Date(message.created_at).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isOwn: message.sender_id === currentUserId,
      isRead: isRead,
    };
  });

  return (
    <div className="flex-1 flex flex-col bg-white">
      <ChatHeader />
      <div className="flex-1 flex">
        <ChatList
          currentUserId={currentUserId}
          onChatSelect={handleChatSelect}
          refreshTrigger={refreshChatList}
          selectedChatId={selectedChatId}
        />
        <ChatInterface
          user={user}
          loading={loading}
          messages={transformedMessages}
          onSendMessage={handleSendMessage}
          isTemporaryChat={isTemporaryChat}
          selectedUserProfile={selectedUserProfile}
        />
        <ChatSidebar />
      </div>
    </div>
  );
}
