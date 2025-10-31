import Image from "next/image";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import LoginForm from "./LoginForm"; // separate client form component

export default async function Login() {
  const session = await getSession();
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen w-full">
      {/* Left Art Section */}
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

      {/* Right Login Section */}
      <div className="w-[50%] flex flex-col justify-center items-center gap-4 p-4"
      >
        <LoginForm />
      </div>
    </div>
  );
}
