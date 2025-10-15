"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const DEFAULT_LIMIT = 6;

const LIMITS = ["6", "12", "18", "24", "30"];

type Props = {
  onChange: (limit: string) => void;
};

export default function LimitSelector({ onChange }: Props) {
  return (
    <Select onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Show more" />
      </SelectTrigger>
      <SelectContent>
        {LIMITS.map((limit) => (
          <SelectItem key={limit} value={limit}>
            Show {limit.padStart(2, "0")} items
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
