"use client";

import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ValueType, NameType } from "recharts/types/component/DefaultTooltipContent";
import { PivotData, PivotDetails } from "../../types/marketing";
import { MemoCard } from "./MemoCard";

interface PivotChartProps {
  data: PivotData[];
  details: PivotDetails;
}

interface CustomDotProps {
  cx?: number;
  cy?: number;
  payload?: PivotData;
  details: PivotDetails;
  setMemoState: (state: { visible: boolean; x: number; y: number }) => void;
}

const CustomDot = (props: CustomDotProps) => {
  const { cx = 0, cy = 0, payload, details, setMemoState } = props;

  if (!payload) return null;

  if (payload.date === details.pivotDate) {
    return (
      <g
        onMouseEnter={() => setMemoState({ visible: true, x: cx, y: cy })}
        onMouseLeave={() => setMemoState({ visible: false, x: cx, y: cy })}
        className="cursor-pointer"
      >
        {/* Radar Ripple Animation Rings */}
        <circle
          cx={cx}
          cy={cy}
          r={8}
          fill="#50C878"
          opacity={0.3}
          className="animate-ping"
        />
        <circle cx={cx} cy={cy} r={4} fill="#50C878" />
        <circle
          cx={cx}
          cy={cy}
          r={16}
          fill="transparent"
          stroke="#50C878"
          strokeWidth={1}
          opacity={0.5}
        />
      </g>
    );
  }

  // Normal dot (or no dot for other points to keep it clean)
  return null;
};

export const PivotChart: React.FC<PivotChartProps> = ({ data, details }) => {
  const [memoState, setMemoState] = useState({ visible: false, x: 0, y: 0 });

  return (
    <div className="relative w-full h-[500px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#3F3F3F"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            stroke="#94a3b8"
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            tickMargin={10}
            axisLine={false}
            tickLine={false}
            tickFormatter={(val) => {
              // format date slightly (e.g. 04-10)
              const parts = val.split("-");
              if (parts.length === 3) return `${parts[1]}/${parts[2]}`;
              return val;
            }}
          />
          <YAxis
            stroke="#94a3b8"
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(val) => `¥${val.toLocaleString()}`}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "#1A1A1A",
              borderColor: "#3F3F3F",
              color: "#F1F5F9",
            }}
            itemStyle={{ color: "#F1F5F9" }}
            labelStyle={{ color: "#94A3B8", marginBottom: "4px" }}
            formatter={(value: ValueType | undefined, name: NameType | undefined) => {
              if (value == null) return ["-", name];
              return [`¥${Number(value).toLocaleString()}`, name];
            }}
          />

          {/* Actuals Line: Silver thick solid */}
          <Line
            type="monotone"
            dataKey="actual"
            name="実績 (Actuals)"
            stroke="#cbd5e1" // slate-300 / Silver
            strokeWidth={3}
            dot={<CustomDot details={details} setMemoState={setMemoState} />}
            activeDot={false}
            isAnimationActive={false} // minimal animation for serious tone
          />

          {/* Predicted Line: Emerald thin dotted */}
          <Line
            type="monotone"
            dataKey="predicted"
            name="予測 (Predicted)"
            stroke="#50C878" // Emerald Green
            strokeWidth={2}
            strokeDasharray="4 4"
            dot={false}
            activeDot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Pop-up Memo Card */}
      <MemoCard
        details={details}
        visible={memoState.visible}
        x={memoState.x}
        y={memoState.y}
      />
    </div>
  );
};
