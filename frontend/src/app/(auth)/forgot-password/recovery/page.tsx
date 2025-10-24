"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const ForgotPassForm = () => {
  const router = useRouter();

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // prevent page reload

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;

    if (!username) {
      toast.error("Please enter your username or email");
      return;
    }

    try {
      // Call your Next.js API route
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to send OTP");
        return;
      }

      toast.success("OTP has been sent to your institute mail");
      router.push(`/verify-otp?username=${encodeURIComponent(username)}`);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 border-t border-primary shadow-md shadow-primary/80 rounded-xl flex flex-col justify-center gap-4 w-full h-full max-h-screen md:max-w-96"
    >
      <div className="flex justify-center">
        <Image src="/Emblem.jpg" alt="Emblem" height={100} width={100} />
      </div>

      <h2 className="text-xl text-center">Recover my account password</h2>

      <div className="flex flex-col gap-1">
        <label htmlFor="username">Username</label>
        <input
          type="text"
          name="username"
          required
          placeholder="Roll no. / Institute Email"
          className="w-full border border-gray-300/30 rounded-xl p-2 focus:outline-none focus:border-primary hover:bg-background/70"
        />
      </div>

      <input
        type="submit"
        value="Submit"
        className="w-full text-center rounded-xl bg-primary/80 text-foreground px-4 py-2 hover:cursor-pointer hover:bg-primary/70"
      />
    </form>
  );
};

export default ForgotPassForm;
