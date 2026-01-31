import { useMemo } from "react";

import type { RecordItem, RecordStatus } from "../types";

export function useRecordCounts(records: RecordItem[]): Record<RecordStatus, number> {
  return useMemo(() => {
    const counts: Record<RecordStatus, number> = {
      pending: 0,
      approved: 0,
      flagged: 0,
      needs_revision: 0,
    };
    records.forEach((record) => {
      counts[record.status] += 1;
    });
    return counts;
  }, [records]);
}
