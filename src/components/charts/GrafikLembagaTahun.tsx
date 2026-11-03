import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { fmt } from "@/lib/utils";
import { GrafikTahunRow } from "@/types";

interface GrafikLembagaTahunProps {
  data: GrafikTahunRow[]
}


export function GrafikLembagaTahun({ data } : GrafikLembagaTahunProps) {

    return(
        <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
                <XAxis dataKey="tahun" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Terakreditasi" stackId="a" fill="#3b82f6" />
                <Bar dataKey="Belum Terakreditasi" stackId="a" fill="#f59e0b" />
                <Bar dataKey="Belum Ada Data" stackId="a" fill="#f54e0b" />
            </BarChart>
            </ResponsiveContainer>
        </div>
    )
}