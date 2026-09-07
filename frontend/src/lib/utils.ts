// Helper utility and formatting functions for MeetScribe

export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Format ISO meeting date into a clean display format (e.g., "September 3, 2026" or "Sep 3, 2026")
 */
export function formatMeetingDate(dateInput: string | Date, options?: Intl.DateTimeFormatOptions): string {
  try {
    const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    if (isNaN(date.getTime())) return "Unknown Date";

    const defaultOptions: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      year: "numeric",
      ...options,
    };

    return new Intl.DateTimeFormat("en-US", defaultOptions).format(date);
  } catch {
    return "Invalid Date";
  }
}

/**
 * Format duration in seconds into human-readable duration string.
 * Example: 4080 seconds (68 mins) -> "1h 8m"
 * Example: 2580 seconds (43 mins) -> "43m"
 * Example: 1440 seconds (24 mins) -> "24m"
 */
export function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return "0m";

  const totalMinutes = Math.floor(seconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;

  if (hours > 0) {
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  }
  return `${remainingMinutes}m`;
}

/**
 * Format seconds to MM:SS or HH:MM:SS for audio timestamps
 */
export function formatTimecode(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const pad = (n: number) => n.toString().padStart(2, "0");

  if (hrs > 0) {
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  }
  return `${pad(mins)}:${pad(secs)}`;
}
