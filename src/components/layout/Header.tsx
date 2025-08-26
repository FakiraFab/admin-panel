import { BellIcon, MessageSquareIcon, SearchIcon, LogOutIcon } from "lucide-react";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";
import { useAuthStore } from "../../store/authStore";

export const Header: React.FC = () => {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="w-full h-auto min-h-[70px] md:h-[100px] bg-white shadow-[2px_2px_25px_#00000014] flex flex-col md:flex-row items-center justify-between p-4 md:px-12 gap-4 md:gap-0">
      <div className="relative w-full md:w-[573px]">
        <Input
          className="h-12 pl-6 pr-12 rounded-xl border border-solid border-[#dadada] w-full"
          placeholder="Search here..."
        />
        <SearchIcon className="absolute w-6 h-6 top-3 right-4 text-gray-400" />
      </div>

      <div className="flex items-center gap-4 md:gap-7">
        <button className="relative w-10 h-10 md:w-12 md:h-12 bg-[#faf7f7] rounded-full flex items-center justify-center">
          <BellIcon className="w-5 h-5 md:w-6 md:h-6" />
        </button>

        <button className="relative w-10 h-10 md:w-12 md:h-12 bg-[#faf7f7] rounded-full flex items-center justify-center">
          <MessageSquareIcon className="w-5 h-5 md:w-6 md:h-6" />
        </button>

        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8 md:w-10 md:h-10">
            <AvatarImage src={user?.avatar} alt="User avatar" />
            <AvatarFallback>{user?.name?.charAt(0) || 'A'}</AvatarFallback>
          </Avatar>

          <div className="flex flex-col w-[70px]">
            <span className="font-['Open_Sans',Helvetica] font-semibold text-[#1c1c1c] text-sm tracking-[0.07px] leading-5 whitespace-nowrap">
              {user?.name || 'Admin'}
            </span>
            <span className="font-['Open_Sans',Helvetica] font-normal text-[#cfcfcf] text-xs tracking-[0.06px]">
              {user?.role || 'Admin'}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="ml-2 p-2 text-gray-500 hover:text-red-500 transition-colors"
            title="Logout"
          >
            <LogOutIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};