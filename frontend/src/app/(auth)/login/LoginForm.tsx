"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { loginAction } from "./actions";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react"; // 👈 import icons

const initialState = { success: false, error: undefined };

const LoginForm = () => {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);
  const [showPassword, setShowPassword] = useState(false); // 👈 for toggle

  useEffect(() => {
    if (!state) return;

    if (state.error) {
      toast.error(state.error);
    }

    if (state.success) {
      toast.success("Login successful");
    }
  }, [state]);

  return (
    <form
      action={formAction}
      className="p-6 border-t border-primary shadow-md shadow-primary/80 rounded-xl flex flex-col justify-center gap-4 w-full h-full max-h-screen md:max-w-96"
    >
      <div className="flex justify-center">
        <Image src="/Emblem.jpg" alt="Emblem" height={100} width={100} />
      </div>

      <h2 className="text-xl text-center">Log into my account</h2>

      <div className="flex flex-col gap-1">
        <label htmlFor="username">Username</label>
        <input
          type="text"
          name="username"
          required
          autoComplete="username"
          placeholder="Roll no. / Institute Email"
          className="w-full border border-gray-300/30 rounded-xl p-2 focus:outline-none focus:border-primary hover:bg-background/70"
        />
      </div>

      <div className="flex flex-col gap-1 relative">
        <label htmlFor="password">Password</label>
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          required
          placeholder="Password"
          className="w-full border border-gray-300/30 rounded-xl p-2 pr-10 focus:outline-none focus:border-primary hover:bg-background/70"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-9 text-gray-500 hover:text-primary transition-colors hover:cursor-pointer"
          tabIndex={-1} // prevent focus stealing
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      <input
        type="submit"
        value={isPending ? "Logging in..." : "Login"}
        disabled={isPending}
        className="w-full text-center rounded-xl bg-primary/80 text-foreground px-4 py-2 hover:cursor-pointer hover:bg-primary/70 disabled:opacity-70 disabled:cursor-not-allowed"
      />

      <Link
        href="/forgot-password/recovery"
        className="underline hover:text-foreground/80 text-center"
      >
        Forgot password? Click here
      </Link>
    </form>
  );
};

export default LoginForm;
