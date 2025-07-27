export function numberToK(number: number) {
  return number.toLocaleString("en-US", {
    maximumFractionDigits: 2,
    notation: "compact",
    compactDisplay: "short",
  });
}

export function formatNumberToLocaleString(number: number) {
  return number.toLocaleString();
}

export function formatNumberToLocale(number: number) {
  return Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(
    number
  );
}

export function convertMinutesToHoursAndMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
}
