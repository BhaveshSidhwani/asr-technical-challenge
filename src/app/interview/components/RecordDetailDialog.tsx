"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import { REVIEW_STATUSES } from "../types";
import type { RecordItem, RecordStatus } from "../types";
import { useRecordReview } from "../hooks/useRecordReview";
import { formatStatusLabel } from "../utils/status";

interface RecordDetailDialogProps {
  record: RecordItem;
  onClose: () => void;
}

/**
 * RecordDetailDialog allows reviewers to inspect a specimen’s details and
 * update its status and accompanying note in a focused modal flow. Review
 * actions are performed via the Status dropdown, while the note captures
 * rationale or extra context for the change.
 */
export default function RecordDetailDialog({
  record,
  onClose,
}: RecordDetailDialogProps) {
  const {
    status,
    setStatus,
    note,
    setNote,
    isSaving,
    error,
    validationMessage,
    save,
  } = useRecordReview(record);
  const statusOptions: RecordStatus[] = [...REVIEW_STATUSES];
  const handleSave = async () => {
    const success = await save();
    if (success) onClose();
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg tracking-tight">
            {record.name}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            {record.description}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <Select
              value={status}
              onValueChange={(value) => setStatus(value as RecordStatus)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem
                    key={option}
                    value={option}
                    className="capitalize"
                  >
                    {formatStatusLabel(option)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Reviewer note
            </label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note..."
              className="min-h-24"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Notes help other reviewers understand decisions.
            </p>
            {validationMessage && (
              <p className="mt-2 text-xs text-destructive">
                {validationMessage}
              </p>
            )}
            {error && !validationMessage && (
              <p className="mt-2 text-xs text-destructive">Error: {error}</p>
            )}
          </div>
        </div>
        <DialogFooter className="mt-6">
          {isSaving && (
            <p className="text-xs text-muted-foreground mr-auto">
              Saving changes... please wait.
            </p>
          )}
          <Button variant="secondary" onClick={() => onClose()}>
            Close
          </Button>
          <Button
            variant="default"
            onClick={handleSave}
            disabled={isSaving || Boolean(validationMessage)}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
