"use client";

import { usePathname } from "next/navigation";

import { Header } from "@/components/layouts/header";

export function ConditionalHeader() {
  const pathname = usePathname();

  if (pathname === "/login") {
    return null;
  }

  return <Header />;
}
