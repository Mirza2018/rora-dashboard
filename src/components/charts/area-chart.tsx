"use client";

import { GitCommitHorizontal } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { week: "Sat", value: 4200 },
  { week: "Sun", value: 5100 },
  { week: "Mon", value: 4800 },
  { week: "Tue", value: 6200 },
  { week: "Wed", value: 7100 },
  { week: "Thu", value: 6800 },
  { week: "Fri", value: 8400 },
];

export function AreaRechart() {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              stopColor="var(--chart-area-from)"
              stopOpacity={0.9}
            />
            <stop
              offset="100%"
              stopColor="var(--chart-area-to)"
              stopOpacity={0.2}
            />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="week"
          stroke="var(--muted-foreground)"
          fontSize={12}
          tick={{ fill: "#BFBFBF", fontSize: 12 }}
          tickLine={true}
          axisLine={true}
        />
        <YAxis
          type="number"
          stroke="white"
          // tick={{ fill: "white" }}
          fontSize={10}
          tick={{ fill: "#BFBFBF", fontSize: 12 }}
          tickLine={true}
          axisLine={true}
        />
        <Tooltip
          contentStyle={{
            background: "var(--card)",
            border: "1px solid var(--card-border)",
            borderRadius: 8,
            color: "var(--foreground)",
          }}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke="var(--chart-bar-1)"
          strokeWidth={2}
          fill="url(#areaFill)"
        />
        <CartesianGrid stroke="#414144" strokeWidth={1} strokeDasharray="4"  horizontal={true} vertical={true} />
      </AreaChart>

      {/* <div className="text-primary  w-150  flex gap-2  justify-center items-center">
          <GitCommitHorizontal />
          Revenue ($)

      </div> */}
    </ResponsiveContainer>
  );
}
