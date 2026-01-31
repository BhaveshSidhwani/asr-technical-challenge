"use client";

import { Button } from "@/components/ui/button";

interface PaginationControlsProps {
  page: number;
  limit: number;
  totalCount: number;
  loading?: boolean;
  onPageChange: (page: number) => void;
}

export default function PaginationControls({
  page,
  limit,
  totalCount,
  loading = false,
  onPageChange,
}: PaginationControlsProps) {
  const totalPages = Math.max(1, Math.ceil(totalCount / limit));

  return (
    <div className="flex flex-col items-center gap-3 border-t pt-4">
      <p className="text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1 || loading}
        >
          Prev
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page * limit >= totalCount || loading}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
