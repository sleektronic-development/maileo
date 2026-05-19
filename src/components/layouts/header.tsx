"use client";

import { useState } from "react";
import Image from "next/image";

import { HeaderProps } from "@/types/components.layouts-interfaces";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { cn } from "@/lib/utils";

import { Power } from "lucide-react";

export function Header({ className }: HeaderProps) {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("auth");
    document.cookie = "auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "/login";
  };

  return (
    <>
      <header
        className={cn(
          "w-full h-[90px] bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60",
          "border-b border-border/60 shadow-md",
          className,
        )}
      >
        <div className="md:max-w-3xl layout-standard h-full flex items-center justify-between">
          {/* LOGO */}
          <div className="flex items-center gap-3">
            <Image
              src="/logo.svg"
              alt="Maileo"
              height={60}
              width={60}
              className="opacity-95"
              priority
            />
            <span className="md:text-xl text-base font-medium tracking-tight text-foreground">
              Maileo
            </span>
          </div>

          {/* ACTIONS */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setShowLogoutDialog(true)}
                className={cn(
                  "h-9 w-9 rounded-full flex items-center justify-center",
                  "text-muted-foreground hover:text-destructive",
                  "hover:bg-muted transition-colors",
                )}
                aria-label="Logout"
              >
                <Power className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Logout</TooltipContent>
          </Tooltip>
        </div>
      </header>

      {/* LOGOUT DIALOG */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to logout? You will need to sign in again to
              access the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              className="bg-destructive text-destructive-foreground"
            >
              Yes, Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
