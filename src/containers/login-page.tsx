"use client";

import { useState } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const VALID_USERNAME = "admin";
const VALID_PASSWORD = "admin1234";

export default function LoginPage() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (user.trim() === VALID_USERNAME && pass === VALID_PASSWORD) {
      localStorage.setItem("auth", "true");
      document.cookie = "auth=true; path=/; max-age=86400";
      window.location.href = "/dashboard";
    } else {
      setError("Invalid username or password. Please try again.");
      setPass("");
    }
  }

  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      handleLogin(e);
    }
  }

  return (
    <div
      style= {{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        backgroundColor: "#f1f5f9",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99999,
        width: "100%",
        overflow: "auto",
      }}
    >
      <Card
        className="max-w-[400px] bg-white border-border w-full"
        style={{
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        }}
      >
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <Image src="/logo.svg" alt="Maileo" height={70} width={70} />
          </div>
          <CardTitle className="text-2xl font-medium">Welcome Back</CardTitle>
          <CardDescription className="text-xs">
            Enter your credentials to access Maileo
          </CardDescription>
        </CardHeader>

        <Separator className="mb-8 w-[90%] mx-auto" />

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Enter your username"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                onKeyPress={handleKeyPress}
                autoComplete="username"
                required
                autoFocus
                className="h-[50px] border-border bg-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                onKeyPress={handleKeyPress}
                autoComplete="current-password"
                className="h-[50px] border-border bg-input"
                required
              />
            </div>

            {error && (
              <div className="text-sm text-destructive bg-destructive/10">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 !mt-10 rounded-none hover:bg-primary-hover"
            >
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
