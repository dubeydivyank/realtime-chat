import { IoSend, IoSearch } from "react-icons/io5";
import { FaRegSmile, FaUser } from "react-icons/fa";
import { FaMicrophone, FaPaperclip, FaRegClock } from "react-icons/fa6";
import chatBg from "../../../public/chat_bg.png";
import periskopeLogo from "../../../public/periskope-logo.svg";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { TransformedMessages } from "../dashboard/ChatContainer";
import { BsCheckAll, BsStars } from "react-icons/bs";
import { User } from "@supabase/supabase-js";
import { RiExpandUpDownLine } from "react-icons/ri";
import { CgSpinner } from "react-icons/cg";
import { Profile } from "@/app/types/database";
import { PiClockClockwise } from "react-icons/pi";
import { HiOutlineSparkles } from "react-icons/hi2";
import { PiTextAlignLeftFill } from "react-icons/pi";

interface ChatInterfaceProps {
  messages: TransformedMessages[];
  loading: boolean;
  onSendMessage?: (content: string) => Promise<void>;
  isTemporaryChat?: boolean;
  user: User;
  selectedUserProfile: Profile | null;
}

export function ChatInterface({
  messages,
  loading,
  onSendMessage,
  isTemporaryChat,
  user,
  selectedUserProfile,
}: ChatInterfaceProps) {
  const [messageContent, setMessageContent] = useState("");
  const [sending, setSending] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageContent.trim() || !onSendMessage || sending) return;

    setSending(true);
    try {
      await onSendMessage(messageContent);
      setMessageContent("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e as React.FormEvent);
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  if (messages.length === 0 && !isTemporaryChat) {
    return (
      <div
        className="flex-1 flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat bg-opacity-50"
        style={{ backgroundImage: `url(${chatBg.src})` }}
      >
        <Image src={periskopeLogo} alt="periskope-logo" className="w-30 h-30" />
        <p className="text-gray-500 text-lg font-bold mt-4">Select a chat to start messaging</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 py-2 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {selectedUserProfile?.profile_picture ? (
              <img src={selectedUserProfile.profile_picture} alt="Profile" className="w-10 h-10 rounded-full" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <FaUser className="w-5 h-5 text-gray-500" />
              </div>
            )}

            <div>
              <h3 className="font-semibold text-gray-900">
                {isTemporaryChat ? "New Chat" : selectedUserProfile?.user_name}
              </h3>
              <p className="text-sm text-gray-500">
                {isTemporaryChat ? "Send a message to start the conversation" : `${selectedUserProfile?.user_name}`}
              </p>
            </div>
          </div>
          {!isTemporaryChat && (
            <div className="flex space-x-2">
              <BsStars className="w-5 h-5 text-gray-500" />
              <IoSearch className="w-5 h-5 text-gray-500" />
            </div>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0"
        style={{
          backgroundImage: `url(${chatBg.src})`,
          maxHeight: "calc(100vh - 14rem)",
          height: "calc(100vh - 14rem)",
        }}
        ref={chatContainerRef}
      >
        {loading && (
          <div className="flex items-center justify-center h-full">
            <CgSpinner className="w-12 h-12 text-green-600 animate-spin" />
          </div>
        )}

        {!isTemporaryChat && messages.length > 0 && (
          <>
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-xs lg:max-w-md ${message.isOwn ? "order-2" : "order-1"}`}>
                  <div className="flex flex-row">
                    {!message.isOwn && (
                      <div className="flex items-center space-x-2 mr-2 -mt-10">
                        {message.sender_profile_picture ? (
                          <img src={message.sender_profile_picture} alt="Profile" className="w-6 h-6 rounded-full" />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                            <FaUser className="w-3 h-3 text-gray-500" />
                          </div>
                        )}
                      </div>
                    )}
                    <div
                      className={`px-2 py-1 max-w-80 rounded-lg ${
                        message.isOwn ? "bg-green-100 text-gray-900" : "bg-white text-gray-900 shadow-sm"
                      }`}
                    >
                      <div className="p-1 flex flex-row items-center justify-between w-full">
                        <span className="text-xs text-green-600 font-bold">{message.sender}</span>
                        <span className="text-xs text-gray-400 ml-4">{message.sender_phone}</span>
                      </div>
                      <p className="text-sm text-gray-800 break-words p-1">{message.content}</p>
                      <div className="flex items-center justify-end mt-1 space-x-1">
                        <span className="text-xs text-gray-400">{message.timestamp}</span>
                        {message.isOwn && (
                          <BsCheckAll className={`w-4 h-4 ${message.isRead ? "text-blue-500" : "text-gray-500"}`} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {isTemporaryChat && (
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm">Send a message to start this conversation</p>
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 flex flex-col justify-between h-24">
        <form onSubmit={handleSendMessage} className="w-full h-12">
          <div className="flex items-center space-x-3 w-full h-12">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Message..."
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={sending}
                className="w-full  px-3 focus:outline-none disabled:opacity-50 h-10 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={!messageContent.trim() || sending}
              className=" text-green-600 p-2 rounded-full  disabled:cursor-not-allowed"
            >
              <IoSend className="w-5 h-5" />
            </button>
          </div>
        </form>

        <div className="flex-1 flex items-center justify-between h-12 space-x-4 w-full px-2">
          <div className="flex items-center space-x-3">
            <button type="button" className="text-gray-500 hover:text-gray-700 cursor-pointer">
              <FaPaperclip className="w-4 h-4" />
            </button>
            <button type="button" className="text-gray-500 hover:text-gray-700 cursor-pointer">
              <FaRegSmile className="w-4 h-4" />
            </button>
            <button type="button" className="text-gray-500 hover:text-gray-700 cursor-pointer">
              <FaRegClock className="w-4 h-4" />
            </button>
            <button type="button" className="text-gray-500 hover:text-gray-700 cursor-pointer">
              <PiClockClockwise className="w-4 h-4" />
            </button>
            <button type="button" className="text-gray-500 hover:text-gray-700 cursor-pointer">
              <HiOutlineSparkles className="w-4 h-4" />
            </button>
            <button type="button" className="text-gray-500 hover:text-gray-700 cursor-pointer">
              <PiTextAlignLeftFill className="w-4 h-4" />
            </button>
            <button type="button" className="text-gray-500 hover:text-gray-700 cursor-pointer">
              <FaMicrophone className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              className="inline-flex border border-gray-200 p-1.5 rounded-md items-center text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              {user.user_metadata.profile_picture_url ? (
                <img src={user.user_metadata.profile_picture_url} alt="User profile" className="w-4 h-4 rounded-full" />
              ) : (
                <div className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center">
                  <FaUser className="w-2 h-2 text-gray-500" />
                </div>
              )}
              <span className="text-xs ml-2">{user.user_metadata.full_name}</span>
              <RiExpandUpDownLine className="w-4 h-4 ml-1 text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
