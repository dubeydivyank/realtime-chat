import { IoSearch } from "react-icons/io5";
import { ChatItem } from "./ChatItem";
import { RiFilter3Fill } from "react-icons/ri";
import { HiMiniFolderArrowDown } from "react-icons/hi2";
import { TbMessageCirclePlus } from "react-icons/tb";
import UserSearchModal from "./UserSearchModal";
import { useEffect } from "react";
import { useState } from "react";
import { Profile } from "../../app/types/database";
import { fetchChats, subscribeToChatListUpdates, unsubscribe } from "../../lib/chat";
import { CgSpinner } from "react-icons/cg";

export interface ChatWithDetails {
  id: string;
  name: string;
  is_group: boolean;
  updated_at: string;
  participants: Profile[];
  last_message: {
    id: string;
    content: string;
    created_at: string;
    sender_name: string;
    sender_id: string;
    is_read_by_others: boolean;
  } | null;
  unread_count: number;
  isTemporary?: boolean;
}

interface ChatListProps {
  currentUserId: string;
  onChatSelect: (chatId: string, user: Profile) => void;
  refreshTrigger?: number;
  selectedChatId?: string | null;
}

export function ChatList({ currentUserId, onChatSelect, refreshTrigger, selectedChatId }: ChatListProps) {
  const [chats, setChats] = useState<ChatWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleUserSelect = async (selectedUser: Profile) => {
    try {
      setIsModalOpen(false);

      // Check if chat already exists locally or in database
      const existingChat = chats.find(
        (chat) => !chat.is_group && chat.participants.some((p) => p.id === selectedUser.id)
      );

      if (existingChat) {
        onChatSelect(existingChat.id, existingChat.participants.find((p) => p.id !== currentUserId)!);
        return;
      }

      // Create temporary chat locally
      const tempChatId = `temp_${Date.now()}_${selectedUser.id}`;
      const tempChat: ChatWithDetails = {
        id: tempChatId,
        name: selectedUser.user_name,
        is_group: false,
        updated_at: new Date().toISOString(),
        participants: [
          {
            id: selectedUser.id,
            user_name: selectedUser.user_name,
            phone_no: selectedUser.phone_no,
            profile_picture: selectedUser.profile_picture,
          },
        ],
        last_message: null,
        unread_count: 0,
        isTemporary: true,
      };

      // Add temporary chat to the beginning of the list
      setChats((prevChats) => [tempChat, ...prevChats]);
      onChatSelect(tempChatId, selectedUser);
    } catch (error) {
      console.error("Error creating temporary chat:", error);
    }
  };

  const loadChats = async () => {
    try {
      const chatDetails = await fetchChats(currentUserId);
      setChats(chatDetails);
    } catch (error) {
      console.error("Error fetching chats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChats();
  }, [currentUserId, refreshTrigger]);

  useEffect(() => {
    const subscription = subscribeToChatListUpdates(() => {
      loadChats();
    });

    return () => {
      unsubscribe(subscription);
    };
  }, []);

  return (
    <div className="w-110 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-[#fafafa] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button className="  text-green-700   cursor-pointer flex items-center justify-center">
            <HiMiniFolderArrowDown className="w-5 h-5" />
            <p className="ml-1 text-sm font-extrabold">Custom filter</p>
          </button>
          <button className="px-2.5 py-1.5 border bg-white border-gray-200  rounded-md transition-colors text-gray-500 hover:bg-gray-100  cursor-pointer flex items-center justify-center">
            <p className=" text-xs font-bold">Save</p>
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <button className="px-2.5 py-1.5 border bg-white border-gray-200  rounded-md transition-colors text-gray-500 hover:bg-gray-100  cursor-pointer flex items-center justify-center">
            <IoSearch className="w-4 h-4" />
            <p className="ml-1 text-xs font-bold">Search</p>
          </button>
          <button className="px-2.5 py-1.5 border bg-white border-gray-200 rounded-md transition-colors text-gray-500 hover:bg-gray-100  cursor-pointer flex items-center justify-center">
            <RiFilter3Fill className="w-4 h-4 text-green-600" />
            <p className="ml-1 text-xs font-bold text-green-600">Filtered</p>
          </button>
        </div>
      </div>

      {/* Chat List */}
      {loading && (
        <div className="flex-1 overflow-y-auto  space-y-4 min-h-0">
          <div className="flex items-center justify-center h-full">
            <CgSpinner className="w-12 h-12 text-green-600 animate-spin" />
          </div>
        </div>
      )}
      {!loading && (
        <div
          className="flex-1 overflow-y-auto  min-h-0"
          style={{
            maxHeight: "calc(100vh - 14rem)",
            height: "calc(100vh - 14rem)",
          }}
        >
          {chats.map((chat) => (
            <ChatItem
              key={chat.id}
              chat={chat}
              currentUserId={currentUserId}
              onChatSelect={onChatSelect}
              isActive={selectedChatId === chat.id}
            />
          ))}
        </div>
      )}

      {/* New Chat Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="h-16 w-16 rounded-full  flex items-center fixed bottom-10 left-100 justify-center py-2 px-3 border bg-green-600 text-white hover:bg-green-700 transition-colors cursor-pointer"
      >
        <TbMessageCirclePlus className="w-6 h-6" />
      </button>

      <UserSearchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentUserId={currentUserId}
        onUserSelect={handleUserSelect}
      />
    </div>
  );
}
