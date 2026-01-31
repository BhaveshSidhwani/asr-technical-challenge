import { useRecords } from "../context/RecordsContext";
import { useRecordCounts } from "../hooks/useRecordCounts";
import { RECORD_STATUSES } from "../types";

/**
 * RecordSummary computes derived counts by status from the current record set
 * provided by RecordsContext and renders them as a lightweight dashboard.
 */
export default function RecordSummary() {
  const { records } = useRecords();
  const counts = useRecordCounts(records);
  return (
    <section aria-label="Record status summary" className="space-y-3">
      <div className="flex flex-col items-baseline justify-between">
        <h3 className="text-base sm:text-lg font-semibold tracking-tight">
          Summary
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Counts by review status
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {RECORD_STATUSES.map((status) => {
          const count = counts[status] ?? 0;
          return (
            <div
              key={status}
              className="rounded-lg border bg-card/50 p-3 sm:p-4 flex flex-col items-center justify-center shadow-sm hover:bg-card transition-colors"
            >
              <span className="text-xs sm:text-sm font-medium capitalize text-muted-foreground">
                {status.replace("_", " ")}
              </span>
              <span
                className="text-xl sm:text-2xl font-bold mt-1 tracking-tight"
                aria-label={`${status} count`}
              >
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
