"use client";

import React, { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { AuthContext, useAuth } from "../lib/auth-context";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

const ProfilePopover = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem("userData"); // Optional: clear stored session
      setOpen(false);
      router.push("/auth");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    setOpen(false);
  };

  const handleProfileClick = () => {
    router.push("/dashboard");
    setOpen(false);
  };

  // ✅ If user not logged in, return null (or redirect)
  if (!user) return null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center space-x-2"
          onClick={() => setOpen(!open)}
        >
          <img
            src={user?.avatar || "/placeholder-user.jpg"}
            alt="User Avatar"
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="font-medium">{user?.name || "User"}</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-52 p-3">
        <div className="flex flex-col space-y-2 text-sm">
          <Button
            variant="link"
            className="justify-start"
            onClick={() => handleNavigation("/profile")}
          >
            Profile
          </Button>
          <Button
            variant="link"
            className="justify-start"
            onClick={() => handleNavigation("/dashboard")}
          >
            Dashboard
          </Button>
          <Button
            variant="link"
            className="justify-start"
            onClick={() => handleNavigation("/")}
          >
            Home
          </Button>
          <Button
            variant="link"
            className="justify-start text-red-500"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ProfilePopover;
