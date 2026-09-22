import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

interface GaugeChartProps {
  pct: number;
}

export function GaugeChart({ pct }: GaugeChartProps) {
  const data = [
    { name: "filled", value: pct },
    { name: "rest", value: 100 - pct },
  ];
  const color = pct >= 90 ? "#12a454" : pct >= 75 ? "#e88a1b" : "#e0433c";

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[180px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            startAngle={180}
            endAngle={0}
            innerRadius="58%"
            outerRadius="80%"
            stroke="none"
          >
            <Cell fill={color} />
            <Cell fill="#e7eaf1" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-2xl font-extrabold text-ink">{pct}%</div>
        <div className="text-xs text-ink-faint">{pct >= 90 ? "Terkendali" : pct >= 75 ? "Perhatian" : "Kritis"}</div>
      </div>
    </div>
  );
}
