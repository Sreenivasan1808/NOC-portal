"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast } from "sonner";

const VerifyOtpClient = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes = 600 seconds
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const searchParams = useSearchParams();
  const username = searchParams.get("username");
  const router = useRouter();

  // Start countdown timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Cleanup on unmount or navigation
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username) {
      alert("Username missing in URL");
      return;
    }

    if (otp.length !== 6) {
      toast.error("Enter the 6 digit OTP");
      return;
    }

    if (timeLeft <= 0) {
      toast.error("OTP has expired");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/verify-otp`,
        { username, otp }
      );

      toast.success("OTP Verified! ✅");
      console.log(res.data);

      // stop timer before navigating away
      if (timerRef.current) clearInterval(timerRef.current);

      router.push("/forgot-password/reset-password?username=" + username);
    } catch (err) {
      console.error(err);
      toast.error("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // Convert seconds to mm:ss format
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
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

      <div className="text-center text-sm text-foreground-muted">
        {timeLeft > 0 ? (
          <>OTP expires in <time className="text-foreground">{formatTime(timeLeft)}</time></>
        ) : (
          <span className="text-red-500 font-medium">OTP expired</span>
        )}
      </div>

      <button
        type="submit"
        disabled={loading || timeLeft <= 0}
        className="w-full text-center rounded-xl bg-primary/80 text-foreground px-4 py-2 hover:cursor-pointer hover:bg-primary/70 disabled:opacity-65"
      >
        {loading ? "Verifying..." : timeLeft > 0 ? "Verify" : "Expired"}
      </button>
    </form>
  );
};

export default VerifyOtpClient;
