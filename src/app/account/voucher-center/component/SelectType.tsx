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

const TYPES = [
  { value: "all", label: "All types" },
  { value: "bonus", label: "Bonus" },
  { value: "fee_discount", label: "Fee discount" },
  { value: "margin_interest", label: "Margin interest" },
];

export function SelectType({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-9 w-[150px] border-lnd-border bg-lnd-surface text-[0.74rem] transition-colors hover:border-lnd-accent/55">
        <SelectValue placeholder="All types" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Voucher type</SelectLabel>
          {TYPES.map((type) => (
            <SelectItem key={type.value} value={type.value}>
              {type.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
