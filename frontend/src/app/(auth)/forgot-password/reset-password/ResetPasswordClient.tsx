"use client";
import React from "react";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

const ResetPasswordClient = () => {
  const params = useSearchParams();
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const newPass = formData.get("newpass");
    const confirmPass = formData.get("newpasss");
    if (newPass !== confirmPass) {
      toast.error("Passwords do not match");
      return;
    }

    if (!newPass || newPass.toString().length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    const username = params.get("username");

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/reset-password`,
        {
          username,
          newPassword: newPass,
        }
      );
      if (response.status === 200) {
        toast.success("Password reset successful!");
        router.push("/login");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Request failed");
      } else {
        toast.error("An unexpected error occurred");
      }
      console.error(error);
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
      <div className="flex flex-col justify-center gap-1">
        <label htmlFor="newpass">New password</label>
        <input
          type="password"
          id="newpass"
          name="newpass"
          placeholder="New Password"
          className="w-full border border-gray-300/30 rounded-xl p-2 focus:outline-none focus:border-primary hover:bg-background/70"
        />
      </div>

      <div className="flex flex-col justify-center gap-1">
        <label htmlFor="confirmpass">Confirm password</label>
        <input
          type="password"
          id="newpass"
          name="newpasss"
          placeholder="Confirm Password"
          className="w-full border border-gray-300/30 rounded-xl p-2 focus:outline-none focus:border-primary hover:bg-background/70"
        />
      </div>
      <button
        type="submit"
        // disabled={loading}
        className="w-full text-center rounded-xl bg-primary/80 text-foreground px-4 py-2 hover:cursor-pointer hover:bg-primary/70 disabled:opacity-65"
      >
        {/* {loading ? "Verifying..." : "Verify"} */}Save
      </button>
    </form>
  );
};

export default ResetPasswordClient;
