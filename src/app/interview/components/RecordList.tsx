"use client";

import { useState } from "react";

import { useRecords } from "../context/RecordsContext";
import { useFilteredRecords } from "../hooks/useFilteredRecords";
import type { RecordItem } from "../types";
import RecordCard from "./RecordCard";
import RecordDetailDialog from "./RecordDetailDialog";
import RecordFilter from "./RecordFilter";
import RecordSummary from "./RecordSummary";
import HistoryLog from "./HistoryLog";
import PaginationControls from "./PaginationControls";
import { Button } from "@/components/ui/button";

/**
 * RecordList orchestrates the interview page by fetching records via
 * RecordsContext, presenting summary counts, exposing a simple filter UI, and
 * handling selection to open the detail dialog.
 */
export default function RecordList() {
  const { records, totalCount, page, limit, loading, error, refresh, setPage } =
    useRecords();
  const [sel, setSel] = useState<RecordItem | null>(null);
  const [fltr, setFltr] = useState<"all" | RecordItem["status"]>("all");

  const display = useFilteredRecords(records, fltr);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">
            Records
          </h2>
          <p className="text-sm text-muted-foreground">
            {totalCount} total • {display.length} showing
          </p>
        </div>
        <Button variant="outline" onClick={() => refresh()} disabled={loading}>
          Refresh Data
        </Button>
      </div>
      {error && (
        <p className="text-sm text-destructive">
          Something went wrong loading records. {error}
        </p>
      )}
      {loading && (
        <p className="text-sm text-muted-foreground">Loading records...</p>
      )}
      <RecordSummary />
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <RecordFilter value={fltr} onChange={setFltr} />
      </div>
      {!loading && !error && display.length === 0 && records.length > 0 && (
        <p className="text-sm text-muted-foreground">
          No records match the current filter.
        </p>
      )}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {display.map((record) => (
          <RecordCard key={record.id} record={record} onSelect={setSel} />
        ))}
      </div>
      <PaginationControls
        page={page}
        limit={limit}
        totalCount={totalCount}
        loading={loading}
        onPageChange={setPage}
      />
      {sel && <RecordDetailDialog record={sel} onClose={() => setSel(null)} />}
      {records.length === 0 && !loading && !error && (
        <p className="text-sm text-muted-foreground">No records found.</p>
      )}
      <HistoryLog />
    </div>
  );
}
