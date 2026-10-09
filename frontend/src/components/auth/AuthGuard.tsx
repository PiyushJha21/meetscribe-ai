"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AudioLines } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const redirectUrl = pathname ? `/login?redirect=${encodeURIComponent(pathname)}` : "/login";
      router.replace(redirectUrl);
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#100730] flex flex-col items-center justify-center space-y-4 text-slate-300">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#5925DC] to-[#7A5BF8] text-white flex items-center justify-center shadow-xl shadow-[#5925DC]/40 animate-pulse">
          <AudioLines className="w-6 h-6 text-white" />
        </div>
        <div className="space-y-1 text-center">
          <p className="text-sm font-semibold text-white">Authenticating MeetScribe Workspace...</p>
          <p className="text-xs text-purple-300/60 font-mono">Verifying secure session token</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
};
