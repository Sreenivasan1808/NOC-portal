import { redirect } from "next/navigation";

export default function Home() {
  
  return (
    <div className="font-sans flex flex-col items-center justify-items-center min-h-screen p-8 pt-2 pb-20 gap-16 sm:p-20 w-full">
      <main className="flex flex-col w-full items-center sm:items-start">
        {redirect("/login")}
      </main>
   </div>
    

  );
  
 }







