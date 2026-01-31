import { useRecords } from "../context/RecordsContext";
import { useOrderedHistory } from "../hooks/useOrderedHistory";
import { Button } from "@/components/ui/button";

/**
 * History log renders a chronological, scrollable list of status changes
 * captured during the current session by the RecordsContext. Each entry shows
 * the record id, a human‑readable timestamp, the previous → new status, and an
 * optional reviewer note to aid traceability. A Clear action is provided to
 * reset the in‑memory log.
 */
export default function HistoryLog() {
  const { history, clearHistory } = useRecords();
  const ordered = useOrderedHistory(history);
  return (
    <div className="space-y-3 mt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">History</h3>
        {history.length > 0 && (
          <Button variant="outline" size="sm" onClick={clearHistory}>
            Clear
          </Button>
        )}
      </div>
      {history.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          No status changes yet. Updates will appear here.
        </p>
      ) : (
        <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
          {ordered.map((entry) => (
            <li
              key={`${entry.id}-${entry.timestamp}`}
              className="text-sm border rounded-md p-2 bg-card"
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">Record {entry.id}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(entry.timestamp).toLocaleString()}
                </span>
              </div>
              <div className="mt-1">
                <span className="text-xs font-medium">
                  {entry.previousStatus} → {entry.newStatus}
                </span>
              </div>
              {entry.note && (
                <p className="text-xs text-muted-foreground mt-1">
                  Note: {entry.note}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
