"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const STATUSES = [
  { value: "all", label: "All statuses" },
  { value: "available", label: "Available" },
  { value: "active", label: "Active" },
  { value: "used", label: "Used" },
  { value: "expired", label: "Expired" },
];

export function SelectStatus({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-9 w-[150px] border-lnd-border bg-lnd-surface text-[0.74rem] transition-colors hover:border-lnd-accent/55">
        <SelectValue placeholder="All statuses" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Voucher status</SelectLabel>
          {STATUSES.map((status) => (
            <SelectItem key={status.value} value={status.value}>
              {status.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
