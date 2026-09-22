import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { fmt, cn } from "@/lib/utils";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  delta?: number | string;
  note?: string;
  accent?: "blue" | "green" | "orange" | "purple" | "teal";
}

const ACCENT_BG: Record<string, string> = {
  blue: "bg-blue-bg text-blue",
  green: "bg-green-bg text-green",
  orange: "bg-orange-bg text-orange",
  purple: "bg-purple-bg text-purple",
  teal: "bg-teal-bg text-teal",
};

export function StatCard({ icon: Icon, label, value, delta, note, accent = "blue" }: StatCardProps) {
  const isNegative = typeof delta === "number" && delta < 0;
  const deltaColor = isNegative ? "text-red" : "text-green";
  const DeltaIcon = isNegative ? TrendingDown : TrendingUp;
  
  return (
    <div className="rounded-card bg-card p-5 shadow-card h-auto min-h-24 w-[132px] md:w-auto flex-shrink-0 snap-start">
      <div className="flex items-start justify-between">
        <div className={cn("hidden md:flex items-center justify-center rounded-xl p-3", ACCENT_BG[accent])}>
          <Icon size={20} strokeWidth={2} />
        </div>
        {typeof delta === "number" && (
          <span className={cn("inline-flex items-center gap-1 text-xs font-semibold", deltaColor)}>
            <DeltaIcon size={13} />
            {Math.abs(delta)}%
          </span>
        )}
      </div>
      <div className="mt-4 text-2xl font-extrabold text-ink">{fmt(value)}</div>
      <div className="mt-1 text-sm text-ink-soft">{label}</div>
      {note && <div className="mt-1 text-xs font-medium, text-ink-soft">{note}</div>}
    </div>
  );
}
