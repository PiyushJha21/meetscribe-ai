"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Public unauthenticated routes: landing page (/) and login page (/login)
  if (pathname === "/" || pathname === "/login") {
    return <>{children}</>;
  }

  // All other routes are protected authenticated workspace pages
  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-[#100730] text-slate-100 antialiased">
        {/* Sidebar Navigation */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Layout Area */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden bg-[#100730]">
          {/* Topbar Navigation */}
          <Topbar onOpenSidebar={() => setIsSidebarOpen(true)} />

          {/* Dynamic Page Content */}
          <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8 bg-[#100730]">
            <div className="max-w-6xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
};
