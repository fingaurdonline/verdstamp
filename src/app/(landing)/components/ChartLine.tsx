"use client"

import { Area, AreaChart } from "recharts"

const chartData = [
  { value: 0 },
  { value: 20 },
  { value: 10 },
  { value: 25 },
  { value: 15 },
  { value: 60 },
  { value: 60 },
  { value: 90 },
  { value: 95 },
]

export function ChartLine() {
  return (
    <div className="h-14 w-28 shrink-0">
      <AreaChart
        width={112}
        height={56}
        data={chartData}
        margin={{ top: 4, right: 0, bottom: 0, left: 0 }}
      >
        <defs>
          <linearGradient id="botFill" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              style={{
                stopColor: "rgb(var(--lnd-accent))",
                stopOpacity: 0.3,
              }}
            />
            <stop
              offset="100%"
              style={{
                stopColor: "rgb(var(--lnd-accent))",
                stopOpacity: 0,
              }}
            />
          </linearGradient>
        </defs>
        <Area
          type="natural"
          dataKey="value"
          stroke="currentColor"
          className="text-lnd-accent"
          strokeWidth={2}
          fill="url(#botFill)"
          isAnimationActive={false}
        />
      </AreaChart>
    </div>
  )
}
