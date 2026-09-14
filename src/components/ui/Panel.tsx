import { ArrowRight } from "lucide-react";
import { ReactNode } from "react";

export function Panel({
  title,
  onMore,
  center,
  children,
}: {
  title: string;
  onMore?: () => void;
  center?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={`w-full rounded-card bg-white p-5 shadow-card ${center ? "items-center" : ""}`}>
      <div className="mb-4 w-full text-sm font-bold text-ink">{title}</div>
      <div className="flex flex-col">
        <div className="w-full min-w-0">{children}</div>
        {onMore && (
          <button onClick={onMore} className="mt-4 flex items-center gap-1 self-end text-xs font-semibold text-blue">
            Lihat Detail <ArrowRight size={13} />
          </button>
        )}
      </div>
      
    </div>
  );
}