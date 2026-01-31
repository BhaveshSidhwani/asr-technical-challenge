import { useMemo } from "react";

import type { RecordItem, RecordStatus } from "../types";

export function useFilteredRecords(
  records: RecordItem[],
  filter: "all" | RecordStatus,
): RecordItem[] {
  return useMemo(() => {
    if (filter === "all") return records;
    return records.filter((record) => record.status === filter);
  }, [records, filter]);
}
