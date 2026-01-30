import type { RecordItem, RecordStatus } from '../types';

export async function getRecords(): Promise<RecordItem[]> {
  const response = await fetch('/api/mock/records');
  if (!response.ok) {
    throw new Error(`Failed to load records: ${response.statusText}`);
  }
  return (await response.json()) as RecordItem[];
}

export async function updateRecord(input: {
  id: string;
  status?: RecordStatus;
  note?: string;
}): Promise<RecordItem> {
  const response = await fetch('/api/mock/records', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    throw new Error(`Failed to update record: ${response.statusText}`);
  }
  return (await response.json()) as RecordItem;
}
