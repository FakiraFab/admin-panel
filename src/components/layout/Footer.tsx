import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white border-t border-[#dadada] py-4 px-4 md:px-12">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">
        <div className="text-xs sm:text-sm text-[#979797] text-center sm:text-left">
          © 2025 Admin Dashboard. All rights reserved.
        </div>
        <div className="text-xs sm:text-sm text-[#979797]">
          Version 1.0.0
        </div>
      </div>
    </footer>
  );
};