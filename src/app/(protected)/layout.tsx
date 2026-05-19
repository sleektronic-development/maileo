"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [ready, setReady] = useState(false);
  const [allowed, setAllowed] = useState(false);

  const checkAuth = () => {
    try {
      if (typeof window === "undefined") {
        return false;
      }

      const isLoggedIn = localStorage.getItem("auth") === "true";
      const hasAuthCookie = document.cookie.split(";").some(c => c.trim().startsWith("auth=true"));

      if (!isLoggedIn || !hasAuthCookie) {
        window.location.replace("/login");
        setAllowed(false);
        return false;
      } else {
        setAllowed(true);
        return true;
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      window.location.replace("/login");
      setAllowed(false);
      return false;
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    const isAuthenticated = checkAuth();
    if (isAuthenticated) {
      setReady(true);
    } else {
      return;
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "auth") {
        checkAuth();
      }
    };

    const handleFocus = () => {
      checkAuth();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [router]);

  if (!ready || !allowed) {
    return null;
  }

  return <>{children}</>;
}
