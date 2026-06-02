import { DataStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const styleByState: Record<DataStatus["state"], string> = {
  live: "border-electric-blue/40 text-electric-blue",
  stale: "border-signal-gold/40 text-signal-gold",
  fallback: "border-neon-red/40 text-neon-red"
};

export function DataStatusBadge({ status }: { status: DataStatus }) {
  return (
    <p
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider",
        styleByState[status.state]
      )}
      aria-live="polite"
    >
      {status.state} data ({status.season})
    </p>
  );
}
