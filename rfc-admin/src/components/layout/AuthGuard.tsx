"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user && pathname !== "/login") {
      router.replace("/login");
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-deep-gravity flex flex-col items-center justify-center z-[9999]">
        <div className="mb-6 flex items-center gap-3">
          <div className="text-white font-bold bg-primary rounded-full w-12 h-12 flex items-center justify-center text-xl">R</div>
          <h1 className="text-white font-bold text-xl font-headline">Regent Fitness Club</h1>
        </div>
        <Loader2 className="w-10 h-10 text-white animate-spin" />
      </div>
    );
  }

  // If not logged in and not on login page, don't render children while redirecting
  if (!user && pathname !== "/login") {
      return null;
  }

  return <>{children}</>;
}
