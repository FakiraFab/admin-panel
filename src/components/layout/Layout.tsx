import React from "react";
import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { Footer } from "./Footer";

export const Layout: React.FC = () => {
  return (
    <div className="bg-[#faf7f7] min-h-screen min-w-full w-screen h-screen overflow-x-auto">
      <div className="flex flex-col md:flex-row min-h-full w-full bg-[#faf7f7]">
        {/* Sidebar */}
        <div className="flex-shrink-0 w-full md:w-auto bg-[#faf7f7]">
          <Sidebar />
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col w-full bg-[#faf7f7]">
          {/* Header */}
          <Header />

          {/* Page content */}
          <main className="flex-1 p-4 sm:p-6 md:p-8 bg-[#faf7f7]">
            <Outlet />
          </main>

          {/* Footer */}
          <Footer />
        </div>
      </div>
    </div>
  );
};