import type { RecordStatus } from "../types";

export function formatStatusLabel(status: RecordStatus): string {
  return status
    .split("_")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}
