import { useMemo } from "react";

import { RECORD_STATUSES } from "../types";
import type { RecordItem, RecordStatus } from "../types";

export function useRecordCounts(records: RecordItem[]): Record<RecordStatus, number> {
  return useMemo(() => {
    const counts = Object.fromEntries(
      RECORD_STATUSES.map((status) => [status, 0]),
    ) as Record<RecordStatus, number>;
    records.forEach((record) => {
      counts[record.status] += 1;
    });
    return counts;
  }, [records]);
}
