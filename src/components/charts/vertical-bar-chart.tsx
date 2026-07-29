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

const data = [
  { day: "Sat", call: 22 },
  { day: "Sun", call: 15 },
  { day: "Mon", call: 24 },
  { day: "Tue", call: 32 },
  { day: "Wed", call: 18 },
  { day: "Thu", call: 41 },
  { day: "Fri", call: 36 },
];

export function VerticalBarChart() {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart
        barSize={20}
        layout="vertical"
        data={data}
        // width={500}
        // height={500}
        margin={{ top: 1, right: 1, left: 0, bottom: 0 }}
      >
        {/* <XAxis
          dataKey="day"
          stroke="var(--muted-foreground)"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        /> */}
        <XAxis
          type="number"
          stroke="white"
          // tick={{ fill: "white" }}
          fontSize={10}
          tick={{ fill: "#fff" }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          dataKey="day"
          type="category"
          stroke="var(--muted-foreground)"
          // fontSize={12}
          tick={{
            fill: "#fff",
            fontSize: 12,
            fontWeight: 400,
          }}
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
        <CartesianGrid stroke="#E0E0E0" horizontal={false} vertical={true} />
      </BarChart>
    </ResponsiveContainer>
  );
}
