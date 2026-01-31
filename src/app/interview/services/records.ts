import type { RecordItem, RecordStatus } from "../types";

export async function getRecords(input?: {
  page?: number;
  limit?: number;
}): Promise<{ records: RecordItem[]; totalCount: number }> {
  const params = new URLSearchParams();

  if (input?.page) params.set("page", String(input.page));
  if (input?.limit) params.set("limit", String(input.limit));

  const suffix = params.toString() ? `?${params.toString()}` : "";
  const response = await fetch(`/api/mock/records${suffix}`);
  if (!response.ok) {
    throw new Error(`Failed to load records: ${response.statusText}`);
  }

  return (await response.json()) as {
    records: RecordItem[];
    totalCount: number;
  };
}

export async function updateRecord(input: {
  id: string;
  status?: RecordStatus;
  note?: string;
}): Promise<RecordItem> {
  const response = await fetch("/api/mock/records", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error(`Failed to update record: ${response.statusText}`);
  }

  return (await response.json()) as RecordItem;
}
