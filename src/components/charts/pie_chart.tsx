"use client"

import * as React from "react"
import {
  Cell,
  Legend,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts"

export type PieChartDatum = {
  /** Slice label, shown in tooltip + legend. */
  label: string
  value: number
  /** Any valid CSS color, e.g. a hex from your palette. */
  color: string
}

export type PieChartProps = {
  data: PieChartDatum[]
  /** Chart height in px. Width always fills its container. Defaults to 220. */
  size?: number
  /** 0 = solid pie. >0 (e.g. "70%" of radius) = donut. Defaults to 0. */
  innerRadius?: number | string
  outerRadius?: number | string
  showLegend?: boolean
  showTooltip?: boolean
  /** Show value/percentage labels directly on each slice. */
  showLabels?: boolean
  /** Rendered in the donut hole. Only useful when innerRadius > 0. */
  centerLabel?: React.ReactNode
  valueFormatter?: (value: number) => string
  className?: string
}

export function PieChart({
  data,
  size = 320,
  innerRadius = 0,
  outerRadius = "80%",
  showLegend = true,
  showTooltip = true,
  showLabels = false,
  centerLabel,
  valueFormatter = (v) => String(v),
  className,
}: PieChartProps) {

  const [activeIndex, setActiveIndex] = React.useState(-1);
  return (
    <div className={className} style={{ position: "relative", width: "100%" }}>
      <ResponsiveContainer width="100%" height={size}>
        <RechartsPieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="label"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={0}
            stroke="none"
            strokeWidth={0}
            // strokeWidth={0}
            onMouseEnter={(_, index) => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(-1)}
            label={
              showLabels
                ? ({ percent }) => `${Math.round((percent ?? 0) * 100)}%`
                : false
            }
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={entry.color}
                fillOpacity={
                  activeIndex === -1 || activeIndex === index ? 1 : 0.45
                }
              />
            ))}
          </Pie>

          {showTooltip && (
            <Tooltip
              formatter={(value, name) => [valueFormatter(Number(value)), name]}
              contentStyle={{
                background: "var(--card)",
                border: "1px solid var(--card-border)",
                borderRadius: 8,
                color: "var(--foreground)",
              }}
              itemStyle={{ color: "var(--foreground)" }}
            />
          )}

          {showLegend && (
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              iconSize={8}
              formatter={(value) => (
                <span
                  style={{ color: "var(--muted-foreground)", fontSize: 12 }}
                >
                  {value}
                </span>
              )}
            />
          )}
        </RechartsPieChart>
      </ResponsiveContainer>

      {centerLabel && Number(innerRadius) !== 0 && (
        <div
          style={{
            position: "absolute",
            top: showLegend ? "calc(50% - 14px)" : "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
            textAlign: "center",
          }}
        >
          {centerLabel}
        </div>
      )}

      {/* total is available if you want it in a custom centerLabel, e.g. centerLabel={`${total}`} */}
    </div>
  );
}