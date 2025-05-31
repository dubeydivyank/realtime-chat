import Image from "next/image";
import logo from "../../../public/periskope-logo.svg";
import { AiFillHome } from "react-icons/ai";
import { BsChatDotsFill } from "react-icons/bs";
import { HiMiniMegaphone } from "react-icons/hi2";
import { FaChartLine, FaListUl } from "react-icons/fa6";
import { RiContactsBookFill, RiFolderImageFill } from "react-icons/ri";
import { MdOutlineChecklist } from "react-icons/md";
import { TbLayoutSidebarRightCollapseFilled, TbSettingsFilled, TbStarsFilled } from "react-icons/tb";
import { IoIosGitNetwork } from "react-icons/io";
import { IoSparklesSharp, IoTicket } from "react-icons/io5";

import { logout } from "@/lib/auth";

export function Sidebar() {
  return (
    <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 space-y-4">
      <Image src={logo} alt="P" className="w-8 h-8 flex items-center justify-center" />

      {/* Top */}
      <div className="flex flex-col space-y-2 mt-2">
        <button className="p-2 rounded-lg transition-colors text-gray-500 hover:bg-gray-100 hover:text-green-700 cursor-pointer">
          <AiFillHome className="w-6 h-6" />
        </button>
        <hr className="w-full border-gray-200" />
        <button className="p-2 rounded-lg  bg-gray-100 text-green-700 cursor-pointer">
          <BsChatDotsFill className="w-6 h-6" />
        </button>
        <button className="p-2 rounded-lg transition-colors text-gray-500 hover:bg-gray-100 hover:text-green-700 cursor-pointer">
          <IoTicket className="w-6 h-6" />
        </button>
        <button className="p-2 rounded-lg transition-colors text-gray-500 hover:bg-gray-100 hover:text-green-700 cursor-pointer">
          <FaChartLine className="w-6 h-6" />
        </button>
        <hr className="w-full border-gray-200" />
        <button className="p-2 rounded-lg transition-colors text-gray-500 hover:bg-gray-100 hover:text-green-700 cursor-pointer">
          <FaListUl className="w-6 h-6" />
        </button>
        <button className="p-2 rounded-lg transition-colors text-gray-500 hover:bg-gray-100 hover:text-green-700 cursor-pointer">
          <HiMiniMegaphone className="w-6 h-6" />
        </button>
        <button className="p-2 rounded-lg transition-colors text-gray-500 hover:bg-gray-100 hover:text-green-700 cursor-pointer">
          <div className="relative">
            <IoIosGitNetwork className="w-6 h-6 rotate-180" />
            <IoSparklesSharp className="w-3 h-3 text-amber-300 absolute -top-1 -right-1" />
          </div>
        </button>
        <hr className="w-full border-gray-200" />
        <button className="p-2 rounded-lg transition-colors text-gray-500 hover:bg-gray-100 hover:text-green-700 cursor-pointer">
          <RiContactsBookFill className="w-6 h-6" />
        </button>
        <button className="p-2 rounded-lg transition-colors text-gray-500 hover:bg-gray-100 hover:text-green-700 cursor-pointer">
          <RiFolderImageFill className="w-6 h-6" />
        </button>
        <hr className="w-full border-gray-200" />
        <button className="p-2 rounded-lg transition-colors text-gray-500 hover:bg-gray-100 hover:text-green-700 cursor-pointer">
          <MdOutlineChecklist className="w-6 h-6" />
        </button>
        <button className="p-2 rounded-lg transition-colors text-gray-500 hover:bg-gray-100 hover:text-green-700 cursor-pointer">
          <TbSettingsFilled className="w-6 h-6" />
        </button>
      </div>

      {/* Bottom */}
      <div className="mt-auto flex flex-col space-y-3">
        <button className="p-2 rounded-lg transition-colors text-gray-500 hover:bg-gray-100 hover:text-green-700 cursor-pointer">
          <TbStarsFilled className="w-6 h-6" />
        </button>
        <button
          className="p-2 rounded-lg transition-colors text-gray-500 hover:bg-gray-100 hover:text-green-700 cursor-pointer"
          onClick={logout}
        >
          <TbLayoutSidebarRightCollapseFilled className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
