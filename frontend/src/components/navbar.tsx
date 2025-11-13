"use client";
import { useState, useRef, useEffect } from "react";
import { getCurrentUser, logout } from "@/lib/auth";
import Image from "next/image";
import Link from "next/link";
import { CircleUserRound, LogOut } from "lucide-react";
import { ChangePassword } from "./change-password";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleLogout = async () => {
    await logout();
  };

  useEffect(() => {
    (async () => {
      const user = await getCurrentUser();
      console.log(user.name);
      setName(user.name);
    })();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // If the change-password dialog is open (portal content lives outside the
      // dropdown), treat clicks inside that dialog as 'inside' so the dropdown
      // doesn't close while the user is interacting with the dialog.
      if (dialogOpen) return;

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dialogOpen]);

  return (
    <nav className="text-foreground bg-background px-6 py-4 flex justify-between items-center">
      {/* Institute Logo + Name */}
      <Link
        className="font-bold flex gap-2 text-center items-center"
        href={"/"}
      >
        <Image src={"/Emblem.jpg"} alt="Logo" width={30} height={30} />
        National Institute of Technology Calicut
      </Link>

      {/* Right Items */}
      <div className="flex items-center space-x-6">
        {/* User Settings Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            className="flex items-center gap-2 hover:text-foreground/80 hover:cursor-pointer"
            onClick={() => setOpen((prev) => !prev)}
          >
            {name} <CircleUserRound size={32} />
          </button>

          {open && (
            <div className="p-1 absolute right-0 mt-2 min-w-fit md:w-64 bg-background border border-background-muted rounded-lg shadow-lg animate-in fade-in-0 zoom-in-95 z-50">
              <ChangePassword onOpenChange={setDialogOpen} />
              <button
                className="flex px-4 py-2 hover:text-foreground/80 hover:bg-background-muted rounded-lg w-full text-start gap-2 hover:cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
