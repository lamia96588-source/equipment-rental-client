"use client";

import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const NAMES = ["primary", "secondary", "accent", "info", "success", "warning", "base-content", "base-100", "base-300"];

// Reads the theme colours from CSS so the charts match light and dark mode.
function useThemeColors() {
  const [colors, setColors] = useState(null);

  useEffect(() => {
    const read = () => {
      const style = getComputedStyle(document.documentElement);
      setColors(Object.fromEntries(NAMES.map((name) => [name, style.getPropertyValue(`--color-${name}`).trim()])));
    };
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  return colors;
}

function Frame({ height = 300, children }) {
  return (
    <div style={{ height }} className="w-full text-base-content/70">
      {children}
    </div>
  );
}

function useChartProps() {
  const colors = useThemeColors();
  if (!colors) return null;
  return {
    colors,
    axis: { tick: { fill: "currentColor", fontSize: 12 }, axisLine: false, tickLine: false },
    grid: { stroke: colors["base-300"], strokeDasharray: "4 4", vertical: false },
    tooltip: {
      contentStyle: {
        background: colors["base-100"],
        border: `1px solid ${colors["base-300"]}`,
        borderRadius: 12,
        color: colors["base-content"],
        fontSize: 13,
      },
      cursor: { fill: colors["base-300"], fillOpacity: 0.35 },
    },
  };
}

const money = (value) => `$${Number(value).toLocaleString("en-US")}`;

// Bars for a count, with a line for money on a second axis.
export function BookingsRevenueChart({ data, barKey, barLabel, lineKey, lineLabel }) {
  const props = useChartProps();
  if (!props) return <Frame />;
  const { colors, axis, grid, tooltip } = props;

  return (
    <Frame>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 8, right: 0, left: -12, bottom: 0 }}>
          <CartesianGrid {...grid} />
          <XAxis dataKey="month" {...axis} />
          <YAxis yAxisId="left" allowDecimals={false} {...axis} />
          <YAxis yAxisId="right" orientation="right" tickFormatter={money} width={64} {...axis} />
          <Tooltip {...tooltip} formatter={(value, name) => (name === lineLabel ? money(value) : value)} />
          <Legend wrapperStyle={{ fontSize: 13 }} />
          <Bar yAxisId="left" dataKey={barKey} name={barLabel} fill={colors.primary} radius={[6, 6, 0, 0]} maxBarSize={36} />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey={lineKey}
            name={lineLabel}
            stroke={colors.accent}
            strokeWidth={2.5}
            dot={{ r: 3, fill: colors.accent }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </Frame>
  );
}

export function MoneyAreaChart({ data, dataKey, label }) {
  const props = useChartProps();
  if (!props) return <Frame />;
  const { colors, axis, grid, tooltip } = props;

  return (
    <Frame>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid {...grid} />
          <XAxis dataKey="month" {...axis} />
          <YAxis tickFormatter={money} width={64} {...axis} />
          <Tooltip {...tooltip} cursor={{ stroke: colors["base-300"] }} formatter={(value) => money(value)} />
          <Area
            type="monotone"
            dataKey={dataKey}
            name={label}
            stroke={colors.primary}
            strokeWidth={2.5}
            fill={colors.primary}
            fillOpacity={0.18}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Frame>
  );
}

export function CountBarChart({ data, dataKey = "count", nameKey = "name", label = "Count", color = "secondary" }) {
  const props = useChartProps();
  if (!props) return <Frame />;
  const { colors, axis, grid, tooltip } = props;

  return (
    <Frame>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid {...grid} />
          <XAxis dataKey={nameKey} {...axis} tickFormatter={(value) => String(value).replace(/^./, (c) => c.toUpperCase())} />
          <YAxis allowDecimals={false} {...axis} />
          <Tooltip {...tooltip} />
          <Bar dataKey={dataKey} name={label} fill={colors[color]} radius={[6, 6, 0, 0]} maxBarSize={44} />
        </BarChart>
      </ResponsiveContainer>
    </Frame>
  );
}

export function SharePieChart({ data, dataKey = "count", nameKey = "name" }) {
  const props = useChartProps();
  if (!props) return <Frame />;
  const { colors, tooltip } = props;
  const palette = [colors.primary, colors.secondary, colors.accent, colors.info, colors.success, colors.warning];

  if (!data?.length) {
    return (
      <Frame>
        <p className="flex h-full items-center justify-center text-sm">No data yet</p>
      </Frame>
    );
  }

  return (
    <Frame>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey={dataKey}
            nameKey={nameKey}
            innerRadius="55%"
            outerRadius="80%"
            paddingAngle={2}
            stroke={colors["base-100"]}
            strokeWidth={2}
          >
            {data.map((entry, index) => (
              <Cell key={entry[nameKey]} fill={palette[index % palette.length]} />
            ))}
          </Pie>
          <Tooltip {...tooltip} />
          <Legend
            wrapperStyle={{ fontSize: 13 }}
            formatter={(value) => String(value).replace(/^./, (c) => c.toUpperCase())}
          />
        </PieChart>
      </ResponsiveContainer>
    </Frame>
  );
}
