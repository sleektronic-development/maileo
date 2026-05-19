"use client";

import { useEffect } from "react";

import HomePage from "@/containers/home-page";

export default function DashboardPage() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isLoggedIn = localStorage.getItem("auth") === "true";
      if (!isLoggedIn) {
        window.location.replace("/login");
      }
    }
  }, []);

  if (typeof window !== "undefined") {
    const isLoggedIn = localStorage.getItem("auth") === "true";
    if (!isLoggedIn) {
      return null;
    }
  }

  return <HomePage />;
}
