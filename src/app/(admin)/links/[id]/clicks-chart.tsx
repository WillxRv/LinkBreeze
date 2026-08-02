"use client";

import * as React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { formatDateLabel } from "@/lib/i18n";
import { useLanguage } from "@/components/providers/language-provider";

interface ChartProps {
  data: Array<{ date: string; clicks: number }>;
}

export function ClicksChart({ data }: ChartProps) {
  const { lang, t } = useLanguage();
  const chartData = React.useMemo(
    () => data.map((d) => ({ ...d, label: formatDateLabel(d.date, lang) })),
    [data, lang],
  );

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -16 }}>
          <defs>
            <linearGradient id="clicksGrad2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--chart-4)" stopOpacity={0.4} />
              <stop offset="95%" stopColor="var(--chart-4)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
            width={32}
          />
          <Tooltip
            contentStyle={{
              background: "rgba(27, 23, 56, 0.85)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              fontSize: 12,
              color: "var(--popover-foreground)",
              backdropFilter: "blur(12px)",
            }}
            labelStyle={{ color: "var(--muted-foreground)" }}
          />
          <Area
            type="monotone"
            dataKey="clicks"
            stroke="var(--chart-4)"
            strokeWidth={2}
            fill="url(#clicksGrad2)"
            name={t("Analytics.clicks", "Clicks")}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
