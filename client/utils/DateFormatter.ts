export function formatToMonthDayTime(isoString: string): string {
  const date = new Date(isoString);

  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };

  const formatted = date.toLocaleString("en-US", options);
  return formatted.replace(",", "");
}
