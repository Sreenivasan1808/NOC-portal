import React from "react";
import Image from "next/image";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const VerifyOtp = () => {
  return (
    <form
      // onSubmit={handleSubmit}
      className="p-6 border-t border-primary shadow-md shadow-primary/80 rounded-xl flex flex-col justify-center gap-4 w-full h-full max-h-screen md:max-w-96"
    >
      <div className="flex justify-center">
        <Image src="/Emblem.jpg" alt="Emblem" height={100} width={100} />
      </div>

      <h2 className="text-xl text-center">Recover my account password</h2>

      <div className="flex flex-col gap-1 w-full ">
        <label htmlFor="username">OTP</label>
        <InputOTP maxLength={6} className="flex justify-center w-full">
          <InputOTPGroup>
            <InputOTPSlot index={0} className="border-gray-300/80 dark:border-gray-300/30"/>
            <InputOTPSlot index={1} className="border-gray-300/80 dark:border-gray-300/30"/>
            <InputOTPSlot index={2} className="border-gray-300/80 dark:border-gray-300/30"/>
            <InputOTPSlot index={3} className="border-gray-300/80 dark:border-gray-300/30"/>
            <InputOTPSlot index={4} className="border-gray-300/80 dark:border-gray-300/30"/>
            <InputOTPSlot index={5} className="border-gray-300/80 dark:border-gray-300/30"/>
          </InputOTPGroup>
        </InputOTP>
      </div>

      <input
        type="submit"
        value="Verify"
        className="w-full text-center rounded-xl bg-primary/80 text-foreground px-4 py-2 hover:cursor-pointer hover:bg-primary/70"
      />
    </form>
  );
};

export default VerifyOtp;
