import type { RecordHistoryEntry, RecordItem } from '../types';

export function buildHistoryEntry(input: {
  previous: RecordItem | undefined;
  next: RecordItem;
  note?: string;
}): RecordHistoryEntry | null {
  const { previous, next, note } = input;
  if (!previous) return null;
  if (previous.status === next.status) return null;
  return {
    id: next.id,
    previousStatus: previous.status,
    newStatus: next.status,
    note,
    timestamp: new Date().toISOString(),
  };
}
