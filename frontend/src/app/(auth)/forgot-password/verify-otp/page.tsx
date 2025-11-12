"use client";
import React, { useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast } from "sonner";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const username = searchParams.get("username");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username) {
      alert("Username missing in URL");
      return;
    }

    if (otp.length !== 6) {
      toast.error("Enter the 6 digit OTP")
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/verify-otp`, {
        username,
        otp,
      });

      toast.success("OTP Verified! ✅");
      console.log(res.data);

      // You can redirect user here if needed:
      router.push("/forgot-password/reset-password?username=" + username);

    } catch (err) {
      console.error(err);
      toast.error("Invalid OTP");
    } finally {
      setLoading(false);
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

      <div className="flex flex-col gap-1 w-full">
        <label htmlFor="otp">OTP</label>
        <InputOTP
          id="otp"
          maxLength={6}
          value={otp}
          onChange={(value) => setOtp(value)}
          className="flex justify-center w-full"
        >
          <InputOTPGroup>
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <InputOTPSlot
                key={index}
                index={index}
                className="border-gray-300/80 dark:border-gray-300/30"
              />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full text-center rounded-xl bg-primary/80 text-foreground px-4 py-2 hover:cursor-pointer hover:bg-primary/70 disabled:opacity-65"
      >
        {loading ? "Verifying..." : "Verify"}
      </button>
    </form>
  );
};

export default VerifyOtp;
