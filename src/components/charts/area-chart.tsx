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

type ChartData = Record<string, string | number>;

type AreaRechartProps = {
  data: ChartData[];
  xKey: string;
  yKey: string;
  color?: string;
  height?: number;
};

const formatDateLabel = (dateStr: string) => {
  const date = new Date(dateStr);

  if (Number.isNaN(date.getTime())) {
    return dateStr;
  }

  return date.toLocaleDateString("en-US", {
    weekday: "short",
  });
};

export function AreaRechart({
  data,
  xKey,
  yKey,
  color = "#2F80ED",
  height = 320,
}: AreaRechartProps) {
  const chartData = data?.map((point) => {
    const xValue = point[xKey];

    return {
      ...point,
      label: xKey === "date" ? formatDateLabel(String(xValue)) : String(xValue),
      value: Number(point[yKey]) || 0,
    };
  });

  const gradientId = `areaGradient-${yKey}`;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart
        data={chartData}
        margin={{
          top: 0,
          right: 0,
          left: 0,
          bottom: 0,
        }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />

            <stop offset="100%" stopColor={color} stopOpacity={0.02} />
          </linearGradient>
        </defs>

        <CartesianGrid
          stroke="#414144"
          strokeWidth={1}
          strokeDasharray="4"
          horizontal
          vertical
        />

        <XAxis
          dataKey="label"
          stroke="var(--muted-foreground)"
          fontSize={12}
          tick={{
            fill: "#BFBFBF",
            fontSize: 12,
          }}
          tickLine
          axisLine
        />

        <YAxis
          type="number"
          stroke="white"
          fontSize={10}
          tick={{
            fill: "#BFBFBF",
            fontSize: 12,
          }}
          tickLine
          axisLine
          allowDecimals={false}
        />

        <Tooltip
          contentStyle={{
            background: "var(--card)",
            border: "1px solid var(--card-border)",
            borderRadius: 8,
            color: "var(--foreground)",
          }}
          labelStyle={{
            color: "var(--foreground)",
          }}
          formatter={(value) => [value, yKey]}
        />

        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          fill={`url(#${gradientId})`}
          activeDot={{
            r: 5,
          }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
