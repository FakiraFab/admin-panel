import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white border-t border-[#dadada] py-4 px-12">
      <div className="flex items-center justify-between">
        <div className="text-sm text-[#979797]">
          © 2025 Admin Dashboard. All rights reserved.
        </div>
        <div className="text-sm text-[#979797]">
          Version 1.0.0
        </div>
      </div>
    </footer>
  );
};