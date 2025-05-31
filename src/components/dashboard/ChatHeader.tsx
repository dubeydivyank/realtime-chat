import { IoSparklesSharp } from "react-icons/io5";
import { FaListUl } from "react-icons/fa";
import { IoMdHelpCircleOutline, IoMdNotificationsOff } from "react-icons/io";
import { MdInstallDesktop } from "react-icons/md";
import { TbRefreshDot } from "react-icons/tb";
import { GoDotFill } from "react-icons/go";
import { RiExpandUpDownLine } from "react-icons/ri";
import { BsChatDotsFill } from "react-icons/bs";

export function ChatHeader() {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      {/* Left side */}
      <div className="flex items-center space-x-2">
        <BsChatDotsFill className="w-4 h-4 text-gray-400" />
        <p className="text-md font-extrabold text-gray-400">chats</p>
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-4">
        <button className="px-3.5 py-2 border border-gray-200 shadow-sm rounded-md transition-colors text-gray-500 hover:bg-gray-100  cursor-pointer flex items-center justify-center">
          <TbRefreshDot className="w-4 h-4" />
          <p className="ml-1 text-xs font-bold">Refresh</p>
        </button>
        <button className="px-3.5 py-2 border border-gray-200 shadow-sm rounded-md transition-colors text-gray-500 hover:bg-gray-100  cursor-pointer flex items-center justify-center">
          <IoMdHelpCircleOutline className="w-4 h-4" />
          <p className="ml-1 text-xs font-bold">Help</p>
        </button>
        <button className="px-3.5 py-2 border border-gray-200 shadow-sm rounded-md transition-colors text-gray-500 hover:bg-gray-100  cursor-pointer flex items-center justify-center">
          <GoDotFill className="w-4 h-4 text-amber-300 bg-amber-100 border-1 border-amber-100  rounded-full" />
          <p className="ml-1 text-xs font-bold">5 / 6 phones</p>
          <RiExpandUpDownLine className="w-4 h-4 ml-1 text-gray-400" />
        </button>
        <button className="px-3.5 py-2 border border-gray-200 shadow-sm rounded-md transition-colors text-gray-500 hover:bg-gray-100  cursor-pointer ">
          <MdInstallDesktop className="w-4 h-4" />
        </button>
        <button className="px-3.5 py-2 border border-gray-200 shadow-sm rounded-md transition-colors text-gray-500 hover:bg-gray-100  cursor-pointer ">
          <IoMdNotificationsOff className="w-4 h-4" />
        </button>
        <button className="px-3.5 py-2 border border-gray-200 shadow-sm rounded-md transition-colors text-gray-500 hover:bg-gray-100  cursor-pointer flex items-center justify-center">
          <IoSparklesSharp className="w-4 h-4 text-amber-300" />
          <FaListUl className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
}
