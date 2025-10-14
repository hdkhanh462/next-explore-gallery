"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const DEFAULT_ORDER = "likes|desc";

const SORTS: SortOption[] = [
  { value: { by: "createdAt", order: "desc" }, label: "Latest" },
  { value: { by: "likes", order: "desc" }, label: "Trending" },
  { value: { by: "title", order: "asc" }, label: "Title A-Z" },
  { value: { by: "title", order: "desc" }, label: "Title Z-A" },
];

type SortOption = {
  value: {
    by: string;
    order: "asc" | "desc";
  };
  label: string;
};

type Props = {
  selected: string;
  onChange: (sort: string) => void;
};

export default function OrderSelector({ selected, onChange }: Props) {
  return (
    <Select
      defaultValue={DEFAULT_ORDER}
      value={selected}
      onValueChange={onChange}
    >
      <SelectTrigger>
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        {SORTS.map((sort) => (
          <SelectItem
            key={sort.label}
            value={`${sort.value.by}|${sort.value.order}`}
          >
            {sort.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
