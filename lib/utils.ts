export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function formatRaceDate(date: string, time?: string): string {
  const iso = time ? `${date}T${time.replace("Z", "")}Z` : `${date}T00:00:00Z`;
  const parsed = new Date(iso);
  return parsed.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}
