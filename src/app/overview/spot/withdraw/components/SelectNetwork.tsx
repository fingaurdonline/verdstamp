import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function SelectNetwork() {
  return (
    <RadioGroup className="grid grid-cols-1 lg:grid-cols-2 lg:gap-3">
      <Label className="w-full lg:w-72 flex items-center justify-between rounded-sm border border-muted bg-lnd-surface-2 py-1.5 px-3.5 text-base font-semibold hover:border-lnd-accent/55 hover:bg-lnd-accent/10 [&:has([data-state=checked])]:bg-lnd-accent/10 [&:has([data-state=checked])]:border-lnd-accent/55 transition-all duration-300 dark:border-lnd-border dark:bg-lnd-surface dark:hover:border-lnd-accent/55 dark:hover:bg-lnd-surface-2 dark:[&:has([data-state=checked])]:bg-lnd-accent/20 dark:[&:has([data-state=checked])]:border-lnd-accent/55 dark:text-lnd-fg">
        <RadioGroupItem value="Bitcoin" className="peer sr-only" />
        Bitcoin
        <span className="flex flex-col items-end text-lnd-fg-muted/90 text-[.73rem] font-Manrope space-y-1 dark:text-lnd-fg-muted">
          <span>Fees</span>
          <span>≈ 6.872 USD</span>
        </span>
      </Label>
    </RadioGroup>
  )
}