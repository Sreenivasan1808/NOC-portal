import React from "react";
import Image from "next/image";

const ForgotPassword = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="flex min-h-screen w-full">
      <div className="relative w-[50%] flex justify-center items-center">
        <Image
          src="/Dark-Art.svg"
          alt="Dark mode art"
          fill
          className="object-contain hidden dark:block"
        />
        <Image
          src="/Light-Art.svg"
          alt="Light mode art"
          fill
          className="object-contain block dark:hidden"
        />
      </div>
      <div className="w-[50%] flex flex-col justify-center items-center gap-4 p-4">
        {children}
      </div>
    </div>
  );
};

export default ForgotPassword;
