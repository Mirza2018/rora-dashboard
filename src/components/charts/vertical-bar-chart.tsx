"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type CallsByStatusPoint = {
  dayOfWeek: number; // MongoDB $dayOfWeek convention: 1 = Sunday ... 7 = Saturday
  count: number;
};

type VerticalBarChartProps = {
  data: CallsByStatusPoint[];
};

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function VerticalBarChart({ data }: VerticalBarChartProps) {
  const chartData = data.map((point) => ({
    day: DAY_LABELS[(point.dayOfWeek - 1 + 7) % 7],
    call: point.count,
  }));

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart
        barSize={20}
        layout="vertical"
        data={chartData}
        margin={{ top: 1, right: 1, left: 0, bottom: 0 }}
      >
        <XAxis
          type="number"
          stroke="white"
          fontSize={10}
          tick={{ fill: "#fff" }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          dataKey="day"
          type="category"
          stroke="var(--muted-foreground)"
          tick={{ fill: "#fff", fontSize: 12, fontWeight: 400 }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          cursor={{ fill: "var(--muted)" }}
          contentStyle={{
            background: "var(--card)",
            border: "1px solid var(--card-border)",
            borderRadius: 8,
            color: "var(--foreground)",
          }}
        />
        <Bar dataKey="call" fill="var(--chart-bar-1)" radius={[0, 10, 10, 0]}>
          <LabelList
            dataKey="call"
            position="right"
            fontSize={10}
            fill="var(--primary)"
          />
        </Bar>
        <CartesianGrid stroke="#E0E0E0" horizontal={false} vertical />
      </BarChart>
    </ResponsiveContainer>
  );
}
