"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type RevenueTrendPoint = {
  date: string;
  revenue: number;
};

type AreaRechartProps = {
  data: RevenueTrendPoint[];
};

const formatDateLabel = (dateStr: string) => {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("en-US", { weekday: "short" });
};

export function AreaRechart({ data }: AreaRechartProps) {
  const chartData = data?.map((point) => ({
    label: formatDateLabel(point.date),
    value: point.revenue,
  }));

  return (
    <ResponsiveContainer width="100%" height={320}>
      <AreaChart
        data={chartData}
        margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
      >
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
          dataKey="label"
          stroke="var(--muted-foreground)"
          fontSize={12}
          tick={{ fill: "#BFBFBF", fontSize: 12 }}
          tickLine={true}
          axisLine={true}
        />
        <YAxis
          type="number"
          stroke="white"
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
        <CartesianGrid
          stroke="#414144"
          strokeWidth={1}
          strokeDasharray="4"
          horizontal
          vertical
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
