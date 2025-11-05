"use client";

import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pen, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { getSession } from "@/lib/auth";

export function ChangePassword({
  onOpenChange,
}: {
  onOpenChange?: (open: boolean) => void;
}) {
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);



  const mutation = useMutation<unknown, unknown, { currentPassword: string; newPassword: string }>(
    {
      mutationFn: async (payload: { currentPassword: string; newPassword: string }) => {
        const token = await getSession();
        const headers: Record<string, string> = {};
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const base = (process.env.NEXT_PUBLIC_SERVER_URL) as string;
        const url = `${base}/api/auth/change-password`;
        console.log(url);
        

        return axios.put(url, payload, { headers, withCredentials: true });
      },
      onSuccess: () => {
        toast.success("Password changed successfully");
        if (onOpenChange) onOpenChange(false);
        setCurrentPass("");
        setNewPass("");
        setConfirmPass("");
      },
      onError: (err: unknown) => {
        if (axios.isAxiosError(err) && err.response) {
          const data = err.response.data as { message?: string } | undefined;
          toast.error(data?.message || "Failed to change password");
        } else {
          toast.error("Failed to change password");
        }
      },
    }
  );

  type Mut = { isLoading?: boolean; isPending?: boolean; status?: "idle" | "pending" | "success" | "error" };
  const m = mutation as unknown as Mut;
  const isLoading = m.isLoading ?? m.isPending ?? m.status === "pending";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    if (!currentPass || !newPass || !confirmPass) {
      toast.error("All fields are required");
      return;
    }
    if (newPass !== confirmPass) {
      toast.error("New password and confirm password do not match");
      return;
    }
    if (newPass.length < 8) {
      toast.error("New password must be at least 8 characters long");
      return;
    }

    await mutation.mutate({ currentPassword: currentPass, newPassword: newPass });
  };

  return (
    <Dialog onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <button className=" px-4 py-2 hover:text-foreground/80 hover:bg-background-muted rounded-lg flex gap-2 w-full">
          <Pen /> Change password
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Make changes to your password here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <label htmlFor="current-pass">Current password</label>
              <div className="relative">
                <input
                  id="current-pass"
                  name="current-pass"
                  type={showCurrent ? "text" : "password"}
                  value={currentPass}
                  onChange={(e) => setCurrentPass(e.target.value)}
                  className="w-full border border-gray-300/30 rounded-xl p-2 pr-10 focus:outline-none focus:border-primary hover:bg-background/70"
                />
                <button
                  type="button"
                  aria-pressed={showCurrent}
                  aria-label={showCurrent ? "Hide current password" : "Show current password"}
                  onClick={() => setShowCurrent((s) => !s)}
                  className="absolute inset-y-0 right-2 flex items-center text-gray-500"
                >
                  {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div className="grid gap-3">
              <label htmlFor="new-pass">New password</label>
              <div className="relative">
                <input
                  id="new-pass"
                  name="new-pass"
                  type={showNew ? "text" : "password"}
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  className="w-full border border-gray-300/30 rounded-xl p-2 pr-10 focus:outline-none focus:border-primary hover:bg-background/70"
                />
                <button
                  type="button"
                  aria-pressed={showNew}
                  aria-label={showNew ? "Hide new password" : "Show new password"}
                  onClick={() => setShowNew((s) => !s)}
                  className="absolute inset-y-0 right-2 flex items-center text-gray-500"
                >
                  {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div className="grid gap-3">
              <label htmlFor="confirm-pass">Confirm new password</label>
              <div className="relative">
                <input
                  id="confirm-pass"
                  name="confirm-pass"
                  type={showConfirm ? "text" : "password"}
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  className="w-full border border-gray-300/30 rounded-xl p-2 pr-10 focus:outline-none focus:border-primary hover:bg-background/70"
                />
                <button
                  type="button"
                  aria-pressed={showConfirm}
                  aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
                  onClick={() => setShowConfirm((s) => !s)}
                  className="absolute inset-y-0 right-2 flex items-center text-gray-500"
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>
          <DialogFooter className="flex gap-4">
            <DialogClose asChild>
              <button className="text-center rounded-xl bg-background text-foreground px-4 py-2 hover:cursor-pointer hover:bg-background-muted">Cancel</button>
            </DialogClose>
            <button disabled={isLoading} type="submit" className="text-center rounded-xl bg-primary/80 text-foreground px-4 py-2 hover:cursor-pointer hover:bg-primary/70">{isLoading ? 'Saving...' : 'Save'}</button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
