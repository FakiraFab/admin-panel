import React from "react";
import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { Footer } from "./Footer";

export const Layout: React.FC = () => {
  return (
    <div className="bg-[#faf7f7] flex flex-col min-h-screen w-full">
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="flex-shrink-0">
          <Sidebar />
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <Header />

          {/* Page content */}
          <main className="flex-1 p-8">
            <Outlet />
          </main>

          {/* Footer */}
          <Footer />
        </div>
      </div>
    </div>
  );
};