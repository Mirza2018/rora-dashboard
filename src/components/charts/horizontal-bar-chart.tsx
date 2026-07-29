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

const data = [
  { day: "Mon", issued: 24, customers: 4 },
  { day: "Tue", issued: 32, customers: 6 },
  { day: "Wed", issued: 18, customers: 3 },
  { day: "Thu", issued: 41, customers: 8 },
  { day: "Fri", issued: 36, customers: 5 },
  { day: "Sat", issued: 22, customers: 2 },
  { day: "Sun", issued: 15, customers: 1 },
];

export function HorizontalBarChart() {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart
        barSize={30}
        data={data}
        margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
      >
        <XAxis
          dataKey="day"
          stroke="var(--muted-foreground)"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{
            fill: "#999999",
            fontSize: 11,
            fontWeight: 400,
          }}
        />
        <Tooltip
          formatter={(value, name) => [
            `${Number(value)}`,
            name === "issued" ? "Issued" : "Transferred to customers",
          ]}
          cursor={{
            fill: "rgba(0, 0, 0, 0)",
          }}
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
          radius={[12, 12, 0, 0]}
        />
        <Bar
          dataKey="customers"
          fill="var(--chart-bar-2)"
          radius={[12, 12, 0, 0]}
        />

        <CartesianGrid stroke="#414144" horizontal={true} vertical={false} />
      </BarChart>
    </ResponsiveContainer>
  );
}
