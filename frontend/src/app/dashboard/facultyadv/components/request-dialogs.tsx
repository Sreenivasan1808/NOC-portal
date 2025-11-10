import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DialogsProps {
  showApproveDialog: boolean;
  showRejectDialog: boolean;
  rejectionReason: string;
  onApproveConfirm: () => void;
  onRejectConfirm: () => void;
  onApproveDialogChange: (open: boolean) => void;
  onRejectDialogChange: (open: boolean) => void;
  onRejectionReasonChange: (reason: string) => void;
}

export function RequestDialogs({
  showApproveDialog,
  showRejectDialog,
  rejectionReason,
  onApproveConfirm,
  onRejectConfirm,
  onApproveDialogChange,
  onRejectDialogChange,
  onRejectionReasonChange,
}: DialogsProps) {
  return (
    <>
      {/* Approve Confirmation Dialog */}
      <AlertDialog open={showApproveDialog} onOpenChange={onApproveDialogChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Approval</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve this request? This action will
              notify the student.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-background-muted hover:cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={onApproveConfirm}
              className="bg-primary hover:bg-primary/80 hover:cursor-pointer"
            >
              Approve
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Dialog with Reason */}
      <Dialog open={showRejectDialog} onOpenChange={onRejectDialogChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this request. This will be
              shared with the student.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm font-semibold text-foreground block mb-2">
              Rejection Reason
            </label>
            <textarea
              value={rejectionReason}
              onChange={(e) => onRejectionReasonChange(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:ring-2 focus:border-transparent resize-none"
              placeholder="Enter rejection reason..."
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => onRejectDialogChange(false)} className="hover:cursor-pointer">
              Cancel
            </Button>
            <Button
              onClick={onRejectConfirm}
              className="bg-red-500 hover:bg-red-600 text-white hover:cursor-pointer"
              disabled={!rejectionReason.trim()}
            >
              Reject Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}