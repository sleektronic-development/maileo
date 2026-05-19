"use client";

import { motion, AnimatePresence } from "framer-motion";

import { SendAnimationProps } from "@/types/components.partials-interfaces";

import { cn } from "@/lib/utils";

import { CheckCircle2, Loader2, XCircle } from "lucide-react";

export function SendAnimation({ status, className }: SendAnimationProps) {
  return (
    <div className={cn("h-6 mt-2 flex items-center", className)}>
      <AnimatePresence mode="wait">
        {status === "sending" && (
          <motion.div
            key="sending"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-1 text-xs text-muted-foreground"
          >
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span>Sending email…</span>
          </motion.div>
        )}

        {status === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -4 }}
            transition={{
              duration: 0.25,
              type: "spring",
              stiffness: 260,
              damping: 18,
            }}
            className="flex items-center gap-1 text-xs text-green-600"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Sent successfully</span>
          </motion.div>
        )}

        {status === "error" && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-1 text-xs text-red-600"
          >
            <XCircle className="h-3.5 w-3.5" />
            <span>Failed to send</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
