"use client";
import { cn } from "../lib/utils";
import { Label } from "@/components/ui/label";
import { InputOTP } from "../ui/input-otp";
import { useId } from "react";
import { SlotProps } from "input-otp";

export default function OtpSpaced() {
  const id = useId();
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>OTP input (spaced)</Label>
      <InputOTP
        id={id}
        containerClassName="flex items-center gap-3 has-disabled:opacity-50"
        maxLength={4}
        render={({ slots }) => (
          <div className="flex gap-2">
            {slots.map((slot, idx) => (
              <Slot key={idx} {...slot} />
            ))}
          </div>
        )}
      />
      <p className="mt-2 text-xs text-muted-foreground" role="region" aria-live="polite">
        Built with{" "}
        <a
          className="underline hover:text-foreground"
          href="https://github.com/guilhermerodz/input-otp"
          target="_blank"
          rel="noopener nofollow"
        >
          Input OTP
        </a>
      </p>
    </div>
  );
}

function Slot(props: SlotProps) {
  return (
    <div
      className={cn(
        "flex size-9 items-center justify-center rounded-lg border border-input bg-background font-medium text-foreground shadow-sm shadow-black/5 transition-shadow",
        { "z-10 border border-ring ring-[3px] ring-ring/20": props.isActive },
      )}
    >
      {props.char !== null && <div>{props.char}</div>}
    </div>
  );
}
