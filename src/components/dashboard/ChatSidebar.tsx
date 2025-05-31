import { FaSync } from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi";
import { RiFolderImageFill, RiListSettingsLine } from "react-icons/ri";
import { TbLayoutSidebarLeftCollapseFilled, TbListDetails } from "react-icons/tb";
import { FiAtSign, FiEdit3 } from "react-icons/fi";
import { FaBarsStaggered, FaHubspot } from "react-icons/fa6";

export function ChatSidebar() {
  return (
    <div className="w-16 bg-white border-l border-gray-200 flex flex-col items-center py-4 space-y-4">
      <div className="flex flex-col space-y-5 mt-4">
        <button className="p-2 rounded-lg transition-colors text-gray-400 hover:bg-gray-100  cursor-pointer">
          <TbLayoutSidebarLeftCollapseFilled className="w-5 h-5" />
        </button>
        <button className="p-2 rounded-lg transition-colors text-gray-400 hover:bg-gray-100  cursor-pointer">
          <FaSync className="w-4 h-4" />
        </button>
        <button className="p-2 rounded-lg transition-colors text-gray-400 hover:bg-gray-100  cursor-pointer">
          <FiEdit3 className="w-5 h-5" />
        </button>
        <button className="p-2 rounded-lg transition-colors text-gray-400 hover:bg-gray-100  cursor-pointer">
          <FaBarsStaggered className="w-5 h-5" />
        </button>
        <button className="p-2 rounded-lg transition-colors text-gray-400 hover:bg-gray-100  cursor-pointer">
          <TbListDetails className="w-5 h-5" />
        </button>
        <button className="p-2 rounded-lg transition-colors text-gray-400 hover:bg-gray-100  cursor-pointer">
          <FaHubspot className="w-5 h-5" />
        </button>
        <button className="p-2 rounded-lg transition-colors text-gray-400 hover:bg-gray-100  cursor-pointer">
          <HiUserGroup className="w-5 h-5" />
        </button>
        <button className="p-2 rounded-lg transition-colors text-gray-400 hover:bg-gray-100  cursor-pointer">
          <FiAtSign className="w-5 h-5" />
        </button>
        <button className="p-2 rounded-lg transition-colors text-gray-400 hover:bg-gray-100  cursor-pointer">
          <RiFolderImageFill className="w-5 h-5" />
        </button>
        <button className="p-2 rounded-lg transition-colors text-gray-400 hover:bg-gray-100  cursor-pointer">
          <RiListSettingsLine className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
