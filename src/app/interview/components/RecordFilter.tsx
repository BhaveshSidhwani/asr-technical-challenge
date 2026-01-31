import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { RECORD_STATUSES } from "../types";
import type { RecordStatus } from "../types";
import { formatStatusLabel } from "../utils/status";

/**
 * RecordFilter provides a status selection UI decoupled from the records list
 * to illustrate separation of concerns. It exposes a controlled `value` and an
 * `onChange` callback so filter state can be lifted to a parent.
 */
interface RecordFilterProps {
  value: "all" | RecordStatus;
  onChange: (value: "all" | RecordStatus) => void;
}

export default function RecordFilter({ value, onChange }: RecordFilterProps) {
  const options: ("all" | RecordStatus)[] = ["all", ...RECORD_STATUSES];
  return (
    <div className="w-56">
      <label className="block text-sm font-medium mb-1">Filter by status</label>
      <Select
        value={value}
        onValueChange={(v) => onChange(v as "all" | RecordStatus)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="All" />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt} value={opt} className="capitalize">
              {opt === "all" ? "All" : formatStatusLabel(opt)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
