"use client";
import { useState, useRef, useEffect } from "react";
import { getCurrentUser, logout } from "@/lib/auth";
import Image from "next/image";
import Link from "next/link";
import { CircleUserRound, LogOut, Pen } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
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
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="text-foreground bg-background px-6 py-4 flex justify-between items-center">
      {/* Institute Logo + Name */}
      <Link
        className="font-bold flex gap-2 text-center items-center"
        href={"/"}
      >
        <Image
          src={"/Emblem.jpg"}
          alt="Logo"
          width={30}
          height={30}
        />
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
              <Link
                href="/change-password"
                className=" px-4 py-2 hover:text-foreground/80 hover:bg-background-muted rounded-lg flex gap-2"
              >
                <Pen />Change Password
              </Link>
              <button
                className="flex px-4 py-2 hover:text-foreground/80 hover:bg-background-muted rounded-lg w-full text-start gap-2"
                onClick={handleLogout}
              >
                <LogOut />Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
