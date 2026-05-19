"use client";

import { CharCounterProps } from "@/types/components.partials-interfaces";

import { cn } from "@/lib/utils";

export function CharCounter({
  value,
  limit = 200,
  className,
}: CharCounterProps) {
  const length = value?.length ?? 0;
  const percentage = (length / limit) * 100;

  const color =
    percentage >= 90
      ? "text-red-600"
      : percentage >= 70
      ? "text-yellow-600"
      : "text-muted-foreground";

  return (
    <span
      className={cn(
        "text-xs font-medium select-none transition-colors",
        color,
        className
      )}
    >
      {length}/{limit}
    </span>
  );
}
