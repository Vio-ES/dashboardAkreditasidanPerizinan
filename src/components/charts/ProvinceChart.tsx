import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { fmt } from "@/lib/utils";
import { ProvinceCount } from "@/types";

interface ProvinceChartProps {
  data: ProvinceCount[]
}


export function ProvinceChart({ data } : ProvinceChartProps) {

    return(
        <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={data} barCategoryGap="10%" margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <XAxis type="number" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#8991a3" }} />
                <YAxis type="category" dataKey="province" width={150} interval={0} tick={{ fontSize: 12, fill: "#8991a3" }}/>
                <Bar dataKey="count" fill="#2f6fed" barSize={12} radius={[0, 6, 6, 0]}/>
                <Tooltip
                formatter={(value: number) => fmt(value)}
                contentStyle={{ borderRadius: 12, border: "1px solid #e7eaf1", fontSize: 8 }}
                />
            </BarChart>
            </ResponsiveContainer>
        </div>
    )
}