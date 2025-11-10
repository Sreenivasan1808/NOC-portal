"use client";
import { Plus } from "lucide-react";
import React from "react";
import axios from "axios";
import { toast } from "sonner";
import { getSession } from "@/lib/auth";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

const NewRequest = () => {
  const router = useRouter();
  const handleNewReq = async () => {
    try {
      const token = await getSession();
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/requests`,
        null,
        {
          headers,
        }
      );
      console.log(response.data);
      toast.success(response.data.message);
    } catch (error: unknown) {
      //@ts-expect-error - Axios error response type is not properly typed for unknown error
      toast.error(error.response.data.message);
      console.log(error);
    }
  };
  return (
    <div className="flex w-full justify-end">
      <Dialog>
        <DialogTrigger asChild>
          <button className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/80 flex gap-1 hover:cursor-pointer">
            <Plus /> New No Due Request
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm new request</DialogTitle>
            <DialogDescription>
              Are you sure you want to create a new No Due request? This will
              submit the request to the server.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <DialogClose asChild>
              <button className="px-4 py-2 rounded bg-background-muted hover:bg-background-muted/80 hover:cursor-pointer">
                Cancel
              </button>
            </DialogClose>
            <DialogClose asChild>
              <button
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/80 hover:cursor-pointer"
                onClick={async () => {
                  // call the same handler and close the dialog (Dialog will close automatically if using DialogClose or onOpenChange)
                  await handleNewReq();
                  router.refresh();
                }}
              >
                Confirm
              </button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewRequest;
