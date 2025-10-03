import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="text-foreground px-6 py-4 flex justify-between items-center border-b border-primary/20 shadow-[0_2px_16px_-2px_var(--primary)]/30">

      {/* Left: Institute Name */}
      <Link className=" font-bold flex gap-1 text-center items-center" href={"/"}>
        <Image src={"/Emblem.jpg"} alt="Logo" width={30} height={30}/>National Institute of Technology Calicut
      </Link>

      {/* Right: Navigation Links */}
      <div className="flex items-center space-x-6">
        <Link href="/student/dashboard" className="hover:text-foreground/80">
          Student Dashboard
        </Link>
        <Link href="/faculty/dashboard" className="hover:text-foreground/80">
          FA Dashboard
        </Link>
        <Link href="/admin/dashboard" className="hover:text-foreground/80">
          Admin Dashboard
        </Link>

        {/* User Settings Dropdown (UI only) */}
        <div className="relative group">
          <button className="flex items-center gap-1 hover:text-foreground/80">
            User Settings ▼
          </button>
          {/* Dropdown menu */}
          <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
            <Link href="#" className="block px-4 py-2 hover:text-foreground/80">
              Change Password
            </Link>
            <Link href="#" className="block px-4 py-2 hover:text-foreground/80">
              Logout
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}