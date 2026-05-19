"use client";

import { useEffect } from "react";

export default function RootPage() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.location.replace("/login");
    }
  }, []);

  return null;
}
