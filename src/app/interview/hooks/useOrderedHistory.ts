import { useMemo } from "react";

import type { RecordHistoryEntry } from "../types";

export function useOrderedHistory(history: RecordHistoryEntry[]) {
  return useMemo(() => {
    return [...history].sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  }, [history]);
}
