"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type WeeklyTrendPoint = {
  week: string;
  issued: number;
  transferred: number;
};

type HorizontalBarChartProps = {
  data: WeeklyTrendPoint[];
};

export function HorizontalBarChart({ data }: HorizontalBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart
        data={data}
        barGap={4}
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
      >
        <CartesianGrid stroke="#414144" strokeDasharray="4" vertical={false} />
        <XAxis
          dataKey="week"
          stroke="var(--muted-foreground)"
          fontSize={12}
          tick={{ fill: "#BFBFBF", fontSize: 12 }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          type="number"
          stroke="white"
          fontSize={10}
          tick={{ fill: "#BFBFBF", fontSize: 12 }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={{
            background: "var(--card)",
            border: "1px solid var(--card-border)",
            borderRadius: 8,
            color: "var(--foreground)",
          }}
        />
        <Bar
          dataKey="issued"
          fill="var(--chart-bar-1)"
          radius={[4, 4, 0, 0]}
          barSize={16}
        />
        <Bar
          dataKey="transferred"
          fill="var(--status-complete, #27C281)"
          radius={[4, 4, 0, 0]}
          barSize={16}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
