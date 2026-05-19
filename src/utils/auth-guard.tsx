"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const isLoggedIn = useMemo(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("auth") === "true";
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/login");
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) return null;

  return <>{children}</>;
}
