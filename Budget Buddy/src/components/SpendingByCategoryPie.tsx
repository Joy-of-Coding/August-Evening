import React from "react";
import type { CategoryTotal } from "../types";

interface SpendingByCategoryPieProps {
  data: CategoryTotal[];
  size?: number; // overall svg size in px
  thickness?: number; // donut thickness in px
  title?: string;
  denominatorTotal?: number; // if provided, legend % will be relative to this total (e.g., total income)
}

const COLORS = [
  "#4F46E5",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#06B6D4",
  "#8B5CF6",
  "#84CC16",
  "#EC4899",
  "#14B8A6",
  "#64748B",
];

function colorForIndex(index: number): string {
  return COLORS[index % COLORS.length];
}

const SpendingByCategoryPie: React.FC<SpendingByCategoryPieProps> = ({
  data,
  size = 220,
  thickness = 24,
  title,
  denominatorTotal,
}) => {
  const total = data.reduce((sum, item) => sum + item.amount, 0);
  const radius = Math.max((size - thickness) / 2, 1);
  const circumference = 2 * Math.PI * radius;

  let cumulative = 0;

  return (
    <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <g transform={`translate(${size / 2}, ${size / 2}) rotate(-90)`}>
          {/* background track */}
          <circle
            r={radius}
            cx={0}
            cy={0}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth={thickness}
          />
          {data.map((slice, index) => {
            const fraction = total > 0 ? slice.amount / total : 0;
            const sliceLength = fraction * circumference;
            const dashArray = `${sliceLength} ${circumference - sliceLength}`;
            const dashOffset = -cumulative;
            cumulative += sliceLength;
            return (
              <circle
                key={slice.category + index}
                r={radius}
                cx={0}
                cy={0}
                fill="none"
                stroke={colorForIndex(index)}
                strokeWidth={thickness}
                strokeDasharray={dashArray}
                strokeDashoffset={dashOffset}
              />
            );
          })}
          {/* inner hole to make donut accessible for screen readers */}
          <title>
            {title ?? "Spending by Category"}: {total.toFixed(2)}
          </title>
        </g>
        {/* center label */}
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={14}
          fill="#111827"
        >
          {total > 0 ? `$${total.toFixed(0)}` : "No Data"}
        </text>
      </svg>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {title ? (
          <div style={{ fontWeight: 600, marginBottom: 4 }}>{title}</div>
        ) : null}
        {data.map((item, index) => {
          const denominator = typeof denominatorTotal === "number" && denominatorTotal > 0 ? denominatorTotal : total;
          const percent = denominator > 0 ? (item.amount / denominator) * 100 : 0;
          return (
            <div key={item.category + index} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  display: "inline-block",
                  width: 12,
                  height: 12,
                  borderRadius: 2,
                  background: colorForIndex(index),
                }}
              />
              <span style={{ minWidth: 120 }}>{String(item.category)}</span>
              <span style={{ color: "#6B7280" }}>{percent.toFixed(1)}%</span>
              <span style={{ marginLeft: 8, fontWeight: 500 }}>${item.amount.toFixed(2)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SpendingByCategoryPie;
