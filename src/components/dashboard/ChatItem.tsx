import { Profile } from "@/app/types/database";
import { ChatWithDetails } from "./ChatList";
import { FaUser } from "react-icons/fa";
import { BsCheckAll } from "react-icons/bs";
import { MdCall } from "react-icons/md";

interface ChatItemProps {
  chat: ChatWithDetails;
  currentUserId: string;
  onChatSelect: (chatId: string, user: Profile) => void;
  isActive?: boolean;
}
export function ChatItem({ chat, currentUserId, onChatSelect, isActive }: ChatItemProps) {
  const participant = chat.participants.find((p) => p.id !== currentUserId);
  const profilePicture = participant?.profile_picture;

  return (
    <div
      key={chat.id}
      onClick={() => onChatSelect(chat.id, participant!)}
      className={`flex items-center p-4 cursor-pointer relative ${isActive ? "bg-gray-100" : "hover:bg-gray-50"} ${
        chat.unread_count > 0 ? "bg-green-50 border-l-4 border-green-500" : ""
      }`}
    >
      <div className="flex-shrink-0 mr-3 relative">
        {chat.is_group ? (
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
            {chat.name.charAt(0).toUpperCase()}
          </div>
        ) : (
          <>
            {profilePicture ? (
              <img src={profilePicture} alt="Profile" className="w-12 h-12 rounded-full" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                <FaUser className="w-6 h-6 text-gray-500" />
              </div>
            )}
          </>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <h3 className={`font-semibold truncate ${chat.unread_count > 0 ? "text-gray-900" : "text-gray-700"}`}>
            {participant?.user_name}
          </h3>

          {chat.unread_count > 0 && (
            <div className="absolute top-2 right-2 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-md">
              {chat.unread_count}
            </div>
          )}
        </div>

        {chat.last_message && (
          <div
            className={`text-sm truncate flex items-center ${
              chat.unread_count > 0 ? "text-gray-800 font-medium" : "text-gray-600"
            }`}
          >
            {chat.last_message.sender_name !== participant?.user_name ? (
              <>
                <span className="text-gray-500 mr-1">
                  <BsCheckAll className="w-4 h-4 text-gray-500" />
                </span>
                <div className="flex flex-row items-center justify-between w-full">
                  <span className="text-gray-500 ">
                    {chat.last_message.content.substring(0, 20)}
                    {chat.last_message.content.length > 20 ? "..." : ""}
                  </span>
                  {chat.last_message && (
                    <span className="text-xs text-gray-500">
                      {new Date(chat.last_message.created_at).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "2-digit",
                      })}
                    </span>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-row items-center justify-start w-full">
                  {participant?.phone_no && (
                    <span className="border border-none p-1 rounded-md text-xs bg-gray-50 text-gray-400 px-1 mr-1 flex items-center">
                      <MdCall className="w-3 h-3 mr-1" /> {participant?.phone_no}
                    </span>
                  )}
                  <span className="text-gray-500 ">
                    : {chat.last_message.content.substring(0, 20)}
                    {chat.last_message.content.length > 20 ? "..." : ""}
                  </span>
                </div>
                <div>
                  {chat.last_message && (
                    <span className="text-xs text-gray-500">
                      {new Date(chat.last_message.created_at).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "2-digit",
                      })}
                    </span>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
