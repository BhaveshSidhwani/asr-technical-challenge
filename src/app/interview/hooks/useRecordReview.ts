import { useCallback, useEffect, useMemo, useState } from "react";

import type { RecordItem, RecordStatus } from "../types";
import { useRecords } from "./useRecords";

export function useRecordReview(record: RecordItem) {
  const { updateRecord } = useRecords();
  const [status, setStatus] = useState<RecordStatus>(record.status);
  const [note, setNote] = useState<string>(record.note ?? "");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const validationMessage = useMemo(() => {
    if (
      (status === "flagged" || status === "needs_revision") &&
      note.trim().length === 0
    ) {
      return "A note is required when flagging or requesting revision.";
    }
    return null;
  }, [note, status]);

  useEffect(() => {
    setStatus(record.status);
    setNote(record.note ?? "");
    setError(null);
  }, [record.id, record.note, record.status]);

  const save = useCallback(async (): Promise<boolean> => {
    setIsSaving(true);
    setError(null);
    if (validationMessage) {
      setError(validationMessage);
      setIsSaving(false);
      return false;
    }
    try {
      await updateRecord(record.id, { status, note });
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [note, record.id, status, updateRecord, validationMessage]);

  return {
    status,
    setStatus,
    note,
    setNote,
    isSaving,
    error,
    validationMessage,
    save,
  };
}
